import { NextApiRequest, NextApiResponse } from "next";
import { CLOSE_PRICE_METHODS } from "opc-types/lib/CLOSE_PRICE_METHODS";
import { StratLeg } from "opc-types/lib/StratLeg";
import { StratName } from "opc-types/lib/StratName";
import { TIME_DECAY_BASIS } from "opc-types/lib/TIME_DECAY_BASIS";
import { Optional } from "opc-types/lib/util/Optional";
import { DTO } from "~/api/routes/price/types";
import usecase from "~/api/routes/price/usecase";
import Strategies from "~/model/Strategies";
import { strategyEstimates } from "~/services/calculate/strategyEstimates";
import TransformStrategy from "~/utils/Data/TransformStrategy/TransformStrategy";
import * as E from "errable";
import isInfinite from "~/utils/Data/isInfinite";
import formatPrice from "~/utils/String/formatPrice/formatPrice";
import { PrismaClient } from "opcalc-database/client";
import rateLimit from "~/utils/rateLimiter";

const prisma = new PrismaClient();

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await limiter.check(res, 10, userIp as string);

    const {
      strategy,
      symbol,
      expiration,
      leg1strike,
      leg1price,
      act,
      num,
      opType,
    } = req.query;

    const headers = req.headers.authorization;

    if (!headers) {
      res.status(403).json({
        error: "Unauthorized",
      });
    }

    const apiKey = headers.replace("Bearer ", "");

    const apiKeyData = await prisma.apiKeys.findFirst({
      where: {
        key: apiKey,
      },
    });

    if (!apiKeyData) {
      res.status(403).json({
        error: "API Key is not valid",
      });
    }

    let user = null;

    try {
      user = await prisma.user.findUnique({
        where: {
          id: apiKeyData.userId,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: `Error finding user by email: ${error}`,
      });
    } finally {
      await prisma.$disconnect();
    }

    if (!user.subscriptionActive) {
      res.status(403).json({
        error: "Subscription is not active",
      });
    }

    let errors = [];
    let errorMessagePrefix = "Missing required query parameter";

    if (!symbol) {
      errors.push(`${errorMessagePrefix}: symbol`);
    }

    if (!expiration) {
      errors.push(`${errorMessagePrefix}: expiration`);
    }

    if (!leg1strike) {
      errors.push(`${errorMessagePrefix}: leg1strike`);
    }

    if (!strategy) {
      errors.push(`${errorMessagePrefix}: straregy`);
    }

    if (act) {
      if (!["buy", "sell"].includes(act as string)) {
        res.status(400).json({
          error: "Parameter act should be 'buy' or 'sell' ",
        });
      }
    }

    if (opType) {
      if (!["call", "put"].includes(opType as string)) {
        res.status(400).json({
          error: "Parameter opType should be 'call' or 'put' ",
        });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Missing required parameters",
        description: errors,
      });
    }

    const price = await Promise.resolve({ symbol, force: true });
    const usecaseResult = await usecase(price as DTO);
    let items = undefined;

    const expirationDate = parseDate(expiration as string);

    if ("result" in usecaseResult) {
      if (usecaseResult.result !== "SUCCESS") {
        res.status(400).json({
          error: "Error",
        });
      }

      const options = usecaseResult.options;

      items = options[expirationDate];
    }

    const priceItem = items["c"][leg1strike as string];
    let stock = null;

    if ("stock" in usecaseResult) {
      stock = usecaseResult.stock;
    }

    const calculator = TransformStrategy.stratToInitialState(
      Strategies.getStrategy(strategy as StratName),
      {
        defaultSymbol: symbol as Optional<string>,
        defaultOptLegs: [
          {
            opType: opType ? (opType as "call" | "put") : "call",
            price: priceItem["a"],
            strike: Number(leg1strike),
            num: 1,
            act: "buy",
            expiry: expirationDate,
            iv: priceItem["iv"],
          },
        ],
      }
    );

    calculator.legsById.underlying = {
      type: "stock",
      act: null,
      name: "Underlying stock",
      num: null,
      linkNum: false,
      val: symbol,
      curPriceUpdated: new Date().getTime(),
      curPriceBid: stock.bid,
      curPriceAsk: stock.ask,
      curPriceLast: stock.last,
      price: null,
    } as StratLeg & any;

    calculator.histIV = stock.ivHist;

    let curPrice = null;

    if (leg1price) {
      curPrice = Number(leg1price);
    }

    calculator.legsById.option = {
      type: "option",
      iv: priceItem["iv"],
      price: curPrice ?? priceItem["a"],
      priceRange: [priceItem["b"], priceItem["a"]],
      strike: Number(leg1strike as string),
      disabled: false,
      name: "Call option",
      act: act ?? "buy",
      opType: "call",
      expiry: expirationDate,
      num: num ?? 1,
      underlying: "underlying",
      showDetails: false,
      showGreeks: false,
      showExitPrice: false,
      customPrice: false,
      linkNum: false,
    } as StratLeg & any;

    const calculatedDataResult = strategyEstimates(calculator, {
      closePriceMethod: CLOSE_PRICE_METHODS.MID,
      stockChangeInValue: true,
      timeDecayBasis: TIME_DECAY_BASIS.CALENDAR_DAYS,
    });

    if (!E.isErr(calculatedDataResult)) {
      let calculatorLink = `${getBaseUrl(
        req
      )}/calculator/${strategy}/?symbol=${symbol}&expiration=${expiration}&leg1strike=${leg1strike}`;

      if (leg1price) {
        calculatorLink += `&leg1price=${leg1price}`;
      }

      if (act) {
        calculatorLink += `&act=${act}`;
      }

      let breakEvents = null;

      if (calculatedDataResult.summary.breakevens.length > 0) {
        if (calculatedDataResult.summary.breakevens[0]) {
          breakEvents = calculatedDataResult.summary.breakevens[0][0];
        }
      }

      res.status(200).json({
        data: {
          initial_cost: calculatedDataResult.initial.gross,
          max_risk: calculatedDataResult.summary.maxRisk,
          prob_of_profit: calculatedDataResult.summary.pop,
          break_events: breakEvents,
          roi_colleteral: calculatedDataResult.summary.roiCollateral,
          max_return: isInfinite(calculatedDataResult.summary.maxReturn)
            ? "Infinite"
            : formatPrice(calculatedDataResult.summary.maxReturn),
          colleteral: calculatedDataResult.summary.collateral,
          url: calculatorLink,
        },
      });
    } else {
      res.status(400).json({
        error: calculatedDataResult.message,
      });
    }
  } catch {
    res.status(429).json({ error: "Rate limit exceeded" });
  }
}

function parseDate(dateString: string): string {
  let parts = dateString.split("-");
  let day = parts[0];
  let month = parts[1];
  let year = parts[2];
  let formattedDate = new Date(`${year}-${month}-${day}`);
  let result = formattedDate.toISOString().slice(0, 10).replace(/-/g, "");
  return result;
}

function getBaseUrl(req: NextApiRequest): string {
  const host = req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = `${protocol}://${host}`;
  return baseUrl;
}

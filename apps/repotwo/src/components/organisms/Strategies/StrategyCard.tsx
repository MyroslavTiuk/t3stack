import React from "react";
import NextLink from "next/link";
import { Flex, Link, useColorMode } from "@chakra-ui/react";
import Image from "next/image";

import { type StrategyType } from "./Strategies";

type Props = {
  strategy: StrategyType;
};

export const StrategyCard: React.FC<Props> = ({ strategy }) => {
  const { colorMode } = useColorMode();

  const { strategyName, href, srcDark, srcLight } = strategy;
  return (
    <Flex key={strategyName} width="290px" gap="3">
      <Image
        src={colorMode === "dark" ? srcDark : srcLight}
        width="33"
        height="33"
        alt={strategyName}
      />
      <Link as={NextLink} href={href} textDecoration={"underline"}>
        {strategyName}
      </Link>
    </Flex>
  );
};
//

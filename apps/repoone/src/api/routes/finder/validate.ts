import { errorFactory } from "../../infrastructure/errorHanding";
import { type DTO } from "./types";
import { isset } from "./helpers/isset";

function find_options_validate($data: DTO) {
  const $e = [];
  if (!isset($data["symbol"]) || $data["symbol"] === "") $e.push("symbol");
  if (!isset($data["currentPrice"]) || isNaN($data["currentPrice"]))
    $e.push("currentPrice");
  if (!isset($data["targetting"]) || $data["targetting"] === "")
    $e.push("targetting");
  if (!isset($data["date"]) || $data["date"] === "") $e.push("date");

  if ($data["targetting"] === "single") {
    if (!isset($data["priceFrom"]) || isNaN($data["priceFrom"]))
      $e.push("priceFrom");
    delete $data["priceTo"];
  } else if ($data["targetting"] === "range") {
    if (!isset($data["priceTo"]) || isNaN($data["priceTo"])) $e.push("priceTo");
    if (!isset($data["priceFrom"]) || isNaN($data["priceFrom"]))
      $e.push("priceFrom");
  } else if ($data["targetting"] === "gt") {
    if (!isset($data["priceFrom"]) || isNaN($data["priceFrom"]))
      $e.push("priceFrom");
    delete $data["priceTo"];
  } else if ($data["targetting"] === "lt") {
    if (!isset($data["priceTo"]) || isNaN($data["priceTo"])) $e.push("priceTo");
    delete $data["priceFrom"];
  }

  if ($e.length > 0)
    return errorFactory("Validation errors: [" + $e.join(", ") + "]");
  //? $e : false;
  else return $data;
}

export default find_options_validate;

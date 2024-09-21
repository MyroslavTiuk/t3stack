import { type Optional } from "opc-types/lib/util/Optional";

function removeDotHtml(str: string): string;
function removeDotHtml(str: Optional<string>): Optional<string>;
function removeDotHtml(str: Optional<string>) {
  if (str === undefined) return str;

  return str?.substr(-5) === ".html" ? str.substring(0, str.length - 5) : str;
}

export default removeDotHtml;

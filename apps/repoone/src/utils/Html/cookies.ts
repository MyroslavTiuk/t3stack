import { SITE } from "../../config/Site";
import getWindow from "./getWindow";

export function getCookie(c_name: string) {
  if (typeof document === "undefined") return undefined;
  let i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      return unescape(y);
    }
  }
}

interface SetCookieCfg {
  expiryDays?: number;
  path?: string;
}

export function setCookie(
  cName: string,
  value: string,
  opts: SetCookieCfg = {}
) {
  if (opts.expiryDays == undefined) opts.expiryDays = 30;
  if (opts.path == undefined) opts.path = "/";
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + opts.expiryDays);
  const c_value =
    escape(value) +
    ";path=" +
    escape(opts.path) +
    ";expires=" +
    exdate.toUTCString() +
    ";max-age=" +
    opts.expiryDays * 60 * 60 * 24 +
    ";domain=" +
    (SITE.COOKIE_DOMAIN || "");
  const win = getWindow();
  if (win) {
    win.document.cookie = cName + "=" + c_value;
  }
}

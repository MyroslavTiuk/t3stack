import { extendTheme } from "@chakra-ui/react";
import type { StyleProps } from "@chakra-ui/styled-system";
import { mode } from "@chakra-ui/theme-tools";
import { Lato } from "next/font/google";
import { colors } from "./colors";
import { textStyles } from "./textStyles";

const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"] });

export const theme = extendTheme({
  config: {
    initialColorMode: "system",
  },
  fonts: {
    heading: lato.style.fontFamily,
    body: lato.style.fontFamily,
  },
  styles: {
    global: (props: StyleProps) => ({
      body: {
        color: mode("cards.800", "neutral.500")(props),
        bg: mode("background.200", "background.900")(props),
      },
    }),
  },
  colors,
  textStyles,
});

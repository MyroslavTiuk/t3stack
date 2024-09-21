import {
  Box,
  Button,
  Divider,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { links } from "./footer.data";
import Link from "next/link";
import Logo from "@atoms/Logo";
import { useContext } from "react";
import { LayoutContext } from "@context/layoutContext";

const Footer: React.FC = () => {
  const backgroundColor = useColorModeValue("background.50", "background.800");
  const { showFooter } = useContext(LayoutContext);

  if (!showFooter) {
    return null;
  }

  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      bg={backgroundColor}
    >
      <Box as="footer" role="contentinfo" p={10} pb={0} width="100%">
        <Stack
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "flex-start", md: "center" }}
          spacing="20"
        >
          <Stack
            spacing={{ base: "6", md: "8" }}
            display="flex"
            mb="40px"
            alignItems="flex-start"
          >
            <Link href="/">
              <Logo />
            </Link>
            <Text color="muted">Because everyone needs a nerdy friend</Text>
          </Stack>
          <Stack
            flexWrap={{ base: "wrap", md: "nowrap" }}
            flexDirection="row"
            alignItems="flex-start"
            justifyContent="space-around"
            sx={{ marginTop: "0 !important" }}
            gap="8"
          >
            {links.map((group, idx) => (
              <Stack
                key={idx}
                spacing="4"
                minW={{ lg: "40" }}
                sx={{ marginTop: "0 !important" }}
              >
                <Text fontSize="sm" fontWeight="semibold" color="subtle">
                  {group.title}
                </Text>
                <Stack spacing="3" shouldWrapChildren>
                  {group.links.map((link, idx) => (
                    <Button key={idx} as="a" variant="link" href={link.href}>
                      {link.label}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
        <Divider my={8} />
        <Stack
          pt="8"
          pb="12"
          justify="space-between"
          direction={{ base: "column-reverse", md: "row" }}
          align="center"
        >
          <Text fontSize="sm" color="subtle">
            &copy; {new Date().getFullYear()} Option Scout, Inc. All rights
            reserved.
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;

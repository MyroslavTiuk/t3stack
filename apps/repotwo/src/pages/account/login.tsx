import React from "react";
import {
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Logo } from "src/components/account/Logo";
import Link from "next/link";
import { OAuthButtonGroup } from "src/components/account/OAuthButtonGroup";
import EmailForm from "src/components/account/EmailForm";
import { useSession } from "next-auth/react";
import ErrorPage from "@atoms/ErrorPage";

const LoginPage: React.FC = () => {
  const { status } = useSession();
  const breakPoint = useBreakpointValue({ base: "xs", md: "sm" });
  if (status === "authenticated") {
    return <ErrorPage message="You are already logged in." />;
  }

  return (
    <div>
      <Container maxW="md" py={{ base: "12", md: "24" }}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Logo />
            <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
              <Heading size={breakPoint}>Log in to your account</Heading>
              <Text color="muted">Start making your dreams come true</Text>
            </Stack>
          </Stack>
          <Stack spacing="6">
            <EmailForm />
            <Stack spacing="6">
              <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                  or log in with
                </Text>
                <Divider />
              </HStack>
              <OAuthButtonGroup />
            </Stack>
          </Stack>
          <HStack spacing="1" justify="center">
            <Text fontSize="sm" color="muted">
              Don&apos;t have an account?
            </Text>
            <Button variant="link" colorScheme="purple" size="sm">
              <Link href="/account/create">Create account</Link>
            </Button>
          </HStack>
        </Stack>
      </Container>
    </div>
  );
};

export default LoginPage;

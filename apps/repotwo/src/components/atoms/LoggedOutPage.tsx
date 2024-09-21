import React from "react";
import { Button, Container, Text } from "@chakra-ui/react";
import Link from "next/link";

const LoggedOutPage: React.FC = () => {
  return (
    <Container h="70vh" centerContent={true} justifyContent="center">
      <Text fontSize="sm" color="muted">
        The Scanner is only available to subscribers of our premium package.
        Please
        <Button variant="link" colorScheme="purple" size="sm">
          <Link href="/account/create">create an account</Link>
        </Button>{" "}
        or{" "}
        <Button variant="link" colorScheme="purple" size="sm">
          <Link href="/account/login">log in</Link>
        </Button>
        .
      </Text>
    </Container>
  );
};
export default LoggedOutPage;

import React from "react";
import { Button, Container, Text } from "@chakra-ui/react";
import Link from "next/link";

const NotSubscribedPage: React.FC = () => {
  return (
    <Container h="70vh" centerContent={true} justifyContent="center">
      <Text fontSize="sm" color="muted">
        The Scanner is only available to subscribers of our premium package.
        Please{" "}
        <Button variant="link" colorScheme="purple" size="sm">
          <Link href="/account/me">subscribe</Link>
        </Button>
        .
      </Text>
    </Container>
  );
};
export default NotSubscribedPage;

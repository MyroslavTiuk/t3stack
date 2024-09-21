import { Container, Text } from "@chakra-ui/react";
import React from "react";
const ErrorPage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Container h="70vh" centerContent={true} justifyContent="center">
      <Text>{message}</Text>
    </Container>
  );
};
export default ErrorPage;

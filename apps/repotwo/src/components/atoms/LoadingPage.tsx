import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <Stack spacing={10} w="full" p={10}>
      <Skeleton h={20} w="full" />
      <Skeleton h={20} w="full" />
      <Skeleton h={20} w="full" />
    </Stack>
  );
};
export default LoadingPage;

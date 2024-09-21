import React from "react";

import { Spinner, Flex, Box, useColorModeValue } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
  isLoading: boolean;
};

const Preloader: React.FC<Props> = ({ children, isLoading }) => {
  const highlightColor = useColorModeValue("primary.200", "primary.500");

  return (
    <>
      {isLoading && (
        <Flex
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bg="neutral.800"
          opacity={0.3}
          zIndex={100}
          align="center"
          justify="center"
        >
          <Box position="fixed" top="50%">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color={highlightColor}
              size="xl"
            />
          </Box>
        </Flex>
      )}
      {children}
    </>
  );
};

export default Preloader;

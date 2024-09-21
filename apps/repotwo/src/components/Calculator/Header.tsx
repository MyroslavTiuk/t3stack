import { HStack, Button, Heading } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useCalculatorStore } from "src/state";
import { strategyNames } from "@data/strategies.data";

const Header = () => {
  const strategy = useCalculatorStore((state) => state.strategy);
  const strategyName = strategyNames[strategy];

  return (
    <HStack>
      <Button as="a" href="/" size="xs">
        <ChevronLeftIcon w={4} h={4} />
      </Button>
      <Heading as="h1" fontSize={"3xl"}>
        {strategyName} Calculator & Visualizer{" "}
      </Heading>
    </HStack>
  );
};

export default Header;

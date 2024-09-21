import React from "react";
import { Card, CardBody, Text, useColorModeValue } from "@chakra-ui/react";
import { strategyDescriptions } from "@data/strategies.data";
import { useCalculatorStore } from "src/state";

const Description: React.FC = () => {
  const background = useColorModeValue("background.50", "cards.800");
  const strategy = useCalculatorStore((state) => state.strategy);
  const description = strategyDescriptions[strategy];

  return (
    <Card maxW="prose" bg={background}>
      <CardBody>
        <Text>{description}</Text>
      </CardBody>
    </Card>
  );
};

export default Description;

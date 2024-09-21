import React from "react";
import Image from "next/image";
import {
  Card,
  CardBody,
  Flex,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { type ProfitEstimate } from "@utils/calculateProfitEstimates/calculateProfitEstimates";

const ProfitEstimateCard: React.FC<{
  profitEstimate: ProfitEstimate<number> | ProfitEstimate<number[]>;
}> = ({ profitEstimate }) => {
  const background = useColorModeValue("background.50", "cards.800");
  return (
    <Card bg={background} width={{ base: "48%", sm: "32%" }}>
      <CardBody>
        <Stack align="center">
          <Flex gap="2">
            {profitEstimate.icon && (
              <Image
                src={profitEstimate.icon}
                alt={profitEstimate.title}
                width="20"
                height="20"
              />
            )}
            <div>{profitEstimate.title}</div>
          </Flex>
          <div>{profitEstimate.formattedValue}</div>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default ProfitEstimateCard;

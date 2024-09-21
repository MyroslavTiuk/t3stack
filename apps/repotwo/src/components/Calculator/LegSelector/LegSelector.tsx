import React from "react";
import { useCalculatorStore } from "src/state";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import OptionContractSummary from "./OptionContractSummary";
import OptionChainPopover from "./OptionChainPopover";
import ManualEditPopover from "./ManualEditPopover";
import CardTitle from "./CardTitle";
import EquityCard from "./EquityCard";
import { type OptionsContract } from "@utils/tdApiTypes";
import { optionContractToCalculatorOption } from "@utils/transformOptions";
import AddLegButton from "./AddLegButton";
import { DeleteIcon } from "@chakra-ui/icons";

const LegSelector: React.FC = () => {
  const background = useColorModeValue("background.50", "cards.800");
  const contracts = useCalculatorStore((state) => state.contracts);
  const setContract = useCalculatorStore((state) => state.setContract);
  const removeContract = useCalculatorStore((state) => state.removeContract);

  return (
    <Stack gap={5}>
      {contracts.map((contract, index) => (
        <Card key={index} bg={background}>
          <CardHeader>
            <CardTitle legIndex={index} />
          </CardHeader>
          <CardBody pt="0">
            <Stack gap={2}>
              <OptionContractSummary contract={contract} />
              <Stack>
                <Divider />
                <OptionChainPopover
                  onSelect={(optionsContract: OptionsContract) => {
                    setContract(
                      optionContractToCalculatorOption(
                        optionsContract,
                        contract.position,
                        contract.contractsCount
                      ),
                      index
                    );
                  }}
                  optionType={contract.optionType}
                />
                <ManualEditPopover legIndex={index} />
                <Button
                  maxW="2xs"
                  variant="outline"
                  color="button.orange.700"
                  leftIcon={<DeleteIcon />}
                  onClick={() => removeContract(index)}
                >
                  Remove
                </Button>
              </Stack>
            </Stack>
          </CardBody>
        </Card>
      ))}
      <AddLegButton />
      <EquityCard />
    </Stack>
  );
};

export default LegSelector;

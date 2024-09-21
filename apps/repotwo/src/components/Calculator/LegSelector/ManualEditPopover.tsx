import React from "react";
import {
  useBreakpointValue,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Button,
  Popover,
  Flex,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  FormLabel,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Select,
} from "@chakra-ui/react";
import { useCalculatorStore } from "src/state";
import { type CalculatorOption } from "@utils/calculateProfitEstimates/calculateProfitEstimates";
import { EditIcon } from "@chakra-ui/icons";
import { OptionType, Position } from "optionscout-database";

const ManualEditPopover: React.FC<{
  legIndex: number;
}> = ({ legIndex }) => {
  const placement = useBreakpointValue({
    base: "bottom" as const,
    lg: "right" as const,
  });
  const popoverBackground = useColorModeValue("cards.50", "cards.800");
  const contracts = useCalculatorStore((state) => state.contracts);
  const contract = contracts[legIndex];

  return (
    <Popover placement={placement}>
      {({ onClose, isOpen }) => (
        <>
          <PopoverTrigger>
            <Button
              maxW="2xs"
              variant="outline"
              color="button.orange.700"
              leftIcon={<EditIcon />}
            >
              Set manually
            </Button>
          </PopoverTrigger>
          <PopoverContent maxH="80vh" bg={popoverBackground} maxW="xs">
            <PopoverArrow bg={popoverBackground} />
            <PopoverCloseButton />
            <PopoverBody>
              {isOpen && (
                <PopoverForm
                  contract={contract}
                  onClose={onClose}
                  legIndex={legIndex}
                />
              )}
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};

const PopoverForm: React.FC<{
  contract: CalculatorOption;
  onClose: () => void;
  legIndex: number;
}> = ({ contract, onClose, legIndex }) => {
  const setContract = useCalculatorStore((state) => state.setContract);

  const [updatedContract, setUpdatedContract] =
    React.useState<CalculatorOption>({
      strikePrice: contract?.strikePrice ?? 0,
      optionPrice: contract?.optionPrice ?? 0,
      daysToExpiration: contract?.daysToExpiration ?? 0,
      position: contract?.position ?? Position.Long,
      optionType: contract?.optionType ?? OptionType.Call,
      volatility: contract?.volatility ?? 0,
      contractsCount: contract?.contractsCount ?? 1,
    });

  function onSubmit() {
    setContract(updatedContract, legIndex);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
        onClose();
      }}
    >
      <Stack py="7" gap="2">
        <Flex align="center" gap="2" justify="space-evenly" w="100%">
          <Select
            onChange={(event) =>
              setUpdatedContract((prevContract) => ({
                ...prevContract,
                position: event.target.selectedOptions[0].value as Position,
              }))
            }
            defaultValue={updatedContract.position}
          >
            <option value={Position.Long}>Long</option>
            <option value={Position.Short}>Short</option>
          </Select>
          <Select
            onChange={(event) =>
              setUpdatedContract((prevContract) => ({
                ...prevContract,
                optionType: event.target.selectedOptions[0].value as OptionType,
              }))
            }
            defaultValue={updatedContract.optionType}
          >
            <option value={OptionType.Call}>Call</option>
            <option value={OptionType.Put}>Put</option>
          </Select>
        </Flex>
        <Flex align="center" gap="2" justify="right" w="100%">
          <FormLabel>Option Price</FormLabel>
          <NumberInput
            min={0}
            precision={2}
            step={0.5}
            inputMode="decimal"
            maxW="32"
            value={updatedContract.optionPrice}
            onChange={(price) =>
              setUpdatedContract((prevContract) => ({
                ...prevContract,
                optionPrice: Number(price),
              }))
            }
          >
            <NumberInputField pattern="[0-9]*(.[0-9]+)?" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>
        <Flex align="center" gap="2" justify="right" w="100%">
          <FormLabel>Strike Price</FormLabel>
          <NumberInput
            min={0}
            precision={2}
            step={0.5}
            inputMode="decimal"
            maxW="32"
            value={updatedContract.strikePrice}
            onChange={(price) =>
              setUpdatedContract((prevContract) => ({
                ...prevContract,
                strikePrice: Number(price),
              }))
            }
          >
            <NumberInputField pattern="[0-9]*(.[0-9]+)?" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>
        <Flex align="center" gap="2" justify="right" w="100%">
          <FormLabel>Days to expiration</FormLabel>
          <NumberInput
            min={0}
            precision={0}
            step={1}
            inputMode="decimal"
            maxW="32"
            value={updatedContract.daysToExpiration}
            onChange={(days) =>
              setUpdatedContract((prevContract) => ({
                ...prevContract,
                daysToExpiration: Number(days),
              }))
            }
          >
            <NumberInputField pattern="[0-9]*(.[0-9]+)?" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>
        <Flex align="center" gap="2" justify="right" w="100%">
          <FormLabel>IV</FormLabel>
          <NumberInput
            min={0}
            precision={2}
            step={0.5}
            inputMode="decimal"
            maxW="32"
            value={updatedContract.volatility}
            onChange={(iv) =>
              setUpdatedContract((prevContract) => ({
                ...prevContract,
                volatility: Number(iv),
              }))
            }
          >
            <NumberInputField pattern="[0-9]*(.[0-9]+)?" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>
      </Stack>
      <Flex gap="3" justify="right">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button bg="button.orange.700" color="background.50" type="submit">
          Set Values
        </Button>
      </Flex>
    </form>
  );
};

export default ManualEditPopover;

import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Select,
  Stack,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { OptionType, Position } from "optionscout-database";
import React from "react";
import { useCalculatorStore } from "src/state";

const AddLegButton: React.FC = () => {
  const popoverBackground = useColorModeValue("cards.50", "cards.800");
  const placement = useBreakpointValue({
    base: "bottom" as const,
    lg: "right" as const,
  });

  return (
    <Popover placement={placement}>
      {({ onClose, isOpen }) => (
        <>
          <PopoverTrigger>
            <Button
              w="100%"
              variant="outline"
              color="button.orange.700"
              leftIcon={<AddIcon />}
              alignContent="center"
            >
              Add Option Contract
            </Button>
          </PopoverTrigger>
          <PopoverContent maxH="80vh" bg={popoverBackground} maxW="2xs">
            <PopoverArrow bg={popoverBackground} />
            <PopoverCloseButton />
            <PopoverBody>
              {isOpen && <PopoverForm onClose={onClose} />}
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};

const PopoverForm: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const addContract = useCalculatorStore((state) => state.addContract);

  const [stagedContract, setStagedContract] = React.useState<{
    position: Position;
    optionType: OptionType;
  }>({ position: Position.Long, optionType: OptionType.Call });

  function onSubmit() {
    addContract({
      ...stagedContract,
      strikePrice: 0,
      optionPrice: 0,
      daysToExpiration: 0,
      volatility: 0,
      contractsCount: 1,
    });
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
        <Select
          onChange={(event) =>
            setStagedContract((prevContract) => ({
              ...prevContract,
              position: event.target.selectedOptions[0].value as Position,
            }))
          }
          defaultValue={stagedContract.position}
        >
          <option value={Position.Long}>Long</option>
          <option value={Position.Short}>Short</option>
        </Select>
        <Select
          onChange={(event) =>
            setStagedContract((prevContract) => ({
              ...prevContract,
              optionType: event.target.selectedOptions[0].value as OptionType,
            }))
          }
          defaultValue={stagedContract.optionType}
        >
          <option value={OptionType.Call}>Call</option>
          <option value={OptionType.Put}>Put</option>
        </Select>
      </Stack>
      <Flex gap="3" justify="right">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button bg="button.orange.700" color="background.50" type="submit">
          Add
        </Button>
      </Flex>
    </form>
  );
};

export default AddLegButton;

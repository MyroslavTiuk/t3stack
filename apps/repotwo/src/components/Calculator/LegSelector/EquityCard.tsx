import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Select,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { Position } from "optionscout-database";
import { type Equity } from "@utils/calculateProfitEstimates/calculateProfitEstimates";
import React from "react";
import { useCalculatorStore } from "src/state";

const EquityCard: React.FC = () => {
  const background = useColorModeValue("background.50", "cards.800");
  const highlightColor = useColorModeValue("primary.200", "primary.500");
  const popoverBackground = useColorModeValue("cards.50", "cards.800");
  const placement = useBreakpointValue({
    base: "bottom" as const,
    lg: "right" as const,
  });

  const equity = useCalculatorStore((state) => state.equity);

  return (
    <Card bg={background}>
      <CardHeader>
        <Text textStyle="caption2" color={highlightColor} mr="1">
          Equity {equity.shares > 0 && "- " + equity.position}
        </Text>
      </CardHeader>
      <CardBody pt="0">
        <Text maxW="52">
          {equity.shares > 0 ? equity.shares + " shares" : "No equity included"}
        </Text>
        <Divider my="2" />
        <Popover placement={placement}>
          {({ onClose, isOpen }) => (
            <>
              <PopoverTrigger>
                <Button
                  w="100%"
                  variant="outline"
                  color="button.orange.700"
                  leftIcon={<EditIcon />}
                >
                  Set manually
                </Button>
              </PopoverTrigger>
              <PopoverContent maxH="80vh" bg={popoverBackground} maxW="2xs">
                <PopoverArrow bg={popoverBackground} />
                <PopoverCloseButton />
                <PopoverBody>
                  {isOpen && <PopoverForm equity={equity} onClose={onClose} />}
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>
      </CardBody>
    </Card>
  );
};

const PopoverForm: React.FC<{
  equity: Equity;
  onClose: () => void;
}> = ({ equity, onClose }) => {
  const setEquity = useCalculatorStore((state) => state.setEquity);

  const [updatedEquity, setUpdatedEquity] = React.useState<{
    position: Position;
    shares: number;
  }>({ ...equity });

  function onSubmit() {
    setEquity(updatedEquity);
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
            setUpdatedEquity((prevEquity) => ({
              ...prevEquity,
              position: event.target.selectedOptions[0].value as Position,
            }))
          }
          defaultValue={updatedEquity.position}
        >
          <option value={Position.Long}>Long</option>
          <option value={Position.Short}>Short</option>
        </Select>
        <Flex align="center" gap="2" justify="right" w="100%">
          <FormLabel>No. of shares</FormLabel>
          <NumberInput
            min={0}
            precision={2}
            step={100}
            inputMode="numeric"
            maxW="24"
            value={updatedEquity.shares}
            onChange={(shares) =>
              setUpdatedEquity((prevEquity) => ({
                ...prevEquity,
                shares: Number(shares),
              }))
            }
          >
            <NumberInputField />
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

export default EquityCard;

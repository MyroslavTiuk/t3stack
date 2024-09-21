import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useCalculatorStore } from "src/state";
import OptionChain from "../OptionChain/OptionChain";
import { type OptionsContract } from "@utils/tdApiTypes";
import { type OptionType } from "optionscout-database";

const OptionChainPopover: React.FC<{
  optionType: OptionType;
  onSelect: (contract: OptionsContract) => void;
}> = ({ optionType, onSelect }) => {
  const placement = useBreakpointValue({
    base: "bottom" as const,
    lg: "right" as const,
  });
  const [selectedDateKey, setSelectedDateKey] = useState<0 | 1>(0);
  const expirationDateKeys = useCalculatorStore(
    (state) => state.expirationDateKeys
  );

  function getExpirationDateKey() {
    if (!expirationDateKeys) {
      return undefined;
    }
    if (!expirationDateKeys.second) {
      return expirationDateKeys.first;
    }
    if (selectedDateKey === 0) {
      return expirationDateKeys.first;
    }
    return expirationDateKeys.second;
  }

  return (
    <>
      {expirationDateKeys?.second && (
        <Flex justify="space-evenly">
          <Button
            variant="link"
            color={selectedDateKey === 0 ? "button.orange.700" : undefined}
            textDecoration={selectedDateKey === 0 ? "underline" : undefined}
            onClick={() => setSelectedDateKey(0)}
          >
            {format(
              new Date(expirationDateKeys.first.split(":")[0]),
              "dd/MMM/yy"
            )}
          </Button>
          <Button
            variant="link"
            color={selectedDateKey === 1 ? "button.orange.700" : undefined}
            textDecoration={selectedDateKey === 1 ? "underline" : undefined}
            onClick={() => setSelectedDateKey(1)}
          >
            {format(
              new Date(expirationDateKeys.second.split(":")[0]),
              "dd/MMM/yy"
            )}
          </Button>
        </Flex>
      )}
      <Popover placement={placement}>
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <Button
                maxW="2xs"
                color="background.50"
                bg="button.orange.700"
                noOfLines={1}
              >
                Select from Option Chain
              </Button>
            </PopoverTrigger>
            <PopoverContent
              minW={{ base: "90vw", md: "xl" }}
              maxH="80vh"
              overflow="scroll"
            >
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody pt="10">
                <OptionChain
                  optionType={optionType}
                  expirationDateKey={getExpirationDateKey()}
                  onSelect={(contract: OptionsContract) => {
                    onSelect(contract);
                    onClose();
                  }}
                />
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>
    </>
  );
};

export default OptionChainPopover;

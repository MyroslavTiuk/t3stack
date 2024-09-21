import React from "react";
import {
  Flex,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Popover,
  Text,
  IconButton,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { MdModeEdit } from "react-icons/md";

const Filter: React.FC<Props> = ({
  name,
  isFilterSet,
  onSubmit,
  handleUnset,
  TextContent,
  FormContent,
  dropdownRef,
  popOverWidth,
}) => {
  const popoverBackground = useColorModeValue("cards.50", "cards.800");
  const iconButtonBackground = useColorModeValue("cards.300", "cards.800");

  return (
    <Flex px="7" py="2" align="center">
      <Text mr="7" w="32">
        {name}
      </Text>
      {isFilterSet && TextContent}
      <Popover initialFocusRef={dropdownRef}>
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <IconButton
                size="sm"
                ml={isFilterSet ? "auto" : 0}
                mr="1"
                aria-label="add filter"
                bg={iconButtonBackground}
              >
                {isFilterSet ? <MdModeEdit /> : <AiOutlinePlus />}
              </IconButton>
            </PopoverTrigger>
            <PopoverContent bg={popoverBackground} width={popOverWidth}>
              <PopoverArrow bg={popoverBackground} />
              <PopoverBody>
                <Text textStyle="heading5">{name}</Text>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                    onClose();
                  }}
                >
                  <Flex py="7" gap="1">
                    {FormContent}
                  </Flex>
                  <Flex gap="3" justify="right">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      bg="button.orange.700"
                      color="background.50"
                      type="submit"
                    >
                      Set Filter
                    </Button>
                  </Flex>
                </form>
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>
      {isFilterSet && (
        <IconButton
          size="sm"
          aria-label="remove filter"
          bg={iconButtonBackground}
          onClick={handleUnset}
        >
          <AiOutlineClose />
        </IconButton>
      )}
    </Flex>
  );
};

type Props = {
  name: string;
  isFilterSet: boolean;
  onSubmit: () => void;
  handleUnset: () => void;
  TextContent: React.ReactNode;
  FormContent: React.ReactNode;
  dropdownRef?: React.RefObject<HTMLSelectElement>;
  popOverWidth?: number;
};

export default Filter;

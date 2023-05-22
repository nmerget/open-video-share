import { PropsWithChildren } from "react";
import { TextLoaderType } from "./data";
import { Flex, Loader, Text } from "@mantine/core";

const TextLoader = ({ children, text }: PropsWithChildren<TextLoaderType>) => {
  return (
    <Flex gap="md" align="center" justify="center">
      <Loader  variant="dots" size="sm" />
      <Text>{children || text}</Text>
      <Loader  variant="dots" size="sm" />
    </Flex>
  );
};

export default TextLoader;

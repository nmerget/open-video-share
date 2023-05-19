import { PropsWithChildren } from "react";
import { CenterPaperType } from "./data";
import { Center, Flex, Paper } from "@mantine/core";

const CenterPaper = ({
  style,
  children,
}: PropsWithChildren<CenterPaperType>) => {
  return (
    <Center style={{ ...style }} p="md" pos="relative">
      <Paper shadow="md" radius="md" p="md" w="100%">
        <Flex gap="md" direction="column">
          {children}
        </Flex>
      </Paper>
    </Center>
  );
};

export default CenterPaper;

import { Result, useZxing } from "react-zxing";
import { QrCodeScannerType } from "./data";
import { decompress } from "../../utils";
import "./qr-code-scanner.css";
import { useTranslation } from "react-i18next";
import { Button, Flex } from "@mantine/core";
import { IconLamp, IconLampOff } from "@tabler/icons-react";
import { MantineColor } from "@mantine/styles";
import TextLoader from "../text-loader";

const QrCodeScanner = ({ onResult }: QrCodeScannerType) => {
  const { t } = useTranslation();
  const {
    ref,
    torch: { on, off, isOn, isAvailable },
  } = useZxing({
    onResult(result: Result) {
      if (result) {
        onResult(decompress(result.getText()));
        if (isAvailable && isOn) {
          off();
        }
      }
    },
  });
  return (
    <Flex gap="md" direction="column">
      <video className="qr-code-scanner-video" ref={ref} />
      <TextLoader>{t("qr-code-scanner-sill-searching")}</TextLoader>
      {isAvailable && (
        <Button
          w="100%"
          onClick={() => (isOn ? off() : on())}
          leftIcon={
            isOn ? (
              <IconLampOff size="1.125rem" />
            ) : (
              <IconLamp size="1.125rem" />
            )
          }
          variant="outline"
          color={(isOn ? "red" : "green") as MantineColor}
        >
          {isOn
            ? t("qr-code-scanner-turn-off-torch")
            : t("qr-code-scanner-turn-on-torch")}
        </Button>
      )}
    </Flex>
  );
};

export default QrCodeScanner;

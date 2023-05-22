import { Result, useZxing } from "react-zxing";
import { QrCodeScannerType } from "./data";
import { decompress } from "../../utils";
import "./qr-code-scanner.css";
import { notifications } from "@mantine/notifications";
import { DEFAULT_ERROR_NOTIFICATION } from "../../utils/constants";
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
    onError(error: Error) {
      // TODO: Handle this for mobile
      if (
        !error.name.includes("NotFoundException") &&
        error.name !== "IndexSizeError"
      ) {
        console.error(error.name);
        console.error(error);
        notifications.show({
          ...DEFAULT_ERROR_NOTIFICATION,
          title: t("_error"),
          message: error.message,
          withCloseButton: true,
        });
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

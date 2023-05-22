import { PropsWithChildren, useState } from "react";
import { MediaSelectionType } from "./data";
import { Button, Flex, SegmentedControl, Switch, Text } from "@mantine/core";
import { t } from "i18next";
import { isMobileDevice } from "../../../utils";

const MediaSelection = ({ onStart }: PropsWithChildren<MediaSelectionType>) => {
  const [camera, setCamera] = useState<string>(
    isMobileDevice() ? "back" : "front"
  );
  const [audio, setAudio] = useState<boolean>(true);
  return (
    <Flex direction="column" gap="md">
      <Text>{t("connection-which-camera")}</Text>
      <Switch
        
        size="lg"
        onLabel={t("_on")}
        offLabel={t("off")}
        label={t("connection-share-audio")}
        checked={audio}
        onChange={(event) => setAudio(event.currentTarget.checked)}
      />
      <SegmentedControl
        value={camera}
        
        onChange={setCamera}
        data={[
          { label: t("connection-camera-front"), value: "front" },
          {
            label: t("connection-camera-back"),
            value: "back",
            disabled: !isMobileDevice(),
          },
        ]}
      />
      <Button
        
        onClick={() => {
          onStart(
            camera === "front" ? "user" : { exact: "environment" },
            audio
          );
        }}
      >
        {t("connection-start-session")}
      </Button>
    </Flex>
  );
};

export default MediaSelection;

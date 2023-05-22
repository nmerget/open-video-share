import {
  Button,
  Center,
  Flex,
  SegmentedControl,
  Text,
  Textarea,
  Transition,
} from "@mantine/core";
import {
  DEFAULT_ERROR_NOTIFICATION,
  DEFAULT_TRANSITION_TIME,
} from "../../../utils/constants";
import CenterPaper from "../../center-paper";
import {
  PeerProcessStore,
  PeerStore,
  TransitionState,
} from "../../../store/data";
import { usePeerProcessStore, usePeerStore } from "../../../store";
import { shallow } from "zustand/shallow";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import QrCodeScanner from "../../qr-code-scanner";
import { decompress } from "../../../utils";
import { notifications } from "@mantine/notifications";

const JoinProcess = () => {
  const { t } = useTranslation();
  const peer = usePeerStore((state: PeerStore) => state.peer);
  const { offerInput, initiator, transition, setOfferInput, setTransition } =
    usePeerProcessStore(
      (state: PeerProcessStore) => ({
        offerInput: state.offerInput,
        initiator: state.initiator,
        transition: state.transition,
        setOfferInput: state.setOfferInput,
        setTransition: state.setTransition,
      }),
      shallow
    );

  const [value, setValue] = useState("qr");
  const [joinSignal, setJoinSignal] = useState<string>();

  useEffect(() => {
    if (peer && joinSignal) {
      peer.signal(JSON.parse(joinSignal || ""));
    }
  }, [joinSignal, peer]);

  return (
    <Transition
      transition={
        transition === TransitionState.JOIN_START ? "slide-left" : "slide-right"
      }
      mounted={
        transition === TransitionState.JOIN_START ||
        transition === TransitionState.JOIN
      }
      duration={DEFAULT_TRANSITION_TIME}
      onEntered={() => setTransition(TransitionState.JOIN)}
      onExited={() => {
        if (initiator === 2) {
          setTransition(TransitionState.SHARE_INVITE_START);
        }
      }}
      timingFunction="ease"
    >
      {(style) => (
        <CenterPaper style={style}>
          <Text>{t("peer-process-join-explanation")}</Text>
          <SegmentedControl
            
            value={value}
            onChange={setValue}
            transitionDuration={DEFAULT_TRANSITION_TIME}
            transitionTimingFunction="ease"
            data={[
              { label: t("peer-process-join-scan-qr"), value: "qr" },
              { label: t("peer-process-join-paste"), value: "paste" },
            ]}
          />

          {value === "qr" && (
            <Center>
              <QrCodeScanner
                onResult={(result: string) => {
                  if (!joinSignal) {
                    setJoinSignal(result);
                  }
                }}
              />
            </Center>
          )}

          {value !== "qr" && (
            <Flex gap="md" direction="column">
              <Textarea
                label={t("peer-process-join-input-label")}
                placeholder={`{"type":"offer|answer","sdn":"..."}`}
                autosize
                minRows={2}
                onChange={(event) => {
                  setOfferInput(event.target.value);
                }}
              />
              <Button
                
                disabled={!offerInput}
                onClick={() => {
                  if (peer) {
                    try {
                      if (!joinSignal) {
                        setJoinSignal(decompress(offerInput));
                      }
                    } catch (error: unknown) {
                      console.error(error);
                      if (error instanceof SyntaxError) {
                        notifications.show({
                          ...DEFAULT_ERROR_NOTIFICATION,
                          title: t("_error"),
                          message: error.message,
                          withCloseButton: true,
                        });
                      }
                    }
                  }
                }}
              >
                {t("peer-process-join-connect")}
              </Button>
            </Flex>
          )}
        </CenterPaper>
      )}
    </Transition>
  );
};

export default JoinProcess;

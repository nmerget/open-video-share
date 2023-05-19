import {
  Button,
  Center,
  Flex,
  JsonInput,
  SegmentedControl,
  Transition,
  Text,
} from "@mantine/core";
import { DEFAULT_TRANSITION_TIME } from "../../../utils/constants";
import CenterPaper from "../../center-paper";
import {
  PeerProcessStore,
  PeerStore,
  TransitionState,
} from "../../../store/data";
import { usePeerProcessStore, usePeerStore } from "../../../store";
import { shallow } from "zustand/shallow";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import QrCodeScanner from "../../qr-code-scanner";

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
                onResult={(result) => {
                  peer.signal(JSON.parse(result || ""));
                }}
              />
            </Center>
          )}

          {value !== "qr" && (
            <Flex gap="md" direction="column">
              <JsonInput
                label={t("peer-process-join-input-label")}
                placeholder={`{"type":"offer|answer","sdn":"..."}`}
                autosize
                minRows={4}
                onChange={(json) => {
                  setOfferInput(json);
                }}
              />
              <Button
                color="cyan"
                disabled={!offerInput}
                onClick={() => {
                  if (peer) {
                    peer.signal(JSON.parse(offerInput || ""));
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

import { Button, Center, CopyButton, Text, Transition } from "@mantine/core";
import { DEFAULT_TRANSITION_TIME } from "../../../utils/constants";
import CenterPaper from "../../center-paper";
import { MantineColor } from "@mantine/styles";
import QRCode from "react-qr-code";
import { PeerProcessStore, PeerStore, TransitionState } from "../../../store/data";
import { usePeerProcessStore, usePeerStore } from "../../../store";
import { shallow } from "zustand/shallow";
import { useTranslation } from "react-i18next";
import TextLoader from "../../text-loader";

const ShareInviteProcess = () => {
  const { t } = useTranslation();
  const offer = usePeerStore((state: PeerStore) => state.offer);
  const { initiator, transition, setStepper, setTransition } =
    usePeerProcessStore(
      (state: PeerProcessStore) => ({
        initiator: state.initiator,
        transition: state.transition,
        setStepper: state.setStepper,
        setTransition: state.setTransition,
      }),
      shallow
    );
  return (
    <Transition
      transition={
        transition === TransitionState.SHARE_INVITE_START
          ? "slide-left"
          : "slide-right"
      }
      mounted={
        transition === TransitionState.SHARE_INVITE_START ||
        transition === TransitionState.SHARE_INVITE
      }
      duration={DEFAULT_TRANSITION_TIME}
      onEntered={() => setTransition(TransitionState.SHARE_INVITE)}
      onExited={() =>
        setTransition(
          initiator === 1 ? TransitionState.JOIN_START : TransitionState.CONNECT
        )
      }
      timingFunction="ease"
    >
      {(style) => (
        <CenterPaper style={style}>
          <Text>{t("peer-process-share-invite-explanation")}</Text>
          {offer && (
            <Center>
              <QRCode value={offer} />
            </Center>
          )}
          <CopyButton value={offer || ""}>
            {({ copied, copy }) => (
              <Button
                variant="outline"
                color={(copied ? "teal" : "cyan") as MantineColor}
                onClick={copy}
              >
                {copied
                  ? t("peer-process-share-invite-copied")
                  : t("peer-process-share-invite-copy")}
              </Button>
            )}
          </CopyButton>
          {initiator === 1 && (
            <Button
              color="cyan"
              onClick={() => {
                setStepper(1);
                setTransition(TransitionState.SHARE_INVITE_END);
              }}
            >
              {t("peer-process-share-invite-continue")}
            </Button>
          )}
          {initiator === 2 && (
            <TextLoader>{t("peer-process-share-invite-wait")}</TextLoader>
          )}
        </CenterPaper>
      )}
    </Transition>
  );
};

export default ShareInviteProcess;

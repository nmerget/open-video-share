import { DEFAULT_TRANSITION_TIME } from "../../../utils/constants";
import CenterPaper from "../../center-paper";
import {
  Button,
  Center,
  Flex,
  LoadingOverlay,
  Text,
  Title,
  Transition,
} from "@mantine/core";
import {
  PeerProcessStore,
  PeerStore,
  TransitionState,
} from "../../../store/data";
import { usePeerProcessStore, usePeerStore } from "../../../store";
import { shallow } from "zustand/shallow";
import { useTranslation } from "react-i18next";

const SelectPeerProcess = () => {
  const { t } = useTranslation();
  const offer = usePeerStore((state: PeerStore) => state.offer);
  const { initiator, transition, setInitiator, setTransition } =
    usePeerProcessStore(
      (state: PeerProcessStore) => ({
        initiator: state.initiator,
        transition: state.transition,
        setInitiator: state.setInitiator,
        setTransition: state.setTransition,
      }),
      shallow
    );
  return (
    <Transition
      transition="fade"
      mounted={transition < TransitionState.SELECT_INVITE_JOIN_END}
      duration={DEFAULT_TRANSITION_TIME}
      onEntered={() => setTransition(TransitionState.SELECT_INVITE_JOIN)}
      onExited={() =>
        setTransition(
          initiator === 1
            ? TransitionState.SHARE_INVITE_START
            : TransitionState.JOIN_START
        )
      }
      timingFunction="ease"
    >
      {(style) => (
        <Flex style={style} gap="md" direction="column">
          <Center>
            <Title>Open Video Share</Title>
          </Center>
          <CenterPaper>
            <Text>{t("peer-process-select-explanation")}</Text>
            <Button  onClick={() => setInitiator(1)}>
              {t("peer-process-select-share")}
            </Button>
            <Button  onClick={() => setInitiator(2)}>
              {t("peer-process-select-receive")}
            </Button>
            <LoadingOverlay
              visible={!offer && initiator === 1}
              overlayBlur={2}
            />
          </CenterPaper>
        </Flex>
      )}
    </Transition>
  );
};

export default SelectPeerProcess;

import { useCallback, useEffect } from "react";
import StepperProcess from "./stepper-process";
import SelectPeerProcess from "./select-peer-process";
import { shallow } from "zustand/shallow";
import ShareInviteProcess from "./share-invite-process";
import JoinProcess from "./join-process";
import { usePeerProcessStore, usePeerStore } from "../../store";
import { PeerProcessStore, PeerStore, TransitionState } from "../../store/data";
import { SignalData } from "simple-peer";
import {
  DEFAULT_ERROR_NOTIFICATION,
  SIMPLE_PEER_ANSWER,
  SIMPLE_PEER_CONNECT,
  SIMPLE_PEER_DATA,
  SIMPLE_PEER_ERROR,
  SIMPLE_PEER_OFFER,
  SIMPLE_PEER_SIGNAL,
} from "../../utils/constants";
import { compress } from "../../utils";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";

const PeerProcess = () => {
  const { t } = useTranslation();
  const { initiator, setStepper, setTransition } = usePeerProcessStore(
    (state: PeerProcessStore) => ({
      initiator: state.initiator,
      setStepper: state.setStepper,
      setTransition: state.setTransition,
    }),
    shallow
  );

  const { offer, connected, setOffer, setConnected, setData, setPeer } =
    usePeerStore((state: PeerStore) => ({
      offer: state.offer,
      connected: state.connected,
      setOffer: state.setOffer,
      setConnected: state.setConnected,
      setData: state.setData,
      setPeer: state.setPeer,
    }));

  const createPeer = useCallback(
    (peerInitiator: number) => {
      const p = new window.SimplePeer({
        initiator: peerInitiator === 1,
        trickle: false,
        config: { iceServers: undefined }, // disable servers
      });

      p.on(SIMPLE_PEER_SIGNAL, (data: SignalData) => {
        const signal = JSON.stringify(data);
        if (
          data.type === SIMPLE_PEER_OFFER ||
          data.type === SIMPLE_PEER_ANSWER
        ) {
          setOffer(compress(signal));
        }
      });

      p.on(SIMPLE_PEER_CONNECT, () => {
        setConnected(true);
      });

      p.on(SIMPLE_PEER_ERROR, (error: Error) => {
        console.error(error);
        notifications.show({
          ...DEFAULT_ERROR_NOTIFICATION,
          title: t("_error"),
          message: error.message,
          withCloseButton: true,
        });
      });

      p.on(SIMPLE_PEER_DATA, (data: Uint8Array) => {
        setData(new TextDecoder().decode(data));
      });

      setPeer(p);
    },
    [setConnected, setData, setOffer, setPeer, t]
  );

  useEffect(() => {
    if (initiator > 0) {
      createPeer(initiator);
      if (initiator === 2) {
        setStepper(0);
        setTransition(TransitionState.SELECT_INVITE_JOIN_END);
      }
    }
  }, [createPeer, initiator, setStepper, setTransition]);

  useEffect(() => {
    if (offer) {
      if (initiator === 1) {
        setStepper(0);
        setTransition(TransitionState.SELECT_INVITE_JOIN_END);
      }
      if (initiator === 2) {
        setStepper(1);
        setTransition(TransitionState.JOIN_END);
      }
    }
  }, [initiator, offer, setStepper, setTransition]);

  useEffect(() => {
    if (connected) {
      setStepper(2);
      setTransition(TransitionState.CONNECT_START);
    }
  }, [connected, setStepper, setTransition]);

  return (
    <>
      <StepperProcess />

      <SelectPeerProcess />

      <ShareInviteProcess />

      <JoinProcess />
    </>
  );
};

export default PeerProcess;

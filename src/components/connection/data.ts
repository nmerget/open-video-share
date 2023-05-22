import {
  DEFAULT_ERROR_NOTIFICATION,
  SIMPLE_PEER_ANSWER,
  SIMPLE_PEER_ERROR,
  SIMPLE_PEER_OFFER,
  SIMPLE_PEER_SIGNAL,
  SIMPLE_PEER_STREAM,
} from "../../utils/constants";
import { SignalData } from "simple-peer";
import { notifications } from "@mantine/notifications";
import { t } from "i18next";

export type FacingModeType =
  | {
      exact: "environment";
    }
  | "user";

export type CreateStreamPeerType = {
  initiator: number;
  setStream: (stream: MediaStream) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  peer?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setStreamPeer: (peer: any) => void;
};

export const createStreamPeer = async ({
  initiator,
  setStream,
  peer,
  setStreamPeer,
}: CreateStreamPeerType) => {

  const p = new window.SimplePeer({
    initiator: initiator === 1,
    trickle: false,
    config: { iceServers: undefined }, // disable servers
  });

  p.on(SIMPLE_PEER_SIGNAL, (data: SignalData) => {
    const signal = JSON.stringify(data);
    if (data.type === SIMPLE_PEER_OFFER || data.type === SIMPLE_PEER_ANSWER) {
      peer.send(signal);
    }
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

  p.on(SIMPLE_PEER_STREAM, (stream: MediaStream) => {
    setStream(stream);
  });

  setStreamPeer(p);
};

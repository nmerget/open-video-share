import { MutableRefObject, useEffect, useRef, useState } from "react";
import CenterPaper from "../center-paper";
import { usePeerProcessStore, usePeerStore } from "../../store";
import { PeerProcessStore, PeerStore } from "../../store/data";
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
import { useTranslation } from "react-i18next";
import { useEffectOnce } from "../../utils/use-effect-once";

const Connection = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [streamPeer, setStreamPeer] = useState<any>();
  const { t } = useTranslation();
  const video =
    useRef<HTMLVideoElement>() as MutableRefObject<HTMLVideoElement>;
  const { peer, data, stream, setStream } = usePeerStore(
    (state: PeerStore) => ({
      peer: state.peer,
      data: state.data,
      stream: state.stream,
      setStream: state.setStream,
    })
  );
  const initiator = usePeerProcessStore(
    (state: PeerProcessStore) => state.initiator
  );

  useEffectOnce(() => {
    const createStreamPeer = async (peerInitiator: number) => {
      let mediaStream: MediaStream | undefined;
      if (peerInitiator === 1) {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
      }

      const p = new window.SimplePeer({
        initiator: peerInitiator === 1,
        trickle: false,
        config: { iceServers: undefined }, // disable servers
        stream: mediaStream,
      });

      p.on(SIMPLE_PEER_SIGNAL, (data: SignalData) => {
        const signal = JSON.stringify(data);
        if (
          data.type === SIMPLE_PEER_OFFER ||
          data.type === SIMPLE_PEER_ANSWER
        ) {
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
        +setStream(stream);
      });

      setStreamPeer(p);
    };
    createStreamPeer(initiator);
  });

  useEffect(() => {
    if (data && streamPeer) {
      streamPeer.signal(data);
    }
  }, [data, streamPeer]);

  useEffect(() => {
    if (video.current && !video.current.srcObject && stream) {
      video.current.srcObject = stream;
      video.current.play();
    }
  }, [stream, video]);

  return (
    <CenterPaper>
      <video ref={video} />
    </CenterPaper>
  );
};

export default Connection;

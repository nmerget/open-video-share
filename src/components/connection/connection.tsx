import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import CenterPaper from "../center-paper";
import { usePeerProcessStore, usePeerStore } from "../../store";
import { PeerProcessStore, PeerStore } from "../../store/data";
import { SIMPLE_PEER_ANSWER, SIMPLE_PEER_OFFER } from "../../utils/constants";
import { createStreamPeer, FacingModeType } from "./data";
import { t } from "i18next";
import TextLoader from "../text-loader";
import MediaSelection from "./media-selection";
import { Flex, Switch } from "@mantine/core";

const Connection = () => {
  const video =
    useRef<HTMLVideoElement>() as MutableRefObject<HTMLVideoElement>;
  const { peer, data } = usePeerStore((state: PeerStore) => ({
    peer: state.peer,
    data: state.data,
  }));
  const initiator = usePeerProcessStore(
    (state: PeerProcessStore) => state.initiator
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [streamPeer, setStreamPeer] = useState<any>();
  const [facingMode, setFacingMode] = useState<FacingModeType | undefined>(
    undefined
  );
  const [audio, setAudio] = useState<boolean>(true);
  const [stream, setStream] = useState<MediaStream>();
  const [muted, setMuted] = useState<boolean>(initiator === 1);

  useEffect(() => {
    createStreamPeer({ initiator, setStream, peer, setStreamPeer });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) {
      const jsonData = JSON.parse(data);
      if (
        (jsonData.type === SIMPLE_PEER_OFFER ||
          jsonData.type === SIMPLE_PEER_ANSWER) &&
        streamPeer
      ) {
        streamPeer.signal(data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (video.current && !video.current.srcObject && stream) {
      video.current.srcObject = stream;
      video.current.play();
    }
  }, [stream, video]);

  useEffect(() => {
    if (initiator === 1 && streamPeer && facingMode) {
      if (stream) {
        streamPeer.removeStream(stream);
      }
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode,
          },
          audio: audio,
        })
        .then((mediaSteam: MediaStream) => {
          streamPeer.addStream(mediaSteam);
          setStream(mediaSteam);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode, streamPeer]);

  return (
    <CenterPaper>
      {!facingMode && initiator === 1 && (
        <MediaSelection
          onStart={(mode, aud) => {
            setAudio(aud);
            setFacingMode(mode);
          }}
        />
      )}

      {!stream && initiator !== 1 && (
        <TextLoader>{t("connection-wait")}</TextLoader>
      )}

      {stream && (
        <Flex gap="md" direction="column">
          <video ref={video} muted={muted} />
          <Flex gap="md">
            <Switch
              size="lg"
              checked={muted}
              onChange={(event) => setMuted(event.currentTarget.checked)}
              onLabel={t("_on")}
              offLabel={t("off")}
              label={t("connection-mute-audio")}
            />
          </Flex>
        </Flex>
      )}
    </CenterPaper>
  );
};

export default Connection;

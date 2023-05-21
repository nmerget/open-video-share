import { MutableRefObject, useEffect, useRef } from "react";
import CenterPaper from "../center-paper";
import { usePeerStore } from "../../store";
import { PeerStore } from "../../store/data";

const Connection = () => {
  const video =
    useRef<HTMLVideoElement>() as MutableRefObject<HTMLVideoElement>;
  const { stream } = usePeerStore((state: PeerStore) => ({
    stream: state.stream,
  }));

  useEffect(() => {
    if (video.current && !video.current.srcObject && stream) {
      console.log("setMediaStream", stream);
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

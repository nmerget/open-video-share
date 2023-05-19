import { useEffect, useState } from "react";
import { ScrollArea, Text, TextInput, Transition } from "@mantine/core";
import { DEFAULT_TRANSITION_TIME } from "../../utils/constants";
import CenterPaper from "../center-paper";
import { shallow } from "zustand/shallow";
import {
  useMessageStore,
  usePeerProcessStore,
  usePeerStore,
} from "../../store";
import {
  MessageStore,
  PeerProcessStore,
  PeerStore,
  TransitionState,
} from "../../store/data";

const Connection = () => {
  const [messageInput, setMessageInput] = useState<string>("");

  const { messages, addMessage } = useMessageStore(
    (state: MessageStore) => ({
      messages: state.messages,
      addMessage: state.addMessage,
    }),
    shallow
  );

  const { transition } = usePeerProcessStore(
    (state: PeerProcessStore) => ({
      transition: state.transition,
    }),
    shallow
  );

  const { peer, data, error } = usePeerStore((state: PeerStore) => ({
    peer: state.peer,
    data: state.data,
    error: state.error,
  }));

  useEffect(() => {
    if (data) {
      addMessage(`Other: ${data.toString()}`);
    }
  }, [addMessage, data]);

  useEffect(() => {
    if (error) {
      addMessage(`Error: ${error.toString()}`);
    }
  }, [addMessage, error]);

  return (
    <Transition
      transition="fade"
      duration={DEFAULT_TRANSITION_TIME}
      mounted={transition === TransitionState.CONNECT}
    >
      {(style) => (
        <CenterPaper style={style}>
          <Text>TODO: Messaging is just for test!</Text>
          <TextInput
            onChange={(event) => setMessageInput(event.currentTarget.value)}
            value={messageInput}
            placeholder="Message"
            radius="xl"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                addMessage(`Me: ${messageInput}`);
                if (peer) {
                  peer.send(messageInput);
                }
                setMessageInput("");
              }
            }}
          />
          <ScrollArea>
            {messages.map((message, index) => (
              <Text key={`${message}-${index}`}>{message}</Text>
            ))}
          </ScrollArea>
        </CenterPaper>
      )}
    </Transition>
  );
};

export default Connection;

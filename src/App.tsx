import { Container } from "@mantine/core";
import { usePeerProcessStore, usePeerStore } from "./store";
import { PeerProcessStore, PeerStore, TransitionState } from "./store/data";
import { shallow } from "zustand/shallow";
import Connection from "./components/connection";
import PeerProcess from "./components/peer-process";

const App = () => {
  const { peer } = usePeerStore((state: PeerStore) => ({
    peer: state.peer,
  }));

  const { transition, initiator } = usePeerProcessStore(
    (state: PeerProcessStore) => ({
      transition: state.transition,
      initiator: state.initiator,
    }),
    shallow
  );
  return (
    <Container
      size="lg"
      px="lg"
      py="lg"
      sx={() => ({ height: "100%", width: "100%" })}
    >
      <PeerProcess />
      {transition === TransitionState.CONNECT && peer && <Connection />}
    </Container>
  );
};

export default App;

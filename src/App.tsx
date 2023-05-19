import { Container } from "@mantine/core";
import PeerProcess from "./components/peer-process";
import Connection from "./components/connection";

const App = () => {
  return (
    <Container
      size="lg"
      px="lg"
      py="lg"
      sx={() => ({ height: "100%", width: "100%" })}
    >
      <PeerProcess />
      <Connection />
    </Container>
  );
};

export default App;

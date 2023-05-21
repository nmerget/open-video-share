export type PeerStore = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  peer?: any;
  offer?: string;
  connected?: boolean;
  data?: string;
  stream?: MediaStream;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPeer: (peer: any) => void;
  setOffer: (offer: string) => void;
  setConnected: (connected: boolean) => void;
  setData: (data: string) => void;
  setStream: (stream: MediaStream) => void;
};

export type PeerProcessStore = {
  stepper: number;
  setStepper: (stepper: number) => void;
  transition: TransitionState;
  setTransition: (transition: TransitionState) => void;
  initiator: number;
  setInitiator: (initiator: number) => void;
  offerInput: string;
  setOfferInput: (offerInput: string) => void;
};

export enum TransitionState {
  SELECT_INVITE_JOIN_START,
  SELECT_INVITE_JOIN,
  SELECT_INVITE_JOIN_END,
  SHARE_INVITE_START,
  SHARE_INVITE,
  SHARE_INVITE_END,
  JOIN_START,
  JOIN,
  JOIN_END,

  CONNECT_START,
  CONNECT,
}

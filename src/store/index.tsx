import { create } from "zustand";
import {
  MessageStore,
  PeerProcessStore,
  PeerStore,
  TransitionState,
} from "./data";
import { devtools } from "zustand/middleware";
import { uuid } from "../utils";

export const storeUUID = uuid();
export const usePeerProcessStore = create<PeerProcessStore>()(
  devtools(
    (set) => ({
      stepper: -1,
      setStepper: (stepper) => set(() => ({ stepper })),
      transition: TransitionState.SELECT_INVITE_JOIN_START,
      setTransition: (transition) => set(() => ({ transition })),
      initiator: 0,
      setInitiator: (initiator) => set(() => ({ initiator })),
      offerInput: "",
      setOfferInput: (offerInput) => set(() => ({ offerInput })),
    }),
    { name: `${storeUUID}-peer-process-store` }
  )
);
export const usePeerStore = create<PeerStore>()(
  devtools(
    (set) => ({
      setPeer: (peer) => set(() => ({ peer })),
      setOffer: (offer) => set(() => ({ offer })),
      setConnected: (connected) => set(() => ({ connected })),
      setError: (error) => set(() => ({ error })),
      setData: (data) => set(() => ({ data })),
    }),
    { name: `${storeUUID}-peer-store` }
  )
);
export const useMessageStore = create<MessageStore>()(
  devtools(
    (set) => ({
      messages: ["Connected"],
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
    }),
    { name: `${storeUUID}-message-store` }
  )
);

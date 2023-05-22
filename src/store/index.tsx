import { create } from "zustand";
import { PeerProcessStore, PeerStore, TransitionState } from "./data";
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
      setData: (data) => set(() => ({ data })),
    }),
    { name: `${storeUUID}-peer-store` }
  )
);

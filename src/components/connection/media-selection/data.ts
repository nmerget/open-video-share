import { FacingModeType } from "../data";

export type MediaSelectionType = {
  onStart: (facingMode: FacingModeType | undefined, audio: boolean) => void;
};

import { DEFAULT_TRANSITION_TIME } from "../../../utils/constants";
import { Stepper, Transition } from "@mantine/core";
import { shallow } from "zustand/shallow";
import { PeerProcessStore, TransitionState } from "../../../store/data";
import { usePeerProcessStore } from "../../../store";
import { useTranslation } from "react-i18next";

const StepperProcess = () => {
  const { t } = useTranslation();
  const { initiator, transition, stepper, setTransition } = usePeerProcessStore(
    (state: PeerProcessStore) => ({
      initiator: state.initiator,
      transition: state.transition,
      stepper: state.stepper,
      setTransition: state.setTransition,
    }),
    shallow
  );
  return (
    <Transition
      transition="slide-down"
      mounted={
        transition > TransitionState.SELECT_INVITE_JOIN_END &&
        transition < TransitionState.CONNECT_START
      }
      onExited={() => setTransition(TransitionState.CONNECT)}
      duration={DEFAULT_TRANSITION_TIME}
      timingFunction="ease"
    >
      {(styles) => (
        <Stepper style={{ ...styles }} color="cyan" size="xs" active={stepper}>
          <Stepper.Step
            label={t("peer-process-stepper-step", { val: 1 })}
            description={
              initiator === 1
                ? t("peer-process-stepper-share")
                : t("peer-process-stepper-join")
            }
          />
          <Stepper.Step
            label={t("peer-process-stepper-step", { val: 1 })}
            description={
              initiator === 2
                ? t("peer-process-stepper-share")
                : t("peer-process-stepper-join")
            }
          />
        </Stepper>
      )}
    </Transition>
  );
};

export default StepperProcess;

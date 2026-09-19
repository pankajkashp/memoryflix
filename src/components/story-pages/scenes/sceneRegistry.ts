import { ComponentType } from "react";
import { SceneProps } from "./types";
import EnvelopeScene from "./EnvelopeScene";
import ScratchCountdownScene from "./ScratchCountdownScene";
import YesNoQuestionScene from "./YesNoQuestionScene";
import ReactionGagScene from "./ReactionGagScene";
import MessageBeatScene from "./MessageBeatScene";
import GiftPickerScene from "./GiftPickerScene";
import ConfettiFinaleScene from "./ConfettiFinaleScene";

export const SCENE_COMPONENT_REGISTRY: Record<string, ComponentType<SceneProps>> = {
  SCENE_ENVELOPE: EnvelopeScene,
  SCENE_SCRATCH_COUNTDOWN: ScratchCountdownScene,
  SCENE_YESNO_QUESTION: YesNoQuestionScene,
  SCENE_REACTION_GAG: ReactionGagScene,
  SCENE_MESSAGE_BEAT: MessageBeatScene,
  SCENE_GIFT_PICKER: GiftPickerScene,
  SCENE_CONFETTI_FINALE: ConfettiFinaleScene,
};

export function isSceneComponentKey(componentKey: string): boolean {
  return componentKey.startsWith("SCENE_");
}

// js/navigation.js

import { state } from "./state.js";
import { publishData, publishRaw } from "./mqtt.js";
import {
  setTiltDisplay,
  resetTiltSlider,
  setFaceTrackButtonState,
} from "./ui.js";

export function sendGoTo(destinationName) {
  if (!state.topics) return;
  publishData(state.topics.COMMANDS, {
    action: "goto",
    destination: destinationName,
  });
}

export function publishMode(mode) {
  if (!state.topics) return;
  publishRaw(state.topics.MODE, mode);
}

export function setTiltAngle(angle) {
  if (!state.topics) return;
  publishData(state.topics.COMMANDS, { tiltAngle: parseInt(angle, 10) });
  setTiltDisplay(angle);
}

export function toggleFaceTracking() {
  state.isFaceTrackingEnabled = !state.isFaceTrackingEnabled;
  if (state.topics) {
    publishData(state.topics.COMMANDS, {
      faceTracking: state.isFaceTrackingEnabled,
    });
  }
  setFaceTrackButtonState(state.isFaceTrackingEnabled);

  if (!state.isFaceTrackingEnabled) {
    setTiltAngle(0);
    resetTiltSlider();
  }
}
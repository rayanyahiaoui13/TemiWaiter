import { initMqtt, selectRobot } from "./mqtt.js";
import { startWebRTCCall, toggleMute, toggleVideo } from "./webrtc.js";
import {
  sendGoTo,
  setTiltAngle,
  toggleFaceTracking,
  requestLocations,
} from "./navigation.js";

import { startJoy, stopJoy, initKeyboardControls } from "./teleop.js";
import { clearLiveCart } from "./cart.js";
import { addRobotOption, getSelectedRobotId } from "./ui.js";
import {
  sendGoTo,
  setTiltAngle,
  toggleFaceTracking,
  requestLocations,
} from "./navigation.js";

// Known robots at startup. Add serial numbers here, or add them live via the input field.
const KNOWN_ROBOTS = ["00122350104", "00123120007"];

function bindControlCenter() {
  document
    .getElementById("btn-call")
    .addEventListener("click", startWebRTCCall);
  document.getElementById("btn-mute").addEventListener("click", toggleMute);
  document.getElementById("btn-video").addEventListener("click", toggleVideo);
}

function bindNavigation() {
  const container = document.getElementById("nav-locations-container");
  if (container) {
    container.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-goto]");
      if (btn) sendGoTo(btn.dataset.goto);
    });
  }

  const refreshBtn = document.getElementById("btn-refresh-locations");
  if (refreshBtn) refreshBtn.addEventListener("click", requestLocations);
}

function bindDPad() {
  const dpad = {
    up: [1.0, 0.0],
    left: [0.0, 0.5],
    down: [-1.0, 0.0],
    right: [0.0, -0.5],
  };

  Object.entries(dpad).forEach(([dir, [speed, rotation]]) => {
    const btn = document.querySelector(`[data-dpad="${dir}"]`);
    if (!btn) return;
    const start = () => startJoy(speed, rotation);
    btn.addEventListener("mousedown", start);
    btn.addEventListener("touchstart", start);
    btn.addEventListener("mouseup", stopJoy);
    btn.addEventListener("mouseleave", stopJoy);
    btn.addEventListener("touchend", stopJoy);
  });
}

function bindTiltAndFaceTrack() {
  document
    .querySelector('input[type="range"]')
    .addEventListener("input", (e) => setTiltAngle(e.target.value));
  document
    .getElementById("btn-facetrack")
    .addEventListener("click", toggleFaceTracking);
}

function bindCart() {
  document
    .getElementById("clear-cart-btn")
    .addEventListener("click", clearLiveCart);
}

function bindRobotSelector() {
  const select = document.getElementById("robot-select");
  const addBtn = document.getElementById("btn-add-robot");
  const input = document.getElementById("robot-id-input");

  if (select) {
    select.addEventListener("change", () => {
      const id = getSelectedRobotId();
      if (input) input.value = id || "";
      if (id) selectRobot(id);
    });
  }

  if (addBtn && input) {
    addBtn.addEventListener("click", () => {
      const id = input.value.trim();
      if (!id) return;
      addRobotOption(id, true);
      selectRobot(id);
      input.value = "";
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addBtn.click();
    });
  }

  KNOWN_ROBOTS.forEach((id) => addRobotOption(id));
}
document.addEventListener("DOMContentLoaded", () => {
  bindControlCenter();
  bindNavigation();
  bindDPad();
  bindTiltAndFaceTrack();
  bindCart();
  bindRobotSelector();
  initKeyboardControls();
  initMqtt();
});

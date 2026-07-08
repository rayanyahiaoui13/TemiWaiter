// js/mqtt.js
import { MQTT_CONFIG, buildTopics } from "./config.js";
import {
  setConnectionStatus,
  renderCart,
  addLogEntry,
  setCurrentPage,
  setBatteryDisplay,
} from "./ui.js";
import { addToCart, handleOrderValidation, clearLiveCart } from "./cart.js";
import { handleRemoteAnswer, handleRemoteCandidate } from "./webrtc.js";
import { state } from "./state.js";

let client = null;

export function publishData(topic, payloadObj) {
  if (!client || !client.isConnected()) return;
  const message = new Paho.MQTT.Message(JSON.stringify(payloadObj));
  message.destinationName = topic;
  message.qos = 0;
  client.send(message);
}

export function publishRaw(topic, text) {
  if (!client || !client.isConnected()) return;
  const message = new Paho.MQTT.Message(text);
  message.destinationName = topic;
  client.send(message);
}

function handleMenuMessage(payload) {
  switch (payload.type) {
    case "page_view":
      setCurrentPage(payload.page);
      addLogEntry(`Client opened: ${payload.page}`, "text-blue-400");
      break;
    case "order_validation":
      handleOrderValidation(payload);
      break;
    case "clear_cart":
      addLogEntry("Customer cleared the cart", "text-red-400");
      clearLiveCart();
      break;
    default:
      if (payload.request) addToCart(payload.request);
  }
}

// Handles the "status" topic: navigation_status + battery_update
function handleStatusMessage(payload) {
  switch (payload.type) {
    case "battery_update":
      state.batteryLevel = payload.level;
      state.isCharging = payload.isCharging;
      setBatteryDisplay(payload.level, payload.isCharging);
      break;
    case "navigation_status":
      addLogEntry(
        `Nav: ${payload.location} -> ${payload.status}`,
        "text-purple-400",
      );
      break;
    default:
      break;
  }
}

function onMessageArrived(message) {
  try {
    const payload = JSON.parse(message.payloadString);
    const topics = state.topics;
    if (!topics) return;

    switch (message.destinationName) {
      case topics.WEBRTC_ANSWER:
        handleRemoteAnswer(payload);
        break;
      case topics.WEBRTC_CANDIDATE_ROBOT:
        handleRemoteCandidate(payload);
        break;
      case topics.MENU:
        handleMenuMessage(payload);
        break;
      case topics.STATUS:
        handleStatusMessage(payload);
        break;
    }
  } catch (error) {
    console.error("MQTT Parsing Error:", error, message.payloadString);
  }
}

function onConnectionLost() {
  setConnectionStatus(false, "🔴 MQTT CONNECTION LOST");
}

function subscribeToRobotTopics() {
  const t = state.topics;
  if (!client || !client.isConnected() || !t) return;
  client.subscribe(t.WEBRTC_ANSWER);
  client.subscribe(t.WEBRTC_CANDIDATE_ROBOT);
  client.subscribe(t.STATUS);
  client.subscribe(t.MENU);
}

function unsubscribeFromRobotTopics(topics) {
  if (!client || !client.isConnected() || !topics) return;
  try {
    client.unsubscribe(topics.WEBRTC_ANSWER);
    client.unsubscribe(topics.WEBRTC_CANDIDATE_ROBOT);
    client.unsubscribe(topics.STATUS);
    client.unsubscribe(topics.MENU);
  } catch (e) {
    console.warn("Unsubscribe error:", e);
  }
}

function onConnectSuccess() {
  setConnectionStatus(true, "🟢 ONLINE (CLOUD) - Ready for video");
  if (state.currentRobotId) selectRobot(state.currentRobotId);
}

function onConnectFailure(message) {
  setConnectionStatus(
    false,
    "🔴 CLOUD CONNECTION FAILED: " + message.errorMessage,
  );
}

export function initMqtt() {
  client = new Paho.MQTT.Client(
    MQTT_CONFIG.broker,
    MQTT_CONFIG.port,
    MQTT_CONFIG.clientId,
  );
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  client.connect({
    userName: "temi_admin",       
    password: "TestTemi1",
    useSSL: false,
    onSuccess: onConnectSuccess,
    onFailure: onConnectFailure,
  });

  renderCart();
}

// Switches the dashboard to control a different Temi robot (by serial number / ROBOT_ID).
// Unsubscribes from the previous robot's topics and subscribes to the new one's.
export function selectRobot(robotId) {
  if (!robotId) return;
  const previousTopics = state.topics;

  state.currentRobotId = robotId;
  state.topics = buildTopics(robotId);

  unsubscribeFromRobotTopics(previousTopics);
  subscribeToRobotTopics();

  // Reset battery display until the new robot reports its status
  state.batteryLevel = null;
  state.isCharging = false;
  setBatteryDisplay(null, false);

  addLogEntry(`Connected to robot: ${robotId}`, "text-green-400", true);
  publishRaw(state.topics.MODE, "MANUEL");
}

export function isMqttConnected() {
  return !!(client && client.isConnected());
}
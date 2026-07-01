// js/mqtt.js
import { MQTT_CONFIG, TOPICS } from "./config.js";
import {
  setConnectionStatus,
  renderCart,
  addLogEntry,
  setCurrentPage,
} from "./ui.js";
import { addToCart, handleOrderValidation, clearLiveCart } from "./cart.js";
import { handleRemoteAnswer, handleRemoteCandidate } from "./webrtc.js";

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

function onMessageArrived(message) {
  try {
    const payload = JSON.parse(message.payloadString);

    switch (message.destinationName) {
      case TOPICS.WEBRTC_ANSWER:
        handleRemoteAnswer(payload);
        break;
      case TOPICS.WEBRTC_CANDIDATE_ROBOT:
        handleRemoteCandidate(payload);
        break;
      case TOPICS.MENU:
        handleMenuMessage(payload);
        break;
    }
  } catch (error) {
    console.error("MQTT Parsing Error:", error, message.payloadString);
  }
}

function onConnectionLost() {
  setConnectionStatus(false, "🔴 MQTT CONNECTION LOST");
}

function onConnectSuccess() {
  setConnectionStatus(true, "🟢 ONLINE (CLOUD) - Ready for video");
  client.subscribe(TOPICS.WEBRTC_ANSWER);
  client.subscribe(TOPICS.WEBRTC_CANDIDATE_ROBOT);
  client.subscribe(TOPICS.STATUS);
  client.subscribe(TOPICS.MENU);
  publishRaw(TOPICS.MODE, "MANUEL");
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
    userName: MQTT_CONFIG.username,
    password: MQTT_CONFIG.password,
    useSSL: true,
    onSuccess: onConnectSuccess,
    onFailure: onConnectFailure,
  });

  renderCart();
}

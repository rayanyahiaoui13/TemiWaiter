//
import { RTC_CONFIG } from "./config.js";
import { state } from "./state.js";
import {
  setCallButtonActive,
  setMuteButtonState,
  setVideoButtonState,
} from "./ui.js";
import { publishData } from "./mqtt.js";

const MEDIA_CONSTRAINTS = {
  video: {
    width: { ideal: 640 },
    height: { ideal: 360 },
    frameRate: { ideal: 15, max: 24 },
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
};

function preferH264(peerConnection) {
  peerConnection.getTransceivers().forEach((transceiver) => {
    if (transceiver.sender?.track?.kind === "video") {
      const capabilities = RTCRtpSender.getCapabilities("video");
      const h264 = capabilities?.codecs.filter(
        (c) => c.mimeType.toLowerCase() === "video/h264",
      );
      if (h264 && h264.length > 0) transceiver.setCodecPreferences(h264);
    }
  });
}

export async function startWebRTCCall() {
  if (!state.topics) {
    alert("Please select a robot before starting a call.");
    return;
  }

  state.peerConnection = new RTCPeerConnection(RTC_CONFIG);

  state.peerConnection.onicecandidate = (event) => {
    if (event.candidate)
      publishData(state.topics.WEBRTC_CANDIDATE_PC, event.candidate);
  };

  state.peerConnection.ontrack = (event) => {
    document.getElementById("remote-video").srcObject = event.streams[0];
    setCallButtonActive();
  };

  try {
    const localStream =
      await navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS);
    state.localStream = localStream;
    document.getElementById("local-video").srcObject = localStream;
    localStream
      .getTracks()
      .forEach((track) => state.peerConnection.addTrack(track, localStream));
    preferH264(state.peerConnection);
  } catch (e) {
    console.warn("Camera/Mic not accessible on this device.", e);
    alert(
      "Please allow camera access to send your video to the robot and see yourself on screen.",
    );
  }

  const offer = await state.peerConnection.createOffer();
  await state.peerConnection.setLocalDescription(offer);
  publishData(state.topics.WEBRTC_OFFER, { type: offer.type, sdp: offer.sdp });
}

export function toggleMute() {
  if (!state.localStream) return;
  state.isMuted = !state.isMuted;
  state.localStream.getAudioTracks()[0].enabled = !state.isMuted;
  setMuteButtonState(state.isMuted);
}

export function toggleVideo() {
  if (!state.localStream) return;
  state.isVideoStopped = !state.isVideoStopped;
  state.localStream.getVideoTracks()[0].enabled = !state.isVideoStopped;
  setVideoButtonState(state.isVideoStopped);
}

export async function handleRemoteAnswer(payload) {
  await state.peerConnection.setRemoteDescription(
    new RTCSessionDescription(payload),
  );
}

export async function handleRemoteCandidate(payload) {
  await state.peerConnection.addIceCandidate(new RTCIceCandidate(payload));
}
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://webrtc-backend-yom8.onrender.com");

export default function VideoRoom({ roomID, username }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const screenTrackRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  useEffect(() => {
    const init = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideoRef.current.srcObject = mediaStream;
      setStream(mediaStream);

      socket.emit("join-room", roomID);

socket.on("user-joined", () => {
  console.log("Another user joined, sending ready signal");
  socket.emit("ready", roomID);
});

socket.on("ready", async () => {
  console.log("Received ready signal, creating offer");
  const offer = await peerConnection.current.createOffer();
  await peerConnection.current.setLocalDescription(offer);
  socket.emit("signal", {
    roomID,
    data: { type: "offer", sdp: offer },
  });
});

    };

    init();

    return () => {
      socket.disconnect();
      if (peerConnection.current) peerConnection.current.close();
    };
  }, [roomID]);

  useEffect(() => {
    if (!stream) return;

    const config = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    peerConnection.current = new RTCPeerConnection(config);

    stream.getTracks().forEach((track) =>
      peerConnection.current.addTrack(track, stream)
    );

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", {
          roomID,
          data: { type: "ice", candidate: event.candidate },
        });
      }
    };

    socket.on("user-joined", async () => {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("signal", {
        roomID,
        data: { type: "offer", sdp: offer },
      });
    });

    socket.on("signal", async ({ data }) => {
      if (data.type === "offer") {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.sdp)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit("signal", {
          roomID,
          data: { type: "answer", sdp: answer },
        });
      } else if (data.type === "answer") {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.sdp)
        );
      } else if (data.type === "ice") {
        try {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        } catch (e) {
          console.error("Error adding ICE candidate", e);
        }
      }
    });

    socket.on("chat-message", (data) => {
      setChatMessages((prev) => [...prev, data]);
    });
  }, [stream, roomID]);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const message = { user: username, text: chatInput };
    socket.emit("chat-message", { roomID, ...message });
    setChatMessages((prev) => [...prev, message]);
    setChatInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Welcome {username} to Room: {roomID}
      </h2>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => {
            stream.getAudioTracks()[0].enabled = !audioEnabled;
            setAudioEnabled(!audioEnabled);
          }}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          {audioEnabled ? "Mute" : "Unmute"}
        </button>
        <button
          onClick={() => {
            stream.getVideoTracks()[0].enabled = !videoEnabled;
            setVideoEnabled(!videoEnabled);
          }}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          {videoEnabled ? "Turn Off Camera" : "Turn On Camera"}
        </button>
        <button
          onClick={async () => {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = screenStream.getTracks()[0];
            screenTrackRef.current = screenTrack;

            const sender = peerConnection.current
              .getSenders()
              .find((s) => s.track.kind === "video");
            sender.replaceTrack(screenTrack);

            screenTrack.onended = () => {
              sender.replaceTrack(stream.getVideoTracks()[0]);
            };
          }}
          className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
        >
          Share Screen
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        <div>
          <h3 className="text-center mb-1">You</h3>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-[320px] h-[240px] bg-black rounded-md"
          />
        </div>
        <div>
          <h3 className="text-center mb-1">Remote</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-[320px] h-[240px] bg-black rounded-md"
          />
        </div>
      </div>

      <div className="mt-8 w-full max-w-md">
        <div className="bg-gray-800 h-64 overflow-y-scroll p-4 rounded-md mb-2">
          {chatMessages.map((msg, i) => (
            <div key={i} className="mb-2">
              <span className="font-semibold text-green-400">{msg.user}: </span>
              <span>{msg.text}</span>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            className="flex-1 px-3 py-2 rounded-l-md bg-gray-700 focus:outline-none"
            placeholder="Type a message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 px-4 py-2 rounded-r-md hover:bg-green-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

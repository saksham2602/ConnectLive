import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import VideoRoom from "../components/VideoRoom";
import { io } from "socket.io-client";

export default function Room() {
  const { roomID } = useParams();
  const username = localStorage.getItem("username");
  const [valid, setValid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("https://webrtc-backend-yom8.onrender.com");

    socket.emit("check-room", roomID, (exists) => {
      setValid(exists);
      if (!exists) {
        alert("Room doesn't exist. Please create one first.");
        navigate("/home");
      }
    });

    return () => socket.disconnect();
  }, [roomID]);

  if (!valid) return null;
  return <VideoRoom roomID={roomID} username={username} />;
}

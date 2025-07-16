import { useParams } from "react-router-dom";
import VideoRoom from "../components/VideoRoom";

export default function Room() {
  const { roomID } = useParams();
  const username = localStorage.getItem("username");

  return <VideoRoom roomID={roomID} username={username} />;
}

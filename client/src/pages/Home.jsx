// client/src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const navigate = useNavigate();
  const [roomID, setRoomID] = useState("");
  const [createdRoomID, setCreatedRoomID] = useState("");
  const [error, setError] = useState("");

  const handleJoin = () => {
    if (!roomID.trim()) return;
    
    // Store room ID temporarily to check later
    sessionStorage.setItem("checkRoomID", roomID);
    navigate(`/room/${roomID}`);
  };

  const handleCreate = () => {
    const newRoomID = uuidv4();
    setCreatedRoomID(newRoomID);
    navigate(`/room/${newRoomID}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdRoomID);
    alert("Room ID copied to clipboard!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 to-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-6">Welcome {localStorage.getItem("username")}</h1>

      <div className="space-y-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter Room ID to Join"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-800 focus:outline-none"
        />
        <button
          onClick={handleJoin}
          className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-md font-semibold"
        >
          Join Room
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="text-center text-sm text-gray-400">or</div>
        <button
          onClick={handleCreate}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
        >
          Create New Room
        </button>
        {createdRoomID && (
          <div className="text-center text-sm text-gray-200 mt-2">
            Room ID: <code>{createdRoomID}</code>
            <button
              onClick={copyToClipboard}
              className="ml-2 text-blue-400 underline"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

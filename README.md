
# ConnectLive

A real-time, peer-to-peer video calling application built with **WebRTC**, **React**, and **Socket.IO**. Users can create or join rooms using a unique room ID to share **video, audio, screen, and text chat** in real-time.

---

## Features

- 🔐 **Room Management**
  - Create room with a unique ID
  - One-click **Copy Room ID** button
  - Validation for non-existent rooms
- 🎥 **Video & Audio Streaming**
  - Real-time, peer-to-peer video/audio communication
- 🎙️ **Media Controls**
  - **Mute/unmute** microphone
  - **Toggle camera** on/off
- 🖥 **Screen Sharing**
  - One-click screen sharing with auto-revert
- 💬 **Chat**
  - Real-time text chat in rooms
- ⚡ **Backend Signaling**
  - Powered by **Socket.IO** and Node.js
- 📱 **Responsive UI**
  - Modern UI/UX with TailwindCSS

---

## Tech Stack

**Frontend**  
- React.js  
- Tailwind CSS  
- Socket.IO client  
- WebRTC (RTCPeerConnection API)

**Backend**  
- Node.js & Express  
- Socket.IO (signaling)  
- Hosted on [Render](https://render.com)

---

## Live Backend  
The backend is deployed at:  
`https://webrtc-backend-yom8.onrender.com`

---

## Screenshots

*(Add screenshots of your app here — Home Page, Video Call, Chat, etc.)*

---

## Project Structure

```
connective/
├── client/
│   ├── src/
│   │   ├── components/     # VideoRoom.jsx (main video call logic)
│   │   ├── pages/          # Login, Home, Room
│   │   ├── App.js          # Routing
│   │   ├── index.js        # React entry
│   └── public/
│
└── server/
    ├── index.js            # Node.js + Socket.IO backend
```

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Install Dependencies

**For Backend**
```bash
cd server
npm install
```

**For Frontend**
```bash
cd ../client
npm install
```

---

### 3. Run Locally

**Start Backend**
```bash
cd server
node index.js
```

**Start Frontend**
```bash
cd client
npm start
```

---

## Environment Variables

Create a `.env` file in your backend with:
```
PORT=5000
```

---

## How It Works

1. **Room Creation**  
   A unique room ID is generated via `uuidv4` on the frontend.

2. **Signaling**  
   WebRTC offers/answers and ICE candidates are exchanged through **Socket.IO**.

3. **Media Streams**  
   `getUserMedia()` captures video and audio, and `RTCPeerConnection` connects the streams peer-to-peer.

4. **Chat & Screen Sharing**  
   Chat messages and screen streams are handled in real-time with minimal latency.

---

## Future Enhancements

- Participant list display
- File sharing support (images/docs)
- Chat history persistence (database)
- Push notifications for invites
- Group video calls (multi-peer connection)

---

## Deployment

- **Backend:** Render (Node.js server)  
- **Frontend:** Vercel or Netlify  

Build and deploy frontend:
```bash
cd client
npm run build
```

---

## Author

**Saksham Bhatia**  
B.Tech – 3rd Year, Bennett University  
[GitHub](https://github.com/saksham2602) • [LinkedIn](https://linkedin.com/in/saksham2602)

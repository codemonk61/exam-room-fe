import React, { useState } from "react";
import socket from "../socket";

const TeacherRoom = () => {
  const [roomId, setRoomId] = useState("exam123");
  const [question, setQuestion] = useState("");

  const sendQuestion = () => {
    socket.emit("send-question", { roomId, question });
    setQuestion("");
  };

  return (
    <div>
      <h2>Room ID: {roomId}</h2>
      <input type="text" placeholder="Type question" value={question} onChange={(e) => setQuestion(e.target.value)} />
      <button onClick={sendQuestion}>Send</button>
    </div>
  );
};

export default TeacherRoom;
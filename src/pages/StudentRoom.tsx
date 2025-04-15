import React, { useEffect, useState } from "react";
import socket from "../socket";

const StudentRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    socket.on("receive-question", (question: string) => {
      setCurrentQuestion(question);
    });

    return () => {
      socket.off("receive-question");
    };
  }, []);

  const handleJoinRoom = () => {
    if (roomId && userName) {
      socket.emit("join-room", { roomId, userName });
      setJoined(true);
    }
  };

  const handleSubmitAnswer = () => {
    socket.emit("submit-answer", { roomId, userName, answer });
    setAnswer("");
  };

  if (!joined) {
    return (
      <div>
        <h2>Join Exam Room</h2>
        <input type="text" placeholder="Enter your name" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <input type="text" placeholder="Enter room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, {userName}</h2>
      <p>Room ID: {roomId}</p>

      {currentQuestion ? (
        <div>
          <h3>Question:</h3>
          <p>{currentQuestion}</p>
          <input type="text" placeholder="Your answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
          <button onClick={handleSubmitAnswer}>Submit Answer</button>
        </div>
      ) : (
        <p>Waiting for question...</p>
      )}
    </div>
  );
};

export default StudentRoom;
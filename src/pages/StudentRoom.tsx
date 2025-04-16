// src/pages/StudentRoom.tsx
import React, { useEffect, useState } from "react";
import socket from "../socket";

const StudentRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [examActive, setExamActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [timer, setTimer] = useState<number | null>(null);
  const [questionEnded, setQuestionEnded] = useState(false);

  useEffect(() => {
    socket.on("receive-question", (question: string) => {
      setCurrentQuestion(question);
      setQuestionEnded(false);
      setAnswer("");
    });

    socket.on("timer-start", (duration: number) => {
      setTimer(duration);
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            clearInterval(interval);
            return null;
          }
        });
      }, 1000);
    });

    socket.on("question-ended", () => {
      setQuestionEnded(true);
      setTimer(null);
    });

    socket.on("exam-started", () => {
      setExamActive(true);
    });

    socket.on("exam-ended", () => {
      setExamActive(false);
    });

    return () => {
      socket.off("receive-question");
      socket.off("timer-start");
      socket.off("question-ended");
      socket.off("exam-started");
      socket.off("exam-ended");
    };
  }, []);

  const handleJoinRoom = () => {
    if (roomId && userName) {
      socket.emit("join-room", { roomId, userName });
      setJoined(true);
    }
  };

  const handleSubmitAnswer = () => {
    if (!examActive || questionEnded) return; // Prevent submissions when exam is over or question ended.
    socket.emit("submit-answer", { roomId, userName, answer });
    setAnswer("");
  };

  if (!joined) {
    return (
      <div>
        <h2>Join Exam Room</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, {userName}</h2>
      <p>Room ID: {roomId}</p>
      {!examActive ? (
        <p>The exam hasn't started yet.</p>
      ) : (
        <div>
          {currentQuestion ? (
            <div>
              <h3>Question:</h3>
              <p>{currentQuestion}</p>
              {timer !== null && <p>Time remaining: {timer} seconds</p>}
              {questionEnded ? (
                <p>Time is up for this question.</p>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Your answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  <button onClick={handleSubmitAnswer}>Submit Answer</button>
                </div>
              )}
            </div>
          ) : (
            <p>Waiting for question...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentRoom;

// src/pages/TeacherRoom.tsx
import React, { useState, useEffect } from "react";
import socket from "../socket";

const TeacherRoom = () => {
  const [roomId, setRoomId] = useState("exam123");
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [duration, setDuration] = useState(30); // in seconds for timer
  const [scoreboard, setScoreboard] = useState<Record<string, number>>({});
  const [examActive, setExamActive] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);

  // Listen for scoreboard updates
  useEffect(() => {
    socket.on("update-scoreboard", (newScoreboard: Record<string, number>) => {
      setScoreboard(newScoreboard);
    });

    socket.on("timer-start", (duration: number) => {
      setTimer(duration);
      // Countdown in the teacher UI as well.
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

    socket.on("exam-started", () => {
      setExamActive(true);
    });

    socket.on("exam-ended", () => {
      setExamActive(false);
    });

    return () => {
      socket.off("update-scoreboard");
      socket.off("timer-start");
      socket.off("exam-started");
      socket.off("exam-ended");
    };
  }, []);

  const startExam = () => {
    socket.emit("start-exam", { roomId });
  };

  const endExam = () => {
    socket.emit("end-exam", { roomId });
  };

  const sendQuestion = () => {
    socket.emit("send-question", { roomId, question, correctAnswer });
    // Clear any previous timer
    setTimer(null);
  };

  const startTimer = () => {
    socket.emit("start-timer", { roomId, duration });
  };

  return (
    <div>
      <h2>Teacher Room</h2>
      <p>Room ID: {roomId}</p>
      <div>
        <button onClick={startExam} disabled={examActive}>
          Start Exam
        </button>
        <button onClick={endExam} disabled={!examActive}>
          End Exam
        </button>
      </div>
      <hr />
      <div>
        <h3>Post a New Question</h3>
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Correct Answer (optional)"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        />
        <button onClick={sendQuestion}>Send Question</button>
      </div>
      <div>
        <h3>Timer Settings</h3>
        <input
          type="number"
          placeholder="Duration (seconds)"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
        <button onClick={startTimer}>Start Timer</button>
        {timer !== null && <p>Time remaining: {timer} seconds</p>}
      </div>
      <div>
        <h3>Live Scoreboard</h3>
        {Object.keys(scoreboard).length === 0 ? (
          <p>No scores yet.</p>
        ) : (
          <ul>
            {Object.entries(scoreboard).map(([user, score]) => (
              <li key={user}>
                {user}: {score}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeacherRoom;

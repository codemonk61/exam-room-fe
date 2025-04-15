import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import TeacherRoom from "./pages/TeacherRoom";
import StudentRoom from "./pages/StudentRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher" element={<TeacherRoom />} />
        <Route path="/student" element={<StudentRoom />} />
      </Routes>
    </Router>
  );
}

export default App;


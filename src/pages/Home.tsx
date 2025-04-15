import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Online Exam Room</h1>
      <p>Choose your role:</p>
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/teacher"><button>Teacher</button></Link>
        <Link to="/student"><button>Student</button></Link>
      </div>
    </div>
  );
};

export default Home;
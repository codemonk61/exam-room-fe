import { io } from "socket.io-client";

const socket = io("http://localhost:5050"); // use env variable in production
export default socket;

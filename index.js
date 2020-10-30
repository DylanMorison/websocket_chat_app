const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "./public");
app.use(express.static(publicDirectoryPath));

/**
 * @param connection: Whenever a new user connects io.on("connection", () => {}) is run
 * @param socket: An oject that contains information about a new connection
 */

io.on("connection", socket => {
	console.log("New WebSocket connection");

	socket.emit("newUser", "Welcome New User!");
	socket.on("userMessage", message => {
		io.emit("userMessage", message);
	});

	// socket.emit("countUpdated", count);

	// socket.on("increment", () => {
	// 	count++;
	// 	io.emit("countUpdated", count);
	// });
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
	console.log(`Server is up on port ${port}!`);
});

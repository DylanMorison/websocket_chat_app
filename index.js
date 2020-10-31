const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage, generateLocationMessage } = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "./public");
app.use(express.static(publicDirectoryPath));

/**
 * @param connection: Whenever a new user connects io.on("connection", () => {}) is run
 * @param socket: An oject that contains information about a new connection
 */

io.on("connection", (socket) => {
	/**
	 * @param socket.emit: emits to connection instancec
	 * @param socket.broadcast.emit: emits to everyone but current connection instance
	 * @param io.emit: emits to all connections
	 * @param io.to.emit: emits to everyone in a specific room
	 * @param socket.broadcast.to.emit: sends messages to every client limited to a room
	 */
	console.log("New WebSocket connection");

	socket.on("join", ({ username, room }) => {
		socket.join(room);

		socket.emit("message", generateMessage("Welcome!"));
		socket.broadcast
			.to(room)
			.emit("message", generateMessage(`${username} has joined!`));
	});

	socket.on("message", (message, callback) => {
		const filter = new Filter();

		if (filter.isProfane(message)) {
			return callback("Profanity is not allowed!");
		}

		io.to('Center City').emit("message", generateMessage(message));
		callback();
	});

	socket.on("disconnect", () => {
		io.emit("message", generateMessage("A user has left!"));
	});

	socket.on("sendLocation", (lat, long, callback) => {
		const url = `https://google.com/maps?q=${lat},${long}`;
		io.emit("locationMessage", generateLocationMessage(url));
		callback();
	});
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
	console.log(`Server is up on port ${port}!`);
});

const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

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
	 */
	console.log("New WebSocket connection");

	socket.emit("newUser", "Welcome New User!");
	socket.broadcast.emit("newUser", "A new user has joined!");

	socket.on("userMessage", (message, callback) => {
		const filter = new Filter();

		if (filter.isProfane(message)) {
			return callback("Profanity is not allowed!");
		}

		io.emit("userMessage", message);
		callback();
	});

	socket.on("disconnect", () => {
		io.emit("userDisconnected", "A user has left!");
	});

	socket.on("sendLocation", (lat, long, callback) => {
		io.emit("message", `https://google.com/maps?q=${lat},${long}`);
		callback();
	});
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
	console.log(`Server is up on port ${port}!`);
});

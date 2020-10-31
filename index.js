const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage, generateLocationMessage } = require("./utils/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users");

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
	 * @param socket.join: ?
	 */

	socket.on("join", ({ username, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, username, room });

		if (error) {
			return callback(error);
		}

		socket.join(user.room);

		socket.emit("message", generateMessage("Welcome!"));
		socket.broadcast
			.to(user.room)
			.emit("message", generateMessage(`${user.username} has joined!`));

		callback();
	});

	socket.on("sendMessage", (message, callback) => {
		const user = getUser(socket.id);
		const filter = new Filter();

		if (filter.isProfane(message)) {
			return callback("Profanity is not allowed!");
		}

		io.to(user.room).emit("message", generateMessage(message));
		callback();
	});

	socket.on("disconnect", () => {
		const user = removeUser(socket.id);

		if (user) {
			io.to(user.room).emit(
				"message",
				generateMessage(`${user.username} has left!`)
			);
		}
	});

	socket.on("sendLocation", (lat, long, callback) => {
		const user = getUser(socket.id);
		const url = `https://google.com/maps?q=${lat},${long}`;
		io.to(user.room).emit("locationMessage", generateLocationMessage(url));
		callback();
	});
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
	console.log(`Server is up on port ${port}!`);
});

const users = [];

/**
 * *The Following Functions are all the functions that exist in users.js
 * @function addUser
 * @function removeUser
 * @function getUser
 * @function getUserInRoom
 */

const addUser = ({ id, username, room }) => {
	// Clean the Data
	username = username.trim().toLowerCase();
	room = room.trim().toLowerCase();

	// Validate the data
	if (!username || !room) {
		return {
			error: "Username and room are required"
		};
	}

	// check for existing user
	const existingUser = users.find((user) => {
		return user.room === room && user.username === username;
	});

	// Validate username
	if (existingUser) {
		return {
			error: "Username is in use!"
		};
	}

	// store user
	const user = { id, username, room };
	users.push(user);
	return { user };
};

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};

const getUser = (id) => {
	return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
	let usersInRoom = [];

	users.forEach((user) => {
		if (user.room === room.toLowerCase()) {
			usersInRoom.push(user);
		}
	});

	return usersInRoom;
};

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom
};

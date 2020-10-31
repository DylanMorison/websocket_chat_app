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
		return users.splice(index, 1);
	}
};

addUser({
	id: 22,
	username: "Dylan",
	room: "South Philly"
});

console.log(users);

const res = addUser({
	id: 33,
	username: "dylan",
	room: "South Philly"
});

console.log(users);

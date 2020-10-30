const socket = io();

socket.on("message", (message) => {
	console.log(message);
});

socket.on("newUser", (message) => {
	console.log(message);
});

socket.on("userDisconnected", (message) => {
	console.log(message);
});

socket.on("userMessage", (message) => {
	console.log(message);
	//document.querySelector("#userMessage").innerHTML = message;
});

document.querySelector("#inputForm").addEventListener("submit", (e) => {
	e.preventDefault();

	const message = document.querySelector("#message").value;

	socket.emit("userMessage", message);
});

document.querySelector("#send-location").addEventListener("click", () => {
	if (!navigator.geolocation) {
		return alert("Geolocation is not supported by your browser");
	}

	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit("sendLocation", position.coords.latitude, position.coords.longitude);
	});
});

const socket = io();

socket.on("userMessage", (message) => {
	console.log(message);
	document.querySelector("#userMessage").innerHTML = message;
});
document.querySelector("#inputForm").addEventListener("submit", (e) => {
	e.preventDefault();
	const message = document.querySelector("#message").value;
	console.log(message);
	socket.emit("userMessage", message);
});
/* 
socket.on("countUpdated", count => {
	console.log("The count has been updated", count);
});

document.querySelector("#increment").addEventListener("click", () => {
	console.log("Clicked");
	socket.emit("increment");
});
 */

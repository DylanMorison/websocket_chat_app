const socket = io();

// elemtnts
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates=>

const messageTemplates = document.querySelector("#message-template").innerHTML;

socket.on("message", (message) => {
	const html = Mustache.render(messageTemplates, {
		message
	});
	$messages.insertAdjacentHTML("beforeend", html);
});

socket.on("newUser", (message) => {
	console.log(message);
});

socket.on("userDisconnected", (message) => {
	console.log(message);
});

$messageForm.addEventListener("submit", (e) => {
	e.preventDefault();

	$messageFormButton.setAttribute("disabled", "disabled");

	const message = document.querySelector("#message").value;

	socket.emit("message", message, (error) => {
		$messageFormButton.removeAttribute("disabled");
		$messageFormInput.value = "";
		$messageFormInput.focus();
		if (error) {
			return console.log(error);
		}

		console.log("Message delivered!");
	});
});

$sendLocationButton.addEventListener("click", () => {
	if (!navigator.geolocation) {
		return alert("Geolocation is not supported by your browser");
	}
	$sendLocationButton.setAttribute("disabled", "disabled");
	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit(
			"sendLocation",
			position.coords.latitude,
			position.coords.longitude,
			() => {
				$sendLocationButton.removeAttribute("disabled");
				console.log("Location shared!");
			}
		);
	});
});

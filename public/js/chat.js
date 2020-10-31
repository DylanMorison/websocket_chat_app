const socket = io();

// elemtnts
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplates = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template")
	.innerHTML;

// OPtions
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on("message", (message) => {
	// console.log(message);
	const html = Mustache.render(messageTemplates, {
		username: message.username,
		message: message.text,
		createdAt: moment(message.createdAt).format("h:mm a")
	});
	$messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (urlObject) => {
	// console.log(url);
	const html = Mustache.render(locationMessageTemplate, {
		username: urlObject.username,
		url: urlObject.url,
		createdAt: moment(urlObject.createdAt).format("h:mm a")
	});
	$messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
	e.preventDefault();

	$messageFormButton.setAttribute("disabled", "disabled");

	const message = document.querySelector("#message").value;

	socket.emit("sendMessage", message, (error) => {
		$messageFormButton.removeAttribute("disabled");
		$messageFormInput.value = "";
		$messageFormInput.focus();
		if (error) {
			return console.log(error);
		}

		console.log("Message delivered!", message);
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

socket.emit("join", { username, room }, (err) => {
	if (err) {
		alert(err);
		location.href = "/";
	}
});

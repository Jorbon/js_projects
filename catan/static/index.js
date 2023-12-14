const socket = io();
socket.on("message", function(data) {
	console.log(data);
});






socket.on("connect", function() {
	socket.emit("client cookie", getCookie("game"));
});

socket.on("set client cookie", function(data) {
	writeCookie("game", data);
});

socket.on("");




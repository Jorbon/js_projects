let express = require("express");
let http = require("http");
let path = require("path");
let socketIO = require("socket.io");

let app = express();
let server = http.Server(app);
let io = socketIO(server);

app.set("port", 5000);
app.use("/static", express.static(__dirname + "/static"));

// Routing
app.get("/", function(request, response) {
	response.sendFile(path.join(__dirname, "index.html"));
});
app.get("/main", function(request, response) {
	response.sendFile(path.join(__dirname, "main.html"));
});

// Start the server
server.listen(5000);








// importing some code from Tools.js

const abs = Math.abs, sin = Math.sin, cos = Math.cos, tan = Math.tan, asin = Math.asin, acos = Math.acos, atan = Math.atan, atan2 = Math.atan2, floor = Math.floor, ceil = Math.ceil, round = Math.round, sign = Math.sign, sqrt = Math.sqrt, cbrt = Math.cbrt, min = Math.min, max = Math.max;

const random = {
	int: function(n1=2, n2=0) { return Math.floor(Math.random() * (n2 - n1)) + n1; },
	float: function(n1=1, n2=0) { return Math.random() * (n2 - n1) + n1; },
	choose: function(list) { return list[Math.floor(Math.random() * list.length)]; }
};

function roundTo(n, d) {
	return Math.round(n/d)*d;
};

const E = Math.E, PI = π = Math.PI, SQRT2 = Math.SQRT2;

function lerp(min, max, t) { return t * (max - min) + min; };
function prel(min, max, t) { return (t - min) / (max - min); };
function cubicLerp(min, max, t) {
    t = -2 * t * t * t + 3 * t * t;
    return min + t * (max - min);
};
function sineLerp(min, max, t) {
	t = (1 - Math.cos(Math.PI * t)) / 2;
	return min + t * (max - min);
};
function bind(x, m1, m2) {
	if (m1 < m2) return Math.min(m2, Math.max(m1, x));
	else return Math.min(m1, Math.max(m2, x));
};
function wrap(x, m1, m2) {
	if (m2 < m1) { let mt = m1; m1 = m2; m2 = mt; };
	return lerp(m1, m2, mod(prel(m1, m2, x), 1));
};
function integrate(f, a, b, steps=10000) {
	let sum = 0;
	for (let i = a + (b-a)/(steps*2); i < b; i += (b-a)/steps) sum += f(i);
	return sum * (b-a)/steps;
};
function splitDecimal(num) {
	return [Math.floor(num), num >= 0 ? num%1 : 1-num%1];
};
function mod(n, d) {
	if (n >= 0) return n % d;
	else if (n < 0) return d + n % d;
};

function invertMap(map) {
	let newmap = [];
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			if (!(newmap[map[i][j]] instanceof Array)) newmap[map[i][j]] = [];
			newmap[map[i][j]].push(i);
		}
	}
	return newmap;
};









// Now for the game scripting

let gameId = random.int(2**16);

// Add WebSocket handlers
io.on("connection", function(socket) {
	console.log("New client joined. id: " + socket.id + " IP address: " + socket.conn.remoteAddress);
	socket.on("disconnect", function() {
		
	});




	socket.join("room 0");
	
	
	socket.on("client cookie", function(data) {
		if (!data) socket.emit("set client cookie", gameId + ":" + (clients.length-1));
		else if (data.split(":")[0] == gameId && clients[data.split(":")[1]] == "disconnected") {
			clients.splice(clients.findIndex(item => item.id == this.id), 1);
			clients[data.split(":")[1]] = this;
			console.log("Found reconnected client, putting player " + data.split(":")[1] + " back in the game.");
		} else socket.emit("set client cookie", gameId + ":" + (clients.length-1));
	});
});


// Send to all: io.sockets.emit(name, data);
// Send to room: io.to("room name").emit(name, data);

let players = ["none", "none", "none", "none"];
let samplePlayer = {
	name: "Name",
	socket: "<client socket>",
	cards: [],
	developmentCards: [],
	soldiers: 0,
	longestRoad: false,
	largestArmy: false,
	roads: 15,
	settlements: 5,
	cities: 4
};




// a collection of data regarding what board elements touch each other by their indices
// this could be automatic but there would be so many edge cases it wouldn't be worth it
const map = {
	hexTouchHex: [
		[1, 3, 4],
		[0, 2, 4, 5],
		[1, 5, 6],
		[0, 4, 7, 8],
		[0, 1, 3, 5, 8, 9],
		[1, 2, 4, 6, 9, 10],
		[2, 5, 10, 11],
		[3, 8, 12],
		[3, 4, 7, 9, 12, 13],
		[4, 5, 8, 10, 13, 14],
		[5, 6, 9, 11, 14, 15],
		[6, 10, 15],
		[7, 8, 13, 16],
		[8, 9, 12, 14, 16, 17],
		[9, 10, 13, 15, 17, 18],
		[10, 11, 14, 18],
		[12, 13, 17],
		[13, 14, 16, 18],
		[14, 15, 17]
	],
	hexTouchCorner: [
		[0, 1, 2, 8, 9, 10],
		[2, 3, 4, 10, 11, 12],
		[4, 5, 6, 12, 13, 14],
		[7, 8, 9, 17, 18, 19],
		[9, 10, 11, 19, 20, 21],
		[11, 12, 13, 21, 22, 23],
		[13, 14, 15, 23, 24, 25],
		[16, 17, 18, 27, 28, 29],
		[18, 19, 20, 29, 30, 31],
		[20, 21, 22, 31, 32, 33],
		[22, 23, 24, 33, 34, 35],
		[24, 25, 26, 35, 36, 37],
		[28, 29, 30, 38, 39, 40],
		[30, 31, 32, 40, 41, 42],
		[32, 33, 34, 42, 43, 44],
		[34, 35, 36, 44, 45, 46],
		[39, 40, 41, 47, 48, 49],
		[41, 42, 43, 49, 50, 51],
		[43, 44, 45, 51, 52, 53]
	],
	cornerTouchEdge: [
		[0, 6],
		[0, 1],
		[1, 2, 7],
		[2, 3],
		[3, 4, 8],
		[4, 5],
		[5, 9],
		[10, 18],
		[6, 10, 11],
		[11, 12, 19],
		[7, 12, 13],
		[13, 14, 20],
		[8, 14, 15],
		[15, 16, 21],
		[9, 16, 17],
		[17, 22],
		[23, 33],
		[18, 23, 24],
		[24, 25, 34],
		[19, 25, 26],
		[26, 27, 35],
		[20, 27, 28],
		[28, 29, 36],
		[21, 29, 30],
		[30, 31, 37],
		[22, 31, 32],
		[32, 38],
		[33, 39],
		[39, 40, 49],
		[34, 40, 41],
		[41, 42, 50],
		[35, 42, 43],
		[43, 44, 51],
		[36, 44, 45],
		[45, 46, 52],
		[37, 46, 47],
		[47, 48, 53],
		[38, 48],
		[49, 54],
		[54, 55, 62],
		[50, 55, 56],
		[56, 57, 63],
		[51, 57, 58],
		[58, 59, 64],
		[52, 59, 60],
		[60, 61, 65],
		[53, 61],
		[62, 66],
		[66, 67],
		[63, 67, 68],
		[68, 69],
		[64, 69, 70],
		[70, 71],
		[65, 71]
	],
	harborTouchCorner: [
		[2, 3],
		[5, 6],
		[15, 25],
		[36, 46],
		[53, 52],
		[50, 49],
		[39, 38],
		[27, 16],
		[7, 8]
	]
};
map.cornerTouchHex = invertMap(map.hexTouchCorner);
map.edgeTouchCorner = invertMap(map.cornerTouchEdge);
map.cornerTouchHarbor = invertMap(map.harborTouchCorner);
map.cornerTouchCorner = [];
for (let i = 0; i < map.cornerTouchEdge.length; i++) {
	let corners = [];
	for (let j = 0; j < map.cornerTouchEdge[i].length; j++) {
		for (let k = 0; k < map.edgeTouchCorner[map.cornerTouchEdge[i][j]].length; k++) {
			if (map.edgeTouchCorner[map.cornerTouchEdge[i][j]][k] != i) corners.push(map.edgeTouchCorner[map.cornerTouchEdge[i][j]][k]);
		}
	}
	map.cornerTouchCorner[i] = corners;
}
map.edgeTouchEdge = [];
for (let i = 0; i < map.edgeTouchCorner.length; i++) {
	let edges = [];
	for (let j = 0; j < map.edgeTouchCorner[i].length; j++) {
		for (let k = 0; k < map.cornerTouchEdge[map.edgeTouchCorner[i][j]].length; k++) {
			if (map.cornerTouchEdge[map.edgeTouchCorner[i][j]][k] != i) edges.push(map.cornerTouchEdge[map.edgeTouchCorner[i][j]][k]);
		}
	}
	map.edgeTouchEdge[i] = edges;
}




let board = {
	tiles: [], // 19
	corners: [], // 54
	edges: [], // 72
	harbors: [] // 9
};

let largestArmy = "none", longestRoad = "none";

function randomizeBoard() {
	board.tiles = [];
	let tileChoices = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6];
	let numberChoices = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
	let deserts = [];

	for (let i = 0; i < 19; i++) {
		board.tiles[i] = { tile: tileChoices.splice(random.int(tileChoices.length), 1), number: "none" };
		if (board.tiles[i].tile == 6) deserts.push(i);
		else if (board.tiles[i].tile != 0) board.tiles[i].number = numberChoices.splice(random.int(numberChoices.length), 1)[0];
	}

	board.robberTile = random.choose(deserts);

	board.harbors = [];
	let harborChoices = [0, 1, 2, 3, 4, "any", "any", "any", "any"];
	for (let i = 0; i < 9; i++) board.harbors[i] = harborChoices.splice(random.int(harborChoices.length), 1)[0];
};



randomizeBoard();

setTimeout(function() { client.send("board data", board); }, 100);
setTimeout(function() { client.send("player data", players); }, 100);




var chars = [ " ", " ",
	"░",
	"▒",
	"▓",
	"█",
	"|",
	"_",//"▁",
	"¯",//"▔",
	"❮",
	"❯",
	"╱",
	"╲",
	"║",
	"═",
	"╔",
	"╗",
	"╚",
	"╝",
	"╠",
	"╣",
	"╦",
	"╩",
	"╬",
	"╰",
	"╮",
	"╭",
	"╯",
	"⧵",
	"⏜",
	"⏝",
	"❭",
	"❬",
	"⊛"
];

var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

var mouse = {
	x: 0,
	y: 0,
	activeChar: " ",
	tile: {
		x: 0,
		y: 0
	},
	left: false,
	right: false,
	area: {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	}
};
var keyMap = {
	" ": 0,
	"1": 2,
	"2": 3,
	"3": 4,
	"4": 5,
	"5": 6,
	"6": 7,
	"7": 8,
	"8": 9,
	"9": 10,
	"0": 11,
	"q": 12,
	"w": 13,
	"e": 14,
	"r": 15,
	"t": 16,
	"y": 17,
	"u": 18,
	"i": 19,
	"o": 20,
	"p": 21,
	"a": 22,
	"s": 23,
	"d": 24,
	"f": 25,
	"g": 26,
	"h": 27,
	"j": 28,
	"k": 29,
	"l": 30,
	"z": 31,
	"x": 32,
	"c": 33
};
window.addEventListener("mousemove", function(event) {mouse.x = event.x; mouse.y = event.y;});
window.addEventListener("mousedown",
	function(event) {
		if (event.button === 0) {
			mouse.left = true;
		} else {
			mouse.right = true;
		}
		/*if (keys[16]) {
			mouse.area
		}*/
	}
);
window.addEventListener("mouseup", 
	function(event) {
		if (event.button === 0) {
			mouse.left = false;
		} else {
			mouse.right = false;
		}
	}
);
window.addEventListener("keydown",
	function(event) {
		keys[event.which || event.keyCode] = true;
		if (event.code === "ShiftRight") {
			if (select) {
				select = false;
			} else {
				select = true;
			}
		} else {
			if (select) {
				mouse.activeChar = chars[keyMap[event.key]];
			} else {
				mouse.activeChar = event.key;
			}
		}
	}
);
window.addEventListener("keyup", function(event) {keys[event.which || event.keyCode] = false;});
var keys = [];
var backSlashChar = "\\";

var select = false;
c.font = "12px Courier New"
var dim = {};
var lineSpacing = 6;
var fontStyle = "Courier New";
var fontSize = 12;
function font (size, style) {
	if (style) {
		fontStyle = style;
	}
	fontSize = size;
	lineSpacing = size / 8;
	c.font = fontSize.toString() + "px " + fontStyle;
	dim.char = {
		x: c.measureText(" ").width,
		y: fontSize + lineSpacing
	};
	dim.window = {
		x: 40, //Math.floor(canvas.width / c.measureText(" ").width),
		y: 20, //Math.floor((canvas.height + lineSpacing) / (fontSize + lineSpacing)),
	};
	dim.window.margain = {
		x: (canvas.width - dim.window.x * dim.char.x) / 2,
		y: (canvas.height - dim.window.y * dim.char.y) / 2
	}
};
font(16);

function print () {
	var saveData = "";
	for (var b = 0; b < dim.window.y; b++) {
		for (var a = 0; a < dim.window.x; a++) {
			if (tiles[a][b].length > 1) {
				saveData = saveData + " ";
			} else if (tiles[a][b] === backSlashChar) {
				saveData = saveData + "⧷";
			} else {
				saveData = saveData + tiles[a][b];
			}
		}
		saveData = saveData + "\n";
	}
	console.log(saveData);
};

function save () {
	var saveData = "";
	for (var b = 0; b < dim.window.y; b++) {
		for (var a = 0; a < dim.window.x; a++) {
			if (tiles[a][b].length > 1) {
				saveData = saveData + " ";
			} else if (tiles[a][b] === backSlashChar) {
				saveData = saveData + "⧷";
			} else {
				saveData = saveData + tiles[a][b];
			}
		}
	}
	console.log(saveData);
};

function load (saveData) {
	for (var b = 0; b < dim.window.y; b++) {
		for (var a = 0; a < dim.window.x; a++) {
			tiles[a][b] = saveData.charAt(b * dim.window.x + a);
		}
	}
};

var tiles = [];
for (var a = 0; a < dim.window.x; a++) {
	tiles[a] = [];
	for (var b = 0; b < dim.window.y; b++) {
		tiles[a][b] = " ";
	}
}

function draw () {
	requestAnimationFrame(draw);
	c.fillStyle = "#ffffff";
	c.fillRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = "#000000";

	mouse.tile = {
		x: Math.floor((mouse.x - dim.window.margain.x) / dim.char.x),
		y: Math.floor((mouse.y - 6 - dim.window.margain.y) / dim.char.y)
	};

	if (mouse.tile.x < 0 || mouse.tile.y < 0 || mouse.tile.x >= dim.window.x || mouse.tile.y >= dim.window.y) {
		mouse.tile = {
			x: undefined,
			y: undefined
		}
	}

	if (mouse.tile.x !== undefined && mouse.tile.y !== undefined) {
		if (mouse.left && keys[16] !== true) {
			tiles[mouse.tile.x][mouse.tile.y] = mouse.activeChar;

		}

		c.fillText(mouse.tile.x.toString(), 1 * dim.char.x, 2 * dim.char.y);
		c.fillText(mouse.tile.y.toString(), 1 * dim.char.x, 3 * dim.char.y);
	}

	c.fillText(dim.window.x.toString(), 5 * dim.char.x, 2 * dim.char.y);
	c.fillText(dim.window.y.toString(), 5 * dim.char.x, 3 * dim.char.y);
	c.fillText(mouse.activeChar, 1 * dim.char.x, 1 * dim.char.y);

	//if (mouse.area.x0 !== null)

	for (var a = 0; a < dim.window.x; a++) {
		for (var b = 0; b < dim.window.y; b++) {
			c.fillText(tiles[a][b], a * dim.char.x + dim.window.margain.x, (b + 1) * dim.char.y + dim.window.margain.y);

			if (a === 0) {
				c.fillText("║", -dim.char.x + dim.window.margain.x, (b + 1) * dim.char.y + dim.window.margain.y);
				c.fillText("║", dim.window.x * dim.char.x + dim.window.margain.x, (b + 1) * dim.char.y + dim.window.margain.y);
			}
		}
		c.fillText("═", a * dim.char.x + dim.window.margain.x, dim.window.margain.y);
		c.fillText("═", a * dim.char.x + dim.window.margain.x, (dim.window.y + 1) * dim.char.y + dim.window.margain.y);
	}

	c.fillText("╔", -dim.char.x + dim.window.margain.x, dim.window.margain.y);
	c.fillText("╗", dim.window.x * dim.char.x + dim.window.margain.x, dim.window.margain.y);
	c.fillText("╚", -dim.char.x + dim.window.margain.x, (dim.window.y + 1) * dim.char.y + dim.window.margain.y);
	c.fillText("╝", dim.window.x * dim.char.x + dim.window.margain.x, (dim.window.y + 1) * dim.char.y + dim.window.margain.y);

};
draw();











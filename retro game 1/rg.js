var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

var tCanvas = document.getElementById("test");
tCanvas.width = 200;
tCanvas.height = 200;
var tctx = tCanvas.getContext("2d");
tctx.fillStyle = "#000000";


var mouse = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	l: false,
	m: false,
	r: false
};

window.addEventListener('contextmenu', event => event.preventDefault());

window.addEventListener("resize", 
	function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
);

window.addEventListener("mousemove", 
	function(event) {
		//if (mouse.r || (mouse.l && keys[16])) {
		if (mouse.l && player.mapView) {
			scrn.x += L(mouse.x - event.x);
			scrn.y += L(mouse.y - event.y);
		}
		mouse.x = event.x;
		mouse.y = event.y;
	}
);

window.addEventListener("mousedown", 
	function(event) {
		switch(event.button) {
			case 0:
				mouse.l = true;
				break;
			case 1:
				mouse.m = true;
				break;
			case 2:
				mouse.r = true;
				break;
		}
	}
);

window.addEventListener("mouseup", 
	function(event) {
		switch(event.button) {
			case 0:
				mouse.l = false;
				break;
			case 1:
				mouse.m = false;
				break;
			case 2:
				mouse.r = false;
				break;
		}
	}
);


window.addEventListener("wheel",
	function(event) {
		if (player.mapView) {
			scrn.z *= 1 + event.deltaY / 1000;
			if (scrn.z > 250) scrn.z = 250;
			scrn.x -= (Lx(mouse.x) - scrn.x) * event.deltaY / 1000;
			scrn.y -= (Ly(mouse.y) - scrn.y) * event.deltaY / 1000;
		}
	}
);


window.addEventListener("keydown", 
	function(event) {
		keys[event.which || event.keyCode] = true;
		switch (event.keyCode) {
			case 77:
				if (player.mapView) {
					player.mapView = false;
					pause = false;
				} else {
					player.mapView = true;
					pause = true;
					scrn.x = player.x;
					scrn.y = player.y;
					scrn.z = player.mapViewSize;
				}
				break;
		}
	}
);

window.addEventListener("keyup",
	function(event) {
		keys[event.which || event.keyCode] = false;
	}
);

var keys = [];
for (var x = 0; x < 256; x++) { keys[x] = false; }

var scrn = {
	x: 0,
	y: 0,
	z: 1,
	Cx: function (x) {return (x - this.x) * Math.min(canvas.width, canvas.height) / 2 / this.z + canvas.width / 2;},
	Cy: function (y) {return (y - this.y) * Math.min(canvas.width, canvas.height) / 2 / this.z + canvas.height / 2;},
	C: function (s) {return s * Math.min(canvas.width, canvas.height) / 2 / this.z;},
	Lx: function (x) {return (x * 2 - canvas.width) * this.z / Math.min(canvas.width, canvas.height) + this.x;},
	Ly: function (y) {return (y * 2 - canvas.height) * this.z / Math.min(canvas.width, canvas.height) + this.y;},
	L: function (s) {return s * 2 * this.z / Math.min(canvas.width, canvas.height);}
};
function Cx(b) {return scrn.Cx(b);};
function Cy(b) {return scrn.Cy(b);};
function C(b) {return scrn.C(b);};
function Lx(b) {return scrn.Lx(b);};
function Ly(b) {return scrn.Ly(b);};
function L(b) {return scrn.L(b);};

// -------------------------------------------------------------------

// -------------------------------------------------------------------

var block = [
	{name: "stone", solid: false, color: "#8a857d", texture: loadTex("stone")},
	{name: "dirt", solid: false, color: "#7d6146", texture: loadTex("dirt")},
	{name: "grass", solid: false, color: "#8cd60d", texture: loadTex("grass")},
	{name: "sand", solid: false, color: "#fae789", texture: loadTex("sand")},
	{name: "water", solid: false, color: "#277fcc", texture: loadTex("water/water")},
	{name: "tree", solid: true, color: "#447d2f", texture: loadTex("tree")},
	{name: "rock", solid: true, color: "#a4a8ac", texture: loadTex("rock")},
	{name: "snow", solid: false, color: "#e6f0f0", texture: loadTex("snow")},
	{name: "plank", solid: true, color: "#d6b46f", texture: loadTex("plank")},
	{name: "ice", solid: false, color: "#9bdae8", texture: loadTex("ice")},
	{name: "bush", solid: false, color: "#579e3e", texture: loadTex("bush")},
	{name: "cactus", solid: true, color: "#668f45", texture: loadTex("cactus")},
	{name: "deadbush", solid: false, color: "#a68217", texture: loadTex("deadbush")},
	{name: "snowrock", solid: true, color: "#e6f0f0", texture: loadTex("snowrock")},
	{name: "flower", solid: false, color: "#f5f4b3", texture: loadTex("flower")}

];

function loadTex(name) {
	var tex = document.createElement("img");
	tex.style.display = "none";
	tex.src = "rg_tex/" + name + ".png";
	return tex;
};

function Map(sizeX, sizeY, generator) {
	this.size = {
		x: sizeX,
		y: sizeY
	};
	this.loadTile = generator;
	this.entities = [];
	this.seed = Math.floor(Math.random() * Math.pow(2, 16));
	this.reset = function() {
		this.tile = [];
		for (var x = 0; x < this.size.x; x++) {
			this.tile[x] = [];
			for (var y = 0; y < this.size.y; y++) {
				this.tile[x][y] = this.loadTile(x, y);
			}
		}
	};
	this.reset();
};

Map.prototype.tick = function() {
	for (var a = 0; a < this.entities.length; a++) {
		this.entities[a].tick();
	}
};

function SurfaceMap(sizeX, sizeY) {
	Map.call(this, sizeX, sizeY, function(x, y) {
		offs = [19/11, 23/13, 29/17, 31/19, 37/23, 41/29, 43/31, 47/37, 51/41];

		var pReps = 5, pPert = 0.5, pScalePert = 0.5, pScale = 25;
		var xPert = 0, yPert = 0;
		for (var a = 0; a < pReps; a++) {
			xPert += Math.pow(pPert, a) * noise.perlin3(x / (pScale * Math.pow(pScalePert, a)), y / (pScale * Math.pow(pScalePert, a)), this.seed + (a + 1) * offs[0]);
			yPert += Math.pow(pPert, a) * noise.perlin3(x / (pScale * Math.pow(pScalePert, a)), y / (pScale * Math.pow(pScalePert, a)), this.seed - (a + 1) * offs[0]);
		}
		x += xPert * 20, y += yPert * 20;

		var scale = 250, reps = 3, pert = 0.4, scalePert = 0.4, mWeight = 0.4;
		var hScale = 250;
		var h = 0, t = 0, w = 0;
		for (var a = 0; a < reps; a++) {
			h += (1 - pert) * Math.pow(pert, a) * noise.perlin3(x / (hScale * Math.pow(scalePert, a)), y / (hScale * Math.pow(scalePert, a)), this.seed + (a + 1) * offs[1]);
			t += (1 - pert) * Math.pow(pert, a) * noise.perlin3(x / (scale * Math.pow(scalePert, a)), y / (scale * Math.pow(scalePert, a)), this.seed + (a + 1) * offs[2]);
			w += (1 - pert) * Math.pow(pert, a) * noise.perlin3(x / (scale * Math.pow(scalePert, a)), y / (scale * Math.pow(scalePert, a)), this.seed - (a + 1) * offs[2]);
		}
		h = h * (1 - mWeight) + mWeight * (0.5 - Math.abs(noise.perlin3(x / hScale, y / hScale, this.seed + 5 * offs[3])) * 1/(1 + pert) - Math.abs(noise.perlin3(x / (hScale * scalePert), y / (hScale * scalePert), this.seed - 5 * offs[3])) * (1 - 1/(1 + pert)));
		t -= Math.max(h * 0.1, 0);

		var RM = 0.4;
		var biome = "plains";
		//tctx.fillRect(w * 100 + 100, t * 100 + 100, 1, 1);
		if (t < -0.4 * RM && t < -w - 0.1 * RM) biome = "snow";
		else if (w > 0.3 * RM) biome = "forest";
		else if (w < -0.4 * RM && t > -0.1 * RM) biome = "desert";
		else if (w < -0.6 * RM && t > 0.8*w - 0.08 * RM) biome = "wasteland";

		var id = 0;
		if (h < 0) {
			id = 4;
		} else if (h > 0.4) {
			if (t < -0.4 * RM) id = 13;
			else id = 6;
		} else {
			switch (biome) {
				case "plains":
					if (Math.random() < 0.015) id = 10;
					else if (Math.random() < 0.025) id = 14;
					else if (Math.random() < 0.005) id = 5;
					else id = 2;
					break;
				case "forest":
					if (Math.random() < 0.2) id = 5;
					else if (Math.random() < 0.025) id = 10;
					else id = 2;
					break;
				case "desert":
					if (Math.random() < 0.05) id = 12;
					else if (Math.random() < 0.025) id = 11;
					else id = 3;
					break;
				case "snow":
					if (Math.random() < 0.025) id = 10;
					else if (Math.random() < 0.9) id = 7;
					else id = 2;
					break;
				case "wasteland":
					if (Math.random() < 0.001) id = 3;
					else if (Math.random() < 0.075) id = 7;
					else if (Math.random() < 0.075) id = 6;
					else id = 1;
					break;
			}
		}
		return {id: id};
	});
};

SurfaceMap.prototype = Map.prototype;

function Entity(x, y, map, hbX, hbY, speed) {
	this.x = x;
	this.y = y;
	this.dx = 0;
	this.dy = 0;
	this.hb = {x: hbX, y: hbY};
	this.map = map;
	this.facing = "s";
	this.speed = speed;
};

Entity.prototype.topSpeed = function() { return this.speed / (1 - friction) };

Entity.prototype.joinMap = function(map) {
	this.map = map;
	map.entities.push(this);
};

Entity.prototype.requestMove = function(dx, dy) {
	this.dx += dx * this.speed;
	this.dy += dy * this.speed;
};

Entity.prototype.tick = function() {
	this.x += this.dx;
	this.y += this.dy;
	this.dx *= friction;
	this.dy *= friction;
};

Entity.prototype.draw = function(x, y) {
	x = x || this.x;
	y = y || this.y;
	if (this.x > Lx(0) - 0.5 && this.x < Lx(canvas.width) + 0.5 && this.y > Ly(0) - 0.5 && this.y < Ly(canvas.height) + 0.5) {
		ctx.drawImage(this.texture, Cx(x - 0.5), Cy(y - 0.5), C(1), C(1));
	}
};

function Player(x, y, map, speed, viewSize) {
	Entity.call(this, x, y, map, 0.3, 0.3, speed);
	this.map = map;
	map.entities.push(this);
	this.viewSize = viewSize;
	this.mapView = false;
	this.mapViewSize = 50;
	this.animation = 0;
	this.whichTexture = 0;
	this.texture = {
		s0: loadTex("player/s0"),
		s1: loadTex("player/s1"),
		n0: loadTex("player/n0"),
		n1: loadTex("player/n1"),
		e0: loadTex("player/e0"),
		e1: loadTex("player/e1"),
		w0: loadTex("player/w0"),
		w1: loadTex("player/w1")
	};
};

Player.prototype = Entity.prototype;

Player.prototype.requestMove = function(dx, dy, w) {
	w = w || false;
	this.dx += dx * this.speed;
	this.dy += dy * this.speed;
	if (this.controls = "simple") {
		if (dy > Math.abs(dx)) this.facing = "s";
		else if (-dy > Math.abs(dx)) this.facing = "n";
		else if (dx < 0) this.facing = "w";
		else if (dx > 0) this.facing = "e";
	}
	if (w) this.animation += 0.075 * Math.sqrt(dx*dx + dy*dy);
	if (this.animation >= 1) {
		this.animation = 0;
		this.whichTexture++;
		if (this.whichTexture >= 2) this.whichTexture = 0;
	}
};

Player.prototype.draw = function(x, y) {
	x = x || this.x;
	y = y || this.y;
	if (this.x > Lx(0) - 0.5 && this.x < Lx(canvas.width) + 0.5 && this.y > Ly(0) - 0.5 && this.y < Ly(canvas.height) + 0.5) {
		ctx.drawImage(this.texture[this.facing + this.whichTexture], Cx(x - 0.5), Cy(y - 0.5), C(1), C(1));
	}
};

Player.prototype.drawView = function() {
	if (!this.mapView) {
		scrn.x = this.x;
		scrn.y = this.y;
		scrn.z = this.viewSize;
	}
	for (var x = Math.max(Math.floor(Lx(0)), 0); x <= Math.min(Math.floor(Lx(canvas.width)), this.map.size.x - 1); x++) {
		for (var y = Math.max(Math.floor(Ly(0)), 0); y <= Math.min(Math.floor(Ly(canvas.height)), this.map.size.y - 1); y++) {
			if (this.mapView) {
				ctx.fillStyle = block[this.map.tile[x][y].id].color;
				ctx.fillRect(Cx(x), Cy(y), C(1) + 1, C(1) + 1);
			} else {
				ctx.drawImage(block[this.map.tile[x][y].id].texture, Cx(x), Cy(y), C(1), C(1));
			}
		}
	}
	if (!this.mapView) {
		for (var a = 0; a < this.map.entities.length; a++) {
			this.map.entities[a].draw();
		}
	}
};

var surface = new SurfaceMap(600, 600);

var player = new Player(surface.size.x / 2, surface.size.y / 2, surface, 0.02, 6);

var pause = false;
var friction = 0.8;

function draw() {
	requestAnimationFrame(draw);
	
	if (!pause) {
		if (keys[87] && !keys[83]) {
			if (keys[65] && !keys[68]) player.requestMove(-Math.SQRT1_2, -Math.SQRT1_2, true);
			else if (keys[68] && !keys[65]) player.requestMove(Math.SQRT1_2, -Math.SQRT1_2, true);
			else player.requestMove(0, -1, true);
		} else if (keys[83] && !keys[87]) {
			if (keys[65] && !keys[68]) player.requestMove(-Math.SQRT1_2, Math.SQRT1_2, true);
			else if (keys[68] && !keys[65]) player.requestMove(Math.SQRT1_2, Math.SQRT1_2, true);
			else player.requestMove(0, 1, true);
		} else if (keys[65] && !keys[68]) player.requestMove(-1, 0, true);
		else if (keys[68] && !keys[65]) player.requestMove(1, 0, true);
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	player.drawView();
	if (!pause) player.map.tick();
};

draw();



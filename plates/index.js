var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
/*
window.addEventListener("resize", function() {
	const temp = ctx.getImageData(0, 0, canvas.width, canvas.height);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx.putImageData(temp, 0, 0);
	drawOffset = new V((canvas.width - size * drawScale) / 2, (canvas.height - size * drawScale) / 2);
});*/
canvas.addEventListener("contextmenu", function(event) { event.preventDefault(); });
mouse.relativeToElement = canvas;

canvas.addEventListener("mousemove", function(event) {
	if (mouse.l && editor.mode == "edit") {
		cursor.updateSelection();
		if (cursor.select.start.x != cursor.select.end.x || cursor.select.start.y != cursor.select.end.y) cursor.select.ka = true;
	}
});
canvas.addEventListener("mousedown", function(event) {
	if (event.button == 0) {
		// left click
	} else if (event.button == 1) {
		// right click
	}
});
window.addEventListener("keydown", function(event) {
	keys[event.which || event.keyCode] = true;

	// keybinds
});



class Color {
	constructor(r, g, b, a=1) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	};
	static fromHSL(h, s, l, a) {
		let r, g, b;
		if (s == 0) r = g = b = l;
		else {
			let q;
			if (l < 0.5) q = l * (1 + s);
			else q = l + s - l * s;

			let p = 2 * l - q;
			[r, g, b] = [h + 1/3, h, h - 1/3].map(t => {
				t = wrap(t, 0, 1);
				if (t < 1/6) return lerp(p, q, 6 * t);
				else if (t < 1/2) return q;
				else if (t < 2/3) return lerp(p, q, (2/3 - t) * 6);
				else return p;
			});
		}
		return new Color(round(r * 255), round(g * 255), round(b * 255), a);
	};
	getHSL() {
		let [r, g, b] = [this.r, this.g, this.b].map(n => n / 255);
		let max = Math.max(r, g, b), min = Math.min(r, g, b);
		let h, s, l = (max + min) / 2;

		if (max == min) h = s = 0;
		else {
			let d = max - min;
			if (l > 0.5) s = d / (2 - max - min);
			else s = d / (max + min)

			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}

		return [h, s, l];
	};
	toCSS() {
		return "rgba(" + [this.r, this.g, this.b, this.a].join(",") + ")";
	};
};




let size = 1000;
canvas.width = size;
canvas.height = size;

let tiles = new Uint16Array(size * size);
let newTiles = [];
for (let i = 0; i < tiles.length; i++) newTiles[i] = [];


let plates = 50;
let plateSizes = [0];
let plateMomenta = [0];
plateColors = [new Color(0, 0, 0)];
for (let i = 0; i < plates; i++) {
	plateSizes.push(1/random.float(1, 4));
	plateMomenta.push(V.fromPolar(random.float(1), random.float(Math.PI * 2)));
	plateColors.push(Color.fromHSL(random.float(), random.float(), random.float(0.1, 0.9)));
	let location = random.int(size * size);
	while (tiles[location] != 0) location = random.int(size * size);
	tiles[location] = i + 1;
}

function tickTiles() {
	for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
		let p = tiles[x + y*size];
		if (p <= 0) continue;

		// allow the value of plateSizes to control the speed of growth
		if (random.float() > plateSizes[p]) continue;

		// determine which surrounding tiles are spreadable to
		let oTiles = [];
		let dTiles = [];

		if (isSpreadable(x-1, y, p)) oTiles.push(x-1 + y*size);
		if (isSpreadable(x+1, y, p)) oTiles.push(x+1 + y*size);
		if (isSpreadable(x, y-1, p)) oTiles.push(x + (y-1)*size);
		if (isSpreadable(x, y+1, p)) oTiles.push(x + (y+1)*size);

		if (isSpreadable(x-1, y-1, p)) oTiles.push(x-1 + (y-1)*size);
		if (isSpreadable(x+1, y-1, p)) oTiles.push(x+1 + (y-1)*size);
		if (isSpreadable(x-1, y+1, p)) oTiles.push(x-1 + (y+1)*size);
		if (isSpreadable(x+1, y+1, p)) oTiles.push(x+1 + (y+1)*size);

		// do nothing if its out of room to spread
		if (oTiles.length == 0 && dTiles.length == 0) continue;

		// give the diagonal tiles a 1/√2 weight to make spread more balanced
		let oChance = oTiles.length / (oTiles.length + dTiles.length * Math.SQRT1_2);

		let location;
		if (random.float() < oChance) location = random.choose(oTiles);
		else location = random.choose(dTiles);

		// write changes to a buffer
		if (!newTiles[location].includes(p)) newTiles[location].push(p);
	}

	// use the values of the buffer, where multiple values where set choose randomly
	for (let i = 0; i < tiles.length; i++) {
		if (newTiles[i].length == 1) tiles[i] = newTiles[i][0];
		else if (newTiles[i].length > 1) tiles[i] = random.choose(newTiles[i]);
		newTiles[i] = [];
	}
};

function isSpreadable(x, y, p) {
	if (x < 0 || y < 0 || x >= size || y >= size) return false;
	if (tiles[x + y*size] == 0) return true;
	if (tiles[x + y*size] == p) return false;

	// if 3 tiles of the spreading type are directly adjacent, they can overtake it
	let count = 0;
	if (x > 0) if (tiles[x-1 + y*size] == p) count++;
	if (x < size-1) if (tiles[x+1 + y*size] == p) count++;
	if (y > 0) if (tiles[x + (y-1)*size] == p) count++;
	if (y < size-1) if (tiles[x + (y+1)*size] == p) count++;
	if (count >= 3) return true;
	return false;
};




function draw() {
	requestAnimationFrame(draw);

	// main loop
	tickTiles();


	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = "#000000";
	ctx.strokeRect(0, 0, size, size);

	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			ctx.fillStyle = plateColors[tiles[x + y*size]].toCSS();
			ctx.fillRect(x, y, 1, 1);
		}
	}
}

draw();
var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");


var mouse = {
	x: null,
	y: null,
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
		if (mouse.r || (mouse.l && keys[16])) {
			scrn.x += L(mouse.x - event.x);
			scrn.y += L(mouse.y - event.y);
		}
		mouse.x = event.x;
		mouse.y = event.y;
		if (keys[32]) {
			if (curve.pointSet.points[0].abs() === 0) curve.pointSet.points.shift();
			curve.pointSet.points.push(new CN(Lx(mouse.x), Ly(mouse.y)));
		}
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
		scrn.z *= 1 + event.deltaY / 1000;
		scrn.x -= (Lx(mouse.x) - scrn.x) * event.deltaY / 1000;
		scrn.y -= (Ly(mouse.y) - scrn.y) * event.deltaY / 1000;
	}
);

window.addEventListener("keydown", 
	function(event) {
		switch (event.keyCode) {
		case 32:
			if (!keys[32]) {
				curve.pointSet = new PointSet();
			}
			break;
		case 188:
			dt /= 2;
			break;
		case 190:
			dt *= 2;
			break;
		}
		keys[event.which || event.keyCode] = true;
	}
);

window.addEventListener("keyup",
	function(event) {
		keys[event.which || event.keyCode] = false;
		switch (event.keyCode) {
		case 32:
			curve.reset();
			curve.initBuffer(10000);
			break;
		}
	}
);

var keys = [];
for (var x = 0; x < 256; x++) { keys[x] = false; }

var scrn = {
	x: 0,
	y: 0,
	z: 2,
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

function CN(r, i) {
	this.r = r || 0;
	this.i = i || 0;
};

CN.prototype.abs = function() { return Math.sqrt(this.r*this.r + this.i*this.i) };
CN.prototype.angle = function() { return Math.atan2(this.i, this.r); };
CN.prototype.add = function(a) { this.r += a.r; this.i += a.i; return this; };
CN.prototype.n = function() { return new CN(-this.r, -this.i); };

function add(a, b) { return new CN(a.r + b.r, a.i + b.i) };
function mult(a, b) { return new CN(a.r * b.r - a.i * b.i, a.i * b.r + a.r * b.i); };
function pow(a, b) {
	var r = Math.pow(a.abs(), b.r) / Math.exp(b.i * a.angle());
	var t = b.r * a.angle() + b.i * Math.log(a.abs());
	return new CN(r * Math.cos(t), r * Math.sin(t));
};
function n(a) {return new CN(-a.r, -a.i)};

function PointSet(points) {
	points = points || [new CN()];
	this.points = points;
};
PointSet.prototype.f = function(t) {
	var u = t * this.points.length % 1;
	var a = Math.floor(t * this.points.length);
	var b = Math.floor(t * this.points.length) + 1;
	while (a >= this.points.length) a -= this.points.length;
	while (b >= this.points.length) b -= this.points.length;
	return add(mult(add(this.points[b], this.points[a].n()), new CN(u, 0)), this.points[a]);
};
PointSet.prototype.draw = function(detail) {
	detail = detail || 1000;
	for (var t = 0; t <= 1; t += 1/detail) {
		point = this.f(t);
		ctx.lineTo(Cx(point.r), Cy(point.i));
	};
};

function FourierSet(pointSet, precision) {
	this.pointSet = pointSet;
	this.p = precision;
	this.c = [];
	for (var n = -this.p; n <= this.p; n++) {
		c = new CN();
		for (var u = 0; u < 1; u += 1/acc) {
			c.add(mult(this.input(u + 0.5 / acc), new CN(Math.cos(-2 * Math.PI * n * (u + 0.5 / acc)), Math.sin(-2 * Math.PI * n * (u + 0.5 / acc)))));
		}
		this.c[n] = new CN(c.r / acc, c.i / acc);
	}
};
FourierSet.prototype.reset = function() {
	this.c = [];
	for (var n = -this.p; n <= this.p; n++) {
		c = new CN();
		for (var u = 0; u < 1; u += 1/acc) {
			c.add(mult(this.input(u + 0.5 / acc), new CN(Math.cos(-2 * Math.PI * n * (u + 0.5 / acc)), Math.sin(-2 * Math.PI * n * (u + 0.5 / acc)))));
		}
		this.c[n] = new CN(c.r / acc, c.i / acc);
	}
};
FourierSet.prototype.input = function(t) { return this.pointSet.f(t); };
FourierSet.prototype.f = function(t) {
	var total = new CN();
	for (var n in this.c) {
		total.add(mult(this.c[n], new CN(Math.cos(2 * Math.PI * n * t), Math.sin(2 * Math.PI * n * t))));
	}
	return total;
};
FourierSet.prototype.draw = PointSet.prototype.draw;
FourierSet.prototype.circles = function(t, color1, color2) {
	var c = [];
	var wCenter;
	for (var a in this.c) {
		if (a === "0") wCenter = new CN(this.c[0].r, this.c[0].i);
		else c.push({f: a, r: this.c[a]});
	}
	c.sort(function(a, b) {return b.r.abs() - a.r.abs();});
	for (var a = 0; a < c.length; a++) {
		ctx.strokeStyle = color2;
		ctx.beginPath();
		ctx.arc(Cx(wCenter.r), Cy(wCenter.i), C(c[a].r.abs()), 0, Math.PI * 2);
		ctx.stroke();

		ctx.strokeStyle = color1;
		ctx.beginPath();
		ctx.moveTo(Cx(wCenter.r), Cy(wCenter.i));
		wCenter.add(mult(c[a].r, new CN(Math.cos(2 * Math.PI * c[a].f * t), Math.sin(2 * Math.PI * c[a].f * t))));
		ctx.lineTo(Cx(wCenter.r), Cy(wCenter.i));
		ctx.stroke();
	}
};
FourierSet.prototype.initBuffer = function(detail) {
	detail = detail || 1000;
	this.buffer = [];
	for (var t = 0; t <= 1; t += 1/detail) {
		this.buffer.push(this.f(t));
	};
};
FourierSet.prototype.drawBuffer = function() {
	if (!this.buffer) return;
	for (var a = 0; a < this.buffer.length; a++) {
		ctx.lineTo(Cx(this.buffer[a].r), Cy(this.buffer[a].i));
	};
};



var acc = 2000;
var curve = new FourierSet(new PointSet(), 500);


var t = 0;
var dt = 0.0005;

function draw() {
	requestAnimationFrame(draw);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (keys[32]) {
		ctx.beginPath();
		curve.pointSet.draw();
		ctx.stroke();
	} else {
		ctx.strokeStyle = "#000000";
		ctx.beginPath();
		curve.drawBuffer();
		ctx.stroke();
		curve.circles(t, "#0000ff", "#3f3f3f");
	}

	t += dt;
	if (keys[16]) {
		scrn.x = curve.f(t).r;
		scrn.y = curve.f(t).i;
	}
}

draw();



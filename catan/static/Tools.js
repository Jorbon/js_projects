/*
General purpose math and management stuff for general use.
Removes annoying Math namespace (π works), new math functions, event scheduling, n-dimensional vectors, matrices, 2d frames for nested coordinate references, and a bit of mouse and keyboard input help.
*/

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

function writeCookie(name, data, hours=24) {
	let now = new Date();
	let time = now.getTime();
	now.setTime(time + 3600000*hours);
	document.cookie = name + "=" + data + ";expires="+now.toGMTString()+";path=/";
};

function getCookie(name) {
	let cookies = document.cookie.split("; ").map(item => item.split("="));
	let cookieObject = {};
	for (let i of cookies) cookieObject[i[0]] = i[1];
	if (name) return cookieObject[name];
	return cookieObject;
};

function iterateTree(tree, callback, type, reverse=false) {
	if (typeof tree == "object") {
		if (type) {
			if (!(tree instanceof type)) {
				if (tree instanceof Array) {
					if (reverse) {
						for (let i = tree.length-1; i >= 0; i--) if (iterateTree(tree[i], callback, type, true)) return true;
					} else for (let i = 0; i < tree.length; i++) if (iterateTree(tree[i], callback, type)) return true;
				} else for (let i in tree) if (iterateTree(tree[i], callback, type, reverse)) return true;
				return false;
			} else return callback(tree) || false;
		} else {
			if (tree instanceof Array) {
				if (reverse) {
					for (let i = tree.length-1; i >= 0; i--) if (iterateTree(tree[i], callback, type, true)) return true;
				} else for (let i = 0; i < tree.length; i++) if (iterateTree(tree[i], callback, type)) return true;
				return false;
			} else return callback(tree) || false;
		}
	} else return callback(tree) || false;
};

class V {
	constructor(c=[0, 0]) {
		this.c = [];
		if (c instanceof V) for (var a = 0; a < c.c.length; a++) this.c[a] = c.c[a];
		else if (c instanceof Array) for (var a = 0; a < c.length; a++) this.c[a] = c[a];
		else for (var a = 0; a < arguments.length; a++) this.c.push(arguments[a]);
	};
	get x() { return this.c[V.letterMap.x]; };
	get y() { return this.c[V.letterMap.y]; };
	get z() { return this.c[V.letterMap.z]; };
	get w() { return this.c[V.letterMap.w]; };
	get r() { return this.c[V.letterMap.r]; };
	get i() { return this.c[V.letterMap.i]; };
	get j() { return this.c[V.letterMap.j]; };
	get k() { return this.c[V.letterMap.k]; };
	get u() { return this.c[V.letterMap.u]; };
	get v() { return this.c[V.letterMap.v]; };
	set x(n) { this.c[V.letterMap.x] = n; };
	set y(n) { this.c[V.letterMap.y] = n; };
	set z(n) { this.c[V.letterMap.z] = n; };
	set w(n) { this.c[V.letterMap.w] = n; };
	set r(n) { this.c[V.letterMap.r] = n; };
	set i(n) { this.c[V.letterMap.i] = n; };
	set j(n) { this.c[V.letterMap.j] = n; };
	set k(n) { this.c[V.letterMap.k] = n; };
	set u(n) { this.c[V.letterMap.u] = n; };
	set v(n) { this.c[V.letterMap.v] = n; };
	static letterMap = { x: 0, y: 1, z: 2, w: 3, r: 0, i: 1, j: 2, k: 3, u: 0, v: 1 };
	get dim() { return this.c.length; };
	set dim(dim) {
		var c = [];
		for (var a = 0; a < dim; a++) c.push(this.c[a] || 0);
		this.c = c;
	};
	setDim(dim, fill=0) {
		var c = [];
		for (var a = 0; a < dim; a++) {
			if (a < this.dim) c.push(this.c[a]);
			else c.push(fill);
		}
		this.c = c;
		return this;
	};
	fix(dim, fill=0) {
		var c = [];
		for (var a = 0; a < dim; a++) {
			if (a < this.dim) c.push(this.c[a]);
			else c.push(fill);
		}
		this.c = c;
		return this;
	}
	
	abs2() { return this.dot(this); };
	abs() { return sqrt(this.abs2()); };
	add(v) {
		var c = [];
		for (var a = 0; a < this.c.length; a++) c.push(this.c[a] + (v.c[a] || 0));
		return new V(c);
	};
	sub(v) {
		var c = [];
		for (var a = 0; a < this.c.length; a++) c.push(this.c[a] - v.c[a]);
		return new V(c);
	};
	mult(s) {
		if (s instanceof V) {
			var q1 = new V(this);
			var q2 = new V(s);
			q1.dim = 4;
			q2.dim = 4;
			return new V(
				q1.r * q2.r - q1.i * q2.i - q1.j * q2.j - q1.k * q2.k,
				q1.r * q2.i + q1.i * q2.r + q1.j * q2.k - q1.k * q2.j,
				q1.r * q2.j - q1.i * q2.k + q1.j * q2.r + q1.k * q2.i,
				q1.r * q2.k + q1.i * q2.j - q1.j * q2.i + q1.k * q2.r
			);
		} else {
			var c = [];
			for (var a = 0; a < this.dim; a++) c.push(this.c[a] * s);
			return new V(c);
		}
	};
	dot(v) {
		var total = 0;
		for (var a = 0; a < this.dim && a < v.dim; a++) total += this.c[a] * v.c[a];
		return total;
	};
	cross(v) {
		var v1 = new V(this), v2 = new V(v);
		v1.dim = 3; v2.dim = 3;
		return new V(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
	};
	normalize() { this.c = this.mult(1/this.abs()).c; return this; };
	angle(v) { return acos(this.dot(v) / (this.abs() * v.abs())); };
	rotate(angle=0, axis=new V(0, 0, 1)) {
		if (this.dim === 2) return new V(this.x * cos(angle) - this.y * sin(angle), this.y * cos(angle) + this.x * sin(angle));
		else if (this.dim === 3) {
			var q = new V(cos(angle / 2), sin(angle / 2) * axis.x, sin(angle / 2) * axis.y, sin(angle / 2) * axis.z);
			var p = q.mult(new V(0, this.x, this.y, this.z)).mult(new V(q.r, -q.i, -q.j, -q.k));
			return new V(p.i, p.j, p.k);
		}
	};
	moveHere() { ctx.moveTo(this.c[0], this.c[1]); };
	lineHere() { ctx.lineTo(this.c[0], this.c[1]); };
	static lerp(v1, v2, t) {
		return v2.sub(v1).mult(t).add(v1);
	};
	static fromPolar(r, a) {
		return new V(cos(a), sin(a)).mult(r);
	};
};



const mouse = Object.assign({ // I want mouse to have the methods of V but not the same .r value
    l: false,
	m: false,
	r: false,
    drag: {
        l: { start: new V(), end: new V() },
        m: { start: new V(), end: new V() },
        r: { start: new V(), end: new V() }
	},
	relativeToElement: { offsetLeft: 0, offsetTop: 0 }
}, new V(0, 0));
mouse.__proto__ = new V().__proto__;

window.addEventListener("mousemove", function(event) {
	mouse.x = event.x - mouse.relativeToElement.offsetLeft;
	mouse.y = event.y - mouse.relativeToElement.offsetTop;
	if (mouse.l) mouse.drag.l.end = new V(mouse);
    if (mouse.m) mouse.drag.m.end = new V(mouse);
    if (mouse.r) mouse.drag.r.end = new V(mouse);
});

window.addEventListener("mousedown", function(event) {
	switch (event.button) {
	case 0:
		mouse.l = true;
		mouse.drag.l.start = new V(mouse);
		mouse.drag.l.end = new V(mouse);
		break;
	case 1:
        mouse.m = true;
		mouse.drag.m.start = new V(mouse);
		mouse.drag.m.end = new V(mouse);
		break;
	case 2:
        mouse.r = true;
        mouse.drag.r.start = new V(mouse);
		mouse.drag.r.end = new V(mouse);
		break;
	}
});

window.addEventListener("mouseup", function(event) {
	switch (event.button) {
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
});

let keys = [];
for (let x = 0; x < 256; x++) { keys[x] = false; }
window.addEventListener("keydown", function(event) { keys[event.which || event.keyCode] = true; });
window.addEventListener("keyup", function(event) { keys[event.which || event.keyCode] = false; });



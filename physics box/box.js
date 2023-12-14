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
		if (mouse.r && scrn.scrollEnabled) {
			scrn.x += L(mouse.x - event.x);
			scrn.y += -L(mouse.y - event.y);
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
        if (scrn.scrollEnabled) {
		    scrn.z *= 1 + event.deltaY / 1000;
		    scrn.x -= (Lx(mouse.x) - scrn.x) * event.deltaY / 1000;
            scrn.y -= (Ly(mouse.y) - scrn.y) * event.deltaY / 1000;
        }
	}
);

window.addEventListener("keydown", 
	function(event) {
		keys[event.which || event.keyCode] = true;
		switch (event.keyCode) {
			
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
    scrollEnabled: false,
    ratio: function() {return canvas.width / canvas.height;},
	x: 0,
	y: 0,
	z: 6,
	Cx: function (x) {return (x - this.x) * Math.min(canvas.width, canvas.height) / 2 / this.z + canvas.width / 2;},
	Cy: function (y) {return (y - this.y) * Math.min(canvas.width, canvas.height) / 2 / this.z + canvas.height / 2;},
	C: function (s) {return s * Math.min(canvas.width, canvas.height) / 2 / this.z;},
	Lx: function (x) {return (x * 2 - canvas.width) * this.z / Math.min(canvas.width, canvas.height) + this.x;},
	Ly: function (y) {return (y * 2 - canvas.height) * this.z / Math.min(canvas.width, canvas.height) + this.y;},
	L: function (s) {return s * 2 * this.z / Math.min(canvas.width, canvas.height);}
};
function Cx(b) {return scrn.Cx(b);};
function Cy(b) {return canvas.height - scrn.Cy(b);};
function C(b) {return scrn.C(b);};
function Lx(b) {return scrn.Lx(b);};
function Ly(b) {return scrn.Ly(canvas.height - b);};
function L(b) {return scrn.L(b);};

// -------------------------------------------------------------------

// -------------------------------------------------------------------

function V(x, y) {
	if (x instanceof V) {
		this.x = x.x;
		this.y = x.y;
	} else {
	    this.x = x || 0;
		this.y = y || 0;
	}
};
V.prototype.r = function() {return Math.sqrt(this.x * this.x + this.y * this.y);};
V.prototype.a = function() {return Math.atan2(this.y, this.x);};
V.prototype.setPolar = function(r, a) {this.x = r * Math.cos(a); this.y = r * Math.sin(a); return this;};
V.prototype.add = function(a) {this.x += a.x; this.y += a.y; return this;};
V.prototype.subtract = function(a) {this.x -= a.x; this.y -= a.y; return this;};
V.prototype.multiply = function(s) {this.x *= s; this.y *= s; return this;}
V.prototype.normalize = function() {var r = this.r(); this.x /= r; this.y /= r; return this;};
V.prototype.dotProduct = function(v) {return this.x * v.x + this.y * v.y};

function left(p1, p2, pos) {
	if (p1.x === p2.x) {
		if (p1.y === p2.y) throw "Left function error, points are identical";
		else if (p2.y > p1.y) return pos.x < p1.x;
		else return pos.x > p1.x;
	} else if (p2.x > p1.x) return pos.y > (p2.y-p1.y) / (p2.x-p1.x) * (pos.x-p1.x) + p1.y;
	else return pos.y < (p2.y-p1.y) / (p2.x-p1.x) * (pos.x-p1.x) + p1.y;
};

function collisionTest(thing1, thing2) {
	if (thing1.lock && thing2.lock) return;
	var collisions = [];
	for (var a = 0; a < thing1.points.length; a++) {
		for (var b1 = 0; b1 < thing2.points.length; b1++) {
			if (b1 + 1 === thing2.points.length) var b2 = 0;
			else var b2 = b1 + 1;

			var start = thing1.pointLocationOld(a);
			var end = thing1.pointLocation(a);
			var p1 = thing2.pointLocation(b1);
			var p2 = thing2.pointLocation(b2);

			if (left(p1, p2, end)) {
				var tm = ((start.x-p1.x) * (p2.y-p1.y) - (start.y-p1.y) * (p2.x-p1.x)) / ((end.y-start.y) * (p2.x-p1.x) - (end.x-start.x) * (p2.y-p1.y));
				var tf = ((p1.y-start.y) * (end.x-start.x) - (p1.x-start.x) * (end.y-start.y)) / ((p2.x-p1.x) * (end.y-start.y) - (p2.y-p1.y) * (end.x-start.x));

				if (tm >= 0 && tm <= 1 && tf >= 0 && tf <= 1) {
					collisions.push({thing1: thing1, thing2: thing2, t: tm, thing1p: a, thing2l: b1, thing2contact: tf});
				}
			}
		}
	}
	for (var a = 0; a < thing2.points.length; a++) {
		for (var b1 = 0; b1 < thing1.points.length; b1++) {
			if (b1 + 1 === thing1.points.length) var b2 = 0;
			else var b2 = b1 + 1;
			
			var start = thing2.pointLocationOld(a);
			var end = thing2.pointLocation(a);
			var p1 = thing1.pointLocation(b1);
			var p2 = thing1.pointLocation(b2);

			if (left(p1, p2, end)) {
				var tm = ((start.x-p1.x) * (p2.y-p1.y) - (start.y-p1.y) * (p2.x-p1.x)) / ((end.y-start.y) * (p2.x-p1.x) - (end.x-start.x) * (p2.y-p1.y));
				var tf = ((p1.y-start.y) * (end.x-start.x) - (p1.x-start.x) * (end.y-start.y)) / ((p2.x-p1.x) * (end.y-start.y) - (p2.y-p1.y) * (end.x-start.x));

				if (tm >= 0 && tm <= 1 && tf >= 0 && tf <= 1) {
					collisions.push({thing1: thing1, thing2: thing2, t: tm, thing1p: a, thing2l: b1, thing2contact: tf});
				}
			}
		}
	}
	if (!collisions.length) return;

	collisions.sort(function(a, b) {return b.t - a.t});
	collisions.filter(function(a) {return a.t === collisions[0].t;});

	for (var a in collisions) {
		thing1 = collisions[a].thing1;
		thing2 = collisions[a].thing2;
		var pointOnThing1 = new V(thing1.points[collisions[a].thing1p]);
		var l1 = new V(thing2.points[collisions[a].thing2l]);
		if (collisions[a].thing2l + 1 === thing2.points.length) var l2 = new V(thing2.points[0]);
		else var l2 = new V(thing2.points[collisions[a].thing2l + 1]);
		var pointOnThing2 = new V(l1).add(new V(l2).subtract(l1).multiply(collisions[a].thing2contact));
		
		var p1 = thing2.pointLocation(collisions[a].thing2l);
		if (collisions[a].thing2l + 1 === thing2.points.length) var p2 = thing2.pointLocation(0);
		else var p2 = thing2.pointLocation(collisions[a].thing2l + 1);

		var forceSurface = new V(p2).subtract(p1);
		var contactPoint = new V(p1).add(new V(forceSurface).multiply(collisions[a].thing2contact));
		var normalForceDirection = new V(forceSurface.y, -forceSurface.x).normalize();
		var parallelForceDirection = new V(forceSurface.x, forceSurface.y).normalize();
		
		var thing1velocity = new V(thing1.v).add(new V().setPolar(pointOnThing1.r(), pointOnThing1.a() + thing1.a + Math.PI / 2).multiply(thing1.r));
		var thing2velocity = new V(thing2.v).add(new V().setPolar(pointOnThing2.r(), pointOnThing2.a() + thing2.a + Math.PI / 2).multiply(thing2.r));

		thing1endPoint = new V(thing1.pointLocation(collisions[a].thing1p));
		thing1.p.subtract(new V(normalForceDirection).multiply(new V(normalForceDirection).dotProduct(new V(thing1endPoint).subtract(contactPoint))));

		// Normal force:
		var eMultiplier = 1 + (thing1.elasticity + thing2.elasticity) / 2;
		var thing1normalV, thing2normalV, normalForce;
		if (thing1.lock) {
			thing1normalV = 0;
			thing2normalV = new V(normalForceDirection).dotProduct(thing2velocity);
			normalForce = thing2normalV * thing1.m * eMultiplier;
		} else if (thing2.lock) {
			thing1normalV = new V(normalForceDirection).dotProduct(thing1velocity);
			thing2normalV = 0;
			normalForce = thing1normalV * thing1.m * eMultiplier;
		} else {
			thing1normalV = new V(normalForceDirection).dotProduct(thing1velocity);
			thing2normalV = new V(normalForceDirection).dotProduct(thing2velocity);
			normalForce = thing2.m * eMultiplier * ((thing1.m*thing1normalV + thing2.m*thing2normalV)/(thing1.m + thing2.m) - thing2normalV);
		}
		thing1.applyForce(new V(normalForceDirection).multiply(-normalForce), pointOnThing1);
		thing2.applyForce(new V(normalForceDirection).multiply(-normalForce), pointOnThing2);

		// Friction force:
		var thing1parallelV = new V(parallelForceDirection).dotProduct(thing1velocity);
		var thing2parallelV = new V(parallelForceDirection).dotProduct(thing2velocity);
	}
};

function Box(width, height, g) {
	this.width = width;
	this.height = height;
	this.g = new V(0, -g / 60);
	this.things = [];
};
Box.prototype.add = function(thing) {this.things.push(thing); thing.box = this;};
Box.prototype.draw = function() {
	ctx.fillStyle = "#cfcfcf";
	ctx.fillRect(Cx(0), Cy(0), C(box.width), C(-box.height));
	for (var a in this.things) {
		this.things[a].draw();
	}
};
Box.prototype.tick = function() {
    for (var a in this.things) {
        this.things[a].tick();
	}
	for (var a = 0; a < this.things.length; a++) {
        for (var b = a + 1; b < this.things.length; b++) {
			collisionTest(this.things[a], this.things[b]);
        }
    }
};

function Thing(x, y, m, color) {
    this.m = m;
	this.p = new V(x, y);
	this.pOld = new V();
	Object.assign(this.pOld, this.p);
    this.v = new V();
	this.a = 0;
	this.aOld = this.a;
	this.r = 0;
	this.points = [new V()];
	this.color = color;
	this.lock = false;
	this.elasticity = 0.6;
	this.box = null;
};
Thing.prototype.tick = function() {
	if (!this.lock) {
		this.v.add(this.box.g);
		Object.assign(this.pOld, this.p);
		this.aOld = this.a;
    	this.p.add(this.v);
		this.a += this.r;
	}
};
Thing.prototype.pointLocation = function(n) {
	var p = new V();
	p.setPolar(this.points[n].r(), this.points[n].a() + this.a);
	return p.add(this.p);
};
Thing.prototype.pointLocationOld = function(n) {
	var p = new V();
	p.setPolar(this.points[n].r(), this.points[n].a() + this.aOld);
	return p.add(this.pOld);
};
Thing.prototype.applyForce = function(force, location) {
	if (!this.lock) {
		var pushDirection = new V().setPolar(-1, location.a() + this.a);
		var pushForce = new V(pushDirection).multiply(new V(force).dotProduct(pushDirection));
		this.v.add(pushForce.multiply(1/this.m));
		var torqueDirection = new V().setPolar(1, pushDirection.a() - Math.PI / 2);
		var torqueForce = new V(force).dotProduct(torqueDirection);
		this.r += torqueForce * location.r() / this.m;
	}
};
Thing.prototype.draw = function() {
	ctx.fillStyle = this.color;
	ctx.beginPath();
	var p = this.pointLocation(this.points.length - 1);
	ctx.moveTo(Cx(p.x), Cy(p.y));
	for (var n = 0; n < this.points.length; n++) {
		var p = this.pointLocation(n);
		ctx.lineTo(Cx(p.x), Cy(p.y));
	}
	ctx.fill();
};

function Rect(x, y, m, width, height, color) {
	Thing.call(this, x, y, m, color);
	this.width = width;
	this.height = height;
	this.points = [
		new V(this.width / 2, this.height / 2),
		new V(-this.width / 2, this.height / 2),
		new V(-this.width / 2, -this.height / 2),
		new V(this.width / 2, -this.height / 2)
	];
};
Rect.prototype = Thing.prototype;


var box = new Box(10, 10, 0.1);
scrn.x = box.width / 2;
scrn.y = box.height / 2;
scrn.z = box.height / 2;
	
var block = new Rect(3, 5, 10, 2, 0.5, "#df6f00");
box.add(block);
block.v.x = 0.02;

var block2 = new Rect(7, 5, 10, 2, 0.5, "#2f2f2f");
box.add(block2);

var wall = new Thing(box.width / 2, box.height / 2, 1, "rgba(0, 0, 0, 0)");
wall.lock = true;
wall.points = [
	new V(box.width / 2, -box.height / 2),
	new V(-box.width / 2, -box.height / 2),
	new V(-box.width / 2, box.height / 2),
	new V(box.width / 2, box.height / 2)
];
box.add(wall);

function draw() {
	requestAnimationFrame(draw);
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	box.tick();
	box.draw();
	
};

draw();



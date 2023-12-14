/*
Biome key:
0 - Deep Ocean
1 - Ocean
2 - Shallow Ocean
3 - Beach
4 - Plains
5 - Forest
6 - Hills
7 - Mountains
8 - Peaks
9 - Cliff

Terrain key:
0 - Normal Land
1 - Water
2 - Steep
3 - Snow
*/


var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

var image = document.getElementById("image");

var mouse = {
	x: undefined,
	y: undefined
};

window.addEventListener("mousemove", 
	function(event) {
		mouse.x = event.x;
        mouse.y = event.y;
	}
);

window.addEventListener("keydown", 
	function(event) {
        keys[event.which || event.keyCode] = true;
        switch (event.keyCode || event.which) {
            case 77:
                if (player.view === 0) {
                    player.view = 1;
                    player.mapX = player.x;
                    player.mapY = player.y;
                    player.drawMapView();
                } else if (player.view === 1) {
                    player.view = 0;
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
for (var a = 0; a <= 222; a++) {
	keys[a] = false;
}

window.addEventListener("resize", 
	function() {
		canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (player.view === 1) player.drawMapView();
	}
);







function rgb2hsv (rgb) {
    var hsv = {h: 0, s: 0, v: 0};
    var min = Math.min(rgb.r/255, rgb.g/255, rgb.b/255);
    var max = Math.max(rgb.r/255, rgb.g/255, rgb.b/255);
    var delta = max - min;
    hsv.v = max;
    if (max === 0) {
        hsv.s = 0;
        hsv.h = 0;
    } else {
        hsv.s = delta / max;
        if (rgb.r === max) {
            hsv.h = (rgb.g - rgb.b) / delta;
        } else if (rgb.g === max) {
            hsv.h = 2 + (rgb.b - rgb.r) / delta;
        } else {
            hsv.h = 4 + (rgb.r - rgb.g) / delta;
        }
        if (hsv.h < 0) hsv.h += 6;
        hsv.h *= 60;
    }
    return hsv;
};



function colorValue(color, value) {
    var r = parseInt(color.split("")[1] + color.split("")[2], 16) / 255;
    var g = parseInt(color.split("")[3] + color.split("")[4], 16) / 255;
    var b = parseInt(color.split("")[5] + color.split("")[6], 16) / 255;
    var currentValue = Math.max(r, g, b);
    var newValue = currentValue + value;
    if (newValue < 0) newValue = 0; else if (newValue > 1) newValue = 1;
    if (currentValue === 0) {
        r = Math.round(255 * newValue).toString(16);
        g = Math.round(255 * newValue).toString(16);
        b = Math.round(255 * newValue).toString(16);
    } else {
        r = Math.round(r * 255 * newValue / currentValue).toString(16);
        g = Math.round(g * 255 * newValue / currentValue).toString(16);
        b = Math.round(b * 255 * newValue / currentValue).toString(16);
    }
    while (r.length < 2) r = "0" + r;
    while (g.length < 2) g = "0" + g;
    while (b.length < 2) b = "0" + b;

    return "#" + r + g + b;
};

function pushToCenter(t) {return (Math.pow(2 * t - 1, 3) + 1) / 2;};
function pushToEdges(t) {return (Math.cbrt(2 * t - 1) + 1) / 2;};


function Player(x, y, hitbox, res, speed) {
    this.x = x;
    this.y = y;
    this.hitbox = hitbox;
    this.movRequest = {x: 0, y: 0};
    this.res = res;
    this.mapRes = 2;
    this.speed = speed;
    this.mapSpeed = 200;
    this.mapX = this.x;
    this.mapY = this.y;
    this.view = 1;
    this.slope = function() {
        return slopeS(this.x, this.y);
    };
    this.alt = function() {
        return map.data[Math.floor(this.x)][Math.floor(this.y)].alt;
    };
    this.biome = function() {
        return map.data[Math.floor(this.x)][Math.floor(this.y)].biome;
    };
    this.move = function() {
        if (this.view === 1) {
            this.mapX += this.movRequest.x * this.mapSpeed;
            this.mapY += this.movRequest.y * this.mapSpeed;
            if (this.mapX < 0) this.mapX = 0;
            if (this.mapY < 0) this.mapY = 0;
            if (this.mapX > map.size.x + 1) this.mapX = map.size.x + 1;
            if (this.mapY > map.size.y + 1) this.mapY = map.size.y + 1;
            if (this.movRequest.x !== 0 || this.movRequest.y !== 0) {
                this.drawMapView();
            }
        } else if (this.view === 0) {
            this.x += this.movRequest.x * this.speed;
            this.y += this.movRequest.y * this.speed;
        }
        this.movRequest = {x: 0, y: 0};
    };
    this.height = function() {
        var record = -65536;
        for (var x = Math.floor(this.x - this.hitbox); x <= Math.floor(this.x + this.hitbox); x++) {
            for (var y = Math.floor(this.y - this.hitbox); y <= Math.floor(this.y + this.hitbox); y++) {
                if (map.data[x][y].height > record) record = map.data[x][y].height;
            }
        }
        return record;
    };
    this.drawView = function() {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var x = Math.floor(this.x - canvas.width / this.res / 2); x <= Math.floor(this.x + canvas.width / this.res / 2); x++) {
            for (var y = Math.floor(this.y - canvas.height / this.res / 2); y <= Math.floor(this.y + canvas.height / this.res / 2); y++) {
                if (x >= 0 && x < map.size.x && y >= 0 && y < map.size.y) {
                    ctx.fillStyle = map.data[x][y].color;
                    ctx.fillRect((x - this.x) * this.res + canvas.width / 2, (y - this.y) * this.res + canvas.height / 2, this.res + 1, this.res + 1);
                }
            }
        }
    };
    this.drawMapView = function() {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var x = Math.floor(this.mapX - canvas.width / this.mapRes / 2); x <= Math.floor(this.mapX + canvas.width / this.mapRes / 2); x++) {
            for (var y = Math.floor(this.mapY - canvas.height / this.mapRes / 2); y <= Math.floor(this.mapY + canvas.height / this.mapRes / 2); y++) {
                if (x >= 0 && x < map.size.x && y >= 0 && y < map.size.y) {
                    ctx.fillStyle = map.data[x][y].color;//.simpleColor
                    ctx.fillRect((x - this.mapX) * this.mapRes + canvas.width / 2, (y - this.mapY) * this.mapRes + canvas.height / 2, this.mapRes + 1, this.mapRes + 1);
                }
            }
        }
    };
    this.draw = function() {
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = 3;
        ctx.strokeRect(canvas.width / 2 - this.hitbox * this.res, canvas.height / 2 - this.hitbox * this.res, this.hitbox * this.res * 2, this.hitbox * this.res * 2);
    };
    this.drawHUD = function() {

        ctx.fillStyle = "#1f1f1f";
        ctx.beginPath();
        ctx.arc(canvas.width - 60, canvas.height - 60, 150, 0, 2 * Math.PI);
        ctx.fill();
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#4f4f4f";
        ctx.stroke();

        ctx.strokeStyle = "#cfcfcf";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(canvas.width - 60, canvas.height - 60, 40, 0, 2 * Math.PI);
        ctx.stroke();
        
        var slope = this.slope();

        ctx.fillStyle = "#ff0000";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.lineTo(canvas.width - 60 + 40 * Math.cos(slope.a + Math.PI), canvas.height - 60 + 40 * Math.sin(slope.a + Math.PI));
        ctx.lineTo(canvas.width - 60 + 40 * Math.cos(slope.a + Math.PI / 6), canvas.height - 60 + 40 * Math.sin(slope.a + Math.PI / 6));
        ctx.lineTo(canvas.width - 60 + 40 * Math.cos(slope.a - Math.PI / 6), canvas.height - 60 + 40 * Math.sin(slope.a - Math.PI / 6));
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "25px Droid Serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText((slope.s).toFixed(2), canvas.width - 60, canvas.height - 60);

        ctx.textAlign = "end";
        ctx.textBaseline = "bottom";
        ctx.font = "20px Droid Serif";
        ctx.fillText("Altitude: " + this.alt().toFixed(3), canvas.width - 20, canvas.height - 140);
        ctx.fillText("Biome: " + this.biome(), canvas.width - 20, canvas.height - 110);

    };
};

function calcShadow(x, y) { // Local shadow only
    var depth = map.landDepth;
    if (getBiome(x, y).terrain === 1) depth = map.oceanDepth;
    return Math.min(Math.max((getAlt(x, y + 0.5) - getAlt(x, y - 0.5)) * depth, -map.maxShadow), map.maxBright);
};

function lerp (min, max, t, mode) {
    if (mode === "CUBIC") {
        t = -2 * t * t * t + 3 * t * t;
    } else if (mode === "SINE") {
        t = (1 - Math.cos(t * Math.PI)) / 2;
    }
    return min + t * (max - min);
};

function colorMap (t) {
    var c = {r: 0, g: 0, b: 0};
    for (var a = 0; a < map.colorMap.length - 1; a++) {
        if (t >= map.colorMap[a].p && t < map.colorMap[a + 1].p) {
            c = {
                r: lerp(map.colorMap[a].r, map.colorMap[a + 1].r, (t - map.colorMap[a].p) / (map.colorMap[a + 1].p - map.colorMap[a].p), "CUBIC"),
                g: lerp(map.colorMap[a].g, map.colorMap[a + 1].g, (t - map.colorMap[a].p) / (map.colorMap[a + 1].p - map.colorMap[a].p), "CUBIC"),
                b: lerp(map.colorMap[a].b, map.colorMap[a + 1].b, (t - map.colorMap[a].p) / (map.colorMap[a + 1].p - map.colorMap[a].p), "CUBIC")
            };
        }
    }
    return "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";
};

function slopeS (x, y) {
    var sx = (getAlt(x + 0.5, y) - getAlt(x - 0.5, y)) * map.heightScale;
    var sy = (getAlt(x, y + 0.5) - getAlt(x, y - 0.5)) * map.heightScale;
    return {s: Math.sqrt(sx * sx + sy * sy), a: Math.atan2(sy, sx)};
};

function newSeed() {
    noise.seed(Math.random());
    seed = [];
    forestSeed = [];
    textureSeed = (2 * Math.random() - 1) * 65536;
    mtnSeed = (2 * Math.random() - 1) * 65536;
    for (var a = 0; a < reps; a++) {
        seed[a] = (2 * Math.random() - 1) * 65536;
        forestSeed[a] = (2 * Math.random() - 1) * 65536;
    }
};





/*
var biomes = {
    deep_ocean: "#202f74",
    ocean: "#40539b",
    shallow_ocean: "#007ca1",
    sand_beach: "#e4cf78",
    plains: "#466443",
    hills: "#8e9963",
    mountains: "#696a67",
    peaks: "#dfddca",
    forest: "#2f553b",
    cliff: "#696a67", // "#606754", "#726c79"

    cliff_beach: "#df9f2f",
    snow_beach: "#dfdfff",
    snow_plains: "#ffffff",
    snow_forest: "#0f7f1f",
    desert: "#dfc74f",
    swamp: "#1f5f1f"
};
*/

function biomeColor(x, y) {
    var alt = getAlt(x, y);
    var forest = 0;
    var r = 0, g = 0, b = 0;
    for (var a = 0; a < reps; a++) {
        forest += noise.perlin3(map.biomeScale * Math.pow(2, a + 1) * x, forestSeed[a], map.biomeScale * Math.pow(2, a + 1) * y) / Math.pow(map.scalar, a) / -(1 + map.scalar / (1 - map.scalar));
    }

    if (forest <= -map.biomeBlend) {
        forest = 0;
    } else if (forest >= map.biomeBlend){
        forest = 1;
    } else {
        forest = -0.25 * Math.pow(forest / map.biomeBlend, 3) + 0.75 * forest / map.biomeBlend + 0.5;
    }

    if (alt < 0) { // ocean
        r = 0;
        g = Math.max(0, (alt + 0.2) * 5 * 159);
        b = Math.max(95, (alt + 0.4) * 2.5 * 223);
    } else if (alt < 0.005) { // sand
        var l = (Math.random() - 0.5) * 2 * 15;
        r = 228 + l;
        g = 207 + l;
        b = 120 + l;
    } else if (alt < 0.0075) { // sand - grass - forest
        var t = (alt - 0.005) / 0.0025;
        var s = pushToEdges(t * 0.5 + Math.random() * 0.5);
        var l = (Math.random() - 0.5) * 2 * 10;
        r = 228 + s * -158 + l;
        g = 207 + s * -107 + l;
        b = 120 + s * -53 + l;
    } else if (alt < 0.25) { // grass - forest
        var t = (alt - 0.0075) / 0.2425;
        var s = (t * 0.9 + Math.random() * 0.1);
        var l = (Math.random() - 0.5) * 2 * 10;
        r = 50 + s * 92 + l;
        g = 100 + s * 53 + l;
        b = 57 + s * 42 + l;
    } else if (alt < 0.275) { // grass - forest - mountain
        var t = (alt - 0.25) / 0.025;
        var s = pushToEdges(t * 0.75 + Math.random() * 0.25);
        var l = (Math.random() - 0.5) * 2 * 9;
        r = 142 + s * -37 + l;
        g = 153 + s * -47 + l;
        b = 99 + s * 4 + l;
    } else if (alt < 0.325) { // mountain
        var l = (Math.random() - 0.5) * 2 * 8;
        r = 105 + l;
        g = 106 + l;
        b = 103 + l;
    } else if (alt < 1) { // mountain - snow
        var t;
        if (alt < 0.3375) t = -128000*alt*alt*alt + 129600*alt*alt - 43680*alt + 4901;
        else t = Math.atan((60 * alt - 20.25) * Math.PI) / Math.PI + 0.5;
        var s = pushToEdges(t * 0.6 + Math.random() * 0.4);
        var l = (Math.random() - 0.5) * 8;
        r = 105 + s * 118 + l;
        g = 106 + s * 115 + l;
        b = 103 + s * 100 + l;
    }

    var modifier = 0;
    if (alt > 0.325) modifier = 0.5;
    if (slopeS(x, y).s > 1.6 - modifier + (Math.random() - 0.5) * 0.3 && alt > 0 && Math.random() < 0.95) {
        var l = (Math.random() - 0.5) * 2;
        r = 105 + l * 12;
        g = 106 + l * 12;
        b = 103 + l * 12;
    }

    r = Math.round(Math.min(Math.max(r, 0), 255)).toString(16);
    g = Math.round(Math.min(Math.max(g, 0), 255)).toString(16);
    b = Math.round(Math.min(Math.max(b, 0), 255)).toString(16);
    while (r.length < 2) r = "0" + r;
    while (g.length < 2) g = "0" + g;
    while (b.length < 2) b = "0" + b;

    return "#" + r + g + b;
};

var map = {
    data: [],
    size: {
        x: 1000,
        y: 1000
    },
    offsetFromSeed: {x: 0, y: 0},
    scale: 0.0005,
    heightScale: 300,
    scalar: 1.75,
    colorMap: [
        {p: -1, r: 0, g: 47, b: 239},
        {p: -0.05, r: 0, g: 47, b: 239},
        {p: 0, r: 223, g: 223, b: 15},
        {p: 0.05, r: 77, g: 223, b: 90},
        {p: 0.3, r: 63, g: 191, b: 71},
        {p: 0.4, r: 170, g: 170, b: 170},
        {p: 0.45, r: 255, g: 255, b: 255},
        {p: 1, r: 255, g: 255, b: 255}
    ],
    biomeScale: 0.0025,
    biomeBlend: 0.05,
    maxShadow: 0.5,
    maxBright: 0.25,
    landDepth: 150,
    oceanDepth: 0,
    colorVarianceMap: {
        scale: 0.4,
        depth: 0.15
    }
};

var player = new Player(map.size.x / 2, map.size.y / 2, 0.75, 30, 0.1);


var reps = 10;
var seed, treeSeed, textureSeed, mtnSeed;
newSeed();

function getAlt (x, y) {
    var alt = 0;
    for (var a = 0; a < reps; a++) {
        alt += noise.perlin3(map.scale * Math.pow(map.scalar, a + 1) * x, seed[a], map.scale * Math.pow(map.scalar, a + 1) * y) / Math.pow(map.scalar, a) * (map.scalar - 1) / map.scalar;
        if (a + 1 > 0.002 / (map.scale * map.scalar)) {
            var strength;
            if (alt <= 0) strength = 0;
            else if (alt < 0.5) strength = (-16 * alt + 12) * alt * alt;
            else strength = 1;
            alt += 2.5 * strength * noise.perlin3(map.scale * Math.pow(map.scalar, a + 1) * x, map.scale * Math.pow(map.scalar, a + 1) * y, mtnSeed) / Math.pow(map.scalar, a) * (map.scalar - 1) / map.scalar;
        }
    }
    return alt;
};

function getBiome (x, y) {
    var alt = getAlt(x, y);
    var forest = 0;
    for (var a = 0; a < reps; a++) {
        forest += noise.perlin3(map.biomeScale * Math.pow(2, a + 1) * x, forestSeed[a], map.biomeScale * Math.pow(2, a + 1) * y) / Math.pow(map.scalar, a) / -(1 + map.scalar / (1 - map.scalar));
    }

    if (forest <= -map.biomeBlend) {
        forest = 0;
    } else if (forest >= map.biomeBlend){
        forest = 1;
    } else {
        forest = -0.25 * Math.pow(forest / map.biomeBlend, 3) + 0.75 * forest / map.biomeBlend + 0.5;
    }

    var biome;

         if (alt < -0.25 )                               biome = 0;
    else if (alt < -0.08 )                               biome = 1;
    else if (alt < 0     )                               biome = 2;
    else if (alt < 0.007 )                               biome = 3;
    else if (alt < 0.26  && forest > Math.random())      biome = 5;
    else if (alt < 0.16  )                               biome = 4;
    else if (alt < 0.26  )                               biome = 6;
    else if (alt < 0.33  )                               biome = 7;
    else if (alt < 1     )                               biome = 8;

    var terrainType;

         if (alt < 0)               terrainType = 1;
    else if (slopeS(x, y).s > 1.6)  terrainType = 2;
    else if (alt < 0.35)            terrainType = 0;
    else if (alt < 1)               terrainType = 3;

    if (terrainType === 2 && alt > 0) biome = "cliff";
    if (biome === "forest") terrainType = "trees";

    return {alt: alt, biome: biome, terrain: terrainType}
};

while (getAlt(player.x, player.y) < 0) {newSeed();}

/*              Can't figure out how to implement
function drawLoadingScreen(progress, end, message) {
    progress = progress || 1;
    end = end || 1;
    message = message || "Loading...";
    ctx.fillStyle = "#dfdfdf";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "bfbfbf";
    ctx.fillRect(canvas.width / 2 - 405, canvas.height / 2 - 30, 810, 60);
    ctx.fillStyle = "2f2f2f";
    ctx.fillRect(canvas.width / 2 - 400, canvas.height / 2 - 25, 800, 50);
    ctx.fillStyle = "df0000";
    ctx.fillRect(canvas.width / 2 - 400, canvas.height / 2 - 25, 800 * progress / end, 50);

    ctx.fillStyle = "2f2f2f";
    ctx.font = "30px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(progress + " / " + end, canvas.width / 2, canvas.height / 2 + 50);
    ctx.textBaseline = "bottom";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 50);

};
*/

function generateMap() {
    for (var x = 0; x < map.size.x; x++) {
        map.data[x] = [];
        for (var y = 0; y < map.size.y; y++) {
            var point = getBiome(x, y);
            var originalColor = biomeColor(x, y);
            var shadedColor = colorValue(originalColor, calcShadow(x, y));
            var modifier = 1; if (point.terrain === 1) modifier = 0.1;
            var variedColor = colorValue(shadedColor, noise.perlin3(x * map.colorVarianceMap.scale, y * map.colorVarianceMap.scale, textureSeed) * map.colorVarianceMap.depth * modifier);
            map.data[x][y] = {
                alt: point.alt,
                biome: point.biome,
                terrain: point.terrain,
                simpleColor: shadedColor,
                color: variedColor
            };
        }
        //drawLoadingScreen(loadProgress, loadEnd, "Loading World...");
    }
};

generateMap();
player.drawMapView();

/*
var count = 0;
var total = 0;
for (var x = 0; x < map.size.x; x++) {
    for (var y = 0; y < map.size.y; y++) {                  Average slope calculator
        total += slopeS(x, y).s;
        count++;
    }
}
console.log(Math.tan(total / count) / Math.PI * 180);
*/


function draw() {
    requestAnimationFrame(draw);

    if (keys[83] && keys[87] === false) player.movRequest.y++;
    if (keys[87] && keys[83] === false) player.movRequest.y--;
    if (keys[68] && keys[65] === false) player.movRequest.x++;
    if (keys[65] && keys[68] === false) player.movRequest.x--;
    player.move();
    
    if (keys[188] && keys[190] === false) player.speed /= 1.1;
    if (keys[190] && keys[188] === false) player.speed *= 1.1;

    if (player.view === 0) {
        player.drawView();
        player.draw();
        player.drawHUD();
    }

};
draw();










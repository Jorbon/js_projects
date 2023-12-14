var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth * 4;
canvas.height = window.innerHeight * 4;
var ctx = canvas.getContext("2d");

var mouse = {x: undefined, y: undefined, xb: undefined, yb: undefined};

window.onkeydown = function(e) {
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
    }
};

window.addEventListener("mousemove", 
	function(event) {
		mouse.x = event.x;
        mouse.y = event.y;
        mouse.xb = Math.floor((mouse.x * zoom - xoff) / res);
        mouse.yb = Math.floor((mouse.y * zoom - yoff) / res);
	}
);

window.addEventListener("keydown", 
	function(event) {
        if (mouse.xb >= 0 && mouse.xb < map.x && mouse.yb >= 0 && mouse.yb < map.y && dedyet === false) {
            switch (event.key) {
                case " ":
                    if (map[mouse.xb][mouse.yb].vis === false && map[mouse.xb][mouse.yb].f === false) {
                        if (firstClick) {
                            firstClick = false;
                            for (var a = mouse.xb - 1; a < mouse.xb + 2; a++) {
                                for (var b = mouse.yb - 1; b < mouse.yb + 2; b++) {
                                    map[a][b].vis = true;
                                    var counter = 0;
                                    if (map[a][b].id === -1) {
                                        map[a][b].id = 0;
                                        counter++;
                                    }
                                    for (var n = 0; n < counter; n=n) {
                                        var x = Math.floor(Math.random() * map.x);
                                        var y = Math.floor(Math.random() * map.y);
                                        if (map[x][y].id !== -1) {
                                            map[x][y].id = -1;
                                            n++;
                                        }
                                    }
                                }
                            }
                            for (var a = 0; a < map.x; a++) {
                                for (var b = 0; b < map.y; b++) {
                                    if (map[a][b].id !== -1) {
                                        map[a][b].id = 0;
                                        for (var a1 = a - 1; a1 < a + 2; a1++) {
                                            for (var b1 = b - 1; b1 < b + 2; b1++) {
                                                if (map[a1][b1].id === -1) map[a][b].id++;
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            if (map[mouse.xb][mouse.yb].id === -1) {
                                ded();
                                break;
                            } else {
                                map[mouse.xb][mouse.yb].vis = true;
                            }
                        }
                        clean();
                    }
                    break;
                case "f":
                    if (map[mouse.xb][mouse.yb].vis === false) {
                        if (map[mouse.xb][mouse.yb].f) {
                            map[mouse.xb][mouse.yb].f = false;
                        } else {
                            map[mouse.xb][mouse.yb].f = true;
                        }
                        drawBoard(true);
                    }
                    break;
            }
        }
	}
);

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

function drawBoard(drawFlags) {
    if (dedyet === false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (drawFlags) flags = 0;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = res * 0.8 + "px Courier New";
        for (var a = 0; a < map.x; a++) {
            for (var b = 0; b < map.y; b++) {
                if (map[a][b].vis) {
                    if ((a + b) % 2) ctx.fillStyle = "#efefef";
                    else ctx.fillStyle = "#cfcfcf";
                    ctx.fillRect(a * res + xoff, b * res + yoff, res, res);
                    ctx.fillStyle = "#1f1f1f";
                    if (map[a][b].id > 0) ctx.fillText(map[a][b].id, (a + 0.5) * res + xoff, (b + 0.5) * res + yoff);
                } else {
                    if ((a + b) % 2) ctx.fillStyle = colorValue(themeColor, 0.1);
                    else ctx.fillStyle = colorValue(themeColor, -0.1);
                    ctx.fillRect(a * res + xoff, b * res + yoff, res, res);
                    if (map[a][b].f && drawFlags) {
                        ctx.fillStyle = "#ef0f0f";
                        ctx.fillRect((a + 0.25) * res + xoff, (b + 0.5) * res + yoff, res * 0.075, res * 0.35);
                        ctx.beginPath();
                        ctx.moveTo((a + 0.25) * res + xoff, (b + 0.15) * res + yoff);
                        ctx.lineTo((a + 0.75) * res + xoff, (b + 0.4) * res + yoff);
                        ctx.lineTo((a + 0.25) * res + xoff, (b + 0.65) * res + yoff);
                        ctx.fill();
                        flags++;
                    }
                    if (map[a][b].id === -1 && drawFlags == false) {
                        ctx.fillStyle = "#1f1f1f";
                        ctx.beginPath();
                        ctx.arc((a + 0.5) * res + xoff, (b + 0.5) * res + yoff, res * 0.2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        }
        var x = 20 * zoom;
        var y = 20 * zoom;
        var scale = 50 * zoom;
        ctx.fillStyle = "#ef0f0f";
        ctx.fillRect(x, y + scale * 0.35, scale * 0.075, scale * 0.35);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + scale * 0.5, y + scale * 0.25);
        ctx.lineTo(x, y + scale * 0.5);
        ctx.fill();
        ctx.fillStyle = "#1f1f1f";
        ctx.font = 35 * zoom + "px Courier New";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(4320 - flags, 50 * zoom, 40 * zoom);
    }
};

function ded() {
    drawBoard(false);
    dedyet = true;
};

function reload(width, height, mines) {
    map.x = width;
    map.y = height;
    for (var a = -1; a < map.x + 1; a++) {
        map[a] = [];
        for (var b = -1; b < map.y + 1; b++) {
            map[a][b] = {id: 0, vis: false, f: false};
        }
    }
    for (var a = 0; a < mines; a=a) {
        var x = Math.floor(Math.random() * map.x);
        var y = Math.floor(Math.random() * map.y);
        if (map[x][y].id !== -1) {
            map[x][y].id = -1;
            a++;
        }
    }
};

function clean() {
    var cleaned = false;
    while (cleaned === false) {
        cleaned = true;
        for (var a = 0; a < map.x; a++) {
            for (var b = 0; b < map.y; b++) {
                if (map[a][b].id === 0 && map[a][b].vis) {
                    for (var a1 = a - 1; a1 < a + 2; a1++) {
                        for (var b1 = b - 1; b1 < b + 2; b1++) {
                            if (map[a1][b1].vis === false) {
                                map[a1][b1].vis = true;
                                cleaned = false;
                            }
                        }
                    }
                }
            }
        }
    }
    for (var a = 0; a < map.x; a++) {
        for (var b = 0; b < map.y; b++) {
            if (map[a][b].id !== -1) {
                map[a][b].id = 0;
                for (var a1 = a - 1; a1 < a + 2; a1++) {
                    for (var b1 = b - 1; b1 < b + 2; b1++) {
                        if (map[a1][b1].id === -1) map[a][b].id++;
                    }
                }
            }
        }
    }
    drawBoard(true);
};


var zoom = 4;
canvas.width = window.innerWidth * zoom;
canvas.height = window.innerHeight * zoom;

var themeColor = "#6ab6e2";
var dedyet = false;
var map = [];
var res = Math.min(canvas.width, canvas.height) / 144;
var firstClick = true;
var flags = 0;
reload(144, 144, 144 * 144 / 4.8);
var xoff = (canvas.width - map.x * res) / 2;
var yoff = (canvas.height - map.y * res) / 2;
drawBoard();





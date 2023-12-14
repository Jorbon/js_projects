var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

window.addEventListener("keydown", 
    function(event) {
        if (m.a === 0) {
            if (event.key === "w") {
                m.r += 1;
            } else if (event.key === "s") {
                m.r += -1;
            } else if (event.key === "d") {
                m.c += 1;
            } else if (event.key === "a") {
                m.c += -1;
            } else if (event.key === "q") {
                m.a = -3;
            } else if (event.key === "e") {
                m.a = 3;
            }
        }
    }
);

var hexRows = 11;
var hexCollumns = 7;
var hexScale = 75;
var hexes = [0];
var found = false;
var fall = false;
var colors = 5;
var score = 0;
var m = {
    r: 0,
    c: 0,
    a: 0,
    t: 0,
    buffer: 0,
    rC: 2/3,
    rO: -1/3,
    angle: 0
};
var offset = {
    x: 100 + (innerWidth - hexRows * hexScale) / 2,
    y: innerHeight - (innerHeight - hexCollumns * hexScale * 0.866025404) / 2
};

function fillHex (a, b, shade) {
    var thisColor = {r: 0, g: 0, b: 0};
    if (hexes[a][b].c === 0) {
        thisColor.r = 255;
    } else if (hexes[a][b].c === 1) {
        thisColor.b = 255;
    } else if (hexes[a][b].c === 2) {
        thisColor.g = 255;
    } else if (hexes[a][b].c === 3) {
        thisColor.r = 255;
        thisColor.g = 255;
    } else if (hexes[a][b].c === 4) {
        thisColor.r = 255;
        thisColor.b = 255;
    } else if (hexes[a][b].c === 5) {
        thisColor.g = 255;
        thisColor.b = 255;
    } else if (hexes[a][b].c === 6) {
        thisColor.g = 127;
    }
    c.fillStyle = "rgba(" + thisColor.r * shade + ", " + thisColor.g * shade + ", " + thisColor.b * shade + ", " + (1 - hexes[a][b].e) + ")";
};

function drawHex (x, y, size) {
    c.beginPath();
    c.moveTo(x - size, y);
    c.lineTo(x - size / 2, y - size * 0.866025404);
    c.lineTo(x + size / 2, y - size * 0.866025404);
    c.lineTo(x + size, y);
    c.lineTo(x + size / 2, y + size * 0.866025404);
    c.lineTo(x - size / 2, y + size * 0.866025404);
    c.fill();
};

function drawM () {
    if (Math.round(m.r / 2) === m.r / 2) {
        m.rC = 2/3;
        m.rO = -1/3;
    } else {
        m.rC = 1/3;
        m.rO = 1/3;
    }
    if (Math.round(m.c / 2) !== m.c / 2) {
        m.rC = 1-m.rC;
        m.rO = -m.rO;
    }

    c.beginPath();
    c.lineWidth = 6;
    c.lineJoin = "round";
    c.lineCap = "round";
    c.strokeStyle = "#000000";

    c.moveTo(offset.x + (m.c + m.rC + m.rO) * 0.866025404 * hexScale, offset.y - (m.r + 1) * hexScale / 2);
    c.lineTo(offset.x + (m.c + m.rC + m.rO * 3) * 0.866025404 * hexScale, offset.y - (m.r + 1) * hexScale / 2);
    c.lineTo(offset.x + (m.c + m.rC + m.rO * 4) * 0.866025404 * hexScale, offset.y - m.r * hexScale / 2);
    c.lineTo(offset.x + (m.c + m.rC + m.rO * 3) * 0.866025404 * hexScale, offset.y - (m.r - 1) * hexScale / 2);
    c.lineTo(offset.x + (m.c + m.rC + m.rO) * 0.866025404 * hexScale, offset.y - (m.r - 1) * hexScale / 2);
    c.lineTo(offset.x + (m.c + m.rC) * 0.866025404 * hexScale, offset.y - (m.r - 2) * hexScale / 2);
    c.lineTo(offset.x + (m.c + m.rC - m.rO * 2) * 0.866025404 * hexScale, offset.y - (m.r - 2) * hexScale / 2);
    c.lineTo(offset.x + (m.c + m.rC - m.rO * 3) * 0.866025404 * hexScale, offset.y - (m.r - 1) * hexScale / 2);
    c.lineTo(offset.x + (m.c + m.rC - m.rO * 2) * 0.866025404 * hexScale, offset.y - m.r * hexScale / 2);
    c.lineTo(offset.x + (m.c + m.rC - m.rO * 3) * 0.866025404 * hexScale, offset.y - (m.r + 1) * hexScale / 2);
    c.lineTo(offset.x + (m.c + m.rC - m.rO * 2) * 0.866025404 * hexScale, offset.y - (m.r + 2) * hexScale / 2);
    c.lineTo(offset.x + (m.c + m.rC) * 0.866025404 * hexScale, offset.y - (m.r + 2) * hexScale / 2);
    c.lineTo(offset.x + (m.c + m.rC + m.rO) * 0.866025404 * hexScale, offset.y - (m.r + 1) * hexScale / 2);

    c.lineTo(offset.x + (m.c + m.rC) * 0.866025404 * hexScale, offset.y - m.r * hexScale / 2);
    c.lineTo(offset.x + (m.c + m.rC + m.rO) * 0.866025404 * hexScale, offset.y - (m.r - 1) * hexScale / 2);
    c.moveTo(offset.x + (m.c + m.rC) * 0.866025404 * hexScale, offset.y - m.r * hexScale / 2);
    c.lineTo(offset.x + (m.c + m.rC - m.rO * 2) * 0.866025404 * hexScale, offset.y - m.r * hexScale / 2);

    c.stroke();
};

function detectTouch () {
    for (var a = 0; a < hexes.length; a++) {
        for (var b = 0; b < hexes[a].length; b++) {
            // up & down
            if (b < hexes[a].length - 1) {
                if (hexes[a][b].c === hexes[a][b+1].c && hexes[a][b].e === 0 && hexes[a][b+1].e === 0) {
                    hexes[a][b].u = true;
                    hexes[a][b+1].d = true;
                } else {
                    hexes[a][b].u = false;
                    hexes[a][b+1].d = false;
                }
            }
            // sides
            if (a < hexes.length - 1) {
                if (a / 2 % 1 === 0) {
                    // even collumns

                    if (hexes[a][b].c === hexes[a+1][b+1].c && hexes[a][b].e === 0 && hexes[a+1][b+1].e === 0) {
                        hexes[a][b].ru = true;
                        hexes[a+1][b+1].ld = true;
                    } else {
                        hexes[a][b].ru = false;
                        hexes[a+1][b+1].ld = false;
                    }
                    if (hexes[a][b].c === hexes[a+1][b].c && hexes[a][b].e === 0 && hexes[a+1][b].e === 0) {
                        hexes[a][b].rd = true;
                        hexes[a+1][b].lu = true;
                    } else {
                        hexes[a][b].rd = false;
                        hexes[a+1][b].lu = false;
                    }
                } else {
                    // odd collumns
                    if (b < hexes[a].length - 1) {
                        if (hexes[a][b].c === hexes[a+1][b].c && hexes[a][b].e === 0 && hexes[a+1][b].e === 0) {
                            hexes[a][b].ru = true;
                            hexes[a+1][b].ld = true;
                        } else {
                            hexes[a][b].ru = false;
                            hexes[a+1][b].ld = false;
                        }
                    }
                    if (b > 0) {
                        if (hexes[a][b].c === hexes[a+1][b-1].c && hexes[a][b].e === 0 && hexes[a+1][b-1].e === 0) {
                            hexes[a][b].rd = true;
                            hexes[a+1][b-1].lu = true;
                        } else {
                            hexes[a][b].rd = false;
                            hexes[a+1][b-1].lu = false;
                        }
                    }
                }
            }
        }
    }
};

function detectCluster () {
    found = true;
    for (var a = 0; a < hexes.length; a++) {
        for (var b = 0; b < hexes[a].length; b++) {
            if (hexes[a][b].e > 0 && hexes[a][b].e < 1) {
                hexes[a][b].e += 0.02;
                found = false;
                m.a = 0;
            }
            if (hexes[a][b].e >= 1) {
                hexes[a][b].c = -1;
            }
            if (((hexes[a][b].u && hexes[a][b].ru) || (hexes[a][b].ru && hexes[a][b].rd) || (hexes[a][b].rd && hexes[a][b].d) || (hexes[a][b].d && hexes[a][b].ld) || (hexes[a][b].ld && hexes[a][b].lu) || (hexes[a][b].lu && hexes[a][b].u)) && hexes[a][b].e === 0) {
                hexes[a][b].e = 0.02;
                found = false;
                m.a = 0;
            }
        }
    }
};

function gravHexes () {
    fall = false;
    for (var a = 0; a < hexes.length; a++) {
        for (var b = 1; b < hexes[a].length; b++) {
            if (hexes[a][b].e === 0 && hexes[a][b-1].e >= 1) {
                hexes[a][b-1].c = hexes[a][b].c;
                hexes[a][b-1].e = 0;
                hexes[a][b].e = 1;
                hexes[a][b].c = -1;
                fall = true;
            }
        }
    }
};

function replaceHexes () {
    for (var a = 0; a < hexes.length; a++) {
        if (hexes[a][hexes[a].length - 1].e >= 1) {
            hexes[a][hexes[a].length - 1] = {
                c: Math.floor(Math.random() * colors),
                e: 0
            };
            score++;
        }
    }
};

// hexes array setup
while (found === false) {
    for (var a = 0; a < hexRows; a++) {
        hexes[a] = [0];
        for (var b = 0; b < Math.floor(hexCollumns) + (a / 2 % 1) * hexCollumns % 1 * 4; b++) {
            hexes[a][b] = {
                c: Math.floor(Math.random() * colors),
                e: 0
            };
        }
    }
    detectTouch();
    detectCluster();
}


draw = function() {
    requestAnimationFrame(draw);

    if (fall === false) {
        detectTouch();
        detectCluster();
    }
    gravHexes();
    replaceHexes();
    
    if (m.r < 0) {m.r = 0;}
    if (m.r > 14) {m.r = 14;}
    if (m.c < 0) {m.c = 0;}
    if (m.c > 8) {m.c = 8;}
    
    if (found && fall === false && m.t === 15 && m.a !== 0) {
        m.t = 0;
        if (m.a > 0) {
            if (Math.round(m.r / 2) === m.r / 2) {
                if (Math.round(m.c / 2) === m.c / 2) {
                    m.buffer = hexes[m.c][m.r/2].c;
                    hexes[m.c][m.r/2].c = hexes[m.c+1][m.r/2].c;
                    hexes[m.c+1][m.r/2].c = hexes[m.c+1][m.r/2+1].c;
                    hexes[m.c+1][m.r/2+1].c = m.buffer;
                } else {
                    m.buffer = hexes[m.c][m.r/2].c;
                    hexes[m.c][m.r/2].c = hexes[m.c+1][m.r/2].c;
                    hexes[m.c+1][m.r/2].c = hexes[m.c][m.r/2+1].c;
                    hexes[m.c][m.r/2+1].c = m.buffer;
                }
            } else {
                if (Math.round(m.c / 2) === m.c / 2) {
                    m.buffer = hexes[m.c][m.r/2-0.5].c;
                    hexes[m.c][m.r/2-0.5].c = hexes[m.c+1][m.r/2+0.5].c;
                    hexes[m.c+1][m.r/2+0.5].c = hexes[m.c][m.r/2+0.5].c;
                    hexes[m.c][m.r/2+0.5].c = m.buffer;
                } else {
                    m.buffer = hexes[m.c+1][m.r/2-0.5].c;
                    hexes[m.c+1][m.r/2-0.5].c = hexes[m.c+1][m.r/2+0.5].c;
                    hexes[m.c+1][m.r/2+0.5].c = hexes[m.c][m.r/2+0.5].c;
                    hexes[m.c][m.r/2+0.5].c = m.buffer;
                }
            }
            m.a += -1;
        } else {
            if (Math.round(m.r / 2) === m.r / 2) {
                if (Math.round(m.c / 2) === m.c / 2) {
                    m.buffer = hexes[m.c][m.r/2].c;
                    hexes[m.c][m.r/2].c = hexes[m.c+1][m.r/2+1].c;
                    hexes[m.c+1][m.r/2+1].c = hexes[m.c+1][m.r/2].c;
                    hexes[m.c+1][m.r/2].c = m.buffer;
                } else {
                    m.buffer = hexes[m.c][m.r/2].c;
                    hexes[m.c][m.r/2].c = hexes[m.c][m.r/2+1].c;
                    hexes[m.c][m.r/2+1].c = hexes[m.c+1][m.r/2].c;
                    hexes[m.c+1][m.r/2].c = m.buffer;
                }
            } else {
                if (Math.round(m.c / 2) === m.c / 2) {
                    m.buffer = hexes[m.c][m.r/2-0.5].c;
                    hexes[m.c][m.r/2-0.5].c = hexes[m.c][m.r/2+0.5].c;
                    hexes[m.c][m.r/2+0.5].c = hexes[m.c+1][m.r/2+0.5].c;
                    hexes[m.c+1][m.r/2+0.5].c = m.buffer;
                } else {
                    m.buffer = hexes[m.c+1][m.r/2-0.5].c;
                    hexes[m.c+1][m.r/2-0.5].c = hexes[m.c][m.r/2+0.5].c;
                    hexes[m.c][m.r/2+0.5].c = hexes[m.c+1][m.r/2+0.5].c;
                    hexes[m.c+1][m.r/2+0.5].c = m.buffer;
                }
            }
            m.a += 1;
        }
    }
    
    if (m.t < 15) {
        m.t++;
    }
    
    // drawing
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, innerWidth, innerHeight);

    drawM();
    for (a = 0; a < hexes.length; a++) {
        for (b = 0; b < hexes[a].length; b++) {
            fillHex(a, b, 0.65);
            drawHex(offset.x + a * 0.866025404 * hexScale, offset.y - (b - a / 2 % 1) * hexScale, hexScale / 2 * (hexes[a][b].e / 2 + 1));
            fillHex(a, b, 1);
            drawHex(offset.x + a * 0.866025404 * hexScale, offset.y - (b - a / 2 % 1) * hexScale, hexScale / 2.75 * (hexes[a][b].e / 2 + 1));
        }
    }
    
    c.fillStyle = "#000000";
    c.font = "25px Arial";
    c.fillText("Score: " + score, 10, innerHeight - 13);
    
    
};

draw();




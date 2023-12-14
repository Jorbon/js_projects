class Draggable {
	constructor(drawFunction, id, data, x, y, width, height, left=0, right=1, top=0, bottom=1) {
		this.rpos = new V();
		this.x = x, this.y = y;
		this.draw = drawFunction;
		this.onClick = function() {};
		this.enabled = true;
		this.show = true;
		if (left == "point") this.bounds = { left: this.rpos.x, right: this.rpos.x, top: this.rpos.y, bottom: this.rpos.y };
		else this.bounds = { left, right, top, bottom };
		this.dragging = false;
		this.defaultPos = new V(this.rpos);
		this.width = width;
		this.height = height;
		this.shiftRightReturn = true;
		this.dragCenter = true;
		this.dragPos = new V();
		this.id = id;
		this.data = data;
	};
	get pos() { return new V(this.x, this.y); };
	set pos(v) { this.x = v.x, this.y = v.y; };
	get x() { return this.rpos.x * canvas.width; };
	set x(n) { this.rpos.x = n / canvas.width; }
	get y() { return this.rpos.y * canvas.height; };
	set y(n) { this.rpos.y = n / canvas.height; };
	return() {
		this.rpos = new V(this.defaultPos);
	};
	goInBounds() {
		this.rpos.x = bind(this.rpos.x, this.bounds.left, this.bounds.right);
		this.rpos.y = bind(this.rpos.y, this.bounds.top, this.bounds.bottom);
	};
	pickupCheck(mouseX=mouse.x, mouseY=mouse.y) {
		if (this.enabled && this.overCheck(mouseX, mouseY)) {
			this.dragging = true;
			ui.dragObject = this;
			if (this.dragCenter) {
				this.dragPos.c = [0.5, 0.5];
				this.x = mouseX;
				this.y = mouseY;
			} else {
				this.dragPos.x = (mouseX - this.x)/this.width + 0.5;
				this.dragPos.y = (mouseY - this.y)/this.height + 0.5;
			}
			return true;
		}
		return false;
	};
	overCheck(mouseX=mouse.x, mouseY=mouse.y) {
		return mouseX >= this.x - this.width/2 && mouseX <= this.x + this.width/2 && mouseY >= this.y - this.height/2 && mouseY <= this.y + this.height/2;
	}
};







// Set default theme colors
const baseColor = "#e2bc8a";
const lightColor = "#faf7ef";
const lineColor = "#2f2f2f";
const textures = {
	background: new Image(),
	resources: [ new Image(), new Image(), new Image(), new Image(), new Image() ],
	resource_cards: [ new Image(), new Image(), new Image(), new Image(), new Image() ],
	card_back: new Image(),
	development_cards: {
		back: new Image(),
		chapel: new Image(),
		governors_house: new Image(),
		library: new Image(),
		market: new Image(),
		university_of_catan: new Image(),
		monopoly: new Image(),
		road_building: new Image(),
		year_of_plenty: new Image(),
		soldier: new Image()
	},
	largest_army: new Image(),
	longest_road: new Image(),
	tiles: [ new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image() ],
	harbor: new Image()
};
function loadResources(folder="static/resources") {
	textures.background.src = folder + "/background.jpg";
	textures.tiles[0].src = folder + "/ocean.png";
	textures.tiles[1].src = folder + "/fields.png";
	textures.tiles[2].src = folder + "/pasture.png";
	textures.tiles[3].src = folder + "/forest.png";
	textures.tiles[4].src = folder + "/hills.png";
	textures.tiles[5].src = folder + "/mountains.png";
	textures.tiles[6].src = folder + "/desert.png";
	textures.tiles[7].src = folder + "/gold_field.png";
	textures.resources[0].src = folder + "/wheat.png";
	textures.resources[1].src = folder + "/sheep.png";
	textures.resources[2].src = folder + "/wood.png";
	textures.resources[3].src = folder + "/brick.png";
	textures.resources[4].src = folder + "/ore.png";
	textures.resource_cards[0].src = folder + "/wheat_card.png";
	textures.resource_cards[1].src = folder + "/sheep_card.png";
	textures.resource_cards[2].src = folder + "/wood_card.png";
	textures.resource_cards[3].src = folder + "/brick_card.png";
	textures.resource_cards[4].src = folder + "/ore_card.png";
	textures.card_back.src = folder + "/card_back.png";
	textures.largest_army.src = folder + "/largest_army.png";
	textures.longest_road.src = folder + "/longest_road.png";
	textures.harbor.src = folder + "/harbor.png";
	textures.development_cards.back.src = folder + "/development_card_back.png";
	textures.development_cards.soldier.src = folder + "/soldier.png";
	textures.development_cards.monopoly.src = folder + "/monopoly.png";
	textures.development_cards.road_building.src = folder + "/road_building.png";
	textures.development_cards.year_of_plenty.src = folder + "/year_of_plenty.png";
	textures.development_cards.chapel.src = folder + "/chapel.png";
	textures.development_cards.governors_house.src = folder + "/governors_house.png";
	textures.development_cards.library.src = folder + "/library.png";
	textures.development_cards.market.src = folder + "/market.png";
	textures.development_cards.university_of_catan.src = folder + "/university_of_catan.png";
};

let initDone = false;
let loadedTextureCount = 0;

iterateTree(textures, function(item) {
	item.onload = function() {
		loadedTextureCount++;
		if (loadedTextureCount >= 33 && initDone) {
			requestAnimationFrame(draw);
		}
	};
}, Image);

loadResources();

// color defaults, not currently in use anywhere
const resources = [
	{ name: "Wheat",	color: "#ebc13a"	},
	{ name: "Sheep",	color: "5cb333"		},
	{ name: "Wood",		color: "#038b39"	},
	{ name: "Brick",	color: "#c07742"	},
	{ name: "Ore",		color: "#4e7060"	}
];
const tiles = [
	{ name: "Ocean",		resource: "none",	color: "#00b8e2"	},
	{ name: "Fields",		resource: 0,		color: "#f0b813"	},
	{ name: "Pasture",		resource: 1,		color: "#49ab0c"	},
	{ name: "Forest",		resource: 2,		color: "#06713c"	},
	{ name: "Hills",		resource: 3,		color: "#af601e"	},
	{ name: "Mountains",	resource: 4,		color: "#5b7883"	},
	{ name: "Desert",		resource: "none",	color: "#bda128"	},
	{ name: "Gold Field",	resource: 5,		color: "#caaa4b"	}
];



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



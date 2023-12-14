

let board = {
	tiles: [], // 19
	corners: [], // 54
	edges: [], // 72
	harbors: [], // 9
	robberTile: 9
};
for (let i = 0; i < 19; i++) board.tiles[i] = {tile: 6, number: "none"};
for (let i = 0; i < 54; i++) board.corners[i] = "none";
for (let i = 0; i < 72; i++) board.edges[i] = "none";
for (let i = 0; i < 9; i++) board.harbors[i] = "any";
let players = ["none", "none", "none", "none"];

let ui = {
	index: 0, // receive
	dice: [random.int(1, 7), random.int(1, 7)], // receive
	extendedEventlog: 0,
	mouseOverEventlog: false,
	scrollFlag: false,
	rolling: false, // send on, receive off
	rollingCooldown: 0,
	developmentCardsInStack: 25, // receive
	dragObject: "none",
	menu: "board",
	harborTrade: {
		selected: "none",
		rates: [4, 4, 4, 4, 4] // receive
	},
	steal: { // receive
		playerOptions: []
	},
	setup: { // receive
		chooser: 0,
		score: 0
	},
	halfAmount: 0, // receive
	menuCards: {
		cards: [
			new Draggable(function() { drawCard(this.data.type, this.x, this.y, this.width, 0, true); }, "new resource card", { type: 0 }, 0, 0, 0, 0),
			new Draggable(function() { drawCard(this.data.type, this.x, this.y, this.width, 0, true); }, "new resource card", { type: 1 }, 0, 0, 0, 0),
			new Draggable(function() { drawCard(this.data.type, this.x, this.y, this.width, 0, true); }, "new resource card", { type: 2 }, 0, 0, 0, 0),
			new Draggable(function() { drawCard(this.data.type, this.x, this.y, this.width, 0, true); }, "new resource card", { type: 3 }, 0, 0, 0, 0),
			new Draggable(function() { drawCard(this.data.type, this.x, this.y, this.width, 0, true); }, "new resource card", { type: 4 }, 0, 0, 0, 0)
		],
		enabled: false,
		x: 0.5,
		y: 0.5,
		width: 0.15,
		spacing: 0.125,
		show: false
	},
	freeRoads: 0, // receive
	accessibleEdges: [],
	accessibleCorners: [],
	gamePhase: 0, // receive
	turn: 0, // receive
	turnPhase: 1, // receive
	recentStarterSettlement: "none", // receive
	points: 0, // receive
	hand: [ new Draggable(function() {}, " ", { type: -1, location: 1, up: 0 }, 0, 0, 0, 0) ], // receive contents
	devhand: [ new Draggable(function() {}, " ", { type: -1, location: 1, up: 0 }, 0, 0, 0, 0) ], // receive contents
	oldHand: [],
	oldDevhand: [],
	handReversed: false,
	fullScreenCard: "none",
	cardRatio: 1.472,
	bigCardRatio: 4/3.25,
	justReleased: false,
	cardOverHandEnd: false,
	d: [
		new Draggable(function() { drawCard("development_card_back", this.x, this.y, this.width, PI, true); }, "new development card", {}, 0, canvas.height*0.075, 0, 0, "point")
	],
	robber: new Draggable(function() { drawRobber(this.x, this.y, tileRadius); }, "robber", {}, 0, 0, 0, 0),
	longestRoad: new Draggable(function() { drawBigCard("longest_road", this.x, this.y, this.width, 0, true); }, "longest road", { owner: "none" /* receive */ }, 0, 0, 0, 0, "point"),
	largestArmy: new Draggable(function() { drawBigCard("largest_army", this.x, this.y, this.width, 0, true); }, "largest army", { owner: "none" /* receive */ }, 0, 0, 0, 0, "point"),
	mouseOverMenu: false,
	gameName: "", // receive
	yopCard1: "none", // send
	playedCardIndex: 0
};
ui.d[0].shiftRightReturn = false;
ui.d[0].dragCenter = false;

ui.hand[0].enabled = false;
ui.hand[0].show = false;
ui.hand[0].shiftRightReturn = false;
ui.hand[0].dragCenter = false;
ui.devhand[0].enabled = false;
ui.devhand[0].show = false;
ui.devhand[0].shiftRightReturn = false;
ui.devhand[0].dragCenter = false;
ui.robber.enabled = false;
ui.robber.shiftRightReturn = false;
ui.d.unshift(ui.robber);
ui.longestRoad.enabled = false;
ui.longestRoad.show = false;
ui.largestArmy.enabled = false;
ui.largestArmy.show = false;












// for testing:

ui.gamePhase = 2;
ui.points = 12;
ui.turnPhase = 2;
ui.gameName = "secret tunnel";

eventlog.innerHTML = "<p>Test event #1</p><p>This all working well?</p><p>Hope you can see this in the history.</p><p>A thing happened!    alritbsserukjybtifausebpiflbjqheb</p><p>wacc</p><p>onno</p><p>Did you ever hear the tragedy of Darth Plagueis the wise? I thought not. It's not a story the Jedi would tell you. It's a Sith legend. Darth Plagueis was a dark lord of the Sith so powerful and so wise he could use the force to influence the midi-chlorians to create life. He had such a knowledge of the dark side that he could even keep the ones he cared about from dying.</p>";
setTimeout(function() {
	eventlog.scrollTop = 2**32;
}, 200);
for (let i = 0; i < 19; i++) board.tiles[i] = {tile: random.int(1, 8), number: random.int(2, 13)};
for (let i = 0; i < 54; i++) board.corners[i] = random.choose(["none", "none", "none", "none", "none", "none", 0, 1, 2, 3, random.choose([10, 11, 12, 13, 10.5, 11.5, 12.5, 13.5])]);
for (let i = 0; i < 72; i++) board.edges[i] = random.choose(["none", "none", "none", 0, 1, 2, 3]);
for (let i = 0; i < 9; i++) board.harbors[i] = random.int(5);

ui.index = 0;
ui.points = 12;


let temp = [3, 1, 0, 2, 3, 2, 0, 4, 2, 2, 2, 2];
for (let i = 0; i < temp.length; i++) {
	ui.hand.unshift(new Draggable(function() { drawCard(this.data.type, this.x, this.y, this.width, 0, true); }, "resource card", { type: temp[i], location: 1, up: 0 }, 0, 0, 0, 0));
	ui.hand[0].shiftRightReturn = false;
	ui.hand[0].dragCenter = false;
}

temp = ["soldier", "year_of_plenty", "market", "library", "governors_house", "chapel", "university_of_catan", "road_building", "monopoly"];
for (let i = 0; i < temp.length; i++) {
	ui.devhand.unshift(new Draggable(function() { drawCard(this.data.type, this.x, this.y, this.width, 0, true); }, "development card", { type: temp[i], location: 1, up: 0 }, 0, 0, 0, 0));
	ui.devhand[0].shiftRightReturn = false;
	ui.devhand[0].dragCenter = false;
}


players = [
	{ name: "Jorbon", cards: 8, developmentCards: 3, soldiers: 2, roads: 15, settlements: 5, cities: 4, color: "red", trade: { offer: [], request: [], accepted: "none" } },
	{ name: "another", cards: 4, developmentCards: 4, soldiers: 0, roads: 15, settlements: 5, cities: 4, color: "green", trade: { offer: [], request: [], accepted: "none" } },
	{ name: "someone else", cards: 5, developmentCards: 0, soldiers: 5, roads: 3, settlements: 8, cities: 1, color: "blue", trade: { offer: [], request: [], accepted: "none" } },
	{ name: "うるさい、ばあか　なんだ畔リルのメカdゆけ", cards: 21, developmentCards: 15, soldiers: 20, roads: 80, settlements: 19, cities: 15, color: "purple", trade: { offer: [], request: [], accepted: "none" } }
];
ui.largestArmy.data.owner = 2, ui.longestRoad.data.owner = 0;

// end testing block







let tileRadius = 1, boardCenter = new V();
let topBarHeight, nameBoxWidth, diceBoxWidth, eventBoxLeft, eventBoxWidth, costCardWidth, developmentCardStackWidth, developmentCardStackX, harborTradeButtonWidth, harborTradeButtonLeft, harborTradeButtonHeight, harborTradeButtonTop;

for (let i = 0; i < players[ui.index].roads; i++) {
	ui.d.unshift(new Draggable(function() { drawRoad(this.x, this.y, tileRadius, players[ui.index].color, 0); }, "road", "none", canvas.width*(0.925 - 0.04 * (i%3)), canvas.height*(0.3 + 0.035*floor(i/3) - 0.0175*(i%3==1)), 0, 0, 0, 0.95, 0.25, 0.7));
};
for (let i = 0; i < players[ui.index].settlements; i++) {
	ui.d.unshift(new Draggable(function() { drawSettlement(this.x, this.y, tileRadius, players[ui.index].color); }, "settlement", "none", canvas.width*(0.93 - 0.045*(i%3 + 0.5*(i >= 3))), canvas.height*(0.49 + 0.04*(i >= 3)), 0, 0, 0, 0.95, 0.25, 0.7));
};
for (let i = 0; i < players[ui.index].cities; i++) {
	ui.d.unshift(new Draggable(function() { drawCity(this.x, this.y, tileRadius, players[ui.index].color, this.data.flipped); }, "city", { flipped: false }, canvas.width*(0.935 - 0.0325*i), canvas.height*(0.59 + 0.04*(i%2)), 0, 0, 0, 0.95, 0.25, 0.7));
};










function addCardAnimated() {
	
};





function onBoardUpdate() {
	
	// scan for what locations are legal to build in

	ui.accessibleEdges = [];
	if (ui.gamePhase == 1 && typeof ui.recentStarterSettlement == "number") {
		for (let i of map.cornerTouchEdge[ui.recentStarterSettlement]) {
			if (board.corners[i] == "none") ui.accessibleEdges.push(i);
		}
	} else if (ui.gamePhase == 2) {
		for (let i in board.edges) {
			let connected = false;
			for (let j of map.edgeTouchCorner[i]) {
				for (let k of map.cornerTouchEdge[j]) {
					if (k != i && board.edges[k] == ui.index && (board.corners[j] == "none" || board.corners[j] == ui.index || floor(board.corners[j]) - 10 == ui.index)) connected = true;
				}
			}
			if (board.edges[i] == "none" && connected) ui.accessibleEdges.push(i);
		}
	}

	ui.accessibleCorners = [];
	for (let i in board.corners) {
		if (board.corners[i] != "none") continue;
		let connected = false, distanced = true;
		for (let j of map.cornerTouchEdge[i]) {
			if (board.edges[j] == ui.index) connected = true;
		}
		for (let j of map.cornerTouchCorner[i]) {
			if (board.corners[j] != "none") distanced = false;
		}
		if ((connected || ui.gamePhase == 1) && distanced) ui.accessibleCorners.push(i);
	}

};
onBoardUpdate();








function draw() {
	requestAnimationFrame(draw);

	// main loop

	// mouse processing, too computationally expensive to do on every mouse movement
	if (mouse.moved) {
		// move dragged object to mouse pointer
		if (ui.dragObject != "none") {
			ui.dragObject.x = mouse.x - (ui.dragObject.dragPos.x - 0.5)*ui.dragObject.width;
			ui.dragObject.y = mouse.y - (ui.dragObject.dragPos.y - 0.5)*ui.dragObject.height;
		}

		if (ui.menu == "board") {
			// see what board element the mouse is over
			mouse.selectedTile = "none";
			mouse.selectedCorner = "none";
			mouse.selectedEdge = "none";
			if (mouse.sub(boardCenter).abs() < tileRadius * 6) {
				for (let i in board.tiles) {
					if (mouse.sub(getTilePos(i)).abs() < tileRadius * 0.8) {
						mouse.selectedTile = i;
						break;
					}
				}
				for (let i in board.corners) {
					if (mouse.sub(getCornerPos(i)).abs() < tileRadius * 0.3) {
						mouse.selectedCorner = i;
						break;
					}
				}
				for (let i in board.edges) {
					if (mouse.sub(getEdgePos(i)[0]).abs() < tileRadius * 0.4) {
						mouse.selectedEdge = i;
						break;
					}
				}
			}
		}
	}

	ui.justReleased = false;
	// drop
	if ((!mouse.l || ui.menu != "board") && ui.dragObject != "none") {
		if (ui.dragObject.id == "resource card") {
			if (!mouse.l || (ui.menu != "board" && ui.menu != "trade" && ui.menu != "half")) {
				ui.dragObject.dragging = false;
				ui.dragObject.data.location = 1;
				ui.dragObject.data.up = 0;
				ui.oldHand = [];
				ui.cardOverHandEnd = false;
				for (let i of ui.hand) ui.oldHand.push(i);
				ui.dragObject = "none";
				ui.justReleased = true;
			}
		} else {
			if (ui.dragObject.id == "development card") {
				if (ui.turn == ui.index && ui.gamePhase == 2 && (ui.turnPhase == 1 || ui.turnPhase == 2)) {
					if (mouse.y <= canvas.height*0.8) {
						if (ui.dragObject.data.type == "soldier" || ui.dragObject.data.type == "road_building") {
							/* request to play development card */
							ui.playedCardIndex = ui.devhand.findIndex(item => item.dragging);
							console.log("play " + ui.dragObject.data.type + " card from devhand position " + ui.playedCardIndex);
						} else if (ui.dragObject.data.type == "monopoly") {
							ui.menu = "monopoly";
						} else if (ui.dragObject.data.type == "year_of_plenty") {
							ui.menu = "year of plenty";
						}
					}
				}
				ui.dragObject.data.location = 1;
				ui.dragObject.data.up = 0;
				ui.oldDevhand = [];
				ui.cardOverHandEnd = false;
				for (let i of ui.devhand) ui.oldDevhand.push(i);
			} else if (ui.dragObject.id == "new development card") {
				if (ui.gamePhase == 2 && ui.turn == ui.index && ui.turnPhase == 2) {
					if (ui.devhand.length <= 1 && mouse.x >= 0.75*canvas.width && mouse.y >= 0.8*canvas.height) {
						/* send development card buy request */
						console.log("buy development card");
					} else for (let card of ui.devhand) if (card.overCheck()) {
						/* send development card buy request */
						console.log("buy development card");
						break;
					}
				}
			} else if (ui.dragObject.id == "road") {
				if (ui.turn == ui.index && ((ui.gamePhase == 1 && ui.turnPhase == 2) || (ui.gamePhase == 2 && (ui.turnPhase == 2 || ui.turnPhase == 6)))) {
					for (let edge of ui.accessibleEdges) if (edge == mouse.selectedEdge) {
						/* request to build road */
						// I could also check the hand here to see if all the required cards are there, but nah, the server has to do it anyways. Same applies to the other 3 buildings.
						console.log("build road", edge);
						break;
					}
				}
			} else if (ui.dragObject.id == "settlement") {
				if (ui.turn == ui.index && ((ui.gamePhase == 1 && ui.turnPhase == 1) || (ui.gamePhase == 2 && ui.turnPhase == 2))) {
					for (let corner of ui.accessibleCorners) if (corner == mouse.selectedCorner) {
						/* request to build settlement */
						console.log("build settlement", corner);
						break;
					}
				}
			} else if (ui.dragObject.id == "city") {
				if (ui.turn == ui.index && ui.gamePhase == 2 && ui.turnPhase == 2) {
					console.log()
					if (board.corners[mouse.selectedCorner] == ui.index) {
						/* request to upgrade to city */
						console.log("build city", mouse.selectedCorner, ui.dragObject.data.flipped);
					}
				}
			}
			ui.dragObject.dragging = false;
			ui.dragObject.goInBounds();
			ui.dragObject = "none";
			ui.justReleased = true;
		}
	}



	// mousing over a card in hand
	for (let item of ui.hand) item.data.up = 0;
	for (let item of ui.devhand) item.data.up = 0;
	if (ui.dragObject == "none" && (ui.menu == "board" || ui.menu == "trade" || ui.menu == "half")) {
		if (!ui.justReleased) {
			for (let i = 0; i < ui.hand.length-1; i++) if (ui.hand[i].overCheck(/*mouse.x, min(mouse.y, canvas.height - ui.hand[i].height/2)   <--  for if card is raised past bottom edge  */) && ui.hand[i].data.location == 1 && ui.hand[i].rpos.x != 0) {
				ui.hand[i].data.up = 1;
				//if (i > 0) ui.hand[i-1].data.up = 0.5;					spreaded lift effect
				//if (i < ui.hand.length-2) ui.hand[i+1].data.up = 0.5;
				break;
			}
			if (ui.menu == "board") for (let i = 0; i < ui.devhand.length-1; i++) if (ui.devhand[i].overCheck() && ui.devhand[i].data.location == 1 && ui.devhand[i].rpos.x != 0) {
				ui.devhand[i].data.up = 1;
				break;
			}
		}

	// switching card indices by dragging cards around in hand
	} else if (ui.dragObject.id == "resource card") {
		let overHand = false, index = 0;
		for (let i = 0; i < ui.hand.length; i++) {
			if (ui.hand[i].data.location == 1 && !ui.hand[i].dragging) {
				if (ui.hand[i].overCheck()) {
					overHand = true;
					break;
				}
				index++;
			}
		}

		// catch a case involving a back and forth loop on the left side
		let overlap = 0.5; // must be at least the actual overlap ratio of the cards
		if (ui.handReversed) overlap *= -1;
		let topIndex = 0;
		if (ui.oldHand[0].dragging) topIndex = 1; 
		if (!overHand && ui.cardOverHandEnd && ui.oldHand[topIndex].overCheck(mouse.x + ui.hand[0].width*overlap, mouse.y)) {
			overHand = true;
			index = 0;
		} else if (overHand && index == 0) ui.cardOverHandEnd = true;
		else ui.cardOverHandEnd = false;

		if (overHand) ui.dragObject.data.location = 1;
		else ui.dragObject.data.location = 0;
		ui.hand = [];
		if (overHand) {
			for (let i = 0; i < ui.oldHand.length; i++) {
				if (!ui.oldHand[i].dragging) ui.hand.push(ui.oldHand[i]);
			}
			ui.hand.splice(index, 0, ui.dragObject);
		} else {
			for (let item of ui.oldHand) ui.hand.push(item);
		}
	} else if (ui.dragObject.id == "development card") {
		let overHand = false, index = 0;
		for (let i = 0; i < ui.devhand.length; i++) {
			if (ui.devhand[i].data.location == 1 && !ui.devhand[i].dragging) {
				if (ui.devhand[i].overCheck()) {
					overHand = true;
					break;
				}
				index++;
			}
		}

		// catch a case involving a back and forth loop on the left side
		let topIndex = 0;
		if (ui.oldDevhand[0].dragging) topIndex = 1; 
		if (!overHand && ui.cardOverHandEnd && ui.oldDevhand[topIndex].overCheck(mouse.x + ui.devhand[0].width*0.5, mouse.y)) {
			overHand = true;
			index = 0;
		} else if (overHand && index == 0) ui.cardOverHandEnd = true;
		else ui.cardOverHandEnd = false;

		if (overHand) ui.dragObject.data.location = 1;
		else ui.dragObject.data.location = 0;
		ui.devhand = [];
		if (overHand) {
			for (let i = 0; i < ui.oldDevhand.length; i++) {
				if (!ui.oldDevhand[i].dragging) ui.devhand.push(ui.oldDevhand[i]);
			}
			ui.devhand.splice(index, 0, ui.dragObject);
		} else {
			for (let item of ui.oldDevhand) ui.devhand.push(item);
		}
	}






	// dice rolling
	if (ui.rolling) {
		ui.rollingCooldown--;
		if (ui.rollingCooldown <= 0) {
			ui.dice[0] = random.int(1, 7);
			ui.dice[1] = random.int(1, 7);
			ui.rollingCooldown = 4;
		}
	}



	// game & turn phases
	if (ui.gamePhase == 0) ui.menu = "setup";
	else if (ui.gamePhase == 2 && ui.turnPhase == 3 && ui.halfAmount < ui.hand.length-1) ui.menu == "half";
	ui.robber.enabled = (ui.gamePhase == 2 && ui.turn == ui.index && ui.turnPhase == 4);





	// background
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if (canvas.height*0.9/canvas.width > 2/3) ctx.drawImage(textures.background, canvas.width/2 - canvas.height*0.9*3/4, canvas.height*0.1, canvas.height*0.9*3/2, canvas.height*0.9);
	else ctx.drawImage(textures.background, 0, canvas.height*0.55 - canvas.width*2/6, canvas.width, canvas.width*2/3);


	// drawing game elements 

	if (ui.menu != "trade") drawBoard();


	// setting ui layout values
	topBarHeight = canvas.height*0.1;
	nameBoxWidth = canvas.width*0.15;
	diceBoxWidth = topBarHeight*11/6;
	costCardWidth = topBarHeight/ui.bigCardRatio;
	pointBoxWidth = topBarHeight*5/6;
	pointBoxLeft = canvas.width - costCardWidth - pointBoxWidth - topBarHeight*0.002;
	eventBoxLeft = nameBoxWidth + diceBoxWidth;
	eventBoxWidth = pointBoxLeft - eventBoxLeft;

	developmentCardStackX = canvas.width/2 + canvas.height*0.37;
	developmentCardStackWidth = canvas.height*0.15;
	harborTradeButtonLeft = max(canvas.width*0.85, developmentCardStackX + developmentCardStackWidth/2 + canvas.width*0.02);
	harborTradeButtonTop = topBarHeight + canvas.height*0.02;
	harborTradeButtonWidth = canvas.width*0.98 - harborTradeButtonLeft;
	harborTradeButtonHeight = canvas.height*0.11;






	drawUI();


	// draggables
	for (let i = ui.d.length-1; i >= 0; i--) if (ui.d[i].show && (ui.d[i].id != "new development card" || !ui.d[i].dragging)) ui.d[i].draw();
	if (ui.menu != "trade") {
		for (let i = ui.devhand.length-1; i >= 0; i--) if (ui.devhand[i].show) ui.devhand[i].draw();
		if (ui.menu != "half") for (let i = ui.hand.length-1; i >= 0; i--) if (ui.hand[i].show) ui.hand[i].draw();
		let newDevCard = ui.d.find(item => item.id == "new development card");
		if (newDevCard.dragging) newDevCard.draw();
	}

	drawTopBar();
	






	// 			menu stuff

	// screen shadowing for other menus
	if (ui.menu != "board") {
		eventlog.style.backgroundColor = "#6a6964";
		eventlog.style.borderColor = "#272727";

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	} else {
		eventlog.style.backgroundColor = "#d4d1c9";
		eventlog.style.borderColor = "#4f4f4f";
	}





	// setup menu
	if (ui.menu == "setup") {
		setup.style.display = "block";
		setup.style.left = (canvas.width - canvas.height)/2 + "px";
	} else {
		setup.style.display = "none";
	}


	// harbor trade menu dimensioning
	if (ui.menu == "harbor trade") {
		htmenu.style.display = "block";	// vvvv aaaarrrgggg ocd attack
		htmenu.style.left = canvas.width*0.498 - canvas.height/2 + "px";
		for (let i in ui.harborTrade.rates) document.getElementById("rate " + i).value = ui.harborTrade.rates + ":1";
		let count = ui.hand.reduce((acc, cur) => acc + (cur.data.type == ui.harborTrade.selected), 0);
		if (count >= ui.harborTrade.rates[ui.harborTrade.selected]) {
			ui.menuCards.show = true;
			ui.menuCards.cards[ui.harborTrade.selected].show = false;
			ui.menuCards.y = 0.63;
			ui.menuCards.spacing = canvas.height/canvas.width*0.1925;
		} else ui.menuCards.show = false;

		if (ui.harborTrade.selected == "none") document.getElementById("circle").style.left = "-50vh";
		else document.getElementById("circle").style.left = 4 + 19.1625*ui.harborTrade.selected + "vh";
	} else {
		htmenu.style.display = "none";
		ui.menuCards.show = false;
	}






	// trade menu
	if (ui.menu == "trade") {
		drawTradeMenu();
		for (let i = ui.hand.length-1; i >= 0; i--) if (ui.hand[i].show) ui.hand[i].draw();
	}

	// halve cards
	else if (ui.menu == "half") {
		drawHalfMenu();
		for (let i = ui.hand.length-1; i >= 0; i--) if (ui.hand[i].show) ui.hand[i].draw();
	}


	// monopoly
	else if (ui.menu == "monopoly") {
		drawMonopolyMenu();
	}





	// fullscreen card
	else if (ui.menu == "card" && ui.fullScreenCard != "none") {
		let height = 0.6;
		if (ui.fullScreenCard == "cost card") drawCostCard(canvas.width/2, canvas.height/2, canvas.height*height/ui.bigCardRatio, 0, true);
		else if (ui.fullScreenCard == "largest army") drawBigCard("largest_army", canvas.width/2, canvas.height/2, canvas.height*height/ui.bigCardRatio, 0, true);
		else if (ui.fullScreenCard == "longest road") drawBigCard("longest_road", canvas.width/2, canvas.height/2, canvas.height*height/ui.bigCardRatio, 0, true);
		else drawCard(ui.fullScreenCard, canvas.width/2, canvas.height/2, canvas.height*height/ui.cardRatio, 0, true);
	}




	// yop
	if (ui.menu == "year of plenty") {
		drawYopMenu();
	} else {
		ui.yopCard1 = "none";
	}
	

	

	// menu resource card dimensioning and drawing
	if (ui.menuCards.show) {
		for (let item of ui.menuCards.cards) {
			item.enabled = ui.menuCards.enabled;
			item.width = canvas.height*ui.menuCards.width;
			item.height = item.width*ui.cardRatio;
			if (!item.dragging) {
				item.rpos.y = ui.menuCards.y;
				item.rpos.x = ui.menuCards.x + (item.data.type - 2)*ui.menuCards.spacing;
			}

			if (item.show) item.draw();
		}
	}




	mouse.moved = false;



}

initDone = true;
if (loadedTextureCount >= 33) {
	requestAnimationFrame(draw);
}


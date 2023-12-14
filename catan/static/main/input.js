const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const eventlog = document.getElementById("eventlog");
const htmenu = document.getElementById("htmenu");
const setup = document.getElementById("setup");

mouse.selectedTile = "none";
mouse.selectedCorner = "none";
mouse.selectedEdge = "none";



window.addEventListener("resize", function() {
	try {
		const temp = ctx.getImageData(0, 0, canvas.width, canvas.height);
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx.putImageData(temp, 0, 0);
	} catch (error) {
		if (error.name == "SecurityError") {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		} else throw error;
	}
});
window.addEventListener("contextmenu", function(event) { event.preventDefault(); });
mouse.relativeToElement = canvas;
window.addEventListener("mousemove", function() {
	mouse.moved = true;
});




window.addEventListener("mousedown", function(event) {
	if (!initDone) return;
	if (event.button == 0) { // left click

		if (ui.menu == "board") {
			// buttons
			/* if (mouse.x >= 0 && mouse.x <= nameBoxWidth/3 && mouse.y >= topBarHeight*0.6 && mouse.y <= topBarHeight) {
				// toggle the menu
				return;
			} */
			// box below dice
			if (ui.turn == ui.index && ui.gamePhase == 2 && !ui.rolling && mouse.x >= nameBoxWidth + diceBoxWidth*0.3 && mouse.y >= topBarHeight*0.9 && mouse.x <= nameBoxWidth + diceBoxWidth*0.7 && mouse.y <= topBarHeight*1.15) {
				if (ui.turnPhase == 1) {
					/* send server request to roll dice */
					ui.rolling = true;
					console.log("roll dice");
				} else if (ui.turnPhase == 2) {
					/* send server request to pass the turn */
					console.log("pass turn");
				}
				return;
			}
			if (ui.turn == ui.index && ui.turnPhase == 2 && ui.gamePhase == 2 && mouse.x >= harborTradeButtonLeft && mouse.y >= harborTradeButtonTop && mouse.x <= harborTradeButtonLeft + harborTradeButtonWidth && mouse.y <= harborTradeButtonTop + harborTradeButtonHeight) {
				// open maritime trade window
				ui.menu = "harbor trade";
				ui.harborTrade.selected = "none";
				return;
			}
			if (mouse.x >= canvas.width - costCardWidth && mouse.y <= topBarHeight) {
				// cost card
				ui.menu = "card";
				ui.fullScreenCard = "cost card";
			}
			if (mouse.x >= canvas.width*0.975 && mouse.y >= canvas.height*0.25 && mouse.y <= canvas.height*0.85) {
				// trade menu
				ui.menu = "trade";
			}




			// draggables
			for (let i = 0; i < ui.d.length; i++) {
				if (ui.d[i].pickupCheck()) {
					ui.d.unshift(ui.d.splice(i, 1)[0]);
					return;
				}
			}
			
			// devhand cards
			for (let i = 0; i < ui.devhand.length; i++) {
				if (ui.devhand[i].pickupCheck()) {
					ui.oldDevhand = [];
					for (let i of ui.devhand) ui.oldDevhand.push(i);
					return;
				}
			}

			// cards in menu list
			if (ui.menuCards.enabled && ui.menuCards.show) for (let i = 0; i < ui.menuCards.cards.length; i++) {
				if (ui.menuCards.cards[i].pickupCheck()) {
					return;
				}
			}


		} else if (ui.menu == "card") {
			ui.menu = "board";
			ui.fullScreenCard = "none";
		} else if (ui.menu == "harbor trade") {
			if (!ui.mouseOverMenu) ui.menu = "board";
			if (ui.menuCards.show) for (let i = 0; i < ui.menuCards.cards.length; i++) {
				if (ui.menuCards.cards[i].overCheck() && ui.menuCards.cards[i].show) {
					/* request a harbor trade */
					console.log("request to trade resource " + ui.harborTrade.selected + " for " + i);
					return;
				}
			}
		} else if (ui.menu == "trade") {
			
		} else if (ui.menu == "half") {
			
		} else if (ui.menu == "monopoly") {
			
		} else if (ui.menu == "year of plenty") {

		}



		if (ui.menu == "board" || ui.menu == "trade" || ui.menu == "half") {
			// cards in hand
			for (let i = 0; i < ui.hand.length; i++) {
				if (ui.hand[i].pickupCheck()) {
					ui.oldHand = [];
					for (let i of ui.hand) ui.oldHand.push(i);
					return;
				}
			}
		}




	} else if (event.button == 2) { // right click

		if (ui.menu == "board") {

			// draggables shift right click to return
			for (let i = 0; i < ui.d.length; i++) {
				let item = ui.d[i];
				if (item.show && item.overCheck()) {
					
					if (keys[16] && !item.dragging) {
						if (item.shiftRightReturn && item.enabled) {
							item.return();
							return;
						} else if (item.id == "longest road" || item.id == "largest army" || item.id == "cost card") {
							ui.menu = "card";
							ui.fullScreenCard = item.id;
							return;
						} else if (item.id == "development card") {
							ui.menu = "card";
							ui.fullScreenCard = item.data.type;
							return;
						}
					}

					if (item.id == "city" && item.enabled) {
						item.data.flipped = !item.data.flipped;
						return;
					}
				}
			}
			// fullscreen cards
			if (keys[16]) {
				for (let i = 0; i < ui.devhand.length; i++) {
					let item = ui.devhand[i];
					if (item.show && item.overCheck() && !item.dragging) {
						ui.menu = "card";
						ui.fullScreenCard = item.data.type;
						return;
					}
				}
				if (ui.largestArmy.show && ui.largestArmy.overCheck()) {
					ui.menu = "card";
					ui.fullScreenCard = "largest army";
					return;
				}
				if (ui.longestRoad.show && ui.longestRoad.overCheck()) {
					ui.menu = "card";
					ui.fullScreenCard = "longest road";
					return;
				}
			}
		}

		// allow hand direction flipping
		if (keys[16] && ui.dragObject == "none" && (ui.menu == "board" || ui.menu == "trade" || ui.menu == "half")) {
			for (let i = 0; i < ui.hand.length; i++) {
				if (ui.hand[i].data.location == 1) if (ui.hand[i].overCheck()) {
					ui.handReversed = !ui.handReversed;
					return;
				}
			}
		}


	}
});


window.addEventListener("keydown", function(event) {
	if (!initDone) return;
	keys[event.which || event.keyCode] = true;

	// keybinds
	if (event.key == "Escape" && ui.menu != "setup" && ui.menu != "half") {
		ui.menu = "board";
	}
});

eventlog.addEventListener("scroll", function(event) {
	ui.scrollFlag = true;
});


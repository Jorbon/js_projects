function getTilePos(i, center=boardCenter, scale=tileRadius) {
	let tilePos = new V();
	if (i < 3) {
		tilePos.x = i - 1;
		tilePos.y = -3;
	} else if (i < 7) {
		tilePos.x = i - 4.5;
		tilePos.y = -1.5;
	} else if (i < 12) {
		tilePos.x = i - 9;
		tilePos.y = 0;
	} else if (i < 16) {
		tilePos.x = i - 13.5;
		tilePos.y = 1.5;
	} else {
		tilePos.x = i - 17;
		tilePos.y = 3;
	}
	tilePos.x *= sqrt(3);
	return tilePos.mult(scale).add(center);
};
function getCornerPos(i, center=boardCenter, scale=tileRadius) {
	let cornerPos = new V();
	if (i < 7) {
		cornerPos.x = (i - 3) / 2;
		cornerPos.y = -3.5 - 0.5 * (i%2);
	} else if (i < 16) {
		cornerPos.x = (i - 11) / 2;
		cornerPos.y = -2.5 + 0.5 * (i%2);
	} else if (i < 27) {
		cornerPos.x = (i - 21) / 2;
		cornerPos.y = -0.5 - 0.5 * (i%2);
	} else return getCornerPos(53 - i, center, -scale);
	cornerPos.x *= sqrt(3);
	return cornerPos.mult(scale).add(center);
};
function getEdgePos(i, center=boardCenter, scale=tileRadius) {
	let edgePos = new V();
	let edgeType = 0;
	if (i < 6) {
		edgePos.x = (i-2.5) * 0.5;
		edgePos.y = -3.75;
		edgeType = i%2;
	} else if (i < 10) {
		edgePos.x = i - 7.5;
		edgePos.y = -3;
		edgeType = 2;
	} else if (i < 18) {
		edgePos.x = (i-13.5) * 0.5;
		edgePos.y = -2.25;
		edgeType = i%2;
	} else if (i < 23) {
		edgePos.x = i - 20;
		edgePos.y = -1.5;
		edgeType = 2;
	} else if (i < 33) {
		edgePos.x = (i-27.5) * 0.5;
		edgePos.y = -0.75;
		edgeType = 1-i%2;
	} else if (i < 36) {
		edgePos.x = i - 35.5;
		edgePos.y = 0;
		edgeType = 2;
	} else return getEdgePos(71 - i, center, -scale);
	edgePos.x *= sqrt(3);
	return [edgePos.mult(scale).add(center), edgeType+1];
};


function drawBigCard(card, x, y, width, rotation=0, center=false) {
	const innerAspectRatio = 3.75/3, borderRatio = 0.038;
	const aspectRatio = (innerAspectRatio+2*borderRatio)/(1+2*borderRatio);
	ctx.translate(x, y);
	ctx.rotate(rotation);
	
	let borderWidth = width / 2 * (1 - 1/(1 + 2 * borderRatio));
	let left, top;
	if (center) left = -width/2 + borderWidth, top = -width*aspectRatio/2 + borderWidth;
	else left = borderWidth, top = borderWidth;
	width *= (1 - 2*borderRatio) * 1.015;
	let height = width * innerAspectRatio;
	let right = left + width, bottom = top + height;

	// edge border
	ctx.lineWidth = 1;
	ctx.strokeStyle = lineColor;
	ctx.fillStyle = lightColor;
	ctx.fillRect(left - borderWidth, top - borderWidth, width + 2*borderWidth, height + 2*borderWidth);
	ctx.strokeRect(left - borderWidth, top - borderWidth, width + 2*borderWidth, height + 2*borderWidth);

	// another border
	ctx.fillStyle = "#844f2f";
	ctx.fillRect(left, top, width, height);

	// background
	ctx.fillStyle = "#ecf782";
	ctx.fillRect(left + width*0.02, top + height*0.015, width*0.96, height*0.97);

	// upper box
	ctx.strokeStyle = "#844f2f";
	ctx.lineWidth = width*0.005;
	ctx.strokeRect(left + width*0.04, top + height*0.035, width*0.92, height*0.1);
	ctx.fillStyle = "#000000";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = width*0.0975 + "px Cormorant";
	let text;
	if (card == "longest_road") text = "Longest Road";
	else if (card == "largest_army") text = "Largest Army";
	ctx.fillText(text, left + width/2, top + height*0.0925);

	// image
	const imageAspectRatio = 180/232;
	ctx.drawImage(textures[card], left + width*0.04, top + height*0.1475, width*0.92, width*0.92*imageAspectRatio);
	ctx.strokeRect(left + width*0.04, top + height*0.1475, width*0.92, width*0.92*imageAspectRatio);

	// bottom box
	ctx.strokeRect(left + width*0.04, top + height*0.732, width*0.92, height*0.232);
	ctx.font = "bold " + width*0.055 + "px Minion Pro";
	ctx.fillText("2 victory points!", left + width/2, top + height*0.78);

	ctx.font = width*0.045 + "px Minion Pro";
	if (card == "longest_road") text = "This card goes to the player with the longest\nroad of at least five road segments. Another\nplayer who builds a longer road gets this card.";
	else if (card == "largest_army") text = "This card goes to the player with the largest\narmy of at least three Soldiers. Another player\nwho creates a larger army gets this card.";
	let lines = text.split("\n");
	for (let i in lines) {
		ctx.fillText(lines[i], left + width/2, top + height*0.872 + (i - (lines.length-1)/2) * width*0.0525);
	}

	ctx.resetTransform();
};
function drawCard(card, x, y, width, rotation=0, center=false) {
	const innerAspectRatio = 216/141, borderRatio = 0.0634;
	const aspectRatio = (innerAspectRatio+2*borderRatio)/(1+2*borderRatio);
	ctx.translate(x, y);
	ctx.rotate(rotation);
	
	let borderWidth = width / 2 * (1 - 1/(1 + 2 * borderRatio));
	let left, top;
	if (center) left = -width/2 + borderWidth, top = -width*aspectRatio/2 + borderWidth;
	else left = borderWidth, top = borderWidth;
	width *= (1 - 2*borderRatio) * 1.015;
	let height = width * innerAspectRatio;
	let right = left + width, bottom = top + height;
	
	// edge border
	ctx.lineWidth = 1;
	ctx.strokeStyle = lineColor;
	ctx.fillStyle = lightColor;
	ctx.beginPath();
	ctx.arc(left, top, borderWidth, PI, PI*3/2);
	ctx.lineTo(right, top - borderWidth);
	ctx.arc(right, top, borderWidth, PI*3/2, PI*2);
	ctx.lineTo(right + borderWidth, bottom);
	ctx.arc(right, bottom, borderWidth, 0, PI/2);
	ctx.lineTo(left, bottom + borderWidth);
	ctx.arc(left, bottom, borderWidth, PI/2, PI);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();


	let image;
	if (typeof card == "number" && card >= 0 && card < 5) image = textures.resource_cards[card];
	else if (card == "back") image = textures.card_back;
	else if (card == "development_card_back") image = textures.development_cards.back;
	else if (["chapel", "governors_house", "library", "market", "university_of_catan", "monopoly", "road_building", "year_of_plenty", "soldier"].some(a => a == card)) {

		// Drawing a development card

		// decide card settings
		image = textures.development_cards[card];
		let imageRatio = 245/200, title, bottomText = "1 victory point!", bottomTextSize = width*0.075;
		switch (card) {
			case "chapel": title = "Chapel"; break;
			case "governors_house": title = "Governor's House"; break;
			case "library": title = "Library"; break;
			case "market": title = "Market"; break;
			case "university_of_catan": title = "University of Catan"; break;
			case "soldier":
				title = "Soldier";
				bottomText = "Move the robber. Steal one resource card from\nthe owner of an adjacent settlement or city.";
				bottomTextSize = width*0.0475;
				break;
			case "road_building":
				title = "Road Building";
				bottomText = "Place 2 new roads as if\nyou had just built them.";
				bottomTextSize = width*0.0475;
				break;
			case "monopoly":
				title = "Monopoly";
				bottomText = "When you play this card, announce one type\nof resource. All other players must give you\nall their resource cards of that type.";
				bottomTextSize = width*0.0475;
				imageRato = 235/200;
				break;
			case "year_of_plenty":
				title = "Year of Plenty";
				bottomText = "Take any 2 resource cards from the bank and\nadd them to your hand. They can be two dif-\nferent resources or two of the same resource.\nThey may immediately be used to build.";
				bottomTextSize = width*0.0475;
				imageRato = 225/200;
				break;
		}
		if (card == "monopoly") imageRatio = 235/200;
		else if (card == "year_of_plenty") imageRatio = 225/200;

		// outer border
		ctx.strokeStyle = "#844f2f";
		ctx.lineWidth = width*0.02;
		ctx.fillStyle = "#ecf782";
		ctx.fillRect(left, top, width, height);
		ctx.strokeRect(left, top, width, height);

		// top box
		ctx.lineWidth = width*0.01;
		ctx.strokeRect(left + width*0.04, top + height*0.02, width*0.92, height*0.1);

		// image and box
		ctx.drawImage(image, left + width*0.04, top + height*0.1325, width*0.92, width*0.92*imageRatio);
		ctx.strokeRect(left + width*0.04, top + height*0.1325, width*0.92, width*0.92*imageRatio);

		// bottom box
		ctx.strokeRect(left + width*0.04, top + height*0.145 + width*0.92*imageRatio, width*0.92, height*0.835 - width*0.92*imageRatio);
		let bottomBoxCenter = top + height*0.5625 + width*0.46*imageRatio;


		// title
		ctx.font = width*0.085 + "px Cormorant";
		ctx.fillStyle = "#000000";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(title, left + width/2, top + height*0.075);

		// bottom text
		ctx.font = bottomTextSize + "px Minion Pro";
		let lines = bottomText.split("\n");
		for (let i in lines) {
			ctx.fillText(lines[i], left + width/2, bottomBoxCenter + (i - (lines.length-1)/2) * bottomTextSize);
		}

		ctx.resetTransform();
		return;
	} else {
		ctx.resetTransform();
		return;
	}

	ctx.drawImage(image, left, top, width, height);

	ctx.resetTransform();
};
function drawCostCard(x, y, width, rotation=0, center=false) {
	const innerAspectRatio = 3.75/3, borderRatio = 0.038;
	const aspectRatio = (innerAspectRatio+2*borderRatio)/(1+2*borderRatio);
	ctx.translate(x, y);
	ctx.rotate(rotation);
	
	let borderWidth = width / 2 * (1 - 1/(1 + 2 * borderRatio));
	let left, top;
	if (center) left = -width/2 + borderWidth, top = -width*aspectRatio/2 + borderWidth;
	else left = borderWidth, top = borderWidth;
	width *= (1 - 2*borderRatio) * 1.015;
	let height = width * innerAspectRatio;
	let right = left + width, bottom = top + height;

	// edge border
	ctx.lineWidth = 1;
	ctx.strokeStyle = lineColor;
	ctx.fillStyle = lightColor;
	ctx.fillRect(left - borderWidth, top - borderWidth, width + 2*borderWidth, height + 2*borderWidth);
	ctx.strokeRect(left - borderWidth, top - borderWidth, width + 2*borderWidth, height + 2*borderWidth);

	// blue background
	ctx.fillStyle = "#002fcf";
	ctx.fillRect(left, top, width, height);

	// title box
	ctx.strokeStyle = lightColor;
	ctx.lineWidth = width*0.007;
	ctx.strokeRect(left + width*0.02, top + height*0.015, width*0.96, height*0.1125);
	ctx.font = "bold " + height*0.085 + "px Cormorant";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = lightColor;
	ctx.fillText("Building Costs", left + width/2, top + height*0.08);

	// gray boxes
	ctx.fillStyle = "#cfcfcf";
	ctx.fillRect(left + width*0.02, top + height*0.14, width*0.96, height*0.2);
	ctx.fillRect(left + width*0.02, top + height*0.355, width*0.96, height*0.2);
	ctx.fillRect(left + width*0.02, top + height*0.57, width*0.96, height*0.2);
	ctx.fillRect(left + width*0.02, top + height*0.785, width*0.96, height*0.2);

	// box titles
	ctx.fillStyle = "#000000";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.font = "bold " + height*0.048 + "px Minion Pro";
	ctx.fillText("Road", left + width*0.04, top + height*0.1525);
	ctx.fillText("Settlement", left + width*0.04, top + height*0.3675);
	ctx.fillText("City", left + width*0.04, top + height*0.5825);
	ctx.fillText("Development Card", left + width*0.04, top + height*0.7975);

	// resource images
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = width*0.004;
	function icon(type, x, y) {
		const radius = 0.0705;
		ctx.drawImage(textures.resources[type], left + width*(0.035 + radius) + x*width*(radius*2 + 0.015) - width*radius, top + height*0.328 - 2*width*radius + y*height*0.215, width*radius*2, width*radius*2);
		ctx.beginPath();
		ctx.arc(left + width*(0.035 + radius) + x*width*(radius*2 + 0.015), top + height*0.33 - width*radius + y*height*0.215, width*radius*0.98, 0, PI*2);
		ctx.stroke();
	}
	icon(2, 0, 0); icon(3, 1, 0);
	icon(2, 0, 1); icon(3, 1, 1); icon(0, 2, 1); icon(1, 3, 1);
	icon(0, 0, 2); icon(0, 1, 2); icon(4, 2, 2); icon(4, 3, 2); icon(4, 4, 2);
	icon(0, 0, 3); icon(1, 1, 3); icon(4, 2, 3);

	// points
	ctx.textAlign = "right";
	ctx.font = height*0.0425 + "px Minion Pro";
	ctx.fillText("0 pts.", right - width*0.04, top + height*0.1525);
	ctx.fillText("1 pt.", right - width*0.04, top + height*0.3675);
	ctx.fillText("2 pts.", right - width*0.04, top + height*0.5825);
	ctx.fillText("? pts.", right - width*0.04, top + height*0.7975);

	// parentheticals
	ctx.textBaseline = "bottom";
	ctx.font = "lighter " + height*0.0375 + "px Cormorant";
	ctx.fillText("(Longest Road -         )", right - width*0.04, top + height*0.3325);
	ctx.fillText("(Largest Army -         )", right - width*0.04, bottom - height*0.0225);
	ctx.font = height*0.0375 + "px Minion Pro";
	ctx.fillText("2pts.", right - width*0.055, top + height*0.3325);
	ctx.fillText("2pts.", right - width*0.055, bottom - height*0.0225);
	ctx.font = "lighter " + height*0.0375 + "px Cormorant";
	ctx.textAlign = "left";
	ctx.fillText("(Replaces Settlement)", left + width*0.165, top + height*0.627);


	// building icons
	ctx.lineWidth = width*0.0025;
	ctx.fillStyle = lightColor;
	ctx.fillRect(left + width*0.73, top + height*0.2375, width*0.23, height/30);
	ctx.strokeRect(left + width*0.73, top + height*0.2375, width*0.23, height/30);

	ctx.beginPath();
	ctx.moveTo(right - width*0.04, top + height*0.4875);
	ctx.lineTo(right - width*0.04, top + height*0.529);
	ctx.lineTo(right - width*0.11, top + height*0.529);
	ctx.lineTo(right - width*0.11, top + height*0.4875);
	ctx.lineTo(right - width*0.075, top + height*0.4625);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(right - width*0.04, top + height*0.675);
	ctx.lineTo(right - width*0.04, top + height*0.745);
	ctx.lineTo(right - width*0.17, top + height*0.745);
	ctx.lineTo(right - width*0.17, top + height*0.703);
	ctx.lineTo(right - width*0.11, top + height*0.703);
	ctx.lineTo(right - width*0.11, top + height*0.675);
	ctx.lineTo(right - width*0.075, top + height*0.65);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	ctx.fillRect(right - width*0.1355, bottom - height*0.149, width*0.073, height*0.079);
	ctx.strokeRect(right - width*0.1355, bottom - height*0.149, width*0.073, height*0.079);

	ctx.font = "bold " + width*0.07 + "px Minion Pro";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#000000";
	ctx.fillText("?", right - width*0.099, bottom - height*0.105);
	
	ctx.resetTransform();
};
function drawHarbor(index, x, y, orientation, scale=tileRadius) {
	const imageAspectRatio = 103/88;
	let width = scale * 0.65;
	ctx.translate(x, y);
	ctx.rotate(-PI/6 - PI/3 * orientation);
	let resource = board.harbors[index];


	// location indicator line
	ctx.strokeStyle = lineColor;
	ctx.lineWidth = scale*0.05;
	ctx.beginPath();
	if (typeof board.corners[map.harborTouchCorner[index][0]] == "number") {
		ctx.moveTo(0, 0);
		ctx.lineTo(-scale/2, scale * sqrt(3)/2);
	} else if (typeof board.corners[map.harborTouchCorner[index][1]] == "number") {
		ctx.moveTo(0, 0);
		ctx.lineTo(scale/2, scale * sqrt(3)/2);
	} else {
		ctx.moveTo(-scale/2 * 0.84, scale * sqrt(3)/2 * 0.84);
		ctx.lineTo(scale/2 * 0.84, scale * sqrt(3)/2 * 0.84);
	}
	ctx.stroke();


	// ship
	ctx.drawImage(textures.harbor, -width/2, -width*imageAspectRatio/2, width, width*imageAspectRatio);

	// trade resource icon
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	let text = "3:1";
	if (typeof resource == "number") {
		// mouseover expands resource image
		if (ui.menu == "board" && ui.dragObject == "none" && (x-mouse.x)*(x-mouse.x) + (y-mouse.y)*(y-mouse.y) <= scale*scale * 0.5*0.5) {
			ctx.resetTransform();
			ctx.drawImage(textures.resources[resource], x - scale * 0.5, y - scale * 0.5, scale, scale);
			return;
		}

		// small resource image
		ctx.drawImage(textures.resources[resource], -scale*0.15, -scale*0.15, scale*0.3, scale*0.3);
		text = "2:1";
	} else {
		// blue ? thing
		ctx.font = "bold " + scale*0.3 + "px Times";
		ctx.fillStyle = "#001fcf";
		ctx.fillText("?", scale*0.01, -scale*0.02);
	}

	// trade rate text
	ctx.font = "bold " + scale*0.18 + "px Minion Pro";
	ctx.fillStyle = "#000000";
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth = scale*0.02;
	ctx.strokeText(text, scale*0.01, scale*0.1);
	ctx.fillText(text, scale*0.01, scale*0.1);

	ctx.resetTransform();
};
function drawDie(x, y, size, number, color=baseColor) {
	ctx.strokeStyle = lineColor;
	ctx.fillStyle = color;
	ctx.lineWidth = size*0.05;
	ctx.beginPath();
	ctx.arc(x + size*0.2, y + size*0.2, size*0.2, PI, PI*3/2);
	ctx.lineTo(x + size*0.8, y);
	ctx.arc(x + size*0.8, y + size*0.2, size*0.2, PI*3/2, PI*2);
	ctx.lineTo(x + size, y + size*0.8);
	ctx.arc(x + size*0.8, y + size*0.8, size*0.2, 0, PI/2);
	ctx.lineTo(x + size*0.2, y + size);
	ctx.arc(x + size*0.2, y + size*0.8, size*0.2, PI/2, PI);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	let dotSize = size*0.1, dotSpacing = size*0.25;
	ctx.fillStyle = lineColor;
	if (number % 2 == 1) {
		ctx.beginPath();
		ctx.arc(x + size/2, y + size/2, dotSize, 0, PI*2);
		ctx.fill();
	}
	if (number > 1) {
		ctx.beginPath();
		ctx.arc(x + size/2 - dotSpacing, y + size/2 - dotSpacing, dotSize, 0, PI*2);
		ctx.fill(); ctx.beginPath();
		ctx.arc(x + size/2 + dotSpacing, y + size/2 + dotSpacing, dotSize, 0, PI*2);
		ctx.fill();
		if (number > 3) {
			ctx.beginPath();
			ctx.arc(x + size/2 + dotSpacing, y + size/2 - dotSpacing, dotSize, 0, PI*2);
			ctx.fill(); ctx.beginPath();
			ctx.arc(x + size/2 - dotSpacing, y + size/2 + dotSpacing, dotSize, 0, PI*2);
			ctx.fill();
			if (number > 5) {
				ctx.beginPath();
				ctx.arc(x + size/2 - dotSpacing, y + size/2, dotSize, 0, PI*2);
				ctx.fill(); ctx.beginPath();
				ctx.arc(x + size/2 + dotSpacing, y + size/2, dotSize, 0, PI*2);
				ctx.fill();
			}
		}
	}
};
function drawSettlement(x, y, scale, color, borderColor=lineColor) {
	ctx.fillStyle = color;
	ctx.strokeStyle = borderColor;
	ctx.lineWidth = scale*0.04;
	ctx.beginPath();
	ctx.moveTo(x, y - scale*0.2);
	ctx.lineTo(x + scale*0.125, y - scale*0.075);
	ctx.lineTo(x + scale*0.125, y + scale*0.1);
	ctx.lineTo(x - scale*0.125, y + scale*0.1);
	ctx.lineTo(x - scale*0.125, y - scale*0.075);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
};
function drawCity(x, y, scale, color, flipped=false, borderColor=lineColor) {
	let xm = 1;
	if (flipped) xm = -1;
	ctx.fillStyle = color;
	ctx.strokeStyle = borderColor;
	ctx.lineWidth = scale*0.04;
	ctx.beginPath();
	ctx.moveTo(x + scale*0.0625 * xm, y - scale*0.275);
	ctx.lineTo(x + scale*0.1875 * xm, y - scale*0.15);
	ctx.lineTo(x + scale*0.1875 * xm, y + scale*0.15);
	ctx.lineTo(x - scale*0.2625 * xm, y + scale*0.15);
	ctx.lineTo(x - scale*0.2625 * xm, y - scale*0.0375);
	ctx.lineTo(x - scale*0.0625 * xm, y - scale*0.0375);
	ctx.lineTo(x - scale*0.0625 * xm, y - scale*0.15);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
};
function drawRoad(x, y, scale, color, type, borderColor=lineColor) {
	ctx.fillStyle = color;
	ctx.strokeStyle = borderColor;
	ctx.lineWidth = scale*0.04;
	ctx.translate(x, y);
	if (type != 0) ctx.rotate(-PI/2 - type*PI*2/3);
	ctx.fillRect(-scale*0.3, -scale*0.06, scale*0.6, scale*0.12);
	ctx.strokeRect(-scale*0.3, -scale*0.06, scale*0.6, scale*0.12);

	ctx.resetTransform();
};
function drawRobber(x, y, scale) {
	ctx.fillStyle = "#3f3f3f";
	ctx.strokeStyle = lineColor;
	ctx.lineWidth = scale*0.04;
	ctx.beginPath();
	ctx.ellipse(x, y + scale*0.275, scale*0.24, scale*0.15, 0, -1, 4);
	ctx.ellipse(x, y - scale*0.025, scale*0.2, scale*0.325, 0, 2.6, 3.4);
	ctx.arc(x, y - scale*0.375, scale*0.15, 2.5, 7);
	ctx.ellipse(x, y - scale*0.025, scale*0.2, scale*0.325, 0, -0.5, 0.7);
	ctx.fill();
	ctx.stroke();
};



function drawBoard() {
	const sqrt3 = sqrt(3);
	boardCenter = new V(canvas.width/2, canvas.height*0.485);
	tileRadius = min(canvas.width * 0.5 / (3.5*sqrt3), canvas.height * 0.5 / 5.5) * 0.75;


	const oceanHexes = [[-1.5, -3], [-0.5, -3], [0.5, -3], [1.5, -3], [-2, -2], [2, -2], [-2.5, -1], [2.5, -1], [-3, 0], [3, 0], [-2.5, 1], [2.5, 1], [-2, 2], [2, 2], [-1.5, 3], [-0.5, 3], [0.5, 3], [1.5, 3]];
	for (let i of oceanHexes) ctx.drawImage(textures.tiles[0], boardCenter.x + (i[0]-0.5) * tileRadius * sqrt3, boardCenter.y + (i[1] * 1.5 - 1) * tileRadius, tileRadius * sqrt3 + 1, tileRadius * 2 + 1);

	const oceanBorder = [[-3.5, -0.5], [-3, -1], [-3, -2], [-2.5, -2.5], [-2.5, -3.5], [-2, -4], [-2, -5], [-1.5, -5.5], [-1, -5], [-0.5, -5.5], [0, -5], [0.5, -5.5], [1, -5], [1.5, -5.5], [2, -5], [2, -4], [2.5, -3.5], [2.5, -2.5], [3, -2], [3, -1], [3.5, -0.5]];
	ctx.strokeStyle = lineColor;
	ctx.lineWidth = tileRadius/24;
	ctx.beginPath();
	for (let i = 0; i < oceanBorder.length; i++) ctx.lineTo(boardCenter.x + oceanBorder[i][0] * tileRadius * sqrt3, boardCenter.y + oceanBorder[i][1] * tileRadius);
	for (let i = 0; i < oceanBorder.length; i++) ctx.lineTo(boardCenter.x - oceanBorder[i][0] * tileRadius * sqrt3, boardCenter.y - oceanBorder[i][1] * tileRadius);
	ctx.closePath();
	ctx.stroke();

	
	for (let i = 0; i < 19; i++) {
		let tilePos = getTilePos(i);


		// hexes
		ctx.drawImage(textures.tiles[board.tiles[i].tile], tilePos.x - tileRadius * sqrt3/2, tilePos.y - tileRadius, tileRadius * sqrt3 + 1, tileRadius * 2 + 1);

		ctx.strokeStyle = lineColor;
		ctx.lineWidth = tileRadius / 24;

		ctx.beginPath();
		ctx.moveTo(tilePos.x, tilePos.y - tileRadius);
		ctx.lineTo(tilePos.x + tileRadius * sqrt3/2, tilePos.y - tileRadius/2);
		ctx.lineTo(tilePos.x + tileRadius * sqrt3/2, tilePos.y + tileRadius/2);
		ctx.lineTo(tilePos.x, tilePos.y + tileRadius);
		ctx.lineTo(tilePos.x - tileRadius * sqrt3/2, tilePos.y + tileRadius/2);
		ctx.lineTo(tilePos.x - tileRadius * sqrt3/2, tilePos.y - tileRadius/2);
		ctx.closePath();
		ctx.stroke();

		



		if (board.tiles[i].number == "none") continue;

		// number rounders
		ctx.fillStyle = baseColor;
		ctx.lineWidth = tileRadius / 24;
		ctx.beginPath();
		ctx.arc(tilePos.x, tilePos.y, tileRadius * 0.3, 0, 2*PI);
		ctx.fill();
		ctx.stroke();

		// numbers
		ctx.font = "bold " + tileRadius * 0.4 + "px Minion Pro";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		if (board.tiles[i].number == 6 || board.tiles[i].number == 8) ctx.fillStyle = "#cf0000";
		else ctx.fillStyle = "#000000";
		ctx.fillText(board.tiles[i].number, tilePos.x, tilePos.y);

		// dots
		let dotCount = 6 - abs(7 - board.tiles[i].number);
		for (let j = -(dotCount - 1)/2; j <= (dotCount - 1)/2; j++) {
			ctx.beginPath();
			ctx.arc(tilePos.x + j * 0.07 * tileRadius, tilePos.y + 0.16 * tileRadius, 0.025 * tileRadius, 0, 2*PI);
			ctx.fill();
		}
	}

	// harbors
	drawHarbor(0, tileRadius * sqrt3 * -0.5 + boardCenter.x, tileRadius * -4.5 + boardCenter.y, 0);
	drawHarbor(1, tileRadius * sqrt3 * 1.5 + boardCenter.x, tileRadius * -4.5 + boardCenter.y, 5);
	drawHarbor(2, tileRadius * sqrt3 * 2.5 + boardCenter.x, tileRadius * -1.5 + boardCenter.y, 4);
	drawHarbor(3, tileRadius * sqrt3 * 2.5 + boardCenter.x, tileRadius * 1.5 + boardCenter.y, 4);
	drawHarbor(4, tileRadius * sqrt3 * 1.5 + boardCenter.x, tileRadius * 4.5 + boardCenter.y, 3);
	drawHarbor(5, tileRadius * sqrt3 * -0.5 + boardCenter.x, tileRadius * 4.5 + boardCenter.y, 2);
	drawHarbor(6, tileRadius * sqrt3 * -2 + boardCenter.x, tileRadius * 3 + boardCenter.y, 2);
	drawHarbor(7, tileRadius * sqrt3 * -3 + boardCenter.x, boardCenter.y, 1);
	drawHarbor(8, tileRadius * sqrt3 * -2 + boardCenter.x, tileRadius * -3 + boardCenter.y, 0);

	


	// player pieces

	// roads
	for (let i in board.edges) {
		let num = board.edges[i];
		if (typeof num != "number") continue;
		let [pos, type] = getEdgePos(i);
		drawRoad(pos.x, pos.y, tileRadius, players[num].color, type);
	}
	for (let i in board.corners) {
		let num = board.corners[i];
		if (typeof num != "number") continue;
		let pos = getCornerPos(i);
		if (num >= 10) drawCity(pos.x, pos.y, tileRadius, players[floor(num-10)].color, num%1 == 0.5);
		else drawSettlement(pos.x, pos.y, tileRadius, players[floor(num)].color);
	}



	// robber
	if (board.robberTile == "none") return;
	let pos = getTilePos(board.robberTile);
	if (!ui.robber.dragging) {
		ui.robber.x = pos.x;
		ui.robber.y = pos.y;
	}
	ui.robber.width = tileRadius*0.45;
	ui.robber.height = tileRadius*0.95;
	// lift up to see number underneath
	if (ui.menu == "board" && ui.dragObject == "none" && !ui.robber.enabled && typeof board.tiles[board.robberTile].number == "number" && (pos.x-mouse.x)*(pos.x-mouse.x) + (pos.y-mouse.y)*(pos.y-mouse.y) <= tileRadius*tileRadius * 0.5*0.5) ui.robber.y -= 0.75*tileRadius;

	ui.robber.draw();
};

function drawBoardPreview(ctx, x, y, width) {
	const sqrt3 = sqrt(3);
	let boardCenterS = new V(x, y);
	let tileRadiusS = width/(7*sqrt3);


	const oceanHexes = [[-1.5, -3], [-0.5, -3], [0.5, -3], [1.5, -3], [-2, -2], [2, -2], [-2.5, -1], [2.5, -1], [-3, 0], [3, 0], [-2.5, 1], [2.5, 1], [-2, 2], [2, 2], [-1.5, 3], [-0.5, 3], [0.5, 3], [1.5, 3]];
	for (let i of oceanHexes) ctx.drawImage(textures.tiles[0], boardCenterS.x + (i[0]-0.5) * tileRadiusS * sqrt3, boardCenterS.y + (i[1] * 1.5 - 1) * tileRadiusS, tileRadiusS * sqrt3 + 1, tileRadiusS * 2 + 1);

	const oceanBorder = [[-3.5, -0.5], [-3, -1], [-3, -2], [-2.5, -2.5], [-2.5, -3.5], [-2, -4], [-2, -5], [-1.5, -5.5], [-1, -5], [-0.5, -5.5], [0, -5], [0.5, -5.5], [1, -5], [1.5, -5.5], [2, -5], [2, -4], [2.5, -3.5], [2.5, -2.5], [3, -2], [3, -1], [3.5, -0.5]];
	ctx.strokeStyle = lineColor;
	ctx.lineWidth = tileRadiusS/24;
	ctx.beginPath();
	for (let i = 0; i < oceanBorder.length; i++) ctx.lineTo(boardCenterS.x + oceanBorder[i][0] * tileRadiusS * sqrt3, boardCenterS.y + oceanBorder[i][1] * tileRadiusS);
	for (let i = 0; i < oceanBorder.length; i++) ctx.lineTo(boardCenterS.x - oceanBorder[i][0] * tileRadiusS * sqrt3, boardCenterS.y - oceanBorder[i][1] * tileRadiusS);
	ctx.closePath();
	ctx.stroke();

	
	for (let i = 0; i < 19; i++) {
		let tilePos = getTilePos(i, boardCenterS, tileRadiusS);


		// hexes
		ctx.drawImage(textures.tiles[board.tiles[i].tile], tilePos.x - tileRadiusS * sqrt3/2, tilePos.y - tileRadiusS, tileRadiusS * sqrt3 + 1, tileRadiusS * 2 + 1);

		ctx.strokeStyle = lineColor;
		ctx.lineWidth = tileRadiusS / 24;

		ctx.beginPath();
		ctx.moveTo(tilePos.x, tilePos.y - tileRadiusS);
		ctx.lineTo(tilePos.x + tileRadiusS * sqrt3/2, tilePos.y - tileRadiusS/2);
		ctx.lineTo(tilePos.x + tileRadiusS * sqrt3/2, tilePos.y + tileRadiusS/2);
		ctx.lineTo(tilePos.x, tilePos.y + tileRadiusS);
		ctx.lineTo(tilePos.x - tileRadiusS * sqrt3/2, tilePos.y + tileRadiusS/2);
		ctx.lineTo(tilePos.x - tileRadiusS * sqrt3/2, tilePos.y - tileRadiusS/2);
		ctx.closePath();
		ctx.stroke();

		



		if (board.tiles[i].number == "none") continue;

		// number rounders
		ctx.fillStyle = baseColor;
		ctx.lineWidth = tileRadiusS / 24;
		ctx.beginPath();
		ctx.arc(tilePos.x, tilePos.y, tileRadiusS * 0.3, 0, 2*PI);
		ctx.fill();
		ctx.stroke();

		// numbers
		ctx.font = "bold " + tileRadiusS * 0.4 + "px Minion Pro";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		if (board.tiles[i].number == 6 || board.tiles[i].number == 8) ctx.fillStyle = "#cf0000";
		else ctx.fillStyle = "#000000";
		ctx.fillText(board.tiles[i].number, tilePos.x, tilePos.y);

		// dots
		let dotCount = 6 - abs(7 - board.tiles[i].number);
		for (let j = -(dotCount - 1)/2; j <= (dotCount - 1)/2; j++) {
			ctx.beginPath();
			ctx.arc(tilePos.x + j * 0.07 * tileRadiusS, tilePos.y + 0.16 * tileRadiusS, 0.025 * tileRadiusS, 0, 2*PI);
			ctx.fill();
		}
	}

	// harbors
	drawHarbor(0, tileRadiusS * sqrt3 * -0.5 + boardCenterS.x, tileRadiusS * -4.5 + boardCenterS.y, 0, tileRadiusS);
	drawHarbor(1, tileRadiusS * sqrt3 * 1.5 + boardCenterS.x, tileRadiusS * -4.5 + boardCenterS.y, 5, tileRadiusS);
	drawHarbor(2, tileRadiusS * sqrt3 * 2.5 + boardCenterS.x, tileRadiusS * -1.5 + boardCenterS.y, 4, tileRadiusS);
	drawHarbor(3, tileRadiusS * sqrt3 * 2.5 + boardCenterS.x, tileRadiusS * 1.5 + boardCenterS.y, 4, tileRadiusS);
	drawHarbor(4, tileRadiusS * sqrt3 * 1.5 + boardCenterS.x, tileRadiusS * 4.5 + boardCenterS.y, 3, tileRadiusS);
	drawHarbor(5, tileRadiusS * sqrt3 * -0.5 + boardCenterS.x, tileRadiusS * 4.5 + boardCenterS.y, 2, tileRadiusS);
	drawHarbor(6, tileRadiusS * sqrt3 * -2 + boardCenterS.x, tileRadiusS * 3 + boardCenterS.y, 2, tileRadiusS);
	drawHarbor(7, tileRadiusS * sqrt3 * -3 + boardCenterS.x, boardCenterS.y, 1, tileRadiusS);
	drawHarbor(8, tileRadiusS * sqrt3 * -2 + boardCenterS.x, tileRadiusS * -3 + boardCenterS.y, 0, tileRadiusS);

	


	// player pieces

	// roads
	for (let i in board.edges) {
		let num = board.edges[i];
		if (typeof num != "number") continue;
		let [pos, type] = getEdgePos(i, boardCenterS, tileRadiusS);
		drawRoad(pos.x, pos.y, tileRadiusS, players[num].color, type);
	}
	for (let i in board.corners) {
		let num = board.corners[i];
		if (typeof num != "number") continue;
		let pos = getCornerPos(i, boardCenterS, tileRadiusS);
		if (num >= 10) drawCity(pos.x, pos.y, tileRadiusS, players[floor(num-10)].color, num%1 == 0.5);
		else drawSettlement(pos.x, pos.y, tileRadiusS, players[floor(num)].color);
	}



	// robber
	if (board.robberTile == "none") return;
	let pos = getTilePos(board.robberTile, boardCenterS, tileRadiusS);
	// lift up to see number underneath
	if (typeof board.tiles[board.robberTile].number == "number" && (pos.x-mouse.x)*(pos.x-mouse.x) + (pos.y-mouse.y)*(pos.y-mouse.y) <= tileRadiusS*tileRadiusS * 0.5*0.5) pos.y -= 0.75*tileRadiusS;

	drawRobber(pos.x, pos.y, tileRadiusS);
};

function drawTopBar() {

	// name box
	ctx.font = "20px Minion Pro";
	ctx.font = min(20*nameBoxWidth*0.88/ctx.measureText(players[ui.index].name).width, topBarHeight*0.45) + "px Minion Pro";
	ctx.fillStyle = "#eae7df";
	ctx.strokeStyle = lineColor;
	ctx.lineWidth = canvas.height*0.002;
	ctx.fillRect(0, 0, nameBoxWidth, topBarHeight);
	ctx.strokeRect(0, 0, nameBoxWidth, topBarHeight);
	ctx.lineWidth = min(20*nameBoxWidth*0.88/ctx.measureText(players[ui.index].name).width, topBarHeight*0.45) * 0.05;
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.fillStyle = players[ui.index].color;
	ctx.fillText(players[ui.index].name, canvas.width*0.01, topBarHeight*0.34);
	ctx.strokeText(players[ui.index].name, canvas.width*0.01, topBarHeight*0.34);
	ctx.font = "20px Minion Pro";
	ctx.font = min(20*nameBoxWidth*0.88/ctx.measureText(ui.gameName).width, topBarHeight*0.3) + "px Minion Pro";
	ctx.lineWidth = topBarHeight*0.3*0.05;
	ctx.fillText(ui.gameName, canvas.width*0.01, topBarHeight*0.75);
	ctx.strokeText(ui.gameName, canvas.width*0.01, topBarHeight*0.75);

	// list button
	/*
	ctx.fillStyle = "#d4d1c9";
	ctx.fillRect(0, topBarHeight*0.6, nameBoxWidth/3, topBarHeight*0.4);
	ctx.strokeRect(0, topBarHeight*0.6, nameBoxWidth/3, topBarHeight*0.4);
	ctx.lineWidth = canvas.height*0.003;
	ctx.strokeRect(nameBoxWidth/6 - topBarHeight*0.15, topBarHeight*0.72, topBarHeight*0.3, 0);
	ctx.strokeRect(nameBoxWidth/6 - topBarHeight*0.15, topBarHeight*0.8, topBarHeight*0.3, 0);
	ctx.strokeRect(nameBoxWidth/6 - topBarHeight*0.15, topBarHeight*0.88, topBarHeight*0.3, 0);
	*/

	// dice box
	ctx.fillStyle = "#eae7df";
	ctx.strokeStyle = lineColor;
	ctx.lineWidth = canvas.height*0.002;
	ctx.fillRect(nameBoxWidth, 0, diceBoxWidth, topBarHeight);
	ctx.strokeRect(nameBoxWidth, 0, diceBoxWidth, topBarHeight);
	drawDie(nameBoxWidth + topBarHeight/6, topBarHeight/6, topBarHeight*2/3, ui.dice[0]);
	drawDie(nameBoxWidth + topBarHeight, topBarHeight/6, topBarHeight*2/3, ui.dice[1]);

	let text = "ROLL";
	ctx.fillStyle = "#bf3f3f";
	if (ui.gamePhase == 2 && ui.turn == ui.index && ui.turnPhase >= 2) {
		text = "PASS";
		ctx.fillStyle = "#7f7fdf";
	}

	ctx.lineWidth = canvas.height*0.002;
	ctx.fillRect(nameBoxWidth + diceBoxWidth*0.3, topBarHeight*0.9, diceBoxWidth*0.4, topBarHeight*0.25);
	ctx.strokeRect(nameBoxWidth + diceBoxWidth*0.3, topBarHeight*0.9, diceBoxWidth*0.4, topBarHeight*0.25);
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = canvas.height*0.02 + "px Cormorant Bold";
	ctx.fillStyle = "#000000";
	ctx.fillText(text, nameBoxWidth + diceBoxWidth/2, topBarHeight*1.047);
	if (!(ui.turn == ui.index && (ui.turnPhase == 1 || ui.turnPhase == 2) && ui.gamePhase == 2)) {
		ctx.fillStyle = "rgba(191, 191, 191, 0.6)";
		ctx.fillRect(nameBoxWidth + diceBoxWidth*0.3, topBarHeight*0.9, diceBoxWidth*0.4, topBarHeight*0.25);
	}


	if (ui.menu != "trade") {

		// cost card
		drawCostCard(canvas.width - costCardWidth, 0, costCardWidth);

		// point box
		ctx.fillStyle = "#eae7df";
		ctx.strokeStyle = lineColor;
		ctx.lineWidth = canvas.height*0.002;
		ctx.fillRect(pointBoxLeft, 0, pointBoxWidth, topBarHeight);
		ctx.strokeRect(pointBoxLeft, 0, pointBoxWidth, topBarHeight);
		ctx.font = "bold " + canvas.height*0.02 + "px Minion Pro";
		ctx.fillStyle = "#000000";
		ctx.fillText("VPs:", pointBoxLeft + pointBoxWidth/2, topBarHeight*0.225);
		ctx.font = "bold " + canvas.height*0.06 + "px Minion Pro";
		ctx.fillText(ui.points, pointBoxLeft + pointBoxWidth/2, topBarHeight*2/3);

		// event box
		eventlog.style.width = eventBoxWidth - canvas.height*0.001 + "px";
		eventlog.style.height = topBarHeight-canvas.height*0.002 + ui.extendedEventlog*topBarHeight*3 + "px";
		eventlog.style.left = eventBoxLeft-canvas.height*0.002 + "px";
		if (ui.mouseOverEventlog && ui.scrollFlag) {
			ui.extendedEventlog = min(ui.extendedEventlog + 0.08, 1);
		} else {
			ui.extendedEventlog = max(ui.extendedEventlog - 0.08, 0);
			eventlog.scrollTop = 2**32;
			ui.scrollFlag = false;
		}
	}

	eventlog.style.top = "-0.1%";
	if (ui.menu == "trade") eventlog.style.top = "-50%";

};

function drawUI() {
	// initialize some things outside the if
	let devhandOverlap, c, devhandSize, devcenter;

	if (ui.menu != "trade") {
		// building placements options
		if (ui.dragObject) {
			ctx.fillStyle = players[ui.index].color;
			let fadedColor = `rgba(${parseInt(ctx.fillStyle[1] + ctx.fillStyle[2], 16)}, ${parseInt(ctx.fillStyle[3] + ctx.fillStyle[4], 16)}, ${parseInt(ctx.fillStyle[5] + ctx.fillStyle[6], 16)}, 0.5)`;
			let fadedLine = "rgba(47, 47, 47, 0.5)";
			switch (ui.dragObject.id) {
			case "road":
				for (let i of ui.accessibleEdges) {
					let [pos, type] = getEdgePos(i);
					drawRoad(pos.x, pos.y, tileRadius, fadedColor, type, mouse.selectedEdge == i && (ui.turn == ui.index && ((ui.gamePhase == 1 && ui.turnPhase == 2) || (ui.gamePhase == 2 && (ui.turnPhase == 2 || ui.turnPhase == 6)))) ? lightColor : fadedLine);
				}
				break;
			case "settlement":
				for (let i of ui.accessibleCorners) {
					let pos = getCornerPos(i);
					drawSettlement(pos.x, pos.y, tileRadius, fadedColor, mouse.selectedCorner == i && (ui.turn == ui.index && ((ui.turnPhase == 2 && ui.gamePhase == 2) || (ui.turnPhase == 1 && ui.gamePhase == 1))) ? lightColor : fadedLine);
				}
				break;
			case "city":
				if (board.corners[mouse.selectedCorner] == ui.index && (ui.turn == ui.index && ui.turnPhase == 2 && ui.gamePhase == 2)) {
					let pos = getCornerPos(mouse.selectedCorner);
					drawSettlement(pos.x, pos.y, tileRadius, "rgba(255, 255, 255, 0)", lightColor);
				}
				break;
			}

		}




		// harbor trade button
		ctx.strokeStyle = lineColor;
		ctx.lineWidth = canvas.height*0.002;
		ctx.fillStyle = "#01afe8";
		ctx.fillRect(harborTradeButtonLeft, harborTradeButtonTop, harborTradeButtonWidth, harborTradeButtonHeight);
		ctx.strokeRect(harborTradeButtonLeft, harborTradeButtonTop, harborTradeButtonWidth, harborTradeButtonHeight);
		ctx.font = "20px Minion Pro";
		ctx.font = min(harborTradeButtonHeight*0.3, 20/ctx.measureText("Harbor").width*harborTradeButtonWidth*0.85) + "px Minion Pro";
		ctx.fillStyle = lineColor;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Harbor", harborTradeButtonLeft + harborTradeButtonWidth/2, harborTradeButtonTop + harborTradeButtonHeight*0.35);
		ctx.fillText("Trades", harborTradeButtonLeft + harborTradeButtonWidth/2, harborTradeButtonTop + harborTradeButtonHeight*0.65);
		if (!(ui.turn == ui.index && ui.turnPhase == 2 && ui.gamePhase == 2)) {
			ctx.fillStyle = "rgba(191, 191, 191, 0.6)";
			ctx.fillRect(harborTradeButtonLeft, harborTradeButtonTop, harborTradeButtonWidth, harborTradeButtonHeight);
		}



		// soldiers
		let x = 0.925*canvas.width;
		let maxWidth = 0.12*canvas.width;
		let width = canvas.height*0.1;
		let spacing = min(width*1.1, maxWidth/players[ui.index].soldiers);
		for (let i = 0; i < players[ui.index].soldiers; i++) {
			drawCard("soldier", x - i*spacing, canvas.height*0.8, width, 0, true);
		}



		// trade menu button bar thing
		ctx.fillStyle = "#eae7df";
		ctx.strokeStyle = lineColor;
		ctx.lineWidth = canvas.height*0.002;
		ctx.fillRect(canvas.width*0.975, canvas.height*0.25, canvas.width*0.03, canvas.height*0.6);
		ctx.strokeRect(canvas.width*0.975, canvas.height*0.25, canvas.width*0.03, canvas.height*0.6);

		ctx.strokeStyle = "#b4b1a9";
		ctx.lineWidth = canvas.height*0.008;
		ctx.beginPath();
		ctx.moveTo(canvas.width*0.995, canvas.height*0.5);
		ctx.lineTo(canvas.width*0.9825, canvas.height*0.55);
		ctx.lineTo(canvas.width*0.995, canvas.height*0.6);
		ctx.stroke();
		


		// development card stack
		for (let i = ui.developmentCardsInStack-1; i >= 2; i -= 3) drawCard("", developmentCardStackX, canvas.height*(0.075+0.00075*i), developmentCardStackWidth, 0, true);
		if (ui.dragObject.id == "new development card" && ui.developmentCardsInStack > 1) drawCard("development_card_back", developmentCardStackX, canvas.height*(0.075+0.00225), developmentCardStackWidth, PI, true);
		let developmentCardStack = ui.d.find(item => item.id == "new development card");
		if (ui.dragObject.id != "new development card") developmentCardStack.x = developmentCardStackX;
		developmentCardStack.bounds.left = developmentCardStackX/canvas.width;
		developmentCardStack.bounds.right = developmentCardStackX/canvas.width;
		developmentCardStack.width = developmentCardStackWidth;
		developmentCardStack.height = developmentCardStackWidth*ui.cardRatio;


		if (ui.developmentCardsInStack > 0) {
			developmentCardStack.show = true;
			if (ui.turn == ui.index && ui.turnPhase == 2 && ui.gamePhase == 2) developmentCardStack.enabled = true;
			else developmentCardStack.enabled = false;
		} else {
			developmentCardStack.show = false;
			developmentCardStack.enabled = false;
		}


		// redimensioning game pieces
		for (let item of ui.d) {
			switch (item.id) {
			case "road":
				item.width = tileRadius*0.6;
				item.height = tileRadius*0.12*3;
				item.bounds.left = (boardCenter.x + tileRadius * 5.5) / canvas.width;
				break;
			case "settlement":
				item.width = tileRadius*0.35;
				item.height = tileRadius*0.4;
				item.bounds.left = (boardCenter.x + tileRadius * 5.5) / canvas.width;
				break;
			case "city":
				item.width = tileRadius*0.55;
				item.height = tileRadius*0.5;
				item.bounds.left = (boardCenter.x + tileRadius * 5.5) / canvas.width;
				break;
			}
		}




		// laying out hands
		// development cards first
		devhandOverlap = 0.5, c = 0, devhandSize = ui.devhand.reduce((acc, cur) => acc + (cur.data.location == 1), -1);
		if (canvas.width*0.15 < devhandSize*canvas.height*0.15*devhandOverlap) devhandOverlap = canvas.width*0.15/(devhandSize*canvas.height*0.15);
		devcenter = 0.875;
		

		for (let i = 0; i < ui.devhand.length; i++) {
			let item = ui.devhand[i];
			if (item.data.location != 1) continue;
			if (item.dragging) {
				c++;
				continue;
			}
			item.width = canvas.height*0.15;
			item.height = item.width*ui.cardRatio;
			if (!item.dragging) {
				item.x = canvas.width*devcenter + (c - devhandSize/2) * devhandOverlap * item.width;
				item.y = canvas.height - item.data.up*item.height*0.3;
				item.defaultPos = new V(item.rpos);
			}
			c++;
		}
	}


	// then resource cards
	c = 0;
	let handOverlap = 0.5, center = 0.5, handSize = ui.hand.reduce((acc, cur) => acc + (cur.data.location == 1), -2);
	if (canvas.width*0.5 < handSize*canvas.height*0.16*handOverlap) {
		handOverlap = canvas.width*0.5/(handSize*canvas.height*0.16);
		if (devhandSize >= 0 && ui.menu != "trade") center = 0.425;
	}

	if (ui.handReversed) {
		handOverlap *= -1;
	}
	

	for (let i = 0; i < ui.hand.length; i++) {
		let item = ui.hand[i];
		if (item.data.location != 1) continue;
        if (item.dragging) {
			c++;
			continue;
		}
		item.width = canvas.height*0.15;
		item.height = item.width*ui.cardRatio;
		if (!item.dragging) {
			item.x = canvas.width*center + (c - handSize/2) * handOverlap * item.width;
			item.y = canvas.height - (1 + item.data.up)*item.height*0.25;
			item.defaultPos = new V(item.rpos);
		}
		c++;
	}






	// other players display
	let y = 0.13;
	for (let i = 0; i < players.length; i++) if (i != ui.index && players[i] != "none") {
		let player = players[i];

		// name
		let fontSize = 3.2;
		ctx.font = fontSize + "vh Minion Pro";
		ctx.font = fontSize * min(1, canvas.width*0.22/ctx.measureText(player.name).width) + "vh Minion Pro";
		ctx.lineWidth = fontSize/3000*canvas.height;
		ctx.fillStyle = player.color;
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		ctx.strokeStyle = lineColor;
		ctx.fillText(player.name, 0.02*canvas.height, y*canvas.height);
		ctx.strokeText(player.name, 0.02*canvas.height, y*canvas.height);

		// cards
		y += 0.02;
		let spacing = 0.02;
		if ((player.cards + player.developmentCards + 4)*spacing > 0.18*canvas.width/canvas.height) {
			spacing = 0.18*canvas.width/canvas.height/(player.cards + player.developmentCards + 4);
		}
		let j = 0;
		for (; j < player.cards; j++) {
			drawCard("back", (0.02 + j*spacing)*canvas.height, y*canvas.height, 0.033*canvas.height);
		}
		j -= 1;
		for (let k = 0; k < player.developmentCards; k++, j++) {
			drawCard("development_card_back", (0.02 + j*spacing + 0.05)*canvas.height, y*canvas.height, 0.033*canvas.height);
		}

		// buildings
		y += 0.085;
		drawCity(0.04*canvas.height, y*canvas.height, 0.07*canvas.height, player.color);
		drawSettlement(0.115*canvas.height, y*canvas.height, 0.07*canvas.height, player.color);
		drawRoad(0.195*canvas.height, y*canvas.height, 0.07*canvas.height, player.color);
		ctx.fillStyle = lineColor;
		ctx.font = "bold 2.25vh Minion Pro";
		ctx.fillText("x" + player.cities, 0.06*canvas.height, y*canvas.height);
		ctx.fillText("x" + player.settlements, 0.13*canvas.height, y*canvas.height);
		ctx.fillText("x" + player.roads, 0.22*canvas.height, y*canvas.height);

		// soldiers
		y += 0.0275;
		spacing = 0.02;
		if ((player.soldiers + 2)*spacing > 0.12*canvas.width/canvas.height) {
			spacing = 0.12*canvas.width/canvas.height/(player.soldiers + 2);
		}
		for (let j = 0; j < player.soldiers; j++) {
			drawCard("soldier", (0.02 + j*spacing)*canvas.height, y*canvas.height, 0.033*canvas.height);
		}

		// separator lines
		y += 0.0675;
		ctx.strokeStyle = lineColor;
		ctx.lineWidth = canvas.height*0.005;
		ctx.beginPath();
		ctx.moveTo(0, y*canvas.height);
		ctx.lineTo(0.03*canvas.height, y*canvas.height);
		ctx.stroke();

		y += 0.03;
	}




	// big cards
	if (ui.longestRoad.data.owner == "none") {
		ui.longestRoad.show = false;
	} else {
		ui.longestRoad.show = true;
		if (ui.longestRoad.data.owner == ui.index) {
			ui.longestRoad.width = 0.13*canvas.height;
			ui.longestRoad.height = ui.longestRoad.width*ui.bigCardRatio;
			ui.longestRoad.rpos.y = 0.89;
			ui.longestRoad.x = 0.09*canvas.height;
		} else {
			let playerY = ui.longestRoad.data.owner - (ui.index < ui.longestRoad.data.owner);
			ui.longestRoad.width = 0.05*canvas.height;
			ui.longestRoad.height = ui.longestRoad.width*ui.bigCardRatio;
			ui.longestRoad.rpos.y = 0.2875 + 0.23 * playerY;
			ui.longestRoad.x = 0.068*canvas.height + 0.12*canvas.width;
		}
		ui.longestRoad.draw();
	}
	if (ui.largestArmy.data.owner == "none") {
		ui.largestArmy.show = false;
	} else {
		ui.largestArmy.show = true;
		if (ui.largestArmy.data.owner == ui.index) {
			ui.largestArmy.width = 0.13*canvas.height;
			ui.largestArmy.height = ui.largestArmy.width*ui.bigCardRatio;
			ui.largestArmy.rpos.y = 0.89;
			ui.largestArmy.x = 0.09*canvas.height + (ui.longestRoad.data.owner == ui.largestArmy.data.owner)*ui.longestRoad.width*1.15;
		} else {
			let playerY = ui.largestArmy.data.owner - (ui.index < ui.largestArmy.data.owner);
			ui.largestArmy.width = 0.05*canvas.height;
			ui.largestArmy.height = ui.largestArmy.width*ui.bigCardRatio;
			ui.largestArmy.rpos.y = 0.2875 + 0.23 * playerY;
			ui.largestArmy.x = 0.068*canvas.height + 0.12*canvas.width + (ui.longestRoad.data.owner == ui.largestArmy.data.owner)*ui.longestRoad.width*1.15;
		}
		ui.largestArmy.draw();
	}




	
};




function drawMonopolyMenu() {
	
};

function drawYopMenu() {

};

function drawHalfMenu() {

};

function drawTradeMenu() {

};





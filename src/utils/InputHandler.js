class InputHandler {

	constructor() {
		this.data = [];
		// for user input intructions
		this.messages = [
			"Mark the diameter of the center",
			"Mark a point in the center on the base and other on the top",
			"Mark " + MAX_POINTS_ZONES + " points to divide the petal in zones"
		];

		// to save the input user data from flower images
		this.currentUserInput = [];

		this.info = {
			distanceCenter: [],
			petalBottonTop: [],
			petalZones: []
		};

		document.getElementById('inputBtn').disabled = true;
	}

	controlMouse(mode) {

		switch (mode) {

			case INPUT_DISTANCE_CENTER:

			if (this.currentUserInput.length < AMOUNT_POINTS_PER_DISTANCE){

				this.currentUserInput.push(
					[ int(mouseX), int(mouseY) ]
				);

				document.getElementById('inputBtn').disabled = true;
			}

			if( this.currentUserInput.length == AMOUNT_POINTS_PER_DISTANCE )
				document.getElementById('inputBtn').disabled = false;
			
			break;

			case INPUT_POINTS_BUTTON_TOP:

			if (this.currentUserInput.length < MAX_POINTS_BUTTON_TOP) {

				this.currentUserInput.push(
					[ int(mouseX), int(mouseY) ]
				);

				document.getElementById('inputBtn').disabled = true;
			}

			if( this.currentUserInput.length == MAX_POINTS_BUTTON_TOP )
				document.getElementById('inputBtn').disabled = false;
			
			break;

			case INPUT_POINTS_ZONES:

			if( this.currentUserInput.length < MAX_POINTS_ZONES ) {
				
				this.currentUserInput.push(
					[
						 int(mouseX), int(mouseY)
					]
				);

				document.getElementById('inputBtn').disabled = true;
			}

			if ( this.currentUserInput.length == MAX_POINTS_ZONES )
				document.getElementById('inputBtn').disabled = false;
			break;

			default:

			// finish the cycle
			this.currentUserInput = [];
			mode = INPUT_POINTS_ZONES;
			createCanvas(
			 	NEW_IMAGE_WIDTH + CANVAS_WIDTH  / IMAGE_AMOUNT,
			 	NEW_IMAGE_HEIGHT
			 );

			break;
		}
	}

	visualize(mode) {

		// show user messages
		fill('#fff');
		text(this.messages[mode], 10, 10, 400, 20);

		switch (mode) {

			case INPUT_DISTANCE_CENTER:

			// show the lines
			if (this.currentUserInput.length != 0) {

				let currentPoint = this.currentUserInput[0];
				strokeWeight( 1 );

				point( currentPoint[X], currentPoint[Y] );

				for (let counter = 0; counter < this.currentUserInput.length; counter++) {

					currentPoint  = this.currentUserInput[ counter ];
					let nextPoint = this.currentUserInput[ (counter + 1) % this.currentUserInput.length];

					point( currentPoint[X], currentPoint[Y] );
					point( nextPoint[X], nextPoint[Y] );

					line ( currentPoint[X], currentPoint[Y], nextPoint[X], nextPoint[Y] );
				}
			}
			break;

			case INPUT_POINTS_BUTTON_TOP:

				for (let counter = 0; counter < this.currentUserInput.length; counter++){
					
					fill('black');
					ellipse(
						this.currentUserInput[counter][0], this.currentUserInput[counter][1],
						RADIUS_POINT , RADIUS_POINT
					);

				}
			break;

			case INPUT_POINTS_ZONES:

				let yMax = this.info.petalBottonTop[1][1];
				let yMin = this.info.petalBottonTop[0][1];

				let zoneDistance = int(dist(this.info.petalBottonTop[0][0], this.info.petalBottonTop[0][1], this.info.petalBottonTop[1][0], this.info.petalBottonTop[1][1]));
				zoneDistance = zoneDistance / MAX_POINTS_ZONES;

				for (let i = yMax; i <= yMin; i += zoneDistance)
					line(0, i, width, i);

				for (let counter = 0; counter < this.currentUserInput.length; counter++){
					fill('red');
					ellipse(this.currentUserInput[counter][0], this.currentUserInput[ counter ][1],
									RADIUS_POINT , RADIUS_POINT);
				}
			break;

			default:

			break;
		}
	}

	nextInput() {

		switch(guiHandler.inputMode) {

			case INPUT_DISTANCE_CENTER:
				this.info.distanceCenter = this.currentUserInput;
			break;

			case INPUT_POINTS_BUTTON_TOP:
				this.info.petalBottonTop = this.currentUserInput;
			break;

			case INPUT_POINTS_ZONES:
				this.info.petalZones = this.currentUserInput;
			break;
		}

		this.currentUserInput = [];
		guiHandler.inputMode++;

		if ( guiHandler.inputMode > INPUT_POINTS_ZONES) {

			console.log("Info ready to use for the image analyzer");
			guiHandler.nextImage();
			document.getElementById('saveDataButton').disable = false;
		}

		document.getElementById('inputBtn').disabled = true;
	}

	saveData() {

		let flowerInfo = flowerGenerator.newFlower;
		saveJSON( flowerInfo, DEFAULT_JSON_FILENAME );
	}

	getData() {
		return this.currentUserInput;
	}
}

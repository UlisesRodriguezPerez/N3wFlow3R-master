class LoopHandler {

	constructor() {

		this.mode = LOOP_USER_INPUT;  		// default value
		this.imageSchemas = imageLoader.getImages(); // get the images schemas loaded
		this.currentImageIndex = 0;
		this.inputHandler = new InputHandler();

		this.inputMode = INPUT_DISTANCE_CENTER; // initial point
	}

	nextImage() {

		/*
			Objective:
				obtain control about the drawing process for every image
		*/

		this.imageSchemas[ this.currentImageIndex ].processed = true;
		this.inputMode = INPUT_DISTANCE_CENTER;

		// save the current data from the input handler
		let recoverData = JSON.parse( JSON.stringify( this.inputHandler.info ) );
		this.inputHandler.data.push( recoverData );

		this.currentImageIndex = (this.currentImageIndex + 1) % IMAGE_AMOUNT;

		if (this.currentImageIndex == 0) {

		 	// when this cycles start again
			 this.mode = LOOP_DRAWING;
			 this.saveData();

			 createCanvas(
			 	NEW_IMAGE_WIDTH + CANVAS_WIDTH  / IMAGE_AMOUNT,
			 	NEW_IMAGE_HEIGHT
			 );
		}

		this.imageSchemas[this.currentImageIndex].showMeta();
	}

	allProcessed() {

		for ( let counter = 0; counter < this.imageSchemas.length; counter++ ) {
			if ( !this.imageSchemas[counter].processed )
				return false;
		}

		return true;
	}

	loop() {

		/*
			Objective:
				switching modes to gui interaction
		*/

		switch( this.mode ) {

			case LOOP_VISUALIZING:
				this.showUserInteractionMode();
			break;

			case LOOP_USER_INPUT:
				this.showUserInteractionMode();
				this.showInputMode();

			break;

			case LOOP_DRAWING:
				this.showDrawProcess();
			break;
		}
	}

	showInputMode() {

		if ( !this.allProcessed() )
			this.inputHandler.visualize( this.inputMode );
		else 
			this.mode = LOOP_DRAWING;
	}

	getImageObject() {

		return this.imageSchemas[this.currentImageIndex].image;
	}

	showUserInteractionMode() {

		// draw the current image
		let currentImage = this.getImageObject();

		currentImage.resize( CANVAS_WIDTH, CANVAS_HEIGHT );

		// show in full size, on the x:0, y:0
		image( currentImage,  0, 0 );
	}

	showDrawProcess() {

		if ( flowerGenerator.ready ) {
			push();
			flowerGenerator.showProcess(); // where the magic happens
			pop();
		}

		// show images on the left side
		for (let counter = 0; counter < this.imageSchemas.length; counter++) {

			this.imageSchemas[ counter ].image.resize(
				CANVAS_WIDTH  / IMAGE_AMOUNT ,
				CANVAS_HEIGHT / IMAGE_AMOUNT
			);

			this.imageSchemas[counter].showImage();
		}
	}

	saveData() {

		// save the data from the input
		flowerGenerator.newFlower.info = JSON.parse( JSON.stringify( this.inputHandler.data ));
		flowerGenerator.imageAnalyzer.data = JSON.parse( JSON.stringify( this.inputHandler.data ));
	}

	setMode(mode) {

		if (mode == ProgramMode.JSON_Mode) {
			this.mode = LOOP_DRAWING;

			// save images with the canvas resolution
			let imgs = imageLoader.fullImages;

			for (let counter = 0; counter < imgs.length; counter++) {

				imgs[ counter ].resize( CANVAS_WIDTH, CANVAS_HEIGHT );
				flowerGenerator.images.push( imgs[counter] );
			}

			console.log("Press space to pause the process");
		}
	}
}

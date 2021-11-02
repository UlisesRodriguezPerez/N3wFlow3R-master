
let guiHandler, imageLoader, programMode, 
	flowerGenerator, imagesIndexes;

const ProgramMode = {
	JSON_Mode:       0,
	User_Input_Mode: 1
};

function preload() {

	imagesIndexes = selectImages();
	imageLoader = new ImageHandler();
	imageLoader.loadImages( imagesIndexes );
}

function setup() {

	angleMode(DEGREES);

	programMode = ProgramMode.JSON_Mode; // to switch the mode
	guiHandler = new LoopHandler( imageLoader.getImages() );

	flowerGenerator = new FlowerGenerator();
	guiHandler.setMode( programMode );

	// program modes
	if ( programMode == ProgramMode.JSON_Mode ) {

		readTextFile( INPUT_FILE_PATH, (text) => {

	   	let data = JSON.parse(text);

	   	let filteredData = filterImagesUsingJson( data.info );

	   	flowerGenerator.newFlower.info = filteredData;
			flowerGenerator.imageAnalyzer.data = filteredData;
			flowerGenerator.imageAnalyzer.getData();

			flowerGenerator.setData( flowerGenerator.imageAnalyzer.info );

			document.getElementById('inputZone').style.display = 'none';
		});

		createCanvas(
			NEW_IMAGE_WIDTH + CANVAS_WIDTH  / IMAGE_AMOUNT,
			NEW_IMAGE_HEIGHT
		);
	}
	else {
		createCanvas(
			CANVAS_WIDTH,
			CANVAS_HEIGHT
		);
	}
}

function draw() {
	guiHandler.loop();
}

function mousePressed() {

	if ( guiHandler.mode == LOOP_USER_INPUT )
		guiHandler.inputHandler.controlMouse(
			guiHandler.inputMode
		);
}

function keyTyped() {
	if ( flowerGenerator != null )
		flowerGenerator.pause = !flowerGenerator.pause;
}

function readTextFile(file, callback) {

	let rawFile = new XMLHttpRequest();
	
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);

	rawFile.onreadystatechange = 
		() => {
		  if (rawFile.readyState === 4 && rawFile.status == "200")
		      callback(rawFile.responseText);
		}

    rawFile.send(null);
}

function selectImages() {

	let inputData = prompt( "Escriba la lista de indices de las flores a usar" );

	try {
		if(inputData == "ALL"){
			imagesIndexes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
		}
		else {
			imagesIndexes = JSON.parse(inputData);
		}

		// check not valid indexes
		if ( imagesIndexes.find( (e) => e < 0 || e >= TEST_IMAGES_AMOUNT ) || imagesIndexes.length == 0 ) {
			alert("Debe ser al menos un valor entre 0 y 18");
			return selectImages();
		}

	} catch(e) {
		alert("Debe insertar una lista valida");
		return selectImages();
	}

	return imagesIndexes;
}

function filterImagesUsingJson(jsonData) {

	// filter the images with the given images indexes

	let data = [];

	for (let counter = 0; counter < imagesIndexes.length; counter++ )
		data.push( jsonData[ imagesIndexes[ counter ] ] );	

	return data;
}

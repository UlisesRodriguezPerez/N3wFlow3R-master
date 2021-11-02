class ImageAnalyzer {

	constructor( data ) {

		this.data = data;

		this.info = {
			centerPoint : [],
			centerRadius : 0,
			petalHeight : 0,
			petalAmount  : 0
		};

		this.colorData = null;
	}

	getData() {

		// get the info for the shape generator
		let centerPoint = [];
		let centerRadius = 0;
		let maxHeight = 0;
		let petalAmount = 0;

		for ( let counter = 0 ; counter < this.data.length; counter++ ) {

			let middlePoint =
				flowerGenerator.getMiddlePointOfCenter(
					this.data[counter].distanceCenter[X],
					this.data[counter].distanceCenter[Y]
				);

			centerRadius +=
				flowerGenerator.getCenterRadius(
					this.data[counter].distanceCenter[X],
					this.data[counter].distanceCenter[Y] 
				);

			// get the average height of the petals
			maxHeight += 
				flowerGenerator.getPetalHeight( this.data[counter].petalZones );

		   petalAmount += this.data[counter].petalAmount;
		}

		centerRadius /= this.data.length;
		maxHeight   /= this.data.length;
		petalAmount  /= this.data.length;

		this.info.centerPoint = [ NEW_IMAGE_WIDTH / 2, NEW_IMAGE_HEIGHT / 2 ];
		this.info.centerRadius = centerRadius;
		this.info.petalHeight = maxHeight;
		this.info.petalAmount = petalAmount;

		// call the greedy algorithm for color
		this.colorData = this.getBestColorPerZone( );
	}

	getColorByLigthness( colorZones ){	//Greedy

		/*
			Recibe la lista de zonas de una flor

		Objetivo:

		->  O(n) siendo n la cantidad de pixeles a recorrer

		#greedyAlgorithm
		
		#Planteamiento
		
		Subestructura: lista de zonas con colores de un petal
		Criterio de seleccion: el pixel que tenga la luminosidad más alta
		Etapas: cada zona
		Optimo: color que cumple el criterio de seleccion ( luminosidad más alta )
		*/

		let choosedColor = null;
		let colorsList = []; // 

		for( let zoneCounter = 0; zoneCounter < colorZones.length; zoneCounter++ ){ 
			
			choosedColor = colorZones[zoneCounter][0]; // choose the first
			
			for( let colorCounter = 0; colorCounter < colorZones[zoneCounter].length; colorCounter++ ){ //100 pixeles
				let colorToCompare = colorZones[zoneCounter][colorCounter];

				choosedColor = lightness(choosedColor) > lightness(colorToCompare) ? choosedColor : colorToCompare;

			}

			colorsList.push(choosedColor);
		}

		return colorsList;
	}

	getBestColorPerZone() {

		// mix the getted colors from the greedy algorithm and
		// return the average color

		let pixelsZonesPerImage = this.getZonesPerImages();
		let colorZones = [];

		for( let zoneCounter = 0; zoneCounter < pixelsZonesPerImage.length; zoneCounter++ ) { 														   
			
			let colorZonesPerPetal = this.getColorByLigthness( pixelsZonesPerImage[zoneCounter] );

			for( let counter = 0; counter < colorZonesPerPetal.length; counter++ )
				colorZones.push(
					colorZonesPerPetal[ counter ]
				);																		
		}

		return colorZones;
	}

	getPixelsAround( xPosition, yPosition, image ) {

		/*
			Objective:
			Given a position and image with their pixels get
			the nearest distance, according to MAX_PIXEL_DISTANCE in a round area

			->  O(n)   siendo n la cantidad de pixeles en la imagen
		*/

		let nearestPixels = [];

		let xLowestLimit  = xPosition - MAX_PIXEL_DISTANCE / 2;
		let xHighestLimit = xPosition + MAX_PIXEL_DISTANCE / 2;

		let yLowestLimit  = yPosition - MAX_PIXEL_DISTANCE / 2;
		let yHighestLimit = yPosition + MAX_PIXEL_DISTANCE / 2;

		for ( let x = xLowestLimit; x < xHighestLimit; ++x ) {
			for ( let y = yLowestLimit; y < yHighestLimit; ++y) {
				nearestPixels.push( image.get(x, y) );
			}
		}

		return nearestPixels;
	}

	getPixelsAroundZones( zonePoints, image ) {

		/*
			Objective:
			Given a position in the zones and image with their pixels get
			the nearest distance, according to MAX_PIXEL_DISTANCE in a round area

			->  O(n)   siendo n la cantidad de pixeles en la imagen
		*/

		let nearestPixels = [];

		let choosedZone = int(  (MAX_POINTS_ZONES - 2) / MAX_COLOR_ZONES );
		let addZoneAux = choosedZone;

		let xPosition = zonePoints[0][X];
		let yPosition = 0;

		for( let counterZones = 0; counterZones < MAX_COLOR_ZONES; counterZones++ ){
			
			yPosition = zonePoints[ choosedZone ][Y];

			// add the pixels around
			nearestPixels.push( ImageUtils.getPixelsAround( xPosition, yPosition, image ) );
			choosedZone += addZoneAux;
		}

		return nearestPixels;
	}

	getZonesPerImages( ){

		let images = imageLoader.fullImages;
		let zonesList = [];

		for( let imageCounter = 0; imageCounter < images.length; imageCounter++ ) {
			zonesList.push( 
				this.getPixelsAroundZones( 
					this.data[imageCounter].petalZones , 
					images[imageCounter]
				)
			);
		}

		return zonesList;
	}

}

class ImageUtils {

	static isSameTone(mainColor, otherColor) {

		/*
			Objective:
			iterating the r, g, b values check if both colors are similar

			->  O(c)
		*/

		for (let counter = 0; counter < RGB_SIZE; counter++) {

			let colorDistance = abs( mainColor[counter]  - otherColor[counter] );

			if ( colorDistance > MAX_TONE_RANGE )
				return false;
		}

		return true;
	}

	static getPixelsAround( xPosition, yPosition, image ) {

		/*
			Objective:
			Given a position and image with their pixels get
			the nearest distance, according to MAX_PIXEL_DISTANCE in a round area

			->  O(n)   siendo n la cantidad de pixeles en la imagen
		*/

		let nearestPixels = [];

		let xMinLimit = xPosition - MAX_PIXEL_DISTANCE / 2;
		let xMaxLimit = xPosition + MAX_PIXEL_DISTANCE / 2;

		let yMinLimit = yPosition - MAX_PIXEL_DISTANCE / 2;
		let yMaxLimit = yPosition + MAX_PIXEL_DISTANCE / 2;

		for ( let x = xMinLimit; x < xMaxLimit; ++x ) {
			for ( let y = yMinLimit; y < yMaxLimit; ++y ) {
				nearestPixels.push(  image.get(x, y) );
			}
		}

		return nearestPixels;
	}

	static getZonesPerImages( ){

		let images = imageLoader.fullImages;
		let zonesList = [];

		for( let imageCounter = 0; imageCounter < images.length; imageCounter++ ){

			zonesList.push( this.getPixelsAroundZones( this.data[imageCounter].petalZones , images[imageCounter]));
		}

		return zonesList;
	}

	static getPixelsAroundZones( zonePoints, image ) {

		/*
			Objective:
			Given a position in the zones and image with their pixels get
			the nearest distance, according to MAX_PIXEL_DISTANCE in a round area

			->  O(n)   siendo n la cantidad de pixeles en la imagen
		*/

		let nearestPixels = [];

		let choosedZone = int(  (MAX_POINTS_ZONES - 1) / MAX_COLOR_ZONES );

		let addZoneAux = choosedZone;
		let xPosition = zonePoints[0][X];

		for( let counterZones = 0; counterZones < MAX_COLOR_ZONES; counterZones++ ){
			
			let yPosition = zonePoints[ choosedZone ][Y];

			// add the pixels around
			nearestPixels.push( 
				this.getPixelsAround( xPosition, yPosition, image ) 
			);

			choosedZone += addZoneAux;
		}

		return nearestPixels;
	}

	static rotatePoint(initialPoint, otherPoint, angle) {
  	  
	  	let translated = [];
	  	
	  	for (let i = 0; i < otherPoint.length; i++)
	   	translated.push( otherPoint[i] - initialPoint[i]  );

	  	let rotated = [
	   	translated[X] * cos( angle ) - translated[Y] * sin(angle),
	   	translated[X] * sin( angle ) + translated[Y] * cos(angle),
	  	];
	  
	  let rotatedPoint = [];

	  for (let i = 0; i < initialPoint.length; i++)
	    rotatedPoint.push( rotated[i] + initialPoint[i]  );
	  
	  return rotatedPoint;
	}
}

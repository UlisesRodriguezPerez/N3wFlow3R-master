class IndividualStem {

	constructor( points, width ) {
		this.points = points;
		this.width = width;

		this.fitnessScore = 0;
	}

	fitness( stemData ) {

		// distance between x's
		let netDistance = 0;
		let factor = -1;

		// to use the center of the ( flower / image )
		let currentPoint = [ NEW_IMAGE_WIDTH / 2, NEW_IMAGE_HEIGHT / 2 ]; 

		for (let pointCounter = 0; pointCounter < this.points.length - 1; pointCounter++) {

			let nextPoint = this.points[ pointCounter ];
			netDistance += pow( factor, pointCounter ) * abs( currentPoint[X] - nextPoint[X] );

			currentPoint = this.points[ pointCounter + 1];
		}

		netDistance *= netDistance;

		// punishment for the points out
		let outPunishment = 0;

		for (let pointCounter = 0; pointCounter < this.points.length; pointCounter++) {

			let currentPoint = this.points[ pointCounter ];

			// widthCoordinates correspond to the points that give us the flower width, 
			// to calculate if the stem have articulation points out of the range
			let inRange = 
				currentPoint[X] >= stemData.widthCoordinates[0][X] && 
				currentPoint[X] <= stemData.widthCoordinates[1][X];

			if ( !inRange ) {

				// if the point is out for the left or the right, we
				// punish that distance to the total score
				let punish = ( currentPoint[X] < stemData.widthCoordinates[0][X] )
					? currentPoint[X] - stemData.widthCoordinates[0][X] 
					: currentPoint[X] - stemData.widthCoordinates[1][X];

				outPunishment += punish*punish;					
			}
		}

		// need to aproximate the stem width of the given data
		let diffWidth = abs( stemData.stemWidth - this.width );
		diffWidth *= diffWidth;

		// set the fitness value to the individual
		this.fitnessScore = netDistance + outPunishment + diffWidth;

		return this.fitnessScore;
	}

	show( stemColor, stemData ) {

		// set the line width
		strokeWeight( this.width );
		stroke( stemColor );

		for (let pointCounter = 0; pointCounter < this.points.length - 1; pointCounter++) {

			let currentPoint = this.points[ pointCounter ];
			let nextPoint = this.points[ pointCounter + 1];

			line( currentPoint[X], currentPoint[Y], nextPoint[X], nextPoint[Y] );
		}
	}
}
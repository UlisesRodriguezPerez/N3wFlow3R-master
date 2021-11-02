class IndividualPistil{

  constructor( length ) {

    this.length = length;
    this.fitnessScore = 0;

    this.mappedLength = map( this.length, 0, MAX_VALUE, 0, NEW_IMAGE_WIDTH );
  }

  fitness( centerRadius ) {

    let score = abs( int(this.mappedLength / 2) - centerRadius );

    this.fitnessScore = score;

    return score;
  }

  show( centerColor ){

    stroke( centerColor );
    line( -this.mappedLength / 2, 0, this.mappedLength / 2, 0 );
  }
}

class IndividualShape{

  constructor( zone, length, heightPerZone ) {

    this.length = length;
    this.zone = this.fitnessScore = 0;
    this.unnormalizedZone = zone;
    this.zone = int(zone /  heightPerZone);
  }

  fitness( petalData, heightPerZone ) {

    /*
    petalData:
      [ 0, N ] siendo N la cantidad de zonas
      Zi = [ xDistance ] 
    */

    let score = 0;

    // 1. Evaluate the distance of the line respect to the zone
    let zoneDistance = 0;

    for (let petalCounter = 0; petalCounter < petalData.length; petalCounter++) {
      score += abs( this.length - petalData[ petalCounter ][ this.zone ] );
    }
    
    // save the score
    this.fitnessScore = score;

    return score;
  }
  
  show( x, y, shapeColor ){

    stroke( shapeColor );
    line( x, y - this.unnormalizedZone, x + this.length - 1, y - this.unnormalizedZone);
  }
}

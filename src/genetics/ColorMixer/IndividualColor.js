class IndividualColor{

  constructor( genotype, phenotype ) {  

    this.genotype = genotype; // is a integer number between 0-65535
    this.brightnessValue = brightness(phenotype); // is a RGB color to avoid convert any time to use fitness
    this.generatedColor = phenotype;

    this.fitnessScore = 0; // to sort the population later
  }

  fitness( brightnessPercentaje, darknessPercentage ) {
    
    //evaluate which are the best values
    let score = 0;

    let currentBrightnessPercentaje = this.brightnessValue / 100;

    let brightnessProportion = 
      ( brightnessPercentaje - currentBrightnessPercentaje) / brightnessPercentaje;

    let darknessProportion = 
      ( darknessPercentage - currentBrightnessPercentaje) / darknessPercentage;

    score = brightnessProportion + darknessProportion;
   
    this.fitnessScore = score;
  }
 
}

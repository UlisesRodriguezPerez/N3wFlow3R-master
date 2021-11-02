class PistilGenerator {

  constructor( centerData ) {

    this.centerInfo = centerData;

    // creating the initial population
    this.population = this.createPopulation();

    // to pause and finalize the generation process
    this.finished = false;  

    // to acumulate the fitness sum for each individual
    this.fitnessSum = Infinity;  

    // current zones to regenerate
    this.linesToFill = 0;

    // length of the circunference
    this.circunference = 2 * PI * this.centerInfo.centerRadius;

    // generations amount to show
    this.generationVisualizeRate = 20;

    // shape process info
    this.info = {
      generationNumber : 0,
      populationSize: 0, // TODO: adjust the population size by given data
      averageFitness: Infinity
    };
  }

   process() {

    if ( !this.finished ) {

      this.setFitness();

      this.naturalSelection();

      while ( this.linesToFill > 0 ) {
        this.mutation();
        this.crossover(); 
      }

      if ( this.info.averageFitness < 1 )
        this.finished = true;

      this.updateInfo();
    }
  
    this.visualize();    
  }

  createPopulation( ) {

    let newPopulation = [];

    let linesAmount = int( 2 * PI * this.centerInfo.centerRadius );

    for ( let zoneCounter = 0; zoneCounter < linesAmount ; zoneCounter++ ) {
        
        let lengthChromosome = 
          createChromosomeCode();

        let newIndividual = 
          new IndividualPistil( lengthChromosome );

        newPopulation.push( newIndividual );
    }

    return newPopulation;
  }

  setFitness() {

    let fitnessSum = 0;

    // for each indivual values add the fitness
    for (let counter = 0; counter < this.population.length; counter++) 
       fitnessSum += this.population[ counter ].fitness( this.centerInfo.centerRadius );

    for (let counter = 0; counter < this.population.length; counter++) 
      this.population[ counter ].fitnessScore /= fitnessSum;

    this.fitnessSum = fitnessSum < this.fitnessSum ? fitnessSum : this.fitnessSum;
  }

  naturalSelection() {

    let amount = 2;

    // sort by fitness value
    this.population.sort( (a, b) => a.fitnessScore - b.fitnessScore );

    while( amount-- > 0) {
      this.population.pop();
      this.linesToFill++;
    }
  }

  mutation() {
    
    let randomNumber = int( random( 0, this.population.length ));

    let mutateCandidate = this.population[ randomNumber ];  

    let mutatedLength = 
      mutate( mutateCandidate.lengthCode );

    let newChromosome = 
      new IndividualPistil( mutatedLength );

    this.population.push( newChromosome );    
    this.linesToFill--;
  }

  crossover() {

    let randomIndex = int(random( 0, this.population.length - 1 ));

    // selecting two individuals
    let firstIndividual  = this.population[ randomIndex ];
    let secondIndividual = this.population[ randomIndex + 1 ];

    let crossedLength = 
      crossover( 
        firstIndividual.length, 
        secondIndividual.length
      );

    let newChromosome = 
      new IndividualPistil( crossedLength );

    // add the new individual shape
    this.population.push( newChromosome );
    this.linesToFill--;
  }

  visualize( ) {

    // move to the center of the flower draw section
    translate( 
      CANVAS_WIDTH / IMAGE_AMOUNT + NEW_IMAGE_WIDTH / 2,
      NEW_IMAGE_HEIGHT / 2 
    );

    let angleMovement = int( this.circunference ) / this.population.length;

    let pistilColor = 
      flowerGenerator.colorGen.population[ 
        flowerGenerator.colorGen.population.length - 1
      ].generatedColor;

    for (let populationCounter = 0; populationCounter < this.population.length; populationCounter++) {

      this.population[ populationCounter ].show( pistilColor );
      rotate( angleMovement );
    }  
  }

  updateInfo() {

    this.info.generationNumber++;
    this.info.populationSize =  this.population.length;

    // update fitness average
    let fitnessAvg = this.fitnessSum / this.population.length
    this.info.averageFitness = fitnessAvg < this.info.averageFitness ? fitnessAvg : this.info.averageFitness;
  }

}

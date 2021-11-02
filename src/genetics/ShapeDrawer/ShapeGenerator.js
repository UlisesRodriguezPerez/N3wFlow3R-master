class ShapeGenerator {

  constructor( shapeData, petalData ) {

    // data getted from input process and greedy algorithms
    this.petalInfo = shapeData; 
    this.petalData = petalData;

    // Individual lines per zone
    this.amountPerZone = int( this.petalInfo.petalHeight / MAX_POINTS_ZONES );
    this.linesAmount = MAX_POINTS_ZONES * this.amountPerZone;

    // creating the initial population
    this.population = this.createPopulation();

    // to pause and finalize the generation process
    this.pause = false;
    this.finished = false;  

    // to acumulate the fitness sum for each individual
    this.fitnessSum = Infinity;  

    // current zones to regenerate
    this.zonesToRegenerate = [];

    // mutation and crossing rate
    this.mutationRate = 0.1;
    this.crossingRate = 0.1;

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

      while ( this.zonesToRegenerate.length > 0 ) {

        let chooser = random();

        if ( chooser < 0.5)
          this.mutation();
        else 
          this.crossover(); 
      }

      if ( this.info.averageFitness < 0.2 )
        this.finished = true;
    }

    this.visualize();
    this.updateInfo();
  }

  createPopulation( ) {

    let newPopulation = [];

    for ( let zoneCounter = 0; zoneCounter < this.linesAmount ; zoneCounter++ ) {
        
        let lengthChromosome = 
          createChromosomeCode();

        let newIndividual = 
          new IndividualShape( 
            zoneCounter,
            lengthChromosome,  
            this.amountPerZone
          );

        newPopulation.push( newIndividual );
    }

    return newPopulation;
  }

  setFitness() {

    let fitnessSum = 0;

    // for each indivual values add the fitness
    for (let counter =  0; counter < this.population.length; counter++) { 
       fitnessSum += this.population[ counter ].fitness( this.petalData, this.amountPerZone );
    }

    for (let counter = 0; counter < this.population.length; counter++) 
      this.population[ counter ].fitnessScore /= fitnessSum;

    this.fitnessSum = fitnessSum < this.fitnessSum ? fitnessSum : this.fitnessSum;

    let fitnessAvg = this.fitnessSum / this.population.length
    this.info.averageFitness = fitnessAvg < this.info.averageFitness ? fitnessAvg : this.info.averageFitness;
  }

  naturalSelection() {

    let amount = 2;
    //let amount = int(this.population.length / 4);

    // sort by fitness value
    this.population.sort( (a, b) => a.fitnessScore - b.fitnessScore );

    while( amount-- > 0)
      this.zonesToRegenerate.push( this.population.pop().unnormalizedZone );
  }

  mutation() {

    let mutateCandidate = this.population[ int(random( 0, this.population.length )) ];
    
    let mutatedLength = 
      mutate( mutateCandidate.length );

    let newChromosome = 
      new IndividualShape(
        this.zonesToRegenerate.pop(),
        mutatedLength,
        this.amountPerZone
      );

    this.population.push( newChromosome );    
  }

  crossover() {

    let randomIndex = int(random(1, 10)); // to choose in the top ten

    let firstChromosome =  this.population[ 0 ];
    let secondChromosome = this.population[ randomIndex ];

    let lengthCode = crossover( firstChromosome.length, secondChromosome.length );

    let newChromosome = 
      new IndividualShape( 
        this.zonesToRegenerate.pop(), 
        lengthCode, 
        this.amountPerZone 
      );

    // add the new individual shape
    this.population.push( newChromosome );    
  }

  visualize( ) {

    let centerPoint  = this.petalInfo.centerPoint;
    let centerRadius = this.petalInfo.centerRadius;
    let petalAmount  = int( this.petalInfo.petalAmount );

    // move to the center of the flower draw section
    translate( 
      CANVAS_WIDTH  / IMAGE_AMOUNT + NEW_IMAGE_WIDTH / 2,
      NEW_IMAGE_HEIGHT / 2 
    );

    let angleMovement = 360 / petalAmount;    

    let colorsByGenerator = flowerGenerator.colorGen.population;
    let colorCounter = 0;

    for (let petalCounter = 0; petalCounter < petalAmount; petalCounter++) {

      for (let individualCounter = 0; individualCounter < this.population.length; individualCounter++) {

        // draw on right
        this.population[ individualCounter ].show( 
          0, 
          - centerRadius, 
          colorsByGenerator[ this.population.length-1 - colorCounter ].generatedColor
        );
        

        // draw on left
        this.population[individualCounter].show( 
          - this.population[individualCounter].length, 
          - centerRadius, 
          colorsByGenerator[  colorCounter ].generatedColor
        );

        colorCounter = colorCounter + 1;
      }

      colorCounter = 0;

      rotate( angleMovement );
    } 
  }

  updateInfo() {

    this.info.generationNumber++;
    this.info.populationSize =  this.population.length;

    // update fitness average
    let fitnessAvg = this.fitnessSum / this.population.length
    this.info.averageFitness = fitnessAvg < this.info.averageFitness ? fitnessAvg : this.info.averageFitness;

    // show stadistics
    fill('white');
    stroke(0);
    textSize(15);
    text("Generation: " + this.info.generationNumber, -250, 180);
    text("Population: " + this.info.populationSize, -250, 200);
    text("Average Fitness: " + this.info.averageFitness.toFixed(2), -250, 220);
    text("Fitness Sum: " + this.fitnessSum.toFixed(2), -250, 240);
  }

}

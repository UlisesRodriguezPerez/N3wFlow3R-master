class GeneticColorProcessor{

  constructor( greedyData, targetAmount, table, 
    brightnessPercentage, selectionProportionAmount, mutationRate ) {
    
    // proportion targets to the design of the flower color
    this.brightnessPercentajeTarget = brightnessPercentage; 
    this.darknessPercentajeTarget = 100 - brightnessPercentage;

    // for select n * (selectionProportionAmount) amount for the next parents of the generation
    this.selectionProportionAmount = selectionProportionAmount / 100;

    // to the phenotype representation
    this.table = table; 

    // data getted from input process and greedy algorithms, the most 3 brightest color per flower
    this.colorData = greedyData; 

    // population amount to reach with the genetic process
    this.targetAmount = int(targetAmount); 
    
    //console.log('taget in GA', targetAmount); 
    
    // creating the initial population
    this.population = this.createPopulation(this.targetAmount);

    this.fittests = [];
  
    this.pause = this.finished = false;   // to pause and finalize the generation process
    
    this.fitnessSum = 0;  // to acumulate the fitness sum for each individual

    // limit for the color generation
    this.generationLimit = COLOR_GENERATION_AMOUNT;

    // mutation rate
    this.mutationRate = mutationRate;

    this.info = {
      generationNumber : 0,
      populationSize: 0, 
      averageFitness: Infinity
    };

  }

  process() {
  
    if ( !this.finished ) {

      // evaluate each individual
      this.setFitness();

      // reset the fittests
      this.fittests = [];

      // sort by fitness value
      this.population.sort( (a, b) => a.fitnessScore - b.fitnessScore );

      // selecting process
      this.selectTheBestColors();

      // fill the population to get the target amount
      this.fillPopulation();  

      // replace for the selected group, the parents for the next generation
      this.population = this.fittests;   

      this.population.sort( (b, a) => a.brightnessValue - b.brightnessValue  );
      
      if ( this.info.generationNumber >= this.generationLimit ){
        
        this.finished = true;

        this.population.sort( (b, a) => a.brightnessValue - b.brightnessValue  );

        console.log( "Genetic Color Procesor is complete: ", this.population );
      }
      else
        this.updateInfo();

    }
  }

  selectTheBestColors() {

    // select a proportion of the population
    let amountToSave = int(this.targetAmount * this.selectionProportionAmount);

    let brightnessAmount = 
      (amountToSave * ( (this.brightnessPercentajeTarget / 100) ) );
  
    let darknessAmount = 
      (amountToSave * ( (this.darknessPercentajeTarget / 100) ) );
   

    // select the darknest colors, using the sorted population (highBrightness -> lowBrightness)
    while ( darknessAmount > 0 ) {
      this.fittests.push( this.population.pop() );
      darknessAmount--;
    }
    
    // select the brightness colors, using the sorted population (highBrightness -> lowBrightness)
    while ( brightnessAmount > 0 ) {

      this.fittests.push( this.population.shift() );
      brightnessAmount--;
    }  
   
  }

  fillPopulation() {

    let amountToFill = this.population.length;
    
    while ( amountToFill > 0 ) {

      let firstParent  = this.fittests[ int( random(0, this.fittests.length) )];
      let secondParent = this.fittests[ int( random(0, this.fittests.length) )];

      let genotypeChild = crossover( firstParent.genotype, secondParent.genotype );

      if ( random() < this.mutationRate ) {
        genotypeChild = mutate( genotypeChild );
      }

      let newChild = 
        new IndividualColor( genotypeChild, this.convertGenotypeToPhenotype(genotypeChild) );

      this.fittests.push( newChild );

      amountToFill--;
    }
  }

  classifyWithRepresentationTable( genoType ) {

    // using the table return the position using the ranges
    
    for ( let rowCounter = 0; rowCounter < this.table.length; rowCounter++ ) {

      let currentRow = this.table[ rowCounter ];

      let inRange = 
        genoType >= currentRow[ TABLE_POS.MIN_GENO_RANGE ] &&
        genoType <= currentRow[ TABLE_POS.MAX_GENO_RANGE ] ;

      if ( inRange ) 
        return rowCounter;
    }

    return -1;
  }

  convertGenotypeToPhenotype( genoValue ) {

  
    let tablePosClassify = this.classifyWithRepresentationTable( genoValue );

    let tableRow = this.table[ tablePosClassify ];

    let minRange = tableRow[ TABLE_POS.MIN_GENO_RANGE ];
    let maxRange = tableRow[ TABLE_POS.MAX_GENO_RANGE ];

    let combinationsAmount = maxRange - minRange;

    let rgbDistance = 0;
    let rgbCombinations = 
      tableRow[ TABLE_POS.MAX_RED ] - tableRow[  TABLE_POS.MIN_RED ];
    
    for ( let rgbCounter = 2; rgbCounter < RGB_SIZE * 2; rgbCounter += 2 ) {

      let minRange = rgbCounter, maxRange = rgbCounter + 1;

      rgbCombinations *= 
        tableRow[ maxRange ] - tableRow[ minRange ];
    }

    let steps = int( rgbCombinations / combinationsAmount );
    let stepsForGenoValue = genoValue - minRange;

    let combinationNumberForGenoValue = int(stepsForGenoValue * steps);
   
    return this.generateColor( combinationNumberForGenoValue );
  }

  generateColor( genoValue ) {

    let rgbScale = [0, 0, 0], total = genoValue;
  
    let tablePosClassify = this.classifyWithRepresentationTable( genoValue );
    
    for (let counter = RGB_SIZE * 2 - 1; counter > 0; counter-= 2 ) {
      
      let minValue = this.table[ tablePosClassify ][ counter - 1 ]; 
      let maxValue = this.table[ tablePosClassify ][ counter ];

      let currentRange = abs(maxValue - minValue);

      rgbScale[ int(counter/2) ] = minValue + (total % currentRange);

      total = int(total / currentRange);
    }

    return color( rgbScale[R], rgbScale[G], rgbScale[B] );
  }

  createPopulation(targetAmount) { 
    //
    let newPopulation = [];

    while (targetAmount > 0) {

      let genotype = createChromosomeCode(); //value from 0 to ( (2 ^ 16) - 1)
      newPopulation.push( new IndividualColor( genotype, this.convertGenotypeToPhenotype(genotype) ) ); 
      targetAmount--;
    }

    return newPopulation;
  }

  setFitness() {
    
    this.fitnessSum = 0;

    for (let populationCounter = 0; populationCounter < this.population.length; populationCounter++) 
      this.fitnessSum += 
        this.population[ populationCounter ].fitness( this.brightnessPercentage, this.darknessPercentage );
  }
  
  updateInfo() {

    this.info.generationNumber++;
    this.info.populationSize =  this.population.length;

    // update fitness average
    let fitnessAvg = this.fitnessSum / this.population.length
    this.info.averageFitness = fitnessAvg < this.info.averageFitness ? fitnessAvg : this.info.averageFitness;
  }
}

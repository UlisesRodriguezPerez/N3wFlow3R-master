const POINTS_PER_STEM = 6;
const POPULATION_AMOUNT = 10;

class StemGenerator {

	constructor( stemData ) {

		// data getted from input process and greedy algorithms
		this.stemData = stemData; 

		// creating the initial population
		this.population = this.createPopulation();

		// to pause and finalize the generation process
		this.pause = false;
		this.finished = false;  

		// to acumulate the fitness sum for each individual
		this.fitnessSum = Infinity;  

		this.amountToRevoke = 3;

		// generations amount to show
		this.generationVisualizeRate = 20;

		// the best stem until now
		this.bestStem = null;

		// shape process info
		this.info = {
			generationNumber : 0,
			populationSize: 15, 
			averageFitness: Infinity
		};
	}

	process() {

		if ( !this.finished ) {

			this.setFitness();
			this.naturalSelection();
			
			let chooser = random(), amountToFill = this.amountToRevoke;

			while( amountToFill-- > 0 ) {
				if (  chooser < 0.6 )
					this.mutation(); 
				else
	  				this.crossover();
  			}

			if ( this.info.averageFitness < 1 )
				this.finished = true;
			
			this.visualize();
			this.updateInfo();
		}

		this.visualize();
	}

	createPopulation() {

		let newPopulation = [];

		for ( let counter = 0; counter < POPULATION_AMOUNT; counter++ ) {

			// generate random points
			let y = 0;
			
			let points = [];
			for ( let pointCounter = 0; pointCounter < POINTS_PER_STEM; pointCounter++ ) {
				
				points.push( [ int(random(0, NEW_IMAGE_WIDTH)), y ] );
				y += NEW_IMAGE_WIDTH  / POINTS_PER_STEM;
			}

			// generate random width
			let width = int(random( 0, this.stemData.stemWidth ));

			let newIndividual = 
				new IndividualStem(
					points, width
				);

			newPopulation.push( newIndividual );
		}

		return newPopulation;
	}

	setFitness() {

		let fitnessSum = 0;

		// for each indivual values add the fitness
		for (let counter =  0 ; counter < this.population.length; counter++) 
			fitnessSum += this.population[ counter ].fitness( this.stemData );
		
		for (let counter = 0; counter < this.population.length; counter++) 
			this.population[ counter ].fitnessScore /= fitnessSum;

		this.fitnessSum = fitnessSum < this.fitnessSum ? fitnessSum : this.fitnessSum;
	}

	naturalSelection() {

		let amount = this.amountToRevoke;
		
		// sort by fitness value
		this.population.sort( (a, b) => a.fitnessScore - b.fitnessScore );

		this.bestStem = this.population[0];

		while( amount-- > 0)
			this.population.pop();
	}

  	mutation() {

		// TODO: experimentar con el porcentaje
		let mutationRate = 0.35;

		// choose one of the top ten
		let goodOneStem = this.population[ int(random(0, this.population.length)) ];

		let newPoints = [];

		for (let pointCounter = 0; pointCounter < POINTS_PER_STEM; pointCounter++) {

			let currentPoint = goodOneStem.points[ pointCounter ];
			currentPoint[X] = currentPoint[X] + int( random(-1, 1) ) * currentPoint[X] * mutationRate;

			newPoints.push( currentPoint );
		}

		// build the mutated stem
		let mutatedWidth = goodOneStem.width + int( random(-1, 1) ) * goodOneStem.width * mutationRate;

		let newChromosome = 
			new IndividualStem( 
				newPoints, 
				mutatedWidth
			);

		this.population.push( newChromosome );  
  	}

  	crossover() {

  		// choose one of the top 5 and to the top 10
		let firstGoodStem  = this.population[ int(random(0, this.population.length)) ];
		let secondGoodStem = this.population[ int(random(0, this.population.length)) ];

		let newPoints = [];

		for (let pointCounter = 0; pointCounter < POINTS_PER_STEM; pointCounter++) {

			let chooser = random();

			let xCoord = chooser < 0.5 
				? firstGoodStem.points[ pointCounter ] [X]
				: secondGoodStem.points[ pointCounter ][X];
			
			let yCoord = chooser < 0.5 
				? secondGoodStem.points[ pointCounter ][Y]
				: firstGoodStem.points[ pointCounter ] [Y]; 
		
			newPoints.push( [xCoord, yCoord] );
		}

		// let crossedPoints = firstMiddle.concat( secondMiddle );
		//width of the steam
		let widthPropotion = random();
		let crossedWidth = 
			firstGoodStem.width * widthPropotion + secondGoodStem.width * ( 1 - widthPropotion);

		let newChromosome = 
			new IndividualStem( newPoints, crossedWidth );
			
		// add the new individual shape
		this.population.push( newChromosome );  
  	}

  visualize() {

	  	translate( 
	  		CANVAS_WIDTH / IMAGE_AMOUNT, 
	  		NEW_IMAGE_HEIGHT / 2
	  	);

	  	let stemColor = color("#038726");

	  	//this.bestStem.show(stemColor, this.stemData);

		for (let populationCounter = 0; populationCounter < this.population.length; populationCounter++) {
			this.population[ populationCounter ].show( stemColor, this.stemData );
		}

  }

   updateInfo() {

		this.info.generationNumber++;
		this.info.populationSize = this.population.length;

		// update fitness average
		let fitnessAvg = this.fitnessSum / this.population.length;
		this.info.averageFitness = fitnessAvg < this.info.averageFitness ? fitnessAvg : this.info.averageFitness;
  }
  
}
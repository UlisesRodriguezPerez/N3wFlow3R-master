/*
	Genetics utils: handling chromosome transformations
*/
function mutate( chromosome ) {

	let randomBit = random( 0, MAX_BITS_AMOUNT ); // for the exponent
	let modifier  = pow( 2, randomBit ); // the value to modifie

	let mutated   = chromosome ^ modifier;

	return mutated;
}

function crossover( firstChromosome, secondChromosome ) {

	// binary masks
	let fullRightSide = pow( 2, MAX_BITS_AMOUNT / 2 ) - 1;  		
	let fullLeftSide  = ( pow( 2, MAX_BITS_AMOUNT ) - 1 ) - fullRightSide;

	let highestPart = firstChromosome  & fullLeftSide ;
	let lowestPart  = secondChromosome & fullRightSide;

	let crossed = highestPart + lowestPart;

	return crossed;
}

function createChromosomeCode() {
	return int( random( 0, MAX_VALUE ) );
}
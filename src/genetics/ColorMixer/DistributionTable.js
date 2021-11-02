/*
    
    table structure for generate the chromosomic representation of the given colors

    [ minR, maxR, minG, maxG, minB, maxB, amount, percentage ]
*/

class DistributionTable{

    constructor( data ){}

    generateTable( colorList ) {
    
        let table = [];

        for ( let colorCounter = 0; colorCounter < colorList.length; colorCounter++ ) {

            let currentColor = colorList[ colorCounter ], colorMatch = false;

            // check if the color match in any other table row
            for ( let rowCounter = 0; rowCounter < table.length; rowCounter++ ) {

                let currentRow = table[ rowCounter ]; 
                colorMatch = true;
                
                for ( let rgbCounter = 0, rgbIndex = 0; rgbCounter < RGB_SIZE * 2; rgbCounter+=2, rgbIndex++ ) {

                    let 
                        minPos = rgbCounter, 
                        maxPos = rgbCounter + 1;  
                    
                    if ( currentColor[ rgbIndex ] < currentRow[ minPos ] ||
                        currentColor[ rgbIndex ] > currentRow[ maxPos ] ) {
                        colorMatch = false;
                        break;
                        
                    }
                }
  
                if ( colorMatch ) {

                    table[ rowCounter ][ TABLE_POS.AMOUNT ]++;
                    
                    table[ rowCounter ][ TABLE_POS.PERCENTAGE ] = 
                        table[rowCounter][ TABLE_POS.AMOUNT ] / colorList.length;
                    
                    table[ rowCounter ][ TABLE_POS.MAX_GENO_RANGE] = 
                        table[ rowCounter ][ TABLE_POS.PERCENTAGE ] * MAX_VALUE;
                    break;
                }
            }
 
            if ( !colorMatch ) {

                // add the rgb ranges
                let row = [

                    (currentColor[R] - RANGE_MOTION) < 0 ? 0 : (currentColor[R] - RANGE_MOTION),
                    (currentColor[R] + RANGE_MOTION) > 255 ? 255 : (currentColor[R] + RANGE_MOTION),

                    (currentColor[G] - RANGE_MOTION) < 0 ? 0 : (currentColor[G] - RANGE_MOTION),
                    (currentColor[G] + RANGE_MOTION) > 255 ? 255 : (currentColor[G] + RANGE_MOTION),

                    (currentColor[B] - RANGE_MOTION) < 0 ? 0 : (currentColor[B] - RANGE_MOTION),
                    (currentColor[B] + RANGE_MOTION) > 255 ? 255 : (currentColor[B] + RANGE_MOTION),

                    1,
                    1 / colorList.length,
                    
                    0,
                    1 / colorList.length * MAX_VALUE
                ];

                table.push( row );
            }
        }

        let lastRange = table[ 0 ][TABLE_POS.MAX_GENO_RANGE]; 

        for ( let rowCounter = 1; rowCounter < table.length; rowCounter++ ) {

            table[ rowCounter ][ TABLE_POS.MIN_GENO_RANGE ] = lastRange + 1;
            table[ rowCounter ][ TABLE_POS.MAX_GENO_RANGE ] += lastRange;

            lastRange = table[ rowCounter ][ TABLE_POS.MAX_GENO_RANGE ];
            table[ rowCounter ][ TABLE_POS.MIN_GENO_RANGE ] = int(table[ rowCounter ][ TABLE_POS.MIN_GENO_RANGE ]);
            table[ rowCounter ][ TABLE_POS.MAX_GENO_RANGE ] = int(table[ rowCounter ][ TABLE_POS.MAX_GENO_RANGE ]);
        }
        
        return table;
    }

}
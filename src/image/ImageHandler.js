class ImageHandler {

	constructor() { 

		this.images = []; 
		this.paths  = [];
		this.fullImages = [];
		this.wallpaper = null;
		
		this.wallpaperPos = CANVAS_HEIGHT / IMAGE_AMOUNT;
	}

	loadImages(indexesList) {

		this.loadWallpaper();

		let y = 0;
		for (let counter = 0; counter < indexesList.length; counter++) {

			let imageName = 'flower' + indexesList[ counter ] + IMAGE_EXTENSION;
			let imagePath = IMAGES_PATH + imageName;
			
			let image = loadImage( imagePath );
			let sameImage = loadImage( imagePath );

			let originalImage = loadImage( ORIGINAL_IMAGES_PATH + imageName);

			sameImage.loadPixels();
			image.loadPixels();
			originalImage.loadPixels();

			let imageSchema = new ImageSchema( imageName, originalImage, 0, y, counter );

			this.fullImages.push( sameImage );

	   	this.images.push( imageSchema );
			this.paths.push ( imagePath   );

			y += CANVAS_HEIGHT / IMAGE_AMOUNT;
		}
	}

	loadWallpaper() {

		this.wallpaper = loadImage( WALLPAPER_PATH );
		this.wallpaper.loadPixels();
	}

	getImages() {
		return this.images;
	}

	getPaths() {
		return this.paths;
	}

}
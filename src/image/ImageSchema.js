class ImageSchema{

	constructor(path, image, x, y, id) {

		this.id = id;
		this.path = path;
		this.image = image;
		this.width = image.width;
		this.height = image.height;
		this.x = x;
		this.y = y;
		this.pixelsAmount = this.image.pixels.length;

		this.processed = false;
	}

	showMeta() {
		console.log( this );
	}

	showImage() {
		
		image(this.image, this.x, this.y);
	}

	resize(width, height) {

		this.width = width;
		this.height = height;
		this.image.resize(width, height);
		this.pixelsAmount = this.image.pixels.length;
	}
}
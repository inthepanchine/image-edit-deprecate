// import types
import { CanvasImage } from "../types/canvas-types";

// import classes
import { Canvas } from "./canvas";

/**
 *
 * File class
 *
 * This class handle the file use
 *
 */
export class FileHandler {
	// the input element
	private input: HTMLInputElement;

	// the canvas to interact with
	private canvas: Canvas;

	constructor(canvas: Canvas, input: HTMLInputElement) {
		// assign canvasStack to this.canvasStack
		this.canvas = canvas;

		// assign input to this.input
		this.input = input;
	}

	/**
	 *
	 * Load the image into a new canvas
	 *
	 * @param {FileList} imgFilesList The list of images' files
	 *
	 */
	loadImage = (imgFilesList: FileList) => {
		// get image file, which is the first of the imgFilesList array
		const imgToLoad = imgFilesList[0];

		// create new image
		const img = new Image();

		// when a new image is loaded scale and draw it into the canvas
		img.onload = () => {
			// scale image to fit canvas
			const imageRatio = img.width / img.height;
			let width = this.canvas.style.size.width;
			let height = width / imageRatio;

			if (height > this.canvas.style.size.height) {
				height = this.canvas.style.size.height;
				width = height * imageRatio;
			}

			const position = {
				x:
					width < this.canvas.canvas.width
						? (this.canvas.canvas.width - width) / 2
						: 0,
				y:
					height < this.canvas.canvas.height
						? (this.canvas.canvas.height - height) / 2
						: 0,
			};

			// create CanvasImage for the loaded image
			const canvasImage: CanvasImage = {
				source: img,
				position,
				size: { width, height },
			};

			// draw content on canvas
			this.canvas.drawImage(canvasImage);
		};

		// set as image source imgFile
		img.src = URL.createObjectURL(imgToLoad);
	};

	/**
	 *
	 * Remove the image with this.canvas.removeImage(), set
	 * this.loadedImage to null and this.input.value to empty string
	 *
	 */
	removeImage = () => {
		// remove image from canvas
		this.canvas.removeImage();

		// set this.input.value to empty string
		this.input.value = "";
	};
}

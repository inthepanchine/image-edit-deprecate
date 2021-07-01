// types import
import { CanvasImage, ImageStyle } from "../types/editorTypes";

// import libraries
import { fabric } from "fabric";
import { Position } from "../types/globalTypes";

/**
 *
 * Editor class
 *
 * This class handle all the canvas use
 *
 */
export class Editor {
	// fabric canvas
	canvas: fabric.Canvas;

	// canvas style
	private style: ImageStyle;

	/**
	 *
	 * Constructor of editor class
	 *
	 * @param {string} canvasId The id of the canvas
	 * @param {number} width The width of the canvas
	 * @param {number} height The height of the canvas
	 * @param {string} [borderColor] The selection's border color
	 *
	 */
	constructor(
		canvasId: string,
		width: number,
		height: number,
		style: ImageStyle = {
			borderColor: "rgba(0, 0, 255, 1)",
			cornerColor: "rgba(0, 0, 255, 1)",
			cornerSize: 10,
			transparentCorners: true,
		},
	) {
		// init this.canvas
		this.canvas = new fabric.Canvas(canvasId);

		// style canvas
		this.canvas.setWidth(width);
		this.canvas.setHeight(height);

		// if borderColor isn't undefined, set it in this.canvas
		this.style = style;
	}

	/**
	 *
	 * Draw an image on this.canvas
	 *
	 * @param {CanvasImage} img The image to load
	 *
	 */
	drawImage = (img: CanvasImage) => {
		// create new fabric image
		const imgToLoad = new fabric.Image(img.source, {
			left: img.position.x,
			top: img.position.y,
			width: img.size.width,
			height: img.size.height,
		});

		// apply style to image
		imgToLoad.set(this.style);

		// draw image on this.canvas
		this.canvas.add(imgToLoad);
	};

	/**
	 *
	 * Remove the image passed as argument
	 *
	 * @param {fabric.Object[]} objToRemove The image to remove
	 *
	 */
	removeImage = (objToRemove: fabric.Object[]) => {
		for (const obj of objToRemove) {
			this.canvas.remove(obj);
		}
	};
}

// types import
import { CanvasImage, ImageStyle } from "../types/editorTypes";

// import libraries
import { fabric } from "fabric";

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

		// assign style to this.style
		this.style = style;

		// on selection update or create bring the target on front
		this.canvas.on("selection:updated", (e) => e.target.bringToFront());
		this.canvas.on("selection:created", (e) => e.target.bringToFront());
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
		});

		// scale imageToLoad to img.size
		imgToLoad.scaleToWidth(img.size.width);
		imgToLoad.scaleToHeight(img.size.height);

		// apply style to image
		imgToLoad.set(this.style);

		// draw image on this.canvas
		this.canvas.add(imgToLoad);
	};

	/**
	 *
	 * Remove the objects passed as argument
	 *
	 * @param {fabric.Object[] | fabric.Object} objToRemove The objects to remove
	 *
	 */
	removeObject = (objToRemove: fabric.Object[] | fabric.Object) => {
		// if param is an array loop through it and remove each element
		// else just remove the object
		if (Array.isArray(objToRemove)) {
			for (const obj of objToRemove) {
				// index of obj in this.canvas.objects
				const index = this.canvas.getObjects().indexOf(obj);

				// if obj exist in this.canvas.objects array remove it
				if (index !== -1) {
					this.canvas.remove(this.canvas.getObjects()[index]);
				}
			}
		} else {
			// index of obj in this.canvas.objects
			const index = this.canvas.getObjects().indexOf(objToRemove);

			// if obj exist in this.canvas.objects array remove it
			if (index !== -1) {
				this.canvas.remove(this.canvas.getObjects()[index]);
			}
		}
	};
}

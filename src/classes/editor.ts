// types import
import { CanvasImage, ImageStyle } from "../types/editorTypes";
import { Position, Size } from "../types/globalTypes";

// import libraries
import { fabric } from "fabric";
import { Selection } from "./selection";

/**
 *
 * Editor class
 *
 * This class handle all the canvas use
 *
 */
export class Editor extends fabric.Canvas {
	// canvas style
	style: ImageStyle;

	// region's selection
	regionSelection: Selection;

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
		// super call
		super(canvasId);

		// style canvas
		this.setWidth(width);
		this.setHeight(height);

		// assign style to this.style
		this.style = style;

		// on selection update or create bring the target on front
		this.on("selection:updated", (e) => e.target.bringToFront());
		this.on("selection:created", (e) => e.target.bringToFront());

		// init selection
		this.regionSelection = new Selection(this);
	}

	/**
	 *
	 * Draw an image on the editor
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
		this.add(imgToLoad);
	};

	/**
	 *
	 * Remove the object(s) passed as argument
	 *
	 * @param {fabric.Object[] | fabric.Object} objToRemove The objects to remove
	 *
	 */
	removeObject = (objToRemove: fabric.Object[] | fabric.Object) => {
		// if param is an array loop through it and remove each element
		// else just remove the object
		if (Array.isArray(objToRemove)) {
			for (const obj of objToRemove) {
				this.remove(obj);
			}
		} else {
			this.remove(objToRemove);
		}
	};

	/**
	 *
	 * Crop selected region of image
	 *
	 */
	cropImage = () => {
		const region = this.regionSelection.getSelection("image");

		// check if region.relativeTo is a fabric.Image for avoiding type-check error
		if (region.relativeTo instanceof fabric.Image) {
			// crop image
			region.relativeTo.set({
				left: this.regionSelection.selection.left,
				top: this.regionSelection.selection.top,
				width: region.size.width,
				height: region.size.height,
				cropX: region.position.x + region.relativeTo.cropX,
				cropY: region.position.y + region.relativeTo.cropY,
			});

			// remove old image, add the cropped image and set it as selected object
			this.setActiveObject(region.relativeTo);
		}
	};
}

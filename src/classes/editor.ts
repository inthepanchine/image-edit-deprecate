// types import
import { CanvasImage, ImageStyle } from "../types/editorTypes";
import { Position } from "../types/globalTypes";

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

	// selected region rect
	private selectedRegion = new fabric.Rect({
		width: 100,
		height: 100,
		fill: "rgba(0, 0, 0, 0.5)",
		left: 50,
		top: 50,
	});

	// selection state, if false means there is no selection
	// else there is
	private selection = false;

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
				this.canvas.remove(obj);
			}
		} else {
			this.canvas.remove(objToRemove);
		}
	};

	/**
	 *
	 * Select a region from canvas
	 *
	 */
	selectRegion = () => {
		// set selectedRegion rect style
		this.selectedRegion.set(this.style);

		// check if there is already a selection
		if (!this.selection) {
			// add it to canvas and set it as active object
			this.canvas.add(this.selectedRegion);
			this.canvas.setActiveObject(this.selectedRegion);

			// set this.selection to true
			this.selection = true;
		}

		// handle selection change
		const selectionUpdated = () => {
			// remove selection
			this.removeObject(this.selectedRegion);

			// set this.selection to false
			this.selection = false;

			// remove event listeners
			this.canvas.off("selection:updated", selectionUpdated);
			this.canvas.off("selection:cleared", selectionUpdated);
		};

		// when selectedRegion is deselected remove it from this.canvas
		this.canvas.on("selection:updated", selectionUpdated);
		this.canvas.on("selection:cleared", selectionUpdated);
	};

	/**
	 *
	 * Crop selected region of image
	 *
	 */
	cropImage = () => {
		// check if there is a selection
		if (this.selection === false) {
			throw new Error("No region selected");
		}

		// create copy of this.canvas.objects and remove this.selection which is the last item
		const objects = this.canvas.getObjects();
		objects.pop();

		// represent object that intersect with selected region
		const intersecObj: fabric.Object[] = [];

		// loop through objects and if obj intersect with this.selectedRegion push it to intersecObj
		for (const obj of objects) {
			if (this.selectedRegion.intersectsWithObject(obj)) {
				intersecObj.push(obj);
			}
		}

		// get the image to crop which is the one on top of the intersecated objects
		const imgToCrop = intersecObj[intersecObj.length - 1];

		// check if the selected object's an image
		if (!(imgToCrop instanceof fabric.Image)) {
			throw new Error("Can't crop an object which is not an image");
		}

		// calculate the variation of x and y
		const dx = this.selectedRegion.left - imgToCrop.left;
		const dy = this.selectedRegion.top - imgToCrop.top;

		// crop coordinate in relation to the image to crop
		// if dx/dy is lower than 0 means that the this.selectedRegion's origin is before imgToCrop's origin so
		// the crop should start from x/y = 0.
		// if dx/dy is greater than 0 means that the this.selectedRegion's origin is after imgToCrop's origin so
		// the crop should start from x/y = dx/dy
		const crop: Position = {
			x: dx >= 0 ? dx : 0,
			y: dy >= 0 ? dy : 0,
		};

		// crop image
		imgToCrop.set({
			left: this.selectedRegion.left,
			top: this.selectedRegion.top,
			width: this.selectedRegion.getScaledWidth(),
			height: this.selectedRegion.getScaledHeight(),
			cropX: crop.x + imgToCrop.cropX,
			cropY: crop.y + imgToCrop.cropY,
		});

		// remove old image, add the cropped image and set it as selected object
		this.canvas.setActiveObject(imgToCrop);
	};
			left: this.selectedRegion.left,
			top: this.selectedRegion.top,
			width: this.selectedRegion.getScaledWidth(),
			height: this.selectedRegion.getScaledHeight(),
			cropX: crop.x,
			cropY: crop.y,
		});

		// set selected object to the cropped imagee
		this.canvas.setActiveObject(imgToCrop);
	};
}

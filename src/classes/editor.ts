// types import
import { CanvasImage, ImageStyle } from "../types/editorTypes";
import { Size } from "../types/globalTypes";

// libraries import
import { fabric } from "fabric";
import { Selection } from "./selection";

/**
 * Editor class.
 *
 * This class handle all the canvas use.
 */
export class Editor extends fabric.Canvas {
	/**
	 * Style of the resize of image.
	 *
	 * @default
	 * By default the style is black border and solid black corner, whose size
	 * is 10px.
	 */
	imgStyle: ImageStyle = {
		borderColor: "rgba(0, 0, 0, 1)",
		cornerColor: "rgba(0, 0, 0, 1)",
		cornerSize: 10,
		transparentCorners: false,
	};

	/** Selectable region. */
	regionSelection: Selection = new Selection(this);

	/**
	 * Constructor of editor class.
	 *
	 * @param canvasId The id of the canvas.
	 * @param size The size of the canvas.
	 * @param borderColor The selection's border color.
	 */
	constructor(canvasId: string, size: Size, style: ImageStyle) {
		// super call
		super(canvasId);

		// style canvas
		this.setWidth(size.width);
		this.setHeight(size.height);

		// assign style to this.style
		this.imgStyle = style;

		// on selection update or create bring the target on front
		this.on("selection:updated", (e) => e.target?.bringToFront());
		this.on("selection:created", (e) => e.target?.bringToFront());
	}

	/**
	 * Draw an image on the editor
	 *
	 * @param img The image to load
	 */
	drawImage = (img: CanvasImage) => {
		// create new fabric image
		const imgToLoad = new fabric.Image(img.source, {
			left: img.position.x,
			top: img.position.y,
		});

		// scale imgToLoad to img.size
		imgToLoad.scaleToWidth(img.size.width);
		imgToLoad.scaleToHeight(img.size.height);

		// apply style to image
		imgToLoad.set(this.imgStyle);

		// draw image on this.canvas
		this.add(imgToLoad);
	};

	/**
	 * Remove the object(s) passed as argument
	 *
	 * @param objToRemove The objects to remove
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

	/** Crop selected region of image */
	cropImage = () => {
		// get selected region
		const region = this.regionSelection.getSelection();

		// check if region.relativeTo.CropX/CropY isn't null
		if (!(region.relativeTo.cropX && region.relativeTo.cropY)) {
			throw new Error("region.relativeTo is null.");
		}

		// crop image
		region.relativeTo.set({
			left: this.regionSelection.selection.left,
			top: this.regionSelection.selection.top,
			width: region.size.width,
			height: region.size.height,
			cropX: region.position.x + region.relativeTo.cropX,
			cropY: region.position.y + region.relativeTo.cropY,
		});

		// set cropped image as selected object
		this.setActiveObject(region.relativeTo);
	};

	/**
	 * Blur selected region of image
	 *
	 * @param value The blur's value, in a range from 0 to 1. Its default value is 1s default value is 1
	 */
	blurRegion = (value: number = 1) => {
		// get selected region
		const region = this.regionSelection.getSelection();

		if (!(region.relativeTo.cropX && region.relativeTo.cropY)) {
			throw new Error("region.relativeTo is null.");
		}

		// create region image from image to blur
		const blurredRegion = new fabric.Image(region.relativeTo.getElement(), {
			left: this.regionSelection.selection.left,
			top: this.regionSelection.selection.top,
			width: region.size.width,
			height: region.size.height,
			scaleX: region.relativeTo.scaleX,
			scaleY: region.relativeTo.scaleY,
			cropX: region.position.x + region.relativeTo.cropX,
			cropY: region.position.y + region.relativeTo.cropY,
		});

		// check if blur value is acceptable
		if (value < 0 || 1 < value) {
			throw new Error("Blur's value must be between 0 and 1.");
		}

		if (!blurredRegion.filters) {
			throw new Error("blurredRegion is null.");
		}

		// add blur to blurredRegion's filter and apply it
		blurredRegion.filters.push(
			// @ts-ignore, until the bug in fabricjs types declaration will not
			// be fixed (for more see: https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/54376)
			new fabric.Image.filters.Blur({
				blur: value,
			}),
		);
		blurredRegion.applyFilters();

		// create a group containing the blurred region and the image to blur
		const blurredImage = new fabric.Group(
			[region.relativeTo, blurredRegion],
			this.imgStyle,
		);

		// remove old image, add blurred image to the canvas and set it as active object
		this.remove(region.relativeTo);
		this.add(blurredImage);
		this.setActiveObject(blurredImage);
	};
}

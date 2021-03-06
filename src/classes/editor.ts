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
export class Editor {
	/** Canvas where images are displayed. */
	canvas: fabric.Canvas;

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
		lockRotation: false,
	};

	/** Selectable region. */
	regionSelection: Selection;

	/**
	 * Constructor of editor class.
	 *
	 * @param canvasId The id of the canvas.
	 * @param size The size of the canvas.
	 * @param style The style of the image.
	 * @param isResponsive Defines wether the canvas is reponsive or not.
	 */
	constructor(
		canvasId: string,
		size: Size,
		style: ImageStyle,
		isResponsive: boolean
	) {
		// init this.canvas
		this.canvas = new fabric.Canvas(canvasId);

		// style canvas
		this.canvas.setDimensions(size);

		// init selection
		this.regionSelection = new Selection(this);

		// assign style to this.style
		this.imgStyle = style;

		// on selection update or create bring the target on front
		this.canvas.on("selection:updated", (e) => e.target?.bringToFront());
		this.canvas.on("selection:created", (e) => e.target?.bringToFront());

		// if canvas has to be responsive add event listener on window resize
		if (isResponsive) {
			this.canvasResponsive();
			window.addEventListener("resize", () => this.canvasResponsive());
		}
	}

	/**
	 * Draw an image on the editor.
	 *
	 * @param img The image to load.
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
		
		// if rotation is disable hide rotating point
		if (this.imgStyle.lockRotation) {
			imgToLoad.controls = {
				...fabric.Image.prototype.controls,
				mtr: new fabric.Control({ visible: false })
			}
		}

		// draw image on this.canvas
		this.canvas.add(imgToLoad);
	};

	/**
	 * Remove the object(s) passed as argument.
	 *
	 * @param objToRemove The objects to remove.
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

	/** Crop selected region of image. */
	cropImage = () => {
		// get selected region
		const region = this.regionSelection.getSelection();

		// check if region.relativeTo.CropX/CropY isn't null
		if (region.relativeTo.cropX === undefined) {
			throw new Error("region.relativeTo is null.");
		}

		if (region.relativeTo.cropY === undefined) {
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
		this.canvas.setActiveObject(region.relativeTo);
	};

	/**
	 * Blur selected region of image.
	 *
	 * @param value The blur's value, in a range from 0 to 1. Its default value
	 * is 1s default value is 1.
	 */
	blurRegion = (value: number = 1) => {
		// get selected region
		const region = this.regionSelection.getSelection();

		// check if region.relativeTo.CropX/CropY isn't null
		if (region.relativeTo.cropX === undefined) {
			throw new Error("region.relativeTo.cropX is null.");
		}

		if (region.relativeTo.cropY === undefined) {
			throw new Error("region.relativeTo.cropX is null.");
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
		// and create a image from it
		const blurredGroup = new fabric.Group(
			[region.relativeTo, blurredRegion],
			this.imgStyle,
		);

		const blurredImage = new fabric.Image(blurredGroup.toCanvasElement())

		// remove old image, add blurred image to the canvas and set it as active object
		this.canvas.remove(region.relativeTo);
		this.canvas.add(blurredImage);
		this.canvas.setActiveObject(blurredImage);
	};

	/** Handle canvas reponsiveness. */
	private canvasResponsive = () => {
		// initial canvas sizes
		const initialSize: Size = {
			width: this.canvas.getWidth(),
			height: this.canvas.getHeight(),
		};

		// get canvas wrapper width and check if it's undefined
		const wrapper = this.canvas.getElement().parentElement;

		if (wrapper === null) {
			throw new Error(
				"Can't make responsive a canvas without parent element"
			);
		}

		wrapper.style.width = "100%";

		// set new canvas' sizes
		const newHeight =
			(initialSize.height * wrapper.clientWidth) / initialSize.width;
		this.canvas.setDimensions({
			width: wrapper.clientWidth, height: newHeight
		});


		// transformation of the content
		const scale =
			this.canvas.getZoom() * (wrapper.clientWidth /initialSize.width);
		this.canvas.setViewportTransform([scale, 0, 0, scale, 0, 0])
	}
}

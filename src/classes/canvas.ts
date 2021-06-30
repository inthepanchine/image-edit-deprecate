import { CanvasImage, CanvasStyle } from "../types/canvas-types";

/**
 *
 * Canvas class
 *
 * This class handle all the canvas use
 *
 */
export class Canvas {
	// the canvas where the content is drawn.
	// By default is equal to a new document element
	public canvas: HTMLCanvasElement = document.createElement("canvas");

	// the context of this.canvas
	public context: CanvasRenderingContext2D;

	// the canvas' style
	public style: CanvasStyle;

	// represent content status, if true means that some content is already loaded.
	// By default is equal to false
	private contentIsLoaded: boolean = false;

	// the container where the canvases are shown
	private container: HTMLElement;

	/**
	 *
	 * Canvas class constructor
	 *
	 * @param {HTMLElement} container The container where the canvas will be created
	 * @param {number} width The canvas width
	 * @param {number} height The canvas height
	 * @param {string} [canvasStyle] The canvas' style
	 *
	 */
	constructor(
		container: HTMLElement,
		width: number,
		height: number,
		canvasStyle: string = "",
	) {
		// assign this.style with params
		this.style = {
			size: { width, height },
			userStyle: canvasStyle,
		};

		// assign this.container to container
		this.container = container;

		// assign this.context
		this.context = this.canvas.getContext("2d");

		// apply style, width and height to canvas
		this.canvas.setAttribute("style", this.style.userStyle);
		this.canvas.setAttribute("width", this.style.size.width.toString());
		this.canvas.setAttribute("height", this.style.size.height.toString());

		// append this.canvas to this.container
		this.container.appendChild(this.canvas);
	}

	/**
	 *
	 * Draw a image on this.context. If this.contentIsLoaded is true,
	 * it means that some content is already drawn, so clear the context
	 *
	 * @param {number} index The index of the element in this.stack
	 */
	drawImage = (content: CanvasImage) => {
		// check if some content isn't already loaded.
		// If it is, remove it
		if (this.contentIsLoaded === true) {
			// clear content
			this.removeImage();
		}

		// draw content on context
		this.context.drawImage(
			content.source,
			content.position.x,
			content.position.y,
			content.size.width,
			content.size.height,
		);

		// content was loaded, so set this.contentIsLoaded to true
		this.contentIsLoaded = true;
	};

	/**
	 *
	 * Remove loaded content from this.canvas and set new state
	 *
	 */
	removeImage = () => {
		// clear canvas with this.context.clearRect
		this.context.clearRect(0, 0, this.style.size.width, this.style.size.height);

		// content was unloaded, so set this.contentIsLoaded to false
		this.contentIsLoaded = false;
	};
}

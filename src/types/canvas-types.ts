/**
 *
 * Canvas types declaration file
 *
 */

/**
 *
 * Interface for canvas' style
 *
 * @param {Size} size The sizes of the canvas
 * @param {string} defaultStyle The default canvas' style
 * @param {string} style The user canvas' style
 *
 */
export interface CanvasStyle {
	size: Size;
	userStyle?: string;
}

/**
 *
 * Interface for images displayed on canvas
 *
 * @param {position} position The position of the image in the canvas
 * @param {Size} size The size of the image
 * @param {number} zIndex The z-index of the canvas where the image is drawn
 *
 */
export interface CanvasImage {
	source: HTMLImageElement;
	position: Position;
	size: Size;
}

/**
 *
 * Interface which describe sizes of an element
 *
 * @param {number} width The width of the element
 * @param {number} height The height of the element
 *
 */
interface Size {
	width: number;
	height: number;
}

/**
 *
 * Interface which describe the position with the x-y axis
 *
 * @param {number} x The x coordinate
 * @param {number} y The y coordinate
 *
 */
interface Position {
	x: number;
	y: number;
}

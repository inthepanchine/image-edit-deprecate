/**
 *
 * Editor types declaration file
 *
 */

import { Position, Size } from "./globalTypes";

/**
 *
 * Interface which describe images' style
 *
 * @param {string} borderColor The selection's border color
 * @param {string} cornerColor The resize corner's color
 * @param {number} cornerSize The the resize corner's size
 * @param {boolean} transparentCorners Define whether corners are transparent or not
 *
 */
export interface ImageStyle {
	borderColor: string;
	cornerColor: string;
	cornerSize: number;
	transparentCorners: boolean;
}

/**
 *
 * Interface for images displayed on canvas
 *
 * @param {HTMLImageElement | string} source The source of the image
 * @param {position} position The position of the image in the canvas
 * @param {Size} size The size of the image
 *
 */
export interface CanvasImage {
	source: HTMLImageElement | string;
	size: Size;
	position: Position;
}

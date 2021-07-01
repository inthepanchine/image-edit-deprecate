/**
 *
 * Editor types declaration file
 *
 */

import { Position } from "./globalTypes";

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
 * @param {position} position The position of the image in the canvas
 * @param {Size} size The size of the image
 * @param {number} zIndex The z-index of the canvas where the image is drawn
 *
 */
export interface CanvasImage {
	source: HTMLImageElement;
	position: Position;
}

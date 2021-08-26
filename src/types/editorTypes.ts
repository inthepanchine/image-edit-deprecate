/** Types declaration file for editor class. */

// types import
import { Position, Size } from "./globalTypes";

/** Interface which describe images' style. */
export interface ImageStyle {
	/* The selection's border color. */
	borderColor: string;
	/* The resize corner's color. */
	cornerColor: string;
	/* The the resize corner's size. */
	cornerSize: number;
	/* Define whether corners are transparent or not. */
	transparentCorners: boolean;
}

/** Interface for images displayed on canvas. */
export interface CanvasImage {
	/* The source of the image. */
	source: HTMLImageElement | string;
	/* The size of the image. */
	size: Size;
	/* The position of the image in the canvas. */
	position: Position;
}

/**
 *
 * Editor types declaration file
 *
 */

import { Position, Size } from "./globalTypes";
import { fabric } from "fabric";

/**
 *
 * @param {Position} position Selected region's position
 * @param {Size} size Selected region's size
 *
 */
export interface SelectedRegion {
	relativeTo: fabric.Canvas | fabric.Image;
	position: Position;
	size: Size;
}

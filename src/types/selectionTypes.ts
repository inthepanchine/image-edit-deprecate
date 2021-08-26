/** Type declaration file for selection class. */

// types import
import { Position, Size } from "./globalTypes";

// libraries import
import { fabric } from "fabric";

/** The properties of the region selected from the canvas. */
export interface SelectedRegion {
	/** The container whose the region is relative to. */
	relativeTo: fabric.Image;
	/** Selected region's position. */
	position: Position;
	/** Selected region's size. */
	size: Size;
}

import { fabric } from "fabric";
import { Size } from "../types/globalTypes";

/**
 * Utility class.
 *
 * This class has some utilities for the library.
 */
export class Utils {
	/**
	 * Trim canvas transparent pixels.
	 * 
	 * @param originalCanvas The original canvas where the image is extracted
	 * from.
	 * @returns The trimmed image as base64 string.
	 */
	trimCanvas = (originalCanvas: fabric.Canvas): string => {
		// create group of object
		const objGroup = new fabric.Group(originalCanvas.getObjects());

		// WARNING: Temporary fix due production need
		// TODO: Better fix of known bug
		// store current object coordinates
		if (objGroup.oCoords === undefined) {
			throw new Error("Can't trim a empty canvas.");
		}

		const currPos = objGroup.oCoords.tl;

		// set objGroup position to origin
		objGroup.setPositionByOrigin(new fabric.Point(0, 0), "left", "top");
		objGroup.setCoords()

		// objects group's sizes
		const groupSize: Size = {
			width: objGroup.getScaledWidth(),
			height: objGroup.getScaledHeight(),
		}

		// create new temporary canvas
		var canvas = new fabric.Canvas(document.createElement("canvas"));

		// set temp canvas sizes from trimmed image and add group
		canvas.setWidth(groupSize.width);
		canvas.setHeight(groupSize.height);
		canvas.add(objGroup);

		// store base64 value of temp canvas
		const base64 = canvas.toDataURL();

		// set group coordinate as the old position
		objGroup.setPositionByOrigin(currPos, "left", "top");
		objGroup.setCoords();

		return base64;
	}
}

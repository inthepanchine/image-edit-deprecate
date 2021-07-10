// import types
import { SelectedRegion } from "../types/selectionTypes";
import { Position, Size } from "../types/globalTypes";

// import libraries
import { fabric } from "fabric";
import { Editor } from "./editor";

/**
 *
 * This class handle selection of a region
 *
 */
export class Selection {
	// selected region rect
	selection = new fabric.Rect({
		width: 100,
		height: 100,
		fill: "rgba(0, 0, 0, 0.5)",
	});

	// selection state, if false means there is no selection
	// else there is
	private isSelected = false;

	// the editor where the selection is made
	private editor: Editor;

	constructor(editor: Editor) {
		// assign editor to this.editor
		this.editor = editor;

		// set selection rect position to the center of the editor
		this.selection.set({
			left: this.editor.getWidth() / 2,
			top: this.editor.getHeight() / 2,
		});
	}

	/**
	 *
	 * Select a region from editor
	 *
	 */
	selectRegion = () => {
		// set selection rect style
		this.selection.set(this.editor.style);

		// check if there is already a selection
		if (!this.isSelected) {
			// add it to editor and set it as active object
			this.editor.add(this.selection);
			this.editor.setActiveObject(this.selection);

			// set this.isSelected to true
			this.isSelected = true;
		}

		// handle selection change
		const selectionUpdated = () => {
			// remove selection
			this.editor.removeObject(this.selection);

			// set this.selection to false
			this.isSelected = false;

			// remove event listeners
			this.editor.off("selection:updated", selectionUpdated);
			this.editor.off("selection:cleared", selectionUpdated);
		};

		// when selection is deselected remove it from this.editor
		this.editor.on("selection:updated", selectionUpdated);
		this.editor.on("selection:cleared", selectionUpdated);
	};

	/**
	 *
	 * Return a SelectedRegion object
	 *
	 * @param {string} relative What the coordinate should be relative to. The options
	 * are "canvas" and "image".
	 * If relative is "canvas", then the coordinates will be canvas-relative.
	 * If relative is "image", then the coordinates will be image-relative.
	 *
	 */
	getSelection(relative: string): SelectedRegion {
		if (relative === "canvas") {
			// region relative to canvas
			return {
				relativeTo: this.editor,
				position: { x: this.selection.left, y: this.selection.top },
				size: {
					width: this.selection.getScaledWidth(),
					height: this.selection.getScaledWidth(),
				},
			};
		} else if (relative === "image") {
			// check if there is a selection
			if (this.isSelected === false) {
				throw new Error("No region selected");
			}

			// create copy of this.editor.objects and remove this.selection which is the last item
			const objects = this.editor.getObjects();
			objects.pop();

			// represent object that intersect with selected region
			const intersecObj: fabric.Object[] = [];

			// loop through objects and if obj intersect with this.selection push it to intersecObj
			for (const obj of objects) {
				if (this.selection.intersectsWithObject(obj)) {
					intersecObj.push(obj);
				}
			}

			// get the object, which the selection is relative to
			const imgRelative = intersecObj[intersecObj.length - 1];

			// check if the relative object is an image
			if (!(imgRelative instanceof fabric.Image)) {
				throw new Error("Can't crop an object which is not an image");
			}

			// calculate the variation of x and y
			const dx = (this.selection.left - imgRelative.left) / imgRelative.scaleX;
			const dy = (this.selection.top - imgRelative.top) / imgRelative.scaleY;

			// calculate sizes
			const width = this.selection.getScaledWidth() / imgRelative.scaleX;
			const height = this.selection.getScaledHeight() / imgRelative.scaleY;

			// crop coordinate in relation to the image to crop:
			// If dx/dy is greater than 0 means that the this.selection's origin is after imgRelative's origin so
			// the region should start from x/y = dx/dy.
			// If dx/dy is lower than 0 means that the this.selection's origin is before imgRelative's origin so
			// the region should start from x/y = 0.
			const position: Position = {
				x: dx >= 0 ? dx : 0,
				y: dy >= 0 ? dy : 0,
			};

			// size:
			// If width/height is greater than imgRelative's width/height means that the selected region's width/height is
			// imgRelative's width/height.
			// If width/height is lower than imgRelative's width/height means that the selected region's width/height is
			// width/height.
			const size: Size = { width, height };
			// region relative to canvas
			return {
				relativeTo: imgRelative,
				position,
				size,
			};
		}
	}
}

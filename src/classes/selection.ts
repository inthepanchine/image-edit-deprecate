// import types
import { SelectedRegion } from "../types/selectionTypes";
import { Position, Size } from "../types/globalTypes";

// import libraries
import { fabric } from "fabric";
import { Editor } from "./editor";

/**
 * Selection class.
 *
 * This class handle selection of a region in the Editor instance passed as
 * param.
 */
export class Selection {
	/**
	 * The rect displayed on this.editor, for let the user choose a region
	 * graphically.
	 *
	 * @default
	 * By default its value is a 100x100 transparent black rect.
	 */
	selection = new fabric.Rect({
		width: 100,
		height: 100,
		fill: "rgba(0, 0, 0, 0.5)",
	});

	/**
	 * Describe the selection state.
	 * If true means there already is a selection.
	 * If false means there is no selection.
	 *
	 * @default
	 * By default there is no selection, so its value is false.
	 */
	private isSelected = false;

	/** The editor where the selection is made. */
	private editor: Editor;

	/**
	 * Editor class constructor.
	 *
	 * @param editor The editor where the selection is made.
	 */
	constructor(editor: Editor) {
		// assign editor to this.editor
		this.editor = editor;

		// set selection rect position to the center of the editor
		this.selection.set({
			left: this.editor.getWidth() / 2,
			top: this.editor.getHeight() / 2,
		});
	}

	/** Select a region from editor. */
	selectRegion = () => {
		// set selection rect style
		this.selection.set(this.editor.imgStyle);

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
	 * Get the selected region.
	 *
	 * @returns A SelectedRegion object, with the properties of user's
	 * selection.
	 */
	getSelection(): SelectedRegion {
		// check if there is a selection
		if (this.isSelected === false) {
			throw new Error("No region selected.");
		}

		// create copy of this.editor.objects, remove this.selection and reverse
		// the array
		const objects = this.editor.getObjects();
		objects.pop();
		objects.reverse();

		// represent object that intersect with selected region
		var intersectedObj: fabric.Object | undefined;

		// check for objects that intersect with this.selection by looping
		// through reversed object and if obj is intersected with this.selection,
		// assign it to intersectedObj and break
		for (const obj of objects) {
			if (this.selection.intersectsWithObject(obj)) {
				intersectedObj = obj;
				break;
			}
		}

		// check if the relative object is an image
		if (!(intersectedObj instanceof fabric.Image)) {
			throw new Error("Can't crop an object which is not an image.");
		}

		// check if this.selection and intersectedObj.scaleX/scaleY
		// aren't null
		if (
			!(
				this.selection.left &&
				this.selection.top &&
				intersectedObj.left &&
				intersectedObj.top &&
				intersectedObj.scaleX &&
				intersectedObj.scaleY
			)
		) {
			throw new Error("this.selection or intersecedObj are undefined.");
		}

		// calculate the variation of x and y
		const deltaX =
			(this.selection.left - intersectedObj.left) / intersectedObj.scaleX;
		const deltaY =
			(this.selection.top - intersectedObj.top) / intersectedObj.scaleY;

		// calculate sizes
		const width = this.selection.getScaledWidth() / intersectedObj.scaleX;
		const height = this.selection.getScaledHeight() / intersectedObj.scaleY;

		// crop coordinate in relation to the image to crop:
		// If deltaX/deltaY is greater than 0 means that the this.selection's origin is after imgRelative's origin so
		// the region should start from x/y = deltaX/deltaY.
		// If deltaX/deltaY is lower than 0 means that the this.selection's origin is before imgRelative's origin so
		// the region should start from x/y = 0.
		const position: Position = {
			x: deltaX >= 0 ? deltaX : 0,
			y: deltaY >= 0 ? deltaY : 0,
		};

		// size:
		// If width/height is greater than imgRelative's width/height means that the selected region's width/height is
		// imgRelative's width/height.
		// If width/height is lower than imgRelative's width/height means that the selected region's width/height is
		// width/height.
		const size: Size = { width, height };
		// region relative to canvas
		return {
			relativeTo: intersectedObj,
			position,
			size,
		};
	}
}

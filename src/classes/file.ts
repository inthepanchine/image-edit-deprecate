// import types
import { CanvasImage } from "../types/editorTypes";

// import classes
import { Editor } from "./editor";

/**
 * File class.
 *
 * This class handle files usage.
 */
export class FileHandler {
	/** The input where the file are loaded from. */
	private input: HTMLInputElement;

	/** The editor where the file will be loaded in/removed from. */
	private editor: Editor;

	/**
	 * FileHandler class constructor.
	 *
	 * @param editor The editor where the file will be loaded in/removed from.
	 * @param input The input where the file are loaded from.
	 */
	constructor(editor: Editor, input: HTMLInputElement) {
		// assign editor to this.editor
		this.editor = editor;

		// assign input to this.input
		this.input = input;
	}

	/**
	 * Load images contained in imgFiles into this.editor.
	 *
	 * @param imgFiles The list of images' files that the user wants to load.
	 */
	loadImage = (imgFiles: FileList) => {
		// loop through imgFiles and load each image into the editor
		for (const imgFile of imgFiles) {
			// create new image
			const img = new Image();

			// when a new image is loaded scale and draw it into the canvas
			img.onload = () => {
				// check this.editor.width/height isn't null
				if (!(this.editor.width && this.editor.height)) {
					throw new Error("this.editor is null.");
				}

				// scale image to fit canvas
				const imageRatio = img.width / img.height;
				var width = this.editor.width;
				var height = width / imageRatio;

				if (height > this.editor.height) {
					height = this.editor.height;
					width = height * imageRatio;
				}

				// set position as center of the canvas
				const position = {
					x: width < this.editor.width ? (this.editor.width - width) / 2 : 0,
					y:
						height < this.editor.height ? (this.editor.height - height) / 2 : 0,
				};

				// create CanvasImage for the loaded image
				const canvasImage: CanvasImage = {
					source: img,
					size: { width, height },
					position,
				};

				// draw content on canvas
				this.editor.drawImage(canvasImage);
			};

			// set as image source imgFile
			img.src = URL.createObjectURL(imgFile);
		}
	};

	/** Remove the selected objects. */
	removeImage = () => {
		// get current selected objects
		const selected = this.editor.getActiveObjects();

		// if selected is empty throw an error
		if (selected.length === 0) {
			throw new Error("No selected image.");
		}

		// remove selected objects
		this.editor.removeObject(selected);

		// set this.input.value to empty string for avoiding conflict when
		// reimporting the image in the canvas
		this.input.value = "";
	};

	/**
	 * Export canvas as base64 string.
	 *
	 * @return The encoded canvas as base64 string.
	 */
	export = (): string => {
		return this.editor.toDataURL();
	};
}

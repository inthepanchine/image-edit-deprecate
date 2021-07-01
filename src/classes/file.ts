// import types
import { CanvasImage } from "../types/editorTypes";

// import classes
import { Editor } from "./editor";

// library import
import { saveAs } from "file-saver";

/**
 *
 * File class
 *
 * This class handle the file use
 *
 */
export class FileHandler {
	// the input element
	private input: HTMLInputElement;

	// the editor to interact with
	private editor: Editor;

	constructor(editor: Editor, input: HTMLInputElement) {
		// assign editor to this.editor
		this.editor = editor;

		// assign input to this.input
		this.input = input;
	}

	/**
	 *
	 * Load the images into the editor
	 *
	 * @param {FileList} imgFilesList The list of images' files
	 *
	 */
	loadImage = (imgFilesList: FileList) => {
		// loop through imgFilesList and load each image into the editor
		for (const imgFile of imgFilesList) {
			// create new image
			const img = new Image();

			// when a new image is loaded scale and draw it into the canvas
			img.onload = () => {
				// scale image to fit canvas
				const imageRatio = img.width / img.height;
				let width = this.editor.canvas.width;
				let height = width / imageRatio;

				if (height > this.editor.canvas.height) {
					height = this.editor.canvas.height;
					width = height * imageRatio;
				}

				// set position as center of the canvas
				const position = {
					x:
						width < this.editor.canvas.width
							? (this.editor.canvas.width - width) / 2
							: 0,
					y:
						height < this.editor.canvas.height
							? (this.editor.canvas.height - height) / 2
							: 0,
				};

				// create CanvasImage for the loaded image
				const canvasImage: CanvasImage = {
					source: img,
					position,
					size: { width, height },
				};

				// draw content on canvas
				this.editor.drawImage(canvasImage);
			};

			// set as image source imgFile
			img.src = URL.createObjectURL(imgFile);
		}
	};

	/**
	 *
	 * Remove the selected objects
	 *
	 */
	removeImage = () => {
		// get currente selected objects
		const selected = this.editor.canvas.getActiveObjects();

		// if selected is empty throw an error
		if (selected.length === 0) {
			throw new Error("No selected image");
		}

		// remove selected objects
		this.editor.removeImage(selected);

		// set this.input.value to empty string
		this.input.value = "";
	};

	/**
	 *
	 * Export canvas as base64
	 *
	 * @return {string} The encoded canvas
	 *
	 */
	export = (): string => {
		return this.editor.canvas.toDataURL();
	};
}

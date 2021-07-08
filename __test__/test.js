// library test file
requirejs(["main"], (util) => {
	// get elements
	const fileInput = document.getElementById("input");
	const removeBtn = document.getElementById("remove");
	const exportBtn = document.getElementById("export");
	const regionBtn = document.getElementById("region");

	var editor = new util.Editor("canvas", 1500, 750, {
		borderColor: "rgba(0, 0, 255, 1)",
		cornerColor: "rgba(0, 0, 255, 1)",
		cornerSize: 10,
		transparentCorners: true,
	});
	var file = new util.FileHandler(editor, fileInput);

	// add event listeners
	fileInput.addEventListener(
		"change",
		(event) => {
			file.loadImage(event.target.files);
		},
		false,
	);

	// remove image on click
	removeBtn.addEventListener("click", () => {
		file.removeImage();
	});

	// export on click
	exportBtn.addEventListener("click", () => {
		console.log(file.export());
	});

	regionBtn.addEventListener("click", () => {
		editor.selectRegion();
	});
});

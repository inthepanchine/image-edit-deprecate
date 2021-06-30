// library test file
requirejs(["main"], (util) => {
	// get elements
	const container = document.getElementById("root");
	const fileInput = document.getElementById("input");
	const removeBtn = document.getElementById("remove");

	var canvas = new util.Canvas(
		container,
		1500,
		750,
		"border:1px solid #000000",
	);
	var file = new util.FileHandler(canvas, fileInput);

	// add event listeners
	fileInput.addEventListener(
		"change",
		(event) => {
			file.loadImage(event.target.files);
		},
		false,
	);

	removeBtn.addEventListener("click", () => {
		file.removeImage();
	});
});

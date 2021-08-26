const path = require("path");

// webpack config
module.exports = (env, options) => {
	return {
		// set soruce-map
		devtool: "source-map",

		// entry point
		entry: "./src/index.ts",

		// make webpack resolve imports
		resolve: {
			modules: [path.join(__dirname, "src"), "node_modules"],
			extensions: [".js", ".ts"],
		},

		// module
		module: {
			// create rule for ts files, that are passed to bebel-loader
			rules: [
				{
					test: /\.ts$/,
					include: [
						path.resolve(__dirname, "./src"),
						path.resolve(__dirname, "./node_modules"),
					],
					loader: "babel-loader",
				},
				{
					test: /\.js$/,
					include: [path.resolve(__dirname, "./node_modules")],
					loader: "babel-loader",
				},
			],
		},

		// output
		output: {
			path:
				options.mode === "development"
					? path.resolve(__dirname, "./__test__/scripts")
					: path.resolve(__dirname, "dist"),
			filename: "[name].js",
			library: ["cms-image-edit"],
			libraryTarget: "umd",
		},
	};
};

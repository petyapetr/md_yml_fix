import fs from "fs";

const fileNames = fs.readdirSync("./assets/raw/");
const formattedFileNames = fileNames.map((name) => {
	name = name.replaceAll(/\p{Emoji_Presentation}/gu, "");
	name = name.trim().replaceAll(" ", "-");
	return name;
	
});

for (let i = 0; i < fileNames.length; i++) {
	const input = "./assets/raw/".concat(fileNames[i]);

	try {
		const {formattedMd, customDir} = formatText(input);

		let output = "./assets/edited/";
		if (customDir[0]) {
			output += `${customDir[0]}/`;
			if (!fs.existsSync(output)) {
				fs.mkdirSync(output);
			}
		}
		output += formattedFileNames[i];

		fs.writeFileSync(output, formattedMd);
	} catch (err) {
		console.log(err);
		fs.copyFile(input, `./assets/unsorted/${formattedFileNames[i]}`);
	}
}

function formatText(path) {
	console.log(path);

	let header = "---\ntags:\n";
	let customDir = [];

	const md = fs
		.readFileSync(path, "utf8", (err, data) => {
			if (err) {
				console.log("Error acquired:");
				return err;
			}
			return data;
		})
		.split("---\n")

	md[1]
		.split("\n")
		.find((str) => str.startsWith("tags: "))
		.slice(7, -1)
		.split(", ")
		.forEach((tag) => {
			if (tag.includes("Notebooks/")) {
				tag = tag.replace("Notebooks/", "");
				customDir.push(tag);
			}
			header += "  - " + tag + "\n";
		});

	header += "---\n";

	const formattedMd = header + md[2];

	return {formattedMd, customDir};
}

// @ts-check

const FS = require("node:fs");
const PATH = require("node:path");

/**
 * @param {string} baseDir
 * @returns {Record<string, string>}
 */
function collectCategories(baseDir) {
	/**
	 * @type {Record<string, string>}
	 */
	const result = {};
	const start = performance.now();

	/**
	 * @param {string} dir
	 * @param {string} category
	 * @returns {void}
	 */
	function walk(dir, category) {
		const entries = FS.readdirSync(dir);

		for (const entry of entries) {
			const fullPath = PATH.join(dir, entry);
			const stats = FS.statSync(fullPath);

			if (stats.isDirectory()) {
				walk(fullPath, entry);
			} else {
				const name = PATH.parse(entry).name.toLowerCase();
				result[name] = category;
			}
		}
	}

	walk(baseDir, PATH.basename(baseDir));
	console.log(
		`Wrote ${Object.keys(result).length} functions to categories/categories.json in ${(
			performance.now() - start
		).toFixed(2)}ms`,
	);
	return result;
}

const categories = collectCategories(
	PATH.join(__dirname, "categories/functions"),
);
FS.rmSync(PATH.join(__dirname, "categories", "categories.json"), {
	force: true,
});
FS.writeFileSync(
	PATH.join(__dirname, "categories", "categories.json"),
	JSON.stringify(categories, null, 4),
);

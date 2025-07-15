// @ts-check

const FS = require("node:fs");
const PATH = require("node:path");
const CAT = require("./categories/categories.json");
const URL = {
	"aoi.canvas": "https://aoi.js.org/extensions/aoijs/aoicanvas/functions/",
	"aoi.js": "https://aoi.js.org/functions/",
	"aoi.music": "https://aoi.js.org/extensions/aoijs/aoimusic/music/",
	"aoi.invite": "https://aoi.js.org/extensions/aoijs/aoiinvite/invite/",
};

const SOURCE = {
	"aoi.canvas": "https://github.com/aoijs/aoi.canvas",
	"aoi.js": "https://github.com/aoijs/aoi.js",
	"aoi.music": "https://github.com/aoijs/aoi.music",
	"aoi.invite": "https://github.com/aoijs/aoi.invite",
};

const array = [];
write(PATH.join(__dirname, "docs"), "functions/functions.json");

/**
 * @param {string} path
 * @param {string} output
 * @returns {void}
 */
function write(path, output) {
	const start = performance.now();
	const data = main(path);
	FS.rmSync(output, { force: true });
	FS.writeFileSync(output, JSON.stringify(data, null, 4));
	console.log(
		`Wrote ${data.length} functions to ${output} in ${(
			performance.now() - start
		).toFixed(2)}ms`,
	);
}

/**
 * @param {string} path
 * @param {string} [_type]
 * @returns {Array<{ function: string; description: string; tip: string; source: string; usage: string; parameters: Array<{ field: string; type: string; description: string; required: boolean; }>; example: string; type: string; }>}
 */
function main(path, _type) {
	const files = FS.readdirSync(path);
	const type = _type && _type !== "functions" ? "aoi." + _type : "aoi.js";
	const funcType = type
		.split(".")
		.map((x) => x[0].toUpperCase() + x.slice(1))
		.join(".");

	for (const file of files) {
		const filePath = PATH.join(path, file);
		const stats = FS.statSync(filePath);

		if (stats.isDirectory()) {
			main(filePath, file);
		} else {
			const md = FS.readFileSync(filePath, "utf8");
			const funcName = getTitle(md) ?? "";
			array.push({
				function: funcName,
				description: getDescription(md),
				usage: getUsage(md),
				parameters: getParameters(md),
				example: getExample(md),
				extras: getExtraTable(md),
				tip: getTip(md),
				documentation: getUrl(file, type),
				source: getSource(type, funcName),
				type: funcType,
			});
		}
	}

	return array;
}

/**
 * @param {string} md
 * @returns {string | null}
 */
function getTitle(md) {
	const match = md.match(/title:\s*(.+)/);
	return match ? match[1].trim() : null;
}

/**
 * @param {string} md
 * @returns {string | null}
 */
function getDescription(md) {
	const match = md.match(/description:\s*(.+)/);
	return match ? match[1].trim() : null;
}

/**
 * @param {string} md
 * @returns {string | null}
 */
function getUsage(md) {
	const match = md.match(/##\s*Usage\s*```(aoi)?\s*\n([\s\S]+?)```/i);
	return match ? match[2]?.trim() : null;
}

/**
 * @param {string} md
 * @returns {string | null}
 */
function getExample(md) {
	const match1 = md.match(/<div slot="default">([\s\S]*?)<\/div>/i);
	if (match1) return match1[1].trim();

	const match2 = md.match(/##\s*Example(?:\(s\))?([\s\S]*)/i);
	return match2 ? match2[1].trim() : null;
}

/**
 * @param {string} md
 * @returns {Array<{ field: string; type: string; description: string; required: boolean; }>}
 */
function getParameters(md) {
	const lines = md.split("\n");
	const headerPattern =
		/\|\s*Field\s*\|\s*Type\s*\|\s*Description\s*\|\s*Required\s*\|/i;
	const tableLines = [];
	let inTable = false;

	for (const line of lines) {
		if (headerPattern.test(line)) {
			inTable = true;
			tableLines.push(line);
			continue;
		}

		if (inTable) {
			if (line.trim().startsWith("|")) {
				tableLines.push(line);
			} else {
				break;
			}
		}
	}

	return tableLines.length >= 3 ? parseParameterTable(tableLines) : [];
}

/**
 * @param {string} md
 * @returns {string | null}
 */
function getTip(md) {
	const match = md.match(/:::tip\[Extension\]([\s\S]*?):::/i);
	return match ? match[1].trim() : null;
}

/**
 * @param {string} file
 * @param {string} type
 * @returns {string}
 */
function getUrl(file, type) {
	return (
		URL[type] +
		file
			.replace(/\.md(x)?/gi, "")
			.toLowerCase()
			.trim()
	);
}

/**
 * @param {string} type
 * @param {string} name
 * @returns {string}
 */
function getSource(type, name) {
	return type === "aoi.js"
		? `${SOURCE[type]}/tree/v6/src/functions/${CAT[name.replace("$", "").toLowerCase() ?? ""]}/${name.replace("$", "")}.js`
		: SOURCE[type];
}

/**
 * @param {string[]} tableLines
 * @returns {Array<{ field: string; type: string; description: string; required: boolean; }>}
 */
function parseParameterTable(tableLines) {
	const rows = tableLines.slice(2);

	return rows.map((line) => {
		const cells = line
			.split("|")
			.map((c) => c.trim())
			.filter(Boolean);
		const field = cells[0].replace(/\?$/, "");
		const type = cells[1];
		const description = cells[2]?.replace(/<br>|<br\s*\/>\s*/g, "\n") || "";
		const required = cells[3]?.toLowerCase() === "true";
		return { field, type, description, required };
	});
}

/**
 * @param {string} md
 * @returns {Array<{ name: string; data: any; }>}
 */
function getExtraTable(md) {
	const lines = md.split("\n");
	let tables = [],
		current = { name: null, data: [] },
		inTable = false;

	for (const line of lines) {
		const match = line.match(/#\s*(.+)/i);
		const section = match?.[1]?.trim();
		if (["Usage", "Example", "Examples", "Parameters", "Parameter", "Example(s)"].includes(section)) continue;
		if (!current.name) current.name = section?.replace(/#/g, "").trim();

		if (line.trim().startsWith("|")) {
			inTable = true;
			current.data.push(line);
		} else if (inTable) {
			if (current.data.length >= 3) tables.push(current);
			current = { name: null, data: [] };
			inTable = false;
		}
	}

	if (inTable && current.data.length >= 3) tables.push(current);
	if (tables.length < 2) return [];

	return tables.slice(1).map(parseGenericTable);
}

/**
 * @param {{ name: string; data: string[]; }} table
 * @returns {{ name: string; data: any; }}
 */
function parseGenericTable(table) {
	const headers = table.data[0].split("|").map(h => h.trim()).filter(Boolean);
	const rows = table.data.slice(2);
	let data = rows.map(line => {
		const cells = line.split("|").map(c => c.trim()).filter(Boolean);
		return headers.reduce((obj, key, i) => {
			obj[key] = cells[i] ?? "";
			return obj;
		}, {});
	});

	if (data.every(row => Object.keys(row).length === 1)) {
		data = data.map(row => Object.values(row)[0]);
	}

	return { name: table.name || headers[0], data };
}

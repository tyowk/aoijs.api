// @ts-check

const Fuse = require("fuse.js");
const functionData = require("./functions.json");

/**
 * @param {string} name
 * @param {number} [limit]
 * @returns {string[] | null}
 */
module.exports = (name, limit = 5) => {
    const results = new Fuse(functionData, {
        keys: ["function"],
        includeScore: false,
        threshold: 0.9,
    }).search(name.replace("$", ""));

    if (results.length === 0) return null;
    return results
        .slice(0, isNaN(limit) ? 5 : Number(limit))
        .map((result) => result.item.function);
};

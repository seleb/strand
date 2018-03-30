/**
 * Converts source text into a map of title->body pairs
 * @param {string} source Source text to parse
 * @returns {object} Map of passage titles to passage bodies
 */
export function parsePassages(source) {
	// sanitize: remove unneeded \r characters and any leading/trailing space
	source = source.replace(/[\r]/g, "").trim();

	// split passages
	// input:
	//     ::title
	//     body
	// output:
	//     [body,title,body,title...]
	const segments = source.split(/^:{2}(.+)\n/gm);

	// remove the first element, which is a body segment without a title
	if (segments.shift().length > 0) {
		console.warn(
			"Found text above first passage title; this text will be ignored"
		);
	}

	if (segments.length === 0) {
		throw new Error("No passages found");
	}

	// map passage bodies to titles
	const passages = {};
	for (let i = 0; i < segments.length; i += 2) {
		const title = segments[i];
		const body = segments[i + 1].trim();
		if (body.length === 0) {
			throw new Error(`Passage titled "${title}" is empty"`);
		}
		if (passages[title]) {
			throw new Error(`Multiple passages titled "${title}" found`);
		}
		passages[title] = body;
	}
	return passages;
}

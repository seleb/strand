import { compile } from "./compiler";

/**
 * Converts source text into a map of title->passage pairs
 * @param {string} source Source text to parse
 * @returns {object} Map of passage titles to passage objects {title: {title,body}}
 */
export function parsePassages(source) {
	// sanitize: remove unneeded \r characters and any leading/trailing space
	source = source.replace(/[\r]/g, '').trim();

	// auto link sugar: `>`, `>text`, and `>a|b|c`
	let autolink = 0;
	source = source
		.replace(
			/^>(.*)/gm,
			/* eslint-disable indent */
			(_, link) =>
				link === '>'
					? `>${link}`
					: link
							.split('|')
							.map(l => `[[${l}|this.goto('auto-${autolink + 1}')]]`)
							.concat(`\n::auto-${++autolink}`)
							.join('\n')
			/* eslint-enable indent */
		)
		// auto link escape
		.replace(/^\\>/gm, '>');

	// split passages
	// input:
	//     ::title
	//     body
	// output:
	//     [body,title,body,title...]
	const segments = source.split(/^:{2}(.+)\n/gm);

	// remove the first element, which is a body segment without a title
	if (segments.shift().length > 0) {
		console.warn('Found text above first passage title; this text will be ignored');
	}

	if (segments.length === 0) {
		throw new Error('No passages found');
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
		passages[title] = {
			title,
			body,
		};
	}
	return passages;
}

export function compilePassage(passage) {
	if (!passage) {
		throw new Error("No passage provided");
	}
	const { title, body } = passage;
	if (!title) {
		throw new Error("Passage must have a title");
	}
	if (!body) {
		throw new Error("Passage must have a body");
	}
	return {
		...passage,
		program: compile(passage.body)
	};
}

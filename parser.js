/**
 * Converts source text into a map of title->passage pairs
 * @param {string} source Source text to parse
 * @returns {object} Map of passage titles to passage objects {title: {title,body}}
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
		passages[title] = {
			title,
			body
		};
	}
	return passages;
}

export function parsePassage(passage) {
	if (!passage) {
		throw new Error("No passage provided");
	}
	const {
		title,
		body
	} = passage;
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

import {
	getLexer
} from "./lexer";
import myrules from "./lang";

const lex = getLexer(myrules);

function compile(source) {
	return parse(lex(source));
}

function parse(tokens) {
	const res = [];
	const stack = [res];
	for (let token of tokens) {
		switch (token.name) {
			case "if":
				{
					const condition = {
						name: "condition",
						value: [{
							condition: token.value,
							branch: []
						}]
					};

					stack[stack.length - 1].push(condition);
					stack.push(condition.value); // enter condition
					stack.push(condition.value[0].branch); // enter condition's branch
					break;
				}
			case "elseif":
				{
					const branch = {
						condition: token.value,
						branch: []
					};
					stack.pop(); // exit condition's branch
					stack[stack.length - 1].push(branch); // last entry in stack is now active condition, so add to its branches
					stack.push(branch.branch); // enter condition's branch
					break;
				}
			case "endif":
				if (stack.length < 3) {
					throw new Error("Tried to close if block, but one wasn't open");
				}
				stack.pop(); // exit condition's branch
				stack.pop(); // exit condition
				break;
			case "action":
				stack[stack.length - 1].push(token);
				break;
			case "fill":
				{
					// fill nodes are just plain text
					const n = {
						...token,
						name: "text"
					};
					stack[stack.length - 1].push(n);
					break;
				}
			default:
				throw new Error(`Unrecognized token name: ${token.name}`);
		}
	}
	if (stack.length !== 1) {
		throw new Error(`Unclosed stack: ${stack}`);
	}
	return res;
}
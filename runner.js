import { parsePassages } from "./parser";

const defaultTitle = "DEFAULT";
export const defaultPassage = {
	title: defaultTitle,
	body:
		"This shows up when a passage failed to parse, or doesn't even exist. Try checking the link for spelling errors or the console logs for more detail on the error.\n[[back|this.back();]]"
};

export default class {
	/**
	 *
	 * @param {string?} source `this.setSource` is called with `source` as a parameter
	 */
	constructor(source) {
		this.history = [];
		this.currentPassage = null;
		this._evalInScope = (script => eval(script)).bind(this);

		this.setSource(source);
	}
	/**
	 * Evaluates a provided script,
	 * using the runner as execution scope.
	 *
	 * @param {string} script Script to evaluate
	 * @returns {any} Evaluation of script
	 */
	eval(script = "") {
		console.log("Running script:", script);
		return this._evalInScope(script);
	}

	/**
	 * Parses `source` and assigns the result to `this.passages`.
	 * If no `source` is provided, assigns an empty object instead.
	 *
	 * If no passage with the title `DEFAULT` is provided,
	 * the runner's default is used.
	 *
	 * @param {string?} source Source text to parse, or nothing
	 */
	setSource(source) {
		if (source) {
			this.passages = parsePassages(source);
		} else {
			this.passages = {};
		}
		this.passages[defaultTitle] =
			this.passages[defaultTitle] || defaultPassage;
	}
	getPassageWithTitle(title) {
	}
	goto(title) {
	}
	back() {
	}
	displayPassage(passage) {
	}
}

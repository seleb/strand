import { parsePassages, parsePassage } from "./parser";

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

	/**
	 * Parses and returns the passage with the provided title
	 * If the passage can't be found/parsed, tries to use default instead.
	 *
	 * @param {string} title Title of passage to retrieve
	 * @returns {Object} parsed passage
	 */
	getPassageWithTitle(title) {
		try {
			if (!this.passages[title]) {
				throw new Error(`Passage titled "${title}" not found"`);
			}
			return parsePassage(this.passages[title]);
		} catch (err) {
			console.error(
				`Failed to parse passage titled "${title}", going to "${defaultTitle}" instead. Original error:`,
				err
			);
			return parsePassage(this.passages[defaultTitle]);
		}
	}
	goto(title) {
	}
	back() {
	}

	/**
	 * Pushes the current passage (if there is one) to history,
	 * then tells the renderer to display the passed-in passage
	 *
	 * @param {Object} passage Passage to display
	 * @returns {Promise} resolves when renderer has displayed passage
	 */
	displayPassage(passage) {
		console.log("Displaying passage:", passage);
		// push current state to history
		if (this.currentPassage) {
			this.history.push(this.currentPassage.title);
		} else {
			console.warn("No history pushed because there is no current passage");
		}
		this.currentPassage = passage;
		return Promise.resolve(); // TODO: ask renderer to display it
	}
}

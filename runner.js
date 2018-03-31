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

	/**
	 * Retrieves the passage with provided title, then displays it.
	 *
	 * @param {string} title Title of passage to go to
	 * @returns {Promise} resolves when transition in to new passage has completed.
	 */
	goto(title) {
		console.log("Going to passage:", title);
		return Promise.resolve()
			.then(() => this.getPassageWithTitle(title))
			.then(passage => this.displayPassage(passage));
	}
	/**
	 * Goes to the last passage.
	 *
	 * @returns {Promise} resolves with title of new currentPassage when goto is complete. If no history is available, rejects with an error
	 */
	back() {
		console.log("back");
		if (this.history.length === 0) {
			return Promise.reject(
				new Error(
					"Cannot go back because there is no history available."
				)
			);
		}
		// go to the last entry in history,
		// then remove the last entry in history
		// (i.e. don't get stuck in a loop)
		const lastPassageTitle = this.history.pop();
		return this.goto(lastPassageTitle).then(() => {
			this.history.pop();
			return lastPassageTitle;
		});
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

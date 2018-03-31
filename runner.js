const defaultTitle = "DEFAULT";
export const defaultPassage = {
	title: defaultTitle,
	body:
		"This shows up when a passage failed to parse, or doesn't even exist. Try checking the link for spelling errors or the console logs for more detail on the error.\n[[back|this.back();]]"
};

export default class {
	constructor(source) {
		this.history = [];
		this.currentPassage = null;
		this._evalInScope = ((script)=>eval(script)).bind(this);
	}
}

function NarrativeEngine() {
	this.scope = this;
}

NarrativeEngine.prototype.log = function () {
	console.log.apply(console, arguments);
};

NarrativeEngine.prototype.parseSource = function (__source) {
	// remove unneeded \r characters
	__source = __source.replace(/[\r]/g, '');

	this.log('Parsing source:', __source);

	return this.parsePassages(__source);
};

NarrativeEngine.prototype.parsePassages = function (__source) {
	// split passages apart
	// passages are in format:
	// ::PASSAGE TITLE
	// passage contents
	var passageRegex = /\s*?:{2}(.*)\n/g;
	var passages = {};

	var p = __source.split(passageRegex);
	p.shift(); // remove the first element, which is all text above first passage title
	this.log(p);

	// associate passage bodies to passage titles
	for (var i = 0; i < p.length; i += 2) {
		passages[p[i]] = p[i + 1];
	}

	this.log('Parsed passages:', passages);
	return passages;
};

NarrativeEngine.prototype.parseConditionals = function (__source) {
	var regex = /\((.*?)\)\{(.*)\}\s*?\n{0,1}/g;
	var sections = __source.split(regex);

	var result = [];
	for (var i = 0; i < sections.length; i += 3) {
		result.push(sections[i]);
		if (this.__eval.call(this.scope, sections[i + 1])) {
			result.push(sections[i + 2]);
		}
	}
	return result.join('');
};

NarrativeEngine.prototype.parseLinks = function (__source) {
	// break out links (links are inside double square brackets, i.e. [[link]] )
	// result will be an array in format [plain-text,whitespace,link, plain-text,whitespace,link, ...]
	regexSource = /(\s)?\[{2}(.*?)\]{2}/g;
	return __source.split(regexSource);
};

NarrativeEngine.prototype.parseExtraData = function (__source) {
	// break out links (links are inside double square brackets, i.e. [[link]] )
	// result will be an array in format [plain-text,whitespace,link, plain-text,whitespace,link, ...]
	regexSource = /(\s)?\\{{2}(.*?)\\}{2}/g
	return __source.split(regexSource);
};



NarrativeEngine.prototype.parsePassage = function (__source) {
	this.log('source: ', __source);
	if (!__source) {
		throw 'no source provided';
	}
	var s;
	do {
		s = __source;
		__source = this.parseConditionals(s);
	} while (s !== __source);
	this.log('conditioned source:', __source);
	__source = this.parseLinks(__source);
	this.log('linked source:', __source);

	// create word list
	// (links are always one "word")
	var words = [];
	for (var i = 0; i < __source.length; ++i) {
		if (i % 3 != 2) { // link check
			if (__source[i]) {
				// split plain-text into array of words/whitespace
				var w = __source[i].split(/([ \n])/g);
				for (var j = 0; j < w.length; ++j) {
					words.push(w[j]);
				}
			}
		} else {
			// link
			var link = __source[i].split(/(.*?)\|(.*)/);
			if (link.length === 1) {
				link[1] = 'this.goto("' + link[0] + '");';
			} else {
				link = link.slice(1, 3);
			}
			words.push({
				text: link[0],
				link: link[1]
			});
		}
	}
	// clear out empty entries
	for (var i = words.length - 1; i >= 0; --i) {
		if (!words[i]) {
			words.splice(i, 1);
		}
	}
	this.log('Parsed passage: ', words);
	return words;
};

NarrativeEngine.prototype.__eval = function (__s) {
	return eval(__s);
};

NarrativeEngine.prototype.eval = function (__script, __scope) {
	// return this.startAction()
	// .then(this.__eval.bind(__scope, __script))
	// .then(this.endAction.bind(this));
	return this.__eval.call(__scope, __script);
};

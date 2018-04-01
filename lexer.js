// executes after all user-defined rules and matches any/all characters
const fillRule = {
	name: "fill",
	regex: /^[^]/,
	getValue: match => match
};

/**
 *
 * @param {string} source Source text to lex
 * @param {Object[]} rules token rules
 * @returns {Object[]} Array of lexed tokens
 */
function lex({ source = "", rules }) {
	const tokens = [];
	while (source.length > 0) {
		for (let rule of rules) {
			const match = source.match(rule.regex);
			if (match) {
				// special case: concat to existing fill instead of adding multiple in a row
				if (
					rule === fillRule &&
					tokens.length > 0 &&
					tokens[tokens.length - 1].name === fillRule.name
				) {
					tokens[tokens.length - 1].value += rule.getValue(...match);
				} else {
					// standard case
					tokens.push({
						name: rule.name,
						value: rule.getValue(...match)
					});
				}
				source = source.substr(match[0].length);
				break;
			}
		}
	}
	return tokens;
}

function validateRules(rules) {
	if (rules.length === 0) {
		throw new Error("Must define at least one rule");
	}
	rules.forEach(rule => {
		if (!rule.name) {
			throw new Error(
				"All rules must have `name`, a string indicating the type of token"
			);
		}
		if (!rule.regex) {
			throw new Error(
				"All rules must have `regex`, a string containing the token regex"
			);
		}
		if (!rule.getValue) {
			throw new Error(
				"All rules must have `getValue`, a function which, provided the regex match, returns the token value"
			);
		}
	});
}

/**
 *
 * @param {Object[]} rules Array of tokenizing rules, in order of precedence
 * @returns {function} Can be called with source text to get tokens according to provided rules
 */
export function getLexer(rules = []) {
	validateRules(rules);
	// convert regex strings in rules to actual regex objects
	rules = rules.map(rule => ({
		...rule,
		regex: new RegExp(`^${rule.regex}`)
	}));
	// add fill rule
	rules.push(fillRule);
	return source =>
		lex({
			source,
			rules
		});
}

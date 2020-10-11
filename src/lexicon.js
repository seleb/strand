export default [
	{
		name: "comment",
		regex: String.raw`\/\/(.*)\n?`,
		getValue: (match, comment) => comment.trim()
	},
	{
		name: "action",
		regex: String.raw`\[\[([^]+?)\]\]`,
		getValue: (match, content) => {
			const [text, action] = content.split("|");
			return {
				text,
				action: action || `this.goto("${text.replace(/"/g,'\\"')}")`
			};
		}
	},
	{
		name: "if",
		regex: String.raw`<<\s*?if\s*?([^]+?)\s*?>>`,
		getValue: (match, condition) => condition.trim()
	},
	{
		name: "elseif",
		regex: String.raw`<<\s*?els?e?\s*?if\s*?([^]+?)\s*?>>`,
		getValue: (match, condition) => condition.trim()
	},
	{
		// else -> elseif true
		name: "elseif",
		regex: String.raw`<<\s*?else?\s*?>>`,
		getValue: () => "true"
	},
	{
		name: "endif",
		regex: String.raw`<<\s*?endif\s*?>>`,
		getValue: () => {}
	},
	{
		name: "do",
		regex: String.raw`<<\s*?do\s*?([^]+?)\s*?>>`,
		getValue: (match, statement) => statement.trim()
	},
	{
		// set a=b -> do this.a=b
		name: "do",
		regex: String.raw`<<\s*?set\s*?([^]+?)\s*?=([^]+?)\s*?>>`,
		getValue: (match, identifier, value) =>
			`this.${identifier.trim()}=${value.trim()}`
	},
	{
		name: "print",
		regex: String.raw`<<\s*?print\s*?([^]+?)\s*?>>`,
		getValue: (match, statement) => statement.trim()
	}
];

export default [
	{
		name: "action",
		regex: String.raw`\[\[(.+?)\]\]`,
		getValue: (match, content) => {
			const [text, action] = content.split("|");
			return {
				text,
				action: action || `this.goto("${text}")`
			};
		}
	},
	{
		name: "if",
		regex: String.raw`<<\s*?if\s*?(.+?)\s*?>>`,
		getValue: (match, condition) => condition.trim()
	},
	{
		name: "elseif",
		regex: String.raw`<<\s*?els?e?\s*?if\s*?(.+?)\s*?>>`,
		getValue: (match, condition) => condition.trim()
	},
	{
		name: "elseif",
		regex: String.raw`<<\s*?else?\s*?>>`,
		getValue: () => "true"
	},
	{
		name: "endif",
		regex: String.raw`<<\s*?endif\s*?>>`,
		getValue: () => {}
	}
];

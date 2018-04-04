export function parse(tokens) {
	const res = [];
	const stack = [res];
	for (let token of tokens) {
		switch (token.name) {
			case "if": {
				const condition = {
					name: "condition",
					value: [
						{
							condition: token.value,
							branch: []
						}
					]
				};

				stack[stack.length - 1].push(condition);
				stack.push(condition.value); // enter condition
				stack.push(condition.value[0].branch); // enter condition's branch
				break;
			}
			case "elseif": {
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
					throw new Error(
						"Tried to close if block, but one wasn't open"
					);
				}
				stack.pop(); // exit condition's branch
				stack.pop(); // exit condition
				break;
			case "action":
			case "do":
			case "print":
				stack[stack.length - 1].push(token);
				break;
			case "fill": {
				// fill nodes are just plain text
				const n = {
					...token,
					name: "text"
				};
				stack[stack.length - 1].push(n);
				break;
			}
			case "comment":
				break;
			default:
				throw new Error(`Unrecognized token name: ${token.name}`);
		}
	}
	if (stack.length !== 1) {
		throw new Error(`Unclosed stack: ${stack}`);
	}
	return res;
}

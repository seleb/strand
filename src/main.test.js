import main from "./main";
import Interpreter from "./interpreter";

describe("main", () => {
	it("exports the interpreter class", () => {
		expect(main).toBe(Interpreter);
	});
});

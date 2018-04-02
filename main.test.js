import main from "./main";
import Interpreter from "./src/interpreter";

describe("main", () => {
	it("exports the interpreter class", () => {
		expect(main).toBe(Interpreter);
	});
});

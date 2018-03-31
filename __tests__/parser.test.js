import { parsePassages } from "../parser";

describe("parsePassages", () => {
	it("is a function", ()=>{
		expect(typeof parsePassages).toBe("function");
	});
	it("returns a map of title->body pairs", () => {
		expect(parsePassages("::title\nbody")).toEqual({
			title: "body"
		});
		expect(parsePassages("::a\n1\n::b\n2\n::c\n3")).toEqual({
			a: "1",
			b: "2",
			c: "3"
		});
	});
	it("removes `\\r` characters", () => {
		expect(parsePassages("::ti\rtle\n\rbo\rdy")).toEqual({
			title: "body"
		});
	});
	it("ignores text above first passage title", () => {
		expect(
			JSON.stringify(parsePassages("extra\n::title\nbody"))
		).not.toMatch(/extra/);
	});
	it("fails if no passages are found", () => {
		expect(() => parsePassages("")).toThrow();
		expect(() => parsePassages("::title without body")).toThrow();
		expect(() => parsePassages("body without title")).toThrow();
	});
	it("fails if passages have non-unique titles", () => {
		expect(() => parsePassages("::title\nbody1\n::title\nbody2")).toThrow();
	});

	describe("passage titles", () => {
		it("are strings", ()=>{
			expect(Object.keys(parsePassages("::title\nbody"))[0]).toBe("title");
			expect(Object.keys(parsePassages("::1\nbody"))[0]).toBe("1");
			expect(Object.keys(parsePassages("::null\nbody"))[0]).toBe("null");
			expect(Object.keys(parsePassages("::undefined\nbody"))[0]).toBe("undefined");
		});
		it("end at the first `\\n` character", () => {
			expect(
				Object.keys(parsePassages("::title\nbody\n::ti\ntle\nbo\ndy"))
			).toEqual(["title", "ti"]);
			expect(() => parsePassages("::title")).toThrow();
			expect(Object.keys(parsePassages("::a\nbody\n::b"))).toEqual(["a"]);
		});
		it("start with `::`", () => {
			expect(
				Object.keys(
					parsePassages(
						"::a\nbody\n:not a title\nbody\n::b\nbody\n::c\nbody\n ::not a title\nbody\n::d\nbody"
					)
				)
			).toEqual(["a", "b", "c", "d"]);
		});
		it("are not empty", () => {
			expect(Object.keys(parsePassages("::a\n1\n::\n2"))).toEqual(["a"]);
		});
	});
	describe("passage bodies", () => {
		it("are strings", ()=>{
			expect(parsePassages("::title\nbody")["title"]).toBe("body");
			expect(parsePassages("::title\n1")["title"]).toBe("1");
			expect(parsePassages("::title\nnull")["title"]).toBe("null");
			expect(parsePassages("::title\nundefined")["title"]).toBe("undefined");
		});
		it("have leading/trailing whitespace trimmed", () => {
			expect(parsePassages("::title\n body \n")["title"]).toBe("body");
		});
		it("are not empty", () => {
			expect(() => parsePassages("::title\n")).toThrow();
			expect(() => parsePassages("::a\n::b\nbody")).toThrow();
		});
	});
});

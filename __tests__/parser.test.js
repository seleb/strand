import { parsePassages } from "../parser";

describe("parsePassages", () => {
	it("is a function", () => {
		expect(typeof parsePassages).toBe("function");
	});
	it("returns a map of title->passage pairs", () => {
		expect(parsePassages("::title\nbody")).toEqual({
			title: {
				title: "title",
				body: "body"
			}
		});
		expect(parsePassages("::a\n1\n::b\n2\n::c\n3")).toEqual({
			a: {
				title: "a",
				body: "1"
			},
			b: {
				title: "b",
				body: "2"
			},
			c: {
				title: "c",
				body: "3"
			}
		});
	});
	it("removes `\\r` characters", () => {
		expect(parsePassages("::ti\rtle\n\rbo\rdy")).toEqual({
			title: {
				title: "title",
				body: "body"
			}
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
		expect(() =>
			parsePassages("::duplicate title\nbody1\n::duplicate title\nbody2")
		).toThrow();
	});
	describe("passage titles", () => {
		it("are strings", () => {
			expect(Object.keys(parsePassages("::title\nbody"))[0]).toBe(
				"title"
			);
			expect(Object.keys(parsePassages("::1\nbody"))[0]).toBe("1");
			expect(Object.keys(parsePassages("::null\nbody"))[0]).toBe("null");
			expect(Object.keys(parsePassages("::undefined\nbody"))[0]).toBe(
				"undefined"
			);
		});
		it("are maps keys and passage properties", () => {
			const p = parsePassages("::title\nbody");
			expect(Object.keys(p)[0]).toBe(p.title.title);
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
		it("are strings", () => {
			expect(parsePassages("::title\nbody")["title"].body).toBe("body");
			expect(parsePassages("::title\n1")["title"].body).toBe("1");
			expect(parsePassages("::title\nnull")["title"].body).toBe("null");
			expect(parsePassages("::title\nundefined")["title"].body).toBe(
				"undefined"
			);
		});
		it("have leading/trailing whitespace trimmed", () => {
			expect(parsePassages("::title\n body \n")["title"].body).toBe(
				"body"
			);
		});
		it("are not empty", () => {
			expect(() => parsePassages("::title\n")).toThrow();
			expect(() => parsePassages("::a\n::b\nbody")).toThrow();
		});
	});
});

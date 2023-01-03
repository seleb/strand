import { compilePassage, parsePassages } from "./passages";

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
	it('treats `>` and `>text` as passage break sugar', () => {
		expect(parsePassages(`
::start
a
>
b
>c|d|e
f
`)).toEqual(parsePassages(`
::start
a
[[|this.goto('auto-1')]]
::auto-1
b
[[c|this.goto('auto-2')]]
[[d|this.goto('auto-2')]]
[[e|this.goto('auto-2')]]
::auto-2
f
`));
	});
	it('treats `\\>` as an escape for `>`', () => {
		expect(parsePassages('::start\n\\>')).toEqual({ start: { title: 'start', body: '>' } });
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

describe("compilePassage", () => {
	it("is a function", () => {
		expect(typeof compilePassage).toBe("function");
	});
	it("accepts an object with `title` and `body` as an argument", () => {
		expect(() => compilePassage()).toThrow();
		expect(() => compilePassage("string")).toThrow();
		expect(() => compilePassage({})).toThrow();
		expect(() =>
			compilePassage({
				title: "title",
				body: ""
			})
		).toThrow();
		expect(() =>
			compilePassage({
				title: "",
				body: "body"
			})
		).toThrow();
		expect(
			compilePassage({
				title: "title",
				body: "body"
			})
		).toBeDefined();
	});

	// TODO
	it("returned object has `program` property", () => {
		expect(
			compilePassage({
				title: "title",
				body: "body"
			}).program
		).toBeDefined();
	});
	it("returned object preserves `title`, `body`, and any extra non-spec properties", () => {
		const p = compilePassage({
			title: "title",
			body: "body",
			extra: "property"
		});
		expect(p.title).toBe("title");
		expect(p.body).toBe("body");
		expect(p.extra).toBe("property");
	});
	describe("`program` property", () => {
		it("throws if an `<<if>>` block is started but not closed", () => {
			expect(() =>
				compilePassage({ title: "title", body: "<<if a>>" })
			).toThrow();
			expect(() =>
				compilePassage({ title: "title", body: "<<if a>><<endif>>" })
			).not.toThrow();
			expect(() =>
				compilePassage({ title: "title", body: "<<if a>><<elseif b>>" })
			).toThrow();
			expect(() =>
				compilePassage({
					title: "title",
					body: "<<if a>><<elseif b>><<endif>>"
				})
			).not.toThrow();
		});
		it("parses stuff correctly :shrug:", () => {
			expect(
				compilePassage({
					title: "title",
					body: "body"
				}).program
			).toEqual([
				{
					name: "text",
					value: "body"
				}
			]);
			expect(
				compilePassage({
					title: "title",
					body: "simple sentence with a [[link]]."
				}).program
			).toEqual([
				{
					name: "text",
					value: "simple sentence with a "
				},
				{
					name: "action",
					value: {
						text: "link",
						action: 'this.goto("link")'
					}
				},
				{
					name: "text",
					value: "."
				}
			]);
			expect(
				compilePassage({
					title: "title",
					body:
						"text<<if a>>1<<elseif b>>[[link]]<<if c>>3<<else>>[[text|action]]<<endif>><<endif>>."
				}).program
			).toEqual([
				{
					name: "text",
					value: "text"
				},
				{
					name: "condition",
					value: [
						{
							condition: "a",
							branch: [{ name: "text", value: "1" }]
						},
						{
							condition: "b",
							branch: [
								{
									name: "action",
									value: {
										text: "link",
										action: 'this.goto("link")'
									}
								},
								{
									name: "condition",
									value: [
										{
											condition: "c",
											branch: [
												{ name: "text", value: "3" }
											]
										},
										{
											condition: "true",
											branch: [
												{
													name: "action",
													value: {
														text: "text",
														action: "action"
													}
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					name: "text",
					value: "."
				}
			]);
		});
	});
});

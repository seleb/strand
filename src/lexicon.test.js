import { getLexer } from "lil-lexer";
import lexicon from "./lexicon";

describe("lexicon", () => {
	it("is a valid ruleset for the lexer", () => {
		expect(() => getLexer(lexicon)).not.toThrow();
	});
	const lex = getLexer(lexicon);
	it('converts `[[a|b]]` to an action token with value: `{text: "a", action: "b"}`', () => {
		expect(lex("[[a|b]]")).toEqual([
			{ name: "action", value: { text: "a", action: "b" } }
		]);
	});
	it('converts `<<if a>>` to an if token with value: `"a"`', () => {
		expect(lex("<<if a>>")).toEqual([{ name: "if", value: "a" }]);
	});
	it('converts `<<elseif a>>` to an elseif token with value: `"a"`', () => {
		expect(lex("<<elseif a>>")).toEqual([{ name: "elseif", value: "a" }]);
	});
	it("converts `<<endif>>` to an endif token without value", () => {
		expect(lex("<<endif>>")).toEqual([{ name: "endif" }]);
	});
	it('converts `<<do a>>` to a do token with value: `"a"`', () => {
		expect(lex("<<do a>>")).toEqual([{ name: "do", value: "a" }]);
	});
	it('converts `<<print a>>` to a print token with value: `"a"`', () => {
		expect(lex("<<print a>>")).toEqual([{ name: "print", value: "a" }]);
	});
	it('converts `// a` to a comment token with value: `"a"`', () => {
		expect(lex("// a")).toEqual([{ name: "comment", value: "a" }]);
	});
	it("treats `[[]]` without anything inside as normal characters", () => {
		expect(lex("[[]]")).toEqual([{ name: "fill", value: "[[]]" }]);
	});
	it("treats `<<>>` without anything inside as normal characters", () => {
		expect(lex("<<>>")).toEqual([{ name: "fill", value: "<<>>" }]);
	});
	it("respects newline after `<<>>` blocks", () => {
		expect(lex("<<if a>>\ntext")).toEqual(lex("<<if a>>").concat(lex("\ntext")));
		expect(lex("<<elseif a>>\ntext")).toEqual(lex("<<elseif a>>").concat(lex("\ntext")));
		expect(lex("<<else>>\ntext")).toEqual(lex("<<else>>").concat(lex("\ntext")));
		expect(lex("<<endif>>\ntext")).toEqual(lex("<<endif>>").concat(lex("\ntext")));
		expect(lex("<<do a>>\ntext")).toEqual(lex("<<do a>>").concat(lex("\ntext")));
		expect(lex("<<set a=b>>\ntext")).toEqual(lex("<<set a=b>>").concat(lex("\ntext")));
	});
	describe("sugar", () => {
		it('treats `[[a]]` as sugar for `[[a|this.goto("a")]]`', () => {
			expect(lex("[[test]]")).toEqual(lex('[[test|this.goto("test")]]'));
		});
		it("treats `<<else>>` as sugar for <<elseif true>>", () => {
			expect(lex("<<else>>")).toEqual(lex("<<elseif true>>"));
		});
		it("treats `<<set a=b>>` as sugar for `<<do this.a=b>>", () => {
			expect(lex("<<set a=b>>")).toEqual(lex("<<do this.a=b>>"));
		});
		it("ignores whitespace between `<<`/`>>` and contents", () => {
			expect(lex("<<if condition>>")).toEqual(
				lex("<< \n\r\tif condition \n\r\t>>")
			);
			expect(lex("<<elseif condition>>")).toEqual(
				lex("<< \n\r\telseif condition \n\r\t>>")
			);
			expect(lex("<<endif>>")).toEqual(lex("<< \n\r\tendif \n\r\t>>"));
		});
		it("ignores whitespace between `if`/`elseif` keyword and condition", () => {
			expect(lex("<<ifcondition>>")).toEqual(
				lex("<<if \n\r\tcondition>>")
			);
			expect(lex("<<elseifcondition>>")).toEqual(
				lex("<<elseif \n\r\tcondition>>")
			);
		});
		it("treats `else if`,`elseif`,`elsif`, and `elif` as interchangeable", () => {
			const baseline = lex("<<else if condition>>");
			expect(lex("<<else \n\r\tif condition>>")).toEqual(baseline);
			expect(lex("<<else if condition>>")).toEqual(baseline);
			expect(lex("<<elseif condition>>")).toEqual(baseline);
			expect(lex("<<elsif condition>>")).toEqual(baseline);
			expect(lex("<<elif condition>>")).toEqual(baseline);
		});
	});
	it("works in simple cases", () => {
		expect(
			lex(
				"A basic sentence with [[multiple]] links using the [[shorthand]] format."
			)
		).toEqual([
			{ name: "fill", value: "A basic sentence with " },
			{
				name: "action",
				value: {
					action: 'this.goto("multiple")',
					text: "multiple"
				}
			},
			{ name: "fill", value: " links using the " },
			{
				name: "action",
				value: {
					action: 'this.goto("shorthand")',
					text: "shorthand"
				}
			},
			{ name: "fill", value: " format." }
		]);
		expect(
			lex(
				"A full if-elseif-else-endif block.<<if a>>1<<elseif b>>2<<else>>3<<endif>>"
			)
		).toEqual(
			[].concat(
				{ name: "fill", value: "A full if-elseif-else-endif block." },
				{ name: "if", value: "a" },
				{ name: "fill", value: "1" },
				{ name: "elseif", value: "b" },
				{ name: "fill", value: "2" },
				{ name: "elseif", value: "true" },
				{ name: "fill", value: "3" },
				{ name: "endif" }
			)
		);

		// [[a]][[a|b]] -> "a","a|b" instead of "a]][[a|b"
		expect(lex("[[a]][[a|b]]")).toEqual([
			{
				name: "action",
				value: { text: "a", action: 'this.goto("a")' }
			},
			{ name: "action", value: { text: "a", action: "b" } }
		]);
	});
	it("works in reasonably complex cases", () => {
		const source = `
		
This passage begins with a bunch of whitespace
	It also has tabs // and comments
// some at the start of a line
	it's got [[links]]
	<<if conditions>>
[[also|actions]]
		<<if nested conditions>>
		it's not a real-world example
	<<if another nested condition with [[link]] syntax inside it!>>
		that's a bit weird
	<<endif>>
	but it should cover most real-world cases
		<<else>>
		I'm sure we'll find a way to break it though
		<<endif>>
	<<else	
	
	if[[bad|action]]

>> <<endif>>
it ends with some whitespace too
	
`;
		expect(lex(source)).toEqual([
			{
				name: "fill",
				value:
					"\n\t\t\nThis passage begins with a bunch of whitespace\n\tIt also has tabs "
			},
			{
				name: 'comment',
				value: 'and comments'
			},
			{
				name: 'comment',
				value: 'some at the start of a line'
			},
			{ name: "fill", value: "\tit's got " },
			{
				name: "action",
				value: { text: "links", action: 'this.goto("links")' }
			},
			{ name: "fill", value: "\n\t" },
			{ name: "if", value: "conditions" },
			{ name: "fill", value: "\n" },
			{ name: "action", value: { text: "also", action: "actions" } },
			{ name: "fill", value: "\n\t\t" },
			{ name: "if", value: "nested conditions" },
			{ name: "fill", value: "\n\t\tit's not a real-world example\n\t" },
			{
				name: "if",
				value:
					"another nested condition with [[link]] syntax inside it!"
			},
			{ name: "fill", value: "\n\t\tthat's a bit weird\n\t" },
			{ name: "endif", value: undefined },
			{
				name: "fill",
				value: "\n\tbut it should cover most real-world cases\n\t\t"
			},
			{ name: "elseif", value: "true" },
			{
				name: "fill",
				value:
					"\n\t\tI'm sure we'll find a way to break it though\n\t\t"
			},
			{ name: "endif", value: undefined },
			{ name: "fill", value: "\n\t" },
			{ name: "elseif", value: "[[bad|action]]" },
			{ name: "fill", value: " " },
			{ name: "endif", value: undefined },
			{ name: "fill", value: "\nit ends with some whitespace too\n\t\n" }
		]);
	});
});

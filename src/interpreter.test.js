import Interpreter, { defaultPassage } from "./interpreter";

// most basic valid renderer
// for use in non-renderer tests
const renderer = Object.freeze({
	displayPassage: () => Promise.resolve()
});

describe("Interpreter", () => {
	it("is an instantiable class", () => {
		expect(typeof Interpreter).toBe("function");
		expect(typeof Interpreter.prototype).toBe("object");
		expect(new Interpreter({ renderer })).toBeInstanceOf(Interpreter);
	});
	describe("constructor argument", () => {
		it("`source` parameter is passed to a call to `setSource` on initialization", () => {
			const setSourceSpy = jest.spyOn(Interpreter.prototype, "setSource");
			new Interpreter({
				source: "::title\nbody",
				renderer
			});
			expect(setSourceSpy).toHaveBeenCalledWith("::title\nbody");
		});
		it("`source` parameter can be undefined", () => {
			const setSourceSpy = jest.spyOn(Interpreter.prototype, "setSource");
			new Interpreter({ renderer });
			expect(setSourceSpy).toHaveBeenCalledWith(undefined);
		});
		it("`renderer` parameter is stored on interpreter as `renderer`", () => {
			new Interpreter({ renderer });
		});
		it("`renderer` parameter with a function `displayPassage` is required", () => {
			expect(() => new Interpreter()).toThrow();
			expect(
				() =>
					new Interpreter({
						renderer: {}
					})
			).toThrow();
			expect(
				() =>
					new Interpreter({
						renderer: {
							displayPassage: "not a function"
						}
					})
			).toThrow();
			expect(
				() =>
					new Interpreter({
						renderer: {
							displayPassage: () => {}
						}
					})
			).not.toThrow();
		});
	});

	describe("setSource", () => {
		it("is a function", () => {
			const r = new Interpreter({ renderer });
			expect(typeof r.goto).toBe("function");
		});
		it("sets `this.passages` to an object with the default passage if no source is provided", () => {
			const r = new Interpreter({ renderer });
			r.setSource();
			expect(r.passages).toEqual({
				[defaultPassage.title]: defaultPassage
			});
		});
		it("sets `this.passages` to the parsed result of the provided argument + default passage if given", () => {
			const r = new Interpreter({ renderer });
			r.setSource("::title\nbody");
			expect(r.passages).toEqual({
				title: {
					title: "title",
					body: "body"
				},
				[defaultPassage.title]: defaultPassage
			});
		});
		it("doesn't add the default passage if one is already defined in the source text", () => {
			const r = new Interpreter({ renderer });
			r.setSource(`::${defaultPassage.title}\nbody`);
			expect(r.passages).toEqual({
				[defaultPassage.title]: {
					title: defaultPassage.title,
					body: "body"
				}
			});
		});
	});

	describe("goto", () => {
		it("is a function", () => {
			const r = new Interpreter({ renderer });
			expect(typeof r.goto).toBe("function");
		});
		it("returns a promise", () => {
			const r = new Interpreter({ renderer });
			expect(r.goto()).toBeInstanceOf(Promise);
		});
		it("resolves with no value", () => {
			expect.assertions(1);
			const r = new Interpreter({ renderer });
			return expect(r.goto("test")).resolves.toBeUndefined();
		});
		it("calls `displayPassage` with target passage", () => {
			expect.assertions(1);
			const r = new Interpreter({ source: "::title\nbody", renderer });
			const displayPassageSpy = jest.spyOn(r, "displayPassage");
			return r
				.goto("title")
				.then(() =>
					expect(displayPassageSpy).toHaveBeenCalledWith(
						r.currentPassage
					)
				);
		});
	});

	describe("back", () => {
		it("is a function", () => {
			const r = new Interpreter({ renderer });
			expect(typeof r.back).toBe("function");
		});
		it("returns a promise", () => {
			const r = new Interpreter({ renderer });
			const p = r.goto("test");
			expect(typeof p.then).toBe("function");
			expect(typeof p.catch).toBe("function");
		});
		it("calls `goto` with the top of the history stack", () => {
			expect.assertions(1);
			const r = new Interpreter({
				source: "::a\n1\n::b\n2\n::c\n3",
				renderer
			});
			const gotoSpy = jest.spyOn(r, "goto");
			return r
				.goto("a")
				.then(() => r.goto("b"))
				.then(() => {
					const h = r.history[r.history.length - 1];
					return r
						.back()
						.then(() => expect(gotoSpy).toHaveBeenCalledWith(h));
				});
		});
		it("history has been popped after promise completes", () => {
			expect.assertions(2);
			const r = new Interpreter({
				source: "::a\n1\n::b\n2\n::c\n3",
				renderer
			});
			return r
				.goto("a")
				.then(() => r.goto("b"))
				.then(() => r.goto("c"))
				.then(() => {
					const h = r.history.slice();
					return r.back().then(() => {
						expect(r.history).toEqual(h.slice(0, -1));
						expect(r.history).toEqual(["a"]);
					});
				});
		});
		it("resolves with title of new current passage", () => {
			expect.assertions(3);
			const r = new Interpreter({
				source: "::a\n1\n::b\n2\n::c\n3",
				renderer
			});
			return r
				.goto("a")
				.then(() => r.goto("b"))
				.then(() => r.goto("c"))
				.then(() => {
					const h = r.history.slice();
					return r.back().then(passage => {
						expect(passage).toBe(r.currentPassage.title);
						expect(passage).toBe(h.pop());
						expect(passage).toBe("b");
					});
				});
		});
		it("rejects if called when there is no history", () => {
			expect.assertions(1);
			const r = new Interpreter({ renderer });
			return expect(r.back()).rejects.toBeDefined();
		});
	});

	describe("eval", () => {
		it("is a function", () => {
			const r = new Interpreter({ renderer });
			expect(typeof r.eval).toBe("function");
		});
		it("evaluates the provided script", () => {
			const fn = (window.fn = jest.fn());
			const r = new Interpreter({ renderer });
			const script = "window.fn()";
			r.eval(script);
			expect(fn).toHaveBeenCalled();
		});
		it("returns the result of provided script", () => {
			const r = new Interpreter({ renderer });
			expect(r.eval()).toBeUndefined();
			expect(r.eval("")).toBeUndefined();
			expect(r.eval("1")).toBe(1);
			expect(r.eval("1,2")).toBe(2);
			expect(r.eval("1;")).toBe(1);
			expect(r.eval("1;2;")).toBe(2);
			expect(r.eval("(function(){return 1}())")).toBe(1);
		});
		it("`this` refers to the interpreter inside provided script", () => {
			const r = new Interpreter({ renderer });
			expect(r.eval("this")).toBe(r);
			r.eval("this.foo='bar'");
			expect(r.foo).toBe("bar");
		});
		it("can access `window` explicitly", () => {
			const r = new Interpreter({ renderer });
			expect(r.eval("window")).toBe(window);
		});
	});

	describe("getPassageWithTitle", () => {
		it("is a function", () => {
			const r = new Interpreter({ renderer });
			expect(typeof r.getPassageWithTitle).toBe("function");
		});
		it("returns the passage with the provided title", () => {
			const r = new Interpreter({ source: "::title\nbody", renderer });
			const p = r.getPassageWithTitle("title");
			expect(p.title).toBe("title");
		});
		it("returns default passage if target is not found/invalid", () => {
			const r = new Interpreter({ renderer });
			const p = r.getPassageWithTitle("title");
			expect(p.title).toBe(defaultPassage.title);
		});
		it("fails if target and default passage are invalid", () => {
			expect.assertions(1);
			const r = new Interpreter({ renderer });
			r.passages[defaultPassage.title] = null;
			return expect(() => r.getPassageWithTitle("test")).toThrow();
		});
	});

	describe("displayPassage", () => {
		it("is a function", () => {
			const r = new Interpreter({ renderer });
			expect(typeof r.displayPassage).toBe("function");
		});
		it("returns a promise", () => {
			const r = new Interpreter({ renderer });
			expect(r.displayPassage()).toBeInstanceOf(Promise);
		});
		it("`currentPassage` is provided passage after promise completes", () => {
			expect.assertions(1);
			const r = new Interpreter({ source: "::title\nbody", renderer });
			const p = r.getPassageWithTitle("title");
			return r
				.displayPassage(p)
				.then(() => expect(r.currentPassage).toBe(p));
		});
		it("`currentPassage.title` at time of call has been pushed to history after promise completes", () => {
			expect.assertions(1);
			const r = new Interpreter({ renderer });
			r.currentPassage = {
				title: "history check"
			};
			return r
				.displayPassage(r.getPassageWithTitle("title"))
				.then(() => expect(r.history.pop()).toBe("history check"));
		});
		it("history is not pushed if `currentPassage` is falsey", () => {
			expect.assertions(1);
			const r = new Interpreter({ renderer });
			return r
				.displayPassage(r.getPassageWithTitle("title"))
				.then(() => expect(r.history.length).toBe(0));
		});
		it("tells renderer to display passage", () => {
			expect.assertions(1);
			const mockDisplayPassage = jest.fn();
			mockDisplayPassage.mockReturnValue(Promise.resolve());
			const r = new Interpreter({
				renderer: {
					displayPassage: mockDisplayPassage
				}
			});
			const p = r.getPassageWithTitle();
			return r.displayPassage(p).then(() => {
				expect(mockDisplayPassage.mock.calls.length).toBe(1);
			});
		});
	});
});

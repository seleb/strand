import Runner, { defaultPassage } from "../runner";

// most basic valid renderer
// for use in non-renderer tests
const renderer = Object.freeze({
	displayPassage: passage => Promise.resolve()
});

describe("Runner", () => {
	it("is an instantiable class", () => {
		expect(typeof Runner).toBe("function");
		expect(typeof Runner.prototype).toBe("object");
		expect(new Runner({ renderer })).toBeInstanceOf(Runner);
	});
	describe("constructor argument", () => {
		it("`source` parameter is passed to a call to `setSource` on initialization", () => {
			const setSourceSpy = jest.spyOn(Runner.prototype, "setSource");
			new Runner({
				source: "::title\nbody",
				renderer
			});
			expect(setSourceSpy).toHaveBeenCalledWith("::title\nbody");
		});
		it("`source` parameter can be undefined", () => {
			const setSourceSpy = jest.spyOn(Runner.prototype, "setSource");
			new Runner({ renderer });
			expect(setSourceSpy).toHaveBeenCalledWith(undefined);
		});
		it("`renderer` parameter is stored on runner as `renderer`", () => {
			new Runner({ renderer });
		});
		it("`renderer` parameter with a function `displayPassage` is required", () => {
			expect(() => new Runner()).toThrow();
			expect(
				() =>
					new Runner({
						renderer: {}
					})
			).toThrow();
			expect(
				() =>
					new Runner({
						renderer: {
							displayPassage: "not a function"
						}
					})
			).toThrow();
			expect(
				() =>
					new Runner({
						renderer: {
							displayPassage: () => {}
						}
					})
			).not.toThrow();
		});
	});

	describe("setSource", () => {
		it("is a function", () => {
			const r = new Runner({ renderer });
			expect(typeof r.goto).toBe("function");
		});
		it("sets `this.passages` to an object with the default passage if no source is provided", () => {
			const r = new Runner({ renderer });
			r.setSource();
			expect(r.passages).toEqual({
				[defaultPassage.title]: defaultPassage
			});
		});
		it("sets `this.passages` to the parsed result of the provided argument + default passage if given", () => {
			const r = new Runner({ renderer });
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
			const r = new Runner({ renderer });
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
			const r = new Runner({ renderer });
			expect(typeof r.goto).toBe("function");
		});
		it("returns a promise", () => {
			const r = new Runner({ renderer });
			expect(r.goto()).toBeInstanceOf(Promise);
		});
		it("resolves with no value", () => {
			expect.assertions(1);
			const r = new Runner({ renderer });
			return expect(r.goto("test")).resolves.toBeUndefined();
		});
		it("calls `displayPassage` with target passage", () => {
			expect.assertions(1);
			const r = new Runner({ source: "::title\nbody", renderer });
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
			const r = new Runner({ renderer });
			expect(typeof r.back).toBe("function");
		});
		it("returns a promise", () => {
			const r = new Runner({ renderer });
			const p = r.goto("test");
			expect(typeof p.then).toBe("function");
			expect(typeof p.catch).toBe("function");
		});
		it("calls `goto` with the top of the history stack", () => {
			expect.assertions(1);
			const r = new Runner({
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
			const r = new Runner({
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
			expect.assertions(2);
			const r = new Runner({
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
						expect(passage).toBe("b");
					});
				});
		});
		it("rejects if called when there is no history", () => {
			expect.assertions(1);
			const r = new Runner({ renderer });
			return expect(r.back()).rejects.toBeDefined();
		});
	});

	describe("eval", () => {
		it("is a function", () => {
			const r = new Runner({ renderer });
			expect(typeof r.eval).toBe("function");
		});
		it("evaluates the provided script", () => {
			const fn = (window.fn = jest.fn());
			const r = new Runner({ renderer });
			const script = "window.fn()";
			r.eval(script);
			expect(fn).toHaveBeenCalled();
		});
		it("returns the result of provided script", () => {
			const r = new Runner({ renderer });
			expect(r.eval()).toBeUndefined();
			expect(r.eval("")).toBeUndefined();
			expect(r.eval("1")).toBe(1);
			expect(r.eval("1,2")).toBe(2);
			expect(r.eval("1;")).toBe(1);
			expect(r.eval("1;2;")).toBe(2);
			expect(r.eval("(function(){return 1}())")).toBe(1);
		});
		it("`this` refers to the runner inside provided script", () => {
			const r = new Runner({ renderer });
			expect(r.eval("this")).toBe(r);
			r.eval("this.foo='bar'");
			expect(r.foo).toBe("bar");
		});
		it("can access `window` explicitly", () => {
			const r = new Runner({ renderer });
			expect(r.eval("window")).toBe(window);
		});
	});

	describe("getPassageWithTitle", () => {
		it("is a function", () => {
			const r = new Runner({ renderer });
			expect(typeof r.getPassageWithTitle).toBe("function");
		});
		it("returns the passage with the provided title", () => {
			const r = new Runner({ source: "::title\nbody", renderer });
			const p = r.getPassageWithTitle("title");
			expect(p.title).toBe("title");
		});
		it("returns default passage if target is not found/invalid", () => {
			const r = new Runner({ renderer });
			const p = r.getPassageWithTitle("title");
			expect(p.title).toBe(defaultPassage.title);
		});
		it("fails if target and default passage are invalid", () => {
			expect.assertions(1);
			const r = new Runner({ renderer });
			r.passages[defaultPassage.title] = null;
			return expect(() => r.getPassageWithTitle("test")).toThrow();
		});
	});

	describe("displayPassage", () => {
		it("is a function", () => {
			const r = new Runner({ renderer });
			expect(typeof r.displayPassage).toBe("function");
		});
		it("returns a promise", () => {
			const r = new Runner({ renderer });
			expect(r.displayPassage()).toBeInstanceOf(Promise);
		});
		it("`currentPassage` is provided passage after promise completes", () => {
			expect.assertions(1);
			const r = new Runner({ source: "::title\nbody", renderer });
			const p = r.getPassageWithTitle("title");
			return r
				.displayPassage(p)
				.then(() => expect(r.currentPassage).toBe(p));
		});
		it("`currentPassage.title` at time of call has been pushed to history after promise completes", () => {
			expect.assertions(1);
			const r = new Runner({ renderer });
			r.currentPassage = {
				title: "history check"
			};
			return r
				.displayPassage(r.getPassageWithTitle("title"))
				.then(() => expect(r.history.pop()).toBe("history check"));
		});
		it("history is not pushed if `currentPassage` is falsey", () => {
			expect.assertions(1);
			const r = new Runner({ renderer });
			return r
				.displayPassage(r.getPassageWithTitle("title"))
				.then(() => expect(r.history.length).toBe(0));
		});
		it("tells renderer to display passage", () => {
			expect.assertions(1);
			const mockDisplayPassage = jest.fn();
			mockDisplayPassage.mockReturnValue(Promise.resolve());
			const r = new Runner({
				renderer: {
					displayPassage: mockDisplayPassage
				}
			});
			const p = r.getPassageWithTitle();
			return r.displayPassage(p).then(() => {
				expect(mockDisplayPassage.mock.calls.length).toBe(1);
			});
		});
		it("flags runner as busy until promise resolves", done => {
			expect.assertions(3);
			let resolveDisplayPassage;
			const r = new Runner({
				renderer: {
					displayPassage: () =>
						new Promise(resolve => {
							resolveDisplayPassage = resolve;
						})
				}
			});
			const p = r.getPassageWithTitle();
			r.displayPassage(p);
			expect(r.busy).toBe(true);
			setTimeout(() => {
				expect(r.busy).toBe(true);
				resolveDisplayPassage();
				setTimeout(() => {
					expect(r.busy).toBe(false);
					done();
				}, -1);
			}, 50);
		});
		it("fails if called while runner is busy", () => {
			const r = new Runner({ renderer });
			r.busy = true;
			expect(() => r.displayPassage(r.getPassageWithTitle())).toThrow();
		});
	});
});

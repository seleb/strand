import Runner, { defaultPassage } from "../runner";

describe("Runner", () => {
	it("is an instantiable class", () => {
		expect(typeof Runner).toBe("function");
		expect(typeof Runner.prototype).toBe("object");
		expect(new Runner()).toBeInstanceOf(Runner);
	});
	it("`setSource` is called with the provided argument on initialization", () => {
		const setSourceSpy = jest.spyOn(Runner.prototype, "setSource");
		new Runner();
		expect(setSourceSpy).toHaveBeenCalledWith(undefined);
		new Runner("::title\nbody");
		expect(setSourceSpy).toHaveBeenCalledWith("::title\nbody");
	});

	describe("setSource", () => {
		it("is a function", () => {
			const r = new Runner();
			expect(typeof r.goto).toBe("function");
		});
		it("sets `this.passages` to an object with the default passage if no source is provided", () => {
			const r = new Runner();
			r.setSource();
			expect(r.passages).toEqual({
				[defaultPassage.title]: defaultPassage
			});
		});
		it("sets `this.passages` to the parsed result of the provided argument + default passage if given", () => {
			const r = new Runner();
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
			const r = new Runner();
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
			const r = new Runner();
			expect(typeof r.goto).toBe("function");
		});
		it("returns a promise", () => {
			const r = new Runner();
			expect(r.goto()).toBeInstanceOf(Promise);
		});
		it("resolves with no value", () => {
			expect.assertions(1);
			const r = new Runner();
			return expect(r.goto("test")).resolves.toBeUndefined();
		});
		it("calls `displayPassage` with target passage", () => {
			expect.assertions(1);
			const r = new Runner("::title\nbody");
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
			const r = new Runner();
			expect(typeof r.back).toBe("function");
		});
		it("returns a promise", () => {
			const r = new Runner();
			const p = r.goto("test");
			expect(typeof p.then).toBe("function");
			expect(typeof p.catch).toBe("function");
		});
		it("calls `goto` with the top of the history stack", () => {
			expect.assertions(1);
			const r = new Runner("::a\n1\n::b\n2\n::c\n3");
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
			const r = new Runner("::a\n1\n::b\n2\n::c\n3");
			return r
				.goto("a")
				.then(() => r.goto("b"))
				.then(() => r.goto("c"))
				.then(() => {
					const h = r.history.slice();
					return r
						.back()
						.then(() => {
							expect(r.history).toEqual(h.slice(0, -1));
							expect(r.history).toEqual(["a"]);
						});
				});
		});
		it("resolves with title of new current passage", () => {
			expect.assertions(2);
			const r = new Runner("::a\n1\n::b\n2\n::c\n3");
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
			const r = new Runner();
			return expect(r.back()).rejects.toBeDefined();
		});
	});

	describe("eval", () => {
		it("is a function", () => {
			const r = new Runner();
			expect(typeof r.eval).toBe("function");
		});
		it("evaluates the provided script", () => {
			const fn = (window.fn = jest.fn());
			const r = new Runner();
			const script = "window.fn()";
			r.eval(script);
			expect(fn).toHaveBeenCalled();
		});
		it("returns the result of provided script", () => {
			const r = new Runner();
			expect(r.eval()).toBeUndefined();
			expect(r.eval("")).toBeUndefined();
			expect(r.eval("1")).toBe(1);
			expect(r.eval("1,2")).toBe(2);
			expect(r.eval("1;")).toBe(1);
			expect(r.eval("1;2;")).toBe(2);
			expect(r.eval("(function(){return 1}())")).toBe(1);
		});
		it("`this` refers to the runner inside provided script", () => {
			const r = new Runner();
			expect(r.eval("this")).toBe(r);
			r.eval("this.foo='bar'");
			expect(r.foo).toBe("bar");
		});
		it("can access `window` explicitly", () => {
			const r = new Runner();
			expect(r.eval("window")).toBe(window);
		});
	});

	describe("getPassageWithTitle", () => {
		it("is a function", () => {
			const r = new Runner();
			expect(typeof r.getPassageWithTitle).toBe("function");
		});
		it("returns the passage with the provided title", () => {
			const r = new Runner("::title\nbody");
			const p = r.getPassageWithTitle("title");
			expect(p.title).toBe("title");
			expect(p.body).toBe("body");
			expect(Object.keys(p)).toContain("passage");
		});
		it("returns default passage if target is not found/invalid", () => {
			const r = new Runner();
			const p = r.getPassageWithTitle("title");
			expect(p.title).toBe(defaultPassage.title);
			expect(p.body).toBe(defaultPassage.body);
			expect(Object.keys(p)).toContain("passage");
		});
		it("fails if target and default passage are invalid", () => {
			expect.assertions(1);
			const r = new Runner();
			r.passages[defaultPassage.title] = null;
			return expect(() => r.getPassageWithTitle("test")).toThrow();
		});
	});

	describe("displayPassage", () => {
		// TODO
		it("is a function", () => {
			const r = new Runner();
			expect(typeof r.displayPassage).toBe("function");
		});
		it("returns a promise", () => {
			const r = new Runner();
			expect(r.displayPassage()).toBeInstanceOf(Promise);
		});
		it("`currentPassage` is provided passage after promise completes", () => {
			expect.assertions(1);
			const r = new Runner("::title\nbody");
			const p = r.getPassageWithTitle("title");
			return r
				.displayPassage(p)
				.then(() => expect(r.currentPassage).toBe(p));
		});
		it("`currentPassage.title` at time of call has been pushed to history after promise completes", () => {
			expect.assertions(1);
			const r = new Runner();
			r.currentPassage = {
				title: "history check"
			};
			return r
				.displayPassage(r.getPassageWithTitle("title"))
				.then(() => expect(r.history.pop()).toBe("history check"));
		});
		it("history is not pushed if `currentPassage` is falsey", () => {
			expect.assertions(1);
			const r = new Runner();
			return r
				.displayPassage(r.getPassageWithTitle("title"))
				.then(() => expect(r.history.length).toBe(0));
		});
		it("tells renderer to display passage", () => {
			// TODO
			throw new Error();
		});
	});
});

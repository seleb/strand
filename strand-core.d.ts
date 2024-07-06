declare module 'strand-core' {
	type ProgramNode =
		| {
				name: 'text';
				value: string;
		  }
		| {
				name: 'action';
				value: {
					text: string;
					action: string;
				};
		  }
		| {
				name: string;
				value: never;
		  };
	class Passage {
		title: string;
		body: string;
		program: unknown;
	}
	abstract class Renderer<T = void> {
		displayPassage(passage: Passage): T;
	}
	export default class Strand<T = void> {
		history: string[];
		passages: { [key: string]: Omit<Passage, 'program'> };
		currentPassage: Passage;
		renderer: Renderer<T>;
		constructor(options: { renderer: Renderer<T>; source: string, logger?: Pick<Console, 'log' | 'warn' | 'error'> });

		eval(source: string): unknown;
		setSource(source: string): void;
		getPassageWithTitle(title: string): Passage;
		goto(passage: string): T;
		back(): T;
		displayPassage(passage: Passage): T;
		execute(program: unknown): ProgramNode[];
	}
}

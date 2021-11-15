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
		displayPassage(passage: Passage): Promise<T>;
	}
	export default class Strand<T = void> {
		busy: boolean;
		history: string[];
		passages: { [key: string]: Omit<Passage, 'program'> };
		renderer: Renderer<T>;
		constructor(options: { renderer: Renderer<T>; source: string });

		eval(source: string): unknown;
		setSource(source: string): void;
		getPassageWithTitle(title: string): Passage;
		goto(passage: string): Promise<T>;
		back(): Promise<T>;
		displayPassage(passage: Passage): Promise<T>;
		execute(program: unknown): ProgramNode[];
	}
}

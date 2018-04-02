import { getLexer } from "lexer";
import { parse } from "./parser";
import lexicon from "./lexicon";

const lex = getLexer(lexicon);
export function compile(source) {
	return parse(lex(source));
}

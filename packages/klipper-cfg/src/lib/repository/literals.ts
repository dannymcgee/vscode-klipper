import { TMGrammarScope } from "@vscode-devkit/grammar";

export const stringLiteral: TMGrammarScope = {
	name: "string.klipper-cfg",
	begin: /"/,
	beginCaptures: {
		0: { name: "punctuation.definition.string.begin.klipper-cfg" },
	},
	end: /(?<!\\)(")|\\\\(")/,
	endCaptures: {
		1: { name: "punctuation.definition.string.end.klipper-cfg" },
		2: { name: "punctuation.definition.string.end.klipper-cfg" },
	},
};

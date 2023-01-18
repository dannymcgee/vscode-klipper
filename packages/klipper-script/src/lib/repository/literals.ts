import { TMGrammarScope } from "@vscode-devkit/grammar";

export const stringLiteral: TMGrammarScope = {
	name: "string.klipper-script",
	begin: /"/,
	beginCaptures: {
		0: { name: "punctuation.definition.string.begin.klipper-script" },
	},
	end: /(?<!\\)(")|\\\\(")/,
	endCaptures: {
		1: { name: "punctuation.definition.string.end.klipper-script" },
		2: { name: "punctuation.definition.string.end.klipper-script" },
	},
};

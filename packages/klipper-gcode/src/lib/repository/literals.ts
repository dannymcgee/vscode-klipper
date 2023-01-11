import { TMGrammarScope } from "@vscode-devkit/grammar";

export const stringLiteral: TMGrammarScope = {
	name: "string.klipper-gcode",
	begin: /"/,
	beginCaptures: {
		0: { name: "punctuation.definition.string.begin.klipper-gcode" },
	},
	end: /(?<!\\)(")|\\\\(")/,
	endCaptures: {
		1: { name: "punctuation.definition.string.end.klipper-gcode" },
		2: { name: "punctuation.definition.string.end.klipper-gcode" },
	},
};

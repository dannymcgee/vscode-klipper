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

export const numericLiteral: TMGrammarScope = {
	name: "constant.numeric.klipper-cfg",
	match: /(-)?(?:[0-9]|(\.)[0-9])+/,
	captures: {
		1: { name: "keyword.operator.negative.klipper-cfg" },
		2: { name: "meta.delimiter.decimal.period.klipper-cfg" },
	},
};

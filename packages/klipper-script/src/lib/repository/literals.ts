import { TMGrammarScope } from "@vscode-devkit/grammar";

export const boolLiteral: TMGrammarScope = {
	name: "constant.language.boolean.klipper-script",
	match: /\b[Tt]rue|[Ff]alse\b/,
};

export const nullLiteral: TMGrammarScope = {
	name: "constant.language.null.klipper-script",
	match: /\b[Nn]one\b/,
};

export const stringLiteral: TMGrammarScope = {
	name: "string.klipper-script",
	begin: /(["'])/,
	beginCaptures: {
		1: { name: "punctuation.definition.string.begin.klipper-script" },
	},
	end: /(?<!\\)(\1)|\\\\(\1)/,
	endCaptures: {
		1: { name: "punctuation.definition.string.end.klipper-script" },
		2: { name: "punctuation.definition.string.end.klipper-script" },
	},
};

export const numericLiteral: TMGrammarScope = {
	name: "constant.numeric.klipper-script",
	match: /(-)?(?:[0-9]+(?:(\.)[0-9]+)?|(\.)[0-9]+)/,
	captures: {
		1: { name: "keyword.operator.negative.klipper-script" },
		2: { name: "meta.delimiter.decimal.period.klipper-script" },
		3: { name: "meta.delimiter.decimal.period.klipper-script" },
	},
};

import { regex, TMGrammarScope } from "@vscode-devkit/grammar";
import { IDENT } from "../common";

export const boolLiteral: TMGrammarScope = {
	name: "constant.language.boolean.klipper-cfg",
	match: /\b[Tt]rue|[Ff]alse\b/,
};

export const nullLiteral: TMGrammarScope = {
	name: "constant.language.null.klipper-cfg",
	match: /\b[Nn]one\b/,
};

export const stringLiteral: TMGrammarScope = {
	patterns: [
		{
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
		},
		{
			name: "string.klipper-cfg",
			begin: /'/,
			beginCaptures: {
				0: { name: "punctuation.definition.string.begin.klipper-cfg" },
			},
			end: /(?<!\\)(')|\\\\(')/,
			endCaptures: {
				1: { name: "punctuation.definition.string.end.klipper-cfg" },
				2: { name: "punctuation.definition.string.end.klipper-cfg" },
			},
		},
		{
			name: "string.path.klipper-cfg",
			match: regex`/(\/${IDENT})+/`,
		}
	],
};

export const numericLiteral: TMGrammarScope = {
	name: "constant.numeric.klipper-cfg",
	match: /(-)?(?:[0-9]+(?:(\.)[0-9]+)?|(\.)[0-9]+)/,
	captures: {
		1: { name: "keyword.operator.negative.klipper-cfg" },
		2: { name: "meta.delimiter.decimal.period.klipper-cfg" },
		3: { name: "meta.delimiter.decimal.period.klipper-cfg" },
	},
};

export const literal: TMGrammarScope = {
	patterns: [
		{ include: "#boolLiteral" },
		{ include: "#nullLiteral" },
		{ include: "#stringLiteral" },
		{ include: "#numericLiteral" },
	],
};

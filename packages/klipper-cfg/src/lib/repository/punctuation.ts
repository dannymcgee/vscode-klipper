import { TMGrammarScope } from "@vscode-devkit/grammar";

export const punctuation: TMGrammarScope = {
	patterns: [
		{
			match: /[()]/,
			name: "punctuation.brace.round.klipper-cfg",
		},
		{
			match: /[{}]/,
			name: "punctuation.brace.curly.klipper-cfg",
		},
		{
			match: /[\[\]]/,
			name: "punctuation.brace.square.klipper-cfg",
		},
		{
			match: /,/,
			name: "punctuation.separator.comma.klipper-cfg",
		},
		{
			match: /:/,
			name: "punctuation.separator.key-value.klipper-cfg",
		},
		{
			match: /\./,
			name: "punctuation.accessor.klipper-cfg",
		},
		{
			match: /;/,
			name: "punctuation.terminator.klipper-cfg",
		},
	],
};

import { TMGrammarScope } from "@vscode-devkit/grammar";

export const punctuation: TMGrammarScope = {
	patterns: [
		{
			match: /[()]/,
			name: "punctuation.brace.round.klipper-script",
		},
		{
			match: /[{}]/,
			name: "punctuation.brace.curly.klipper-script",
		},
		{
			match: /[\[\]]/,
			name: "punctuation.brace.square.klipper-script",
		},
		{
			match: /,/,
			name: "punctuation.separator.comma.klipper-script",
		},
		{
			match: /:/,
			name: "punctuation.separator.key-value.klipper-script",
		},
		{
			match: /\./,
			name: "punctuation.accessor.klipper-script",
		},
		{
			match: /;/,
			name: "punctuation.terminator.klipper-script",
		},
	],
};

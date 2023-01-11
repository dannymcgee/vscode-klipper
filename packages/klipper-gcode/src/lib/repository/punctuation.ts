import { TMGrammarScope } from "@vscode-devkit/grammar";

export const punctuation: TMGrammarScope = {
	patterns: [
		{
			match: /[()]/,
			name: "punctuation.brace.round.klipper-gcode",
		},
		{
			match: /[{}]/,
			name: "punctuation.brace.curly.klipper-gcode",
		},
		{
			match: /[\[\]]/,
			name: "punctuation.brace.square.klipper-gcode",
		},
		{
			match: /,/,
			name: "punctuation.separator.comma.klipper-gcode",
		},
		{
			match: /:/,
			name: "punctuation.separator.key-value.klipper-gcode",
		},
		{
			match: /\./,
			name: "punctuation.accessor.klipper-gcode",
		},
		{
			match: /;/,
			name: "punctuation.terminator.klipper-gcode",
		},
	],
};

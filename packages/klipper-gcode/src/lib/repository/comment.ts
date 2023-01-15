import { TMGrammarScope } from "@vscode-devkit/grammar";

export const comment: TMGrammarScope = {
	name: "comment.line.klipper-gcode",
	begin: /[#;]/,
	beginCaptures: {
		0: { name: "punctuation.definition.begin.comment.line.klipper-gcode" },
	},
	end: /(?=[\r\n])/,
};

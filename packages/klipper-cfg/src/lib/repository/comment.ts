import { TMGrammarScope } from "@vscode-devkit/grammar";

export const comment: TMGrammarScope = {
	begin: /#/,
	beginCaptures: {
		0: { name: "punctuation.definition.begin.comment.line.klipper-cfg" },
	},
	end: /(?=[\r\n])/,
	name: "comment.line.klipper-cfg",
};

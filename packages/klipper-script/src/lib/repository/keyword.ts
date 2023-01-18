import { TMGrammarScope } from "@vscode-devkit/grammar";

export const keyword: TMGrammarScope = {
	patterns: [
		{
			name: "keyword.control.iteration.$1.klipper-script",
			match: /\b(for|in|endfor)\b/,
		},
		{
			name: "keyword.control.condition.$1.klipper-script",
			match: /\b(if|elif|else|endif)\b/,
		},
		{
			name: "keyword.operator.wordlike.logical.$1.klipper-script",
			match: /\b(and|or|not|is)\b/
		},
		{
			name: "storage.type.$1.klipper-script",
			match: /\b(set)\b/,
		},
	],
};

export const operator: TMGrammarScope = {
	patterns: [
		{
			name: "keyword.operator.arithmetic.$1.klipper-script",
			match: /(\+|-|\/\/?|%|\*\*?)/,
		},
		{
			name: "keyword.operator.comparison.$1.klipper-script",
			match: /(>=?|<=?|[!=]=)/,
		},
		{
			name: "keyword.operator.concatenation.klipper-script",
			match: /~/,
		},
		{
			name: "keyword.operator.pipe.klipper-script",
			match: /\|/,
		},
		{
			name: "keyword.operator.assignment.klipper-script",
			match: /=/,
		},
	],
};

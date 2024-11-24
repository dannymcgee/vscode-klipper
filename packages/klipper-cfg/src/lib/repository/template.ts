import { TMGrammarScope } from "@vscode-devkit/grammar";

export const template: TMGrammarScope = {
	patterns: [
		{
			name: "meta.jinja2.conditional.klipper-cfg",
			begin: /\{%/,
			beginCaptures: {
				0: { name: "punctuation.definition.template-expression.begin.klipper-cfg" },
			},
			end: /%\}/,
			endCaptures: {
				0: { name: "punctuation.definition.template-expression.end.klipper-cfg" },
			},
			contentName: "source.klipper-script",
			patterns: [
				{ include: "source.klipper-script" },
			],
		},
		{
			name: "meta.jinja2.expression.klipper-cfg",
			begin: /\{/,
			beginCaptures: {
				0: { name: "punctuation.definition.template-expression.begin.klipper-cfg" },
			},
			end: /\}/,
			endCaptures: {
				0: { name: "punctuation.definition.template-expression.end.klipper-cfg" },
			},
			contentName: "source.klipper-script",
			patterns: [
				{ include: "source.klipper-script" },
			],
		},
	],
};

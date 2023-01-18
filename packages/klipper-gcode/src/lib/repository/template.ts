import { TMGrammarScope } from "@vscode-devkit/grammar";

export const template: TMGrammarScope = {
	patterns: [
		{
			name: "meta.jinja2.conditional.klipper-gcode",
			begin: /\{%/,
			beginCaptures: {
				0: { name: "punctuation.definition.template-expression.begin.klipper-gcode" },
			},
			end: /%\}/,
			endCaptures: {
				0: { name: "punctuation.definition.template-expression.end.klipper-gcode" },
			},
			contentName: "source.klipper-script",
			patterns: [
				{ include: "source.klipper-script" },
			],
		},
		{
			name: "meta.jinja2.expression.klipper-gcode",
			begin: /\{/,
			beginCaptures: {
				0: { name: "punctuation.definition.template-expression.begin.klipper-gcode" },
			},
			end: /\}/,
			endCaptures: {
				0: { name: "punctuation.definition.template-expression.end.klipper-gcode" },
			},
			contentName: "source.klipper-script",
			patterns: [
				{ include: "source.klipper-script" },
			],
		},
	],
};

import { TMGrammarScope } from "@vscode-devkit/grammar";

export const template: TMGrammarScope = {
	patterns: [
		{
			name: "meta.jinja2.block-set.klipper-gcode",
			begin: /(\{%-?)(\s*)(set)\b((?:(?!-?%\}|=).)*)(-?%\})/,
			beginCaptures: {
				1: { name: "punctuation.definition.template-expression.begin.klipper-gcode" },
				3: { name: "storage.type.set.klipper-script" },
				5: { name: "punctuation.definition.template-expression.end.klipper-gcode" },
			},
			end: /(\{%-?)(\s*)(endset)\b(\s*)(-?%\})/,
			endCaptures: {
				1: { name: "punctuation.definition.template-expression.begin.klipper-gcode" },
				3: { name: "storage.type.endset.klipper-script" },
				5: { name: "punctuation.definition.template-expression.end.klipper-gcode" },
			},
			contentName: "string.unquoted.block-set.klipper-gcode",
			patterns: [
				{ include: "#template" },
			],
		},
		{
			name: "meta.jinja2.conditional.klipper-gcode",
			begin: /\{%-?/,
			beginCaptures: {
				0: { name: "punctuation.definition.template-expression.begin.klipper-gcode" },
			},
			end: /-?%\}/,
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
			begin: /\{-?/,
			beginCaptures: {
				0: { name: "punctuation.definition.template-expression.begin.klipper-gcode" },
			},
			end: /-?\}/,
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

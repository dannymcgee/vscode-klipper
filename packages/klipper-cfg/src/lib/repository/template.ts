import { TMGrammarScope } from "@vscode-devkit/grammar";

export const template: TMGrammarScope = {
	patterns: [
		{
			name: "meta.jinja2.block-set.klipper-cfg",
			begin: /(\{%-?)(\s*)(set)\b((?:(?!-?%\}|=).)*)(-?%\})/,
			beginCaptures: {
				1: { name: "punctuation.definition.template-expression.begin.klipper-cfg" },
				3: { name: "storage.type.set.klipper-script" },
				5: { name: "punctuation.definition.template-expression.end.klipper-cfg" },
			},
			end: /(\{%-?)(\s*)(endset)\b(\s*)(-?%\})/,
			endCaptures: {
				1: { name: "punctuation.definition.template-expression.begin.klipper-cfg" },
				3: { name: "storage.type.endset.klipper-script" },
				5: { name: "punctuation.definition.template-expression.end.klipper-cfg" },
			},
			contentName: "string.unquoted.block-set.klipper-cfg",
			patterns: [
				{ include: "#template" },
			],
		},
		{
			name: "meta.jinja2.conditional.klipper-cfg",
			begin: /\{%-?/,
			beginCaptures: {
				0: { name: "punctuation.definition.template-expression.begin.klipper-cfg" },
			},
			end: /-?%\}/,
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
			begin: /\{-?/,
			beginCaptures: {
				0: { name: "punctuation.definition.template-expression.begin.klipper-cfg" },
			},
			end: /-?\}/,
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

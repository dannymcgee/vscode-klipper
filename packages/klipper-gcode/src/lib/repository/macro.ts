import { regex, TMGrammarScope } from "@vscode-devkit/grammar";
import { IDENT } from "../common";

export const macro: TMGrammarScope = {
	name: "meta.macro-invocation.klipper-gcode",
	begin: IDENT,
	beginCaptures: {
		0: { name: "entity.name.function.preprocessor.klipper-gcode" },
	},
	end: /[\r\n]/,
	patterns: [
		{ include: "#comment" },
		{
			name: "meta.parameter.klipper-gcode",
			begin: regex`/(${IDENT})(=)/`,
			beginCaptures: {
				1: { name: "variable.parameter.klipper-gcode" },
				2: { name: "keyword.operator.assignment.klipper-gcode" },
			},
			end: /(?=\s)/,
			patterns: [
				{ include: "#stringLiteral" },
				{ include: "#numericLiteral" },
				{ include: "#template" },
				{ include: "#comment" },
				{
					name: "variable.other.klipper-gcode",
					match: IDENT,
				},
			],
		},
	],
};

import { TMGrammarScope } from "@vscode-devkit/grammar";

export const command: TMGrammarScope = {
	name: "meta.gcode-command.klipper-gcode",
	begin: /^\s*([GMT])[0-9]{1,3}/,
	beginCaptures: {
		0: { name: "entity.name.function.gcode-command.$1.klipper-gcode" },
	},
	end: /[\r\n]/,
	patterns: [
		{ include: "#comment" },
		{ include: "#macroParameter" },
		{ include: "#parameter" },
		{ include: "#template" },
	],
};

export const parameter: TMGrammarScope = {
	patterns: [
		{
			name: "constant.numeric.$1.klipper-gcode",
			match: /([SPXYZUVWIJDHFRQEN])([-.0-9]+)/,
			captures: {
				1: { name: "meta.parameter-specifier.klipper-gcode" },
				2: { name: "meta.parameter-value.klipper-gcode" },
			},
		},
		{
			// Parameter with interpolation, e.g.:
			// S{some_variable}
			name: "constant.numeric.$1.klipper-gcode",
			match: /([SPXYZUVWIJDHFRQEN])(?=\{)/,
			captures: {
				0: { name: "meta.parameter-specifier.klipper-gcode" },
			},
		},
	],
};

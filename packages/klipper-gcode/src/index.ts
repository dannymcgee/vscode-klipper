import { TMGrammar } from "@vscode-devkit/grammar";

import repository from "./lib/repository";

const grammar: TMGrammar = {
	name: "klipper-gcode",
	scopeName: "source.klipper-gcode",
	patterns: [
		{ include: "#comment" },
		{ include: "#template" },
		{ include: "#command" },
	],
	repository,
};

export default grammar;

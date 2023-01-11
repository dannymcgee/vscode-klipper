import { TMGrammar } from "@vscode-devkit/grammar";

import repository from "./lib/repository";

const grammar: TMGrammar = {
	name: "klipper-cfg",
	scopeName: "source.klipper-cfg",
	patterns: [
		{ include: "#comment" },
		{ include: "#identifier" },
		{ include: "#punctuation" },
	],
	repository,
};

export default grammar;

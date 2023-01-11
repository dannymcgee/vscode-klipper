import { TMGrammar } from "@vscode-devkit/grammar";
import repository from "./lib/repository";

const grammar: TMGrammar = {
	name: "klipper-cfg",
	scopeName: "source.klipper-cfg",
	patterns: [
		{ include: "#stringLiteral" },
		{ include: "#punctuation" },
		{ include: "#identifier" },
	],
	repository,
};

export default grammar;

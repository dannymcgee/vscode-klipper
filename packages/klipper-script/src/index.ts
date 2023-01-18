import { TMGrammar } from "@vscode-devkit/grammar";
import repository from "./lib/repository";

const grammar: TMGrammar = {
	name: "klipper-script",
	scopeName: "source.klipper-script",
	patterns: [
		{ include: "#stringLiteral" },
		{ include: "#punctuation" },
		{ include: "#identifier" },
	],
	repository,
};

export default grammar;

import { TMGrammar } from "@vscode-devkit/grammar";
import repository from "./lib/repository";

const grammar: TMGrammar = {
	name: "klipper-script",
	scopeName: "source.klipper-script",
	patterns: [
		{ include: "#stringLiteral" },
		{ include: "#keyword" },
		{ include: "#numericLiteral" },
		{ include: "#operator" },
		{ include: "#punctuation" },
		{ include: "#boolLiteral" },
		{ include: "#nullLiteral" },
		{ include: "#identifier" },
	],
	repository,
};

export default grammar;

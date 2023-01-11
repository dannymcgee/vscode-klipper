import { TMGrammarScope, regex } from "@vscode-devkit/grammar";

import { IDENT } from "../common";

export const identifier: TMGrammarScope = {
	patterns: [
		// {
		// 	match: regex`/\b(${IDENT})\s*(?=\()/`,
		// 	captures: {
		// 		1: { name: "entity.name.function.klipper-cfg" },
		// 	},
		// },
		{
			match: IDENT,
			name: "variable.other.klipper-cfg",
		},
	],
};

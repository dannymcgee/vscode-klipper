import { TMGrammarScope, regex } from "@vscode-devkit/grammar";

import { IDENT } from "../common";

export const identifier: TMGrammarScope = {
	patterns: [
		{
			match: regex`/\b(${IDENT})\s*(?=\()/`,
			captures: {
				1: { name: "entity.name.function.klipper-script" },
			},
		},
		{
			match: regex`/(?<=\.)(${IDENT})/`,
			captures: {
				1: { name: "variable.other.property.klipper-script" },
			},
		},
		{
			match: regex`/\b(${IDENT})\b/`,
			captures: {
				1: { name: "variable.other.klipper-script" },
			},
		},
	],
};

import { TMGrammarScope, regex } from "@vscode-devkit/grammar";

import { IDENT } from "../common";

export const identifier: TMGrammarScope = {
	patterns: [
		{
			name: "entity.name.function.filter.klipper-script",
			match: /\b(abs|attr|batch|capitalize|center|default|dictsort|escape|filesizeformat|first|float|forceescape|format|groupby|indent|int|join|last|length|list|lower|map|max|min|pprint|random|reject|rejectattr|replace|reverse|round|safe|select|selectattr|slice|sort|string|striptags|sum|title|tojson|truncate|unique|upper|urlencode|urlize|wordcount|wordwrap|xmlattr)\b/,
		},
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

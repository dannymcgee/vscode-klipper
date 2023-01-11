import { TMGrammarScope, regex } from "@vscode-devkit/grammar";

import { IDENT } from "../common";

export const identifier: TMGrammarScope = {
	patterns: [
		{
			name: "meta.property-block.header.klipper-cfg",
			begin: regex`/^(\[)(include)/`,
			beginCaptures: {
				1: { name: "punctuation.brace.square.klipper-cfg" },
				2: { name: "keyword.other.klipper-cfg" }
			},
			end: /\]/,
			endCaptures: {
				0: { name: "punctuation.brace.square.klipper-cfg" },
			},
			patterns: [{
				name: "string.path.klipper-cfg",
				match: /[^\]\s]+/,
			}],
		},
		{
			name: "meta.property-block.header.klipper-cfg",
			begin: regex`/^(\[)(${IDENT})/`,
			beginCaptures: {
				1: { name: "punctuation.brace.square.klipper-cfg" },
				2: { name: "keyword.other.klipper-cfg" }
			},
			end: /\]/,
			endCaptures: {
				0: { name: "punctuation.brace.square.klipper-cfg" },
			},
			patterns: [{
				name: "entity.name.class.klipper-cfg",
				match: IDENT,
			}],
		},
		{
			name: "meta.pin-id.klipper-cfg",
			// TODO: Does this cover everything?
			match: regex`/(?:(${IDENT})(:))?([!^\b])?((?:[A-Z]{1,2}|gpio)[0-9]+)\b/`,
			captures: {
				1: { name: "entity.name.class.klipper-cfg" },
				2: { name: "punctuation.accessor.klipper-cfg" },
				3: { name: "keyword.operator.klipper-cfg" },
				// TODO: I do like this color for global statics, but this isn't
				// really an accurately named scope
				4: { name: "variable.other.enummember.klipper-cfg" },
			},
		},
		{
			name: "meta.property-block.entry.klipper-cfg",
			begin: regex`/^(${IDENT})(:)/`,
			beginCaptures: {
				1: { name: "variable.property.klipper-cfg" },
				2: { name: "punctuation.separator.key-value.klipper-cfg" },
			},
			end: /(?=\n[^ \t])/,
			patterns: [
				{ include: "#comment" },
				{ include: "#literal" },
				{ include: "#identifier" },
				{ include: "#punctuation" },
			]
		},
		{
			name: "variable.other.klipper-cfg",
			match: regex`/\b${IDENT}\b/`,
		},
	],
};

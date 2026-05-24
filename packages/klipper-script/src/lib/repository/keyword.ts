import { TMGrammarScope } from "@vscode-devkit/grammar";
const JINJA_TESTS =
	"boolean|callable|defined|divisibleby|escaped|even|false|filter|float|ge|greaterthan|gt|in|integer|iterable|le|lessthan|lower|lt|mapping|ne|none|number|odd|sameas|sequence|string|test|true|undefined|upper|eq|equalto";

const JINJA_SYMBOL_TESTS = "==|!=|>=|<=|>|<";

export const keyword: TMGrammarScope = {
	patterns: [
		{
			name: "keyword.control.definition.$1.klipper-script",
			match: /\b(macro|endmacro)\b/,
		},
		{
			name: "keyword.control.iteration.$1.klipper-script",
			match: /\b(for|in|endfor)\b/,
		},
		{
			name: "keyword.control.condition.$1.klipper-script",
			match: /\b(if|elif|else|endif)\b/,
		},
		{
			match: /\b(is)\s+(?:(not)\s+)?([Nn]one)\b/,
			captures: {
				1: { name: "keyword.operator.wordlike.logical.is.klipper-script" },
				2: { name: "keyword.operator.wordlike.logical.not.klipper-script" },
				3: { name: "constant.language.null.klipper-script" },
			},
		},
		{
			match: /\b(is)\s+(?:(not)\s+)?([Tt]rue|[Ff]alse)\b/,
			captures: {
				1: { name: "keyword.operator.wordlike.logical.is.klipper-script" },
				2: { name: "keyword.operator.wordlike.logical.not.klipper-script" },
				3: { name: "constant.language.boolean.klipper-script" },
			},
		},
		{
			match: new RegExp(`\\b(is)\\s+(?:(not)\\s+)?(${JINJA_TESTS})\\b`),
			captures: {
				1: { name: "keyword.operator.wordlike.logical.is.klipper-script" },
				2: { name: "keyword.operator.wordlike.logical.not.klipper-script" },
				3: { name: "entity.name.function.test.klipper-script" },
			},
		},
		{
			match: new RegExp(`\\b(is)\\s+(?:(not)\\s+)?(${JINJA_SYMBOL_TESTS})`),
			captures: {
				1: { name: "keyword.operator.wordlike.logical.is.klipper-script" },
				2: { name: "keyword.operator.wordlike.logical.not.klipper-script" },
				3: { name: "entity.name.function.test.klipper-script" },
			},
		},
		{
			name: "keyword.operator.wordlike.logical.$1.klipper-script",
			match: /\b(and|or|not|is)\b/,
		},
		{
			name: "storage.type.$1.klipper-script",
			match: /\b(set|endset)\b/,
		},
	],
};

export const operator: TMGrammarScope = {
	patterns: [
		{
			name: "keyword.operator.arithmetic.$1.klipper-script",
			match: /(\+|-|\/\/?|%|\*\*?)/,
		},
		{
			name: "keyword.operator.comparison.$1.klipper-script",
			match: /(>=?|<=?|[!=]=)/,
		},
		{
			name: "keyword.operator.concatenation.klipper-script",
			match: /~/,
		},
		{
			match: /(\|)\s*(abs|attr|batch|capitalize|center|default|dictsort|escape|filesizeformat|first|float|forceescape|format|groupby|indent|int|join|last|length|list|lower|map|max|min|pprint|random|reject|rejectattr|replace|reverse|round|safe|select|selectattr|slice|sort|string|striptags|sum|title|tojson|truncate|unique|upper|urlencode|urlize|wordcount|wordwrap|xmlattr|count|d|e|items|trim)\b/,
			captures: {
				1: { name: "keyword.operator.pipe.klipper-script" },
				2: { name: "entity.name.function.filter.klipper-script" },
			},
		},
		{
			name: "keyword.operator.pipe.klipper-script",
			match: /\|/,
		},
		{
			name: "keyword.operator.assignment.klipper-script",
			match: /=/,
		},
	],
};

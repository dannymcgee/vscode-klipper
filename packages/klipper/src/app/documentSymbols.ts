import {
	CancellationToken,
	DocumentSymbol,
	DocumentSymbolProvider,
	Position,
	Range,
	SymbolKind,
	TextDocument,
} from "vscode";

type SymbolCandidate = {
	name: string;
	detail: string;
	kind: SymbolKind;
	line: number;
	selectionRange: Range;
};

const CFG_SECTION_RE = /^\s*\[([^\]]+)\]/;
const CFG_SECTION_KINDS: Record<string, SymbolKind> = {
	gcode_macro: SymbolKind.Function,
	delayed_gcode: SymbolKind.Event,
	gcode_shell_command: SymbolKind.Function,
	display_template: SymbolKind.Function,
	include: SymbolKind.File,
	menu: SymbolKind.Namespace,
};

const GCODE_HEADING_RE = /^\s*;+\s*(.+)$/;
// Ignore slicer metadata that would spam the outline.
const GCODE_HEADING_IGNORE_KEYS = new Set([
	"FLAVOR",
	"TIME",
	"MINX",
	"MINY",
	"MINZ",
	"MAXX",
	"MAXY",
	"MAXZ",
	"LAYER_COUNT",
	"LAYER",
	"TYPE",
	"MESH",
	"FILAMENT",
	"MATERIAL",
	"NOZZLE",
	"BED",
	"GENERATED",
	"SLICER",
	"BUILD_VOLUME",
]);

function buildSymbols(
	document: TextDocument,
	candidates: SymbolCandidate[],
): DocumentSymbol[] {
	const lastLine = Math.max(document.lineCount - 1, 0);

	return candidates.map((candidate, index) => {
		const nextLine =
			index + 1 < candidates.length ? candidates[index + 1].line - 1 : lastLine;
		const endLine = Math.max(candidate.line, nextLine);
		const endLineText = document.lineAt(endLine);
		const range = new Range(
			new Position(candidate.line, 0),
			endLineText.range.end,
		);
		return new DocumentSymbol(
			candidate.name,
			candidate.detail,
			candidate.kind,
			range,
			candidate.selectionRange,
		);
	});
}

function parseCfgSection(sectionText: string): {
	name: string;
	detail: string;
	kind: SymbolKind;
} {
	const trimmed = sectionText.trim();
	if (!trimmed) {
		return { name: "section", detail: "", kind: SymbolKind.Namespace };
	}

	const parts = trimmed.split(/\s+/);
	const rawType = parts[0];
	const type = rawType.toLowerCase();
	const rest = parts.slice(1).join(" ");
	const kind = CFG_SECTION_KINDS[type] ?? SymbolKind.Namespace;

	if (type === "include") {
		return {
			name: rest || trimmed,
			detail: rawType,
			kind,
		};
	}

	if (rest) {
		return { name: rest, detail: rawType, kind };
	}

	return { name: trimmed, detail: "", kind };
}

function parseGcodeHeading(text: string): string | null {
	const trimmed = text.trim();
	if (!trimmed) {
		return null;
	}

	const bracketMatch = trimmed.match(/^\[(.+)\]$/);
	if (bracketMatch) {
		return bracketMatch[1].trim();
	}

	if (trimmed.startsWith("@") || trimmed.startsWith("#")) {
		return trimmed.slice(1).trim() || null;
	}

	const keyMatch = trimmed.match(/^([A-Za-z0-9_]+)\s*[:\-]\s*(.*)$/);
	if (keyMatch) {
		const key = keyMatch[1].toUpperCase();
		if (GCODE_HEADING_IGNORE_KEYS.has(key)) {
			return null;
		}
		return trimmed;
	}

	if (/^[A-Z0-9][A-Z0-9 _-]{2,}$/.test(trimmed)) {
		if (GCODE_HEADING_IGNORE_KEYS.has(trimmed.toUpperCase())) {
			return null;
		}
		return trimmed;
	}

	return null;
}

export class KlipperCfgDocumentSymbolProvider
	implements DocumentSymbolProvider
{
	provideDocumentSymbols(
		document: TextDocument,
		token: CancellationToken,
	): DocumentSymbol[] {
		const candidates: SymbolCandidate[] = [];

		for (let line = 0; line < document.lineCount; line += 1) {
			if (token.isCancellationRequested) {
				break;
			}

			const lineText = document.lineAt(line).text;
			const match = lineText.match(CFG_SECTION_RE);
			if (!match) {
				continue;
			}

			const sectionText = match[1];
			const parsed = parseCfgSection(sectionText);
			const headerStart = lineText.indexOf("[");
			const headerEnd = lineText.indexOf("]", headerStart + 1);
			const selectionStart = Math.max(headerStart + 1, 0);
			const selectionEnd = Math.max(headerEnd, selectionStart);
			const selectionRange = new Range(
				new Position(line, selectionStart),
				new Position(line, selectionEnd),
			);

			candidates.push({
				name: parsed.name,
				detail: parsed.detail,
				kind: parsed.kind,
				line,
				selectionRange,
			});
		}

		return buildSymbols(document, candidates);
	}
}

export class KlipperGcodeDocumentSymbolProvider
	implements DocumentSymbolProvider
{
	provideDocumentSymbols(
		document: TextDocument,
		token: CancellationToken,
	): DocumentSymbol[] {
		const candidates: SymbolCandidate[] = [];

		for (let line = 0; line < document.lineCount; line += 1) {
			if (token.isCancellationRequested) {
				break;
			}

			const lineText = document.lineAt(line).text;
			const match = lineText.match(GCODE_HEADING_RE);
			if (!match) {
				continue;
			}

			const rawHeading = match[1];
			const heading = parseGcodeHeading(rawHeading);
			if (!heading) {
				continue;
			}

			const rawStart = lineText.indexOf(rawHeading);
			const trimmedStart = rawHeading.indexOf(rawHeading.trim());
			const selectionStart = Math.max(rawStart + trimmedStart, 0);
			const selectionEnd = selectionStart + heading.length;
			const selectionRange = new Range(
				new Position(line, selectionStart),
				new Position(line, selectionEnd),
			);

			candidates.push({
				name: heading,
				detail: "",
				kind: SymbolKind.Namespace,
				line,
				selectionRange,
			});
		}

		return buildSymbols(document, candidates);
	}
}

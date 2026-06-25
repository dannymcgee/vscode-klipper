import * as vscode from 'vscode';
import { KlipperWorkspaceState, stripComments } from './klipper-state';
import * as fs from 'fs/promises';

export function isValidReference(
	line: string,
	startCol: number,
	word: string,
	type: 'gcode_macro' | 'delayed_gcode'
): boolean {
	const before = line.substring(0, startCol);
	const after = line.substring(startCol + word.length);

	// 1. Section Header Definition check
	if (/^\s*\[\s*(gcode_macro|delayed_gcode)\s+$/i.test(before) && /^\s*\]/.test(after)) {
		if (type === 'gcode_macro') {
			return /^\s*\[\s*gcode_macro\s+$/i.test(before);
		} else {
			return /^\s*\[\s*delayed_gcode\s+$/i.test(before);
		}
	}
	// Any other section header is not a valid reference
	if (/^\s*\[\s*[^\]]+$/i.test(before) && /^\s*\]/.test(after)) {
		return false;
	}

	// 2. Built-in macro-referencing commands
	// ID=word (only for delayed_gcode, inside UPDATE_DELAYED_GCODE)
	if (type === 'delayed_gcode') {
		if (/UPDATE_DELAYED_GCODE\s+[^#;]*\bID\s*=\s*["']?$/i.test(before)) {
			return true;
		}
	}

	// MACRO=word (only for gcode_macro, inside SET_GCODE_VARIABLE)
	if (type === 'gcode_macro') {
		if (/SET_GCODE_VARIABLE\s+[^#;]*\bMACRO\s*=\s*["']?$/i.test(before)) {
			return true;
		}
	}

	// COMMAND=word (only for gcode_macro, inside TUNING_TOWER)
	if (type === 'gcode_macro') {
		if (/TUNING_TOWER\s+[^#;]*\bCOMMAND\s*=\s*["']?$/i.test(before)) {
			return true;
		}
	}

	// 3. Standalone G-code command calls
	// Must not be followed by "=" (e.g. parameter definition)
	if (/^\s*=/.test(after)) {
		return false;
	}
	// Must not be preceded by "PARAM="
	if (/\b[a-zA-Z0-9_]+\s*=\s*["']?$/i.test(before)) {
		return false;
	}

	return true;
}

export class KlipperDefinitionProvider implements vscode.DefinitionProvider {
	constructor(private state: KlipperWorkspaceState) {}

	public provideDefinition(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.Definition> {
		const range = document.getWordRangeAtPosition(position);
		if (!range) return null;

		const word = document.getText(range);
		const connected = this.state.getConnectedFiles(document.uri);
		const matches: vscode.Location[] = [];

		for (const fsPath of connected) {
			const defs = this.state.definitions.get(fsPath);
			if (defs) {
				for (const def of defs) {
					if (def.name.toLowerCase() === word.toLowerCase()) {
						matches.push(new vscode.Location(
							def.uri,
							new vscode.Range(def.line, def.startCol, def.line, def.endCol)
						));
					}
				}
			}
		}

		return matches;
	}
}

export async function findWordReferences(
	word: string,
	type: 'gcode_macro' | 'delayed_gcode',
	startUri: vscode.Uri,
	state: KlipperWorkspaceState
): Promise<vscode.Location[]> {
	const connected = state.getConnectedFiles(startUri);
	const locations: vscode.Location[] = [];
	const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const regex = new RegExp(`\\b${escaped}\\b`, 'gi');

	for (const fsPath of connected) {
		const uri = vscode.Uri.file(fsPath);
		let text = '';

		const openDoc = vscode.workspace.textDocuments.find(doc => doc.uri.fsPath === fsPath);
		if (openDoc) {
			text = openDoc.getText();
		} else {
			try {
				const buffer = await fs.readFile(fsPath);
				text = buffer.toString('utf8');
			} catch (e) {
				continue;
			}
		}

		const lines = text.split(/\r?\n/);
		for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
			const originalLine = lines[lineIndex];
			const stripped = stripComments(originalLine);

			for (const match of stripped.matchAll(regex)) {
				const startCol = match.index!;
				if (!isValidReference(stripped, startCol, word, type)) {
					continue;
				}
				const endCol = startCol + word.length;
				locations.push(new vscode.Location(
					uri,
					new vscode.Range(lineIndex, startCol, lineIndex, endCol)
				));
			}
		}
	}

	return locations;
}

export class KlipperReferenceProvider implements vscode.ReferenceProvider {
	constructor(private state: KlipperWorkspaceState) {}

	public async provideReferences(
		document: vscode.TextDocument,
		position: vscode.Position,
		context: vscode.ReferenceContext,
		token: vscode.CancellationToken
	): Promise<vscode.Location[]> {
		const range = document.getWordRangeAtPosition(position);
		if (!range) return [];

		const word = document.getText(range);
		const connected = this.state.getConnectedFiles(document.uri);
		let targetType: 'gcode_macro' | 'delayed_gcode' | undefined;

		for (const fsPath of connected) {
			const defs = this.state.definitions.get(fsPath);
			if (defs) {
				const found = defs.find(def => def.name.toLowerCase() === word.toLowerCase());
				if (found) {
					targetType = found.type;
					break;
				}
			}
		}

		if (!targetType) return [];

		return await findWordReferences(word, targetType, document.uri, this.state);
	}
}

export class KlipperRenameProvider implements vscode.RenameProvider {
	constructor(private state: KlipperWorkspaceState) {}

	public prepareRename(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.Range> {
		const range = document.getWordRangeAtPosition(position);
		if (!range) return null;

		const word = document.getText(range);
		const connected = this.state.getConnectedFiles(document.uri);
		let isDefined = false;

		for (const fsPath of connected) {
			const defs = this.state.definitions.get(fsPath);
			if (defs && defs.some(def => def.name.toLowerCase() === word.toLowerCase())) {
				isDefined = true;
				break;
			}
		}

		if (!isDefined) {
			throw new Error("Only gcode_macro and delayed_gcode objects can be renamed.");
		}

		return range;
	}

	public async provideRenameEdits(
		document: vscode.TextDocument,
		position: vscode.Position,
		newName: string,
		token: vscode.CancellationToken
	): Promise<vscode.WorkspaceEdit> {
		const range = document.getWordRangeAtPosition(position);
		if (!range) return null;

		const word = document.getText(range);
		const connected = this.state.getConnectedFiles(document.uri);
		let targetType: 'gcode_macro' | 'delayed_gcode' | undefined;

		for (const fsPath of connected) {
			const defs = this.state.definitions.get(fsPath);
			if (defs) {
				const found = defs.find(def => def.name.toLowerCase() === word.toLowerCase());
				if (found) {
					targetType = found.type;
					break;
				}
			}
		}

		if (!targetType) return null;

		const references = await findWordReferences(word, targetType, document.uri, this.state);
		const edit = new vscode.WorkspaceEdit();

		for (const ref of references) {
			edit.replace(ref.uri, ref.range, newName);
		}

		return edit;
	}
}

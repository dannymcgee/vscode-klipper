import * as vscode from 'vscode';
import { KlipperWorkspaceState, stripComments } from './klipper-state';
import * as fs from 'fs/promises';

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
		let isMacroOrDelayed = false;

		for (const fsPath of connected) {
			const defs = this.state.definitions.get(fsPath);
			if (defs && defs.some(def => def.name.toLowerCase() === word.toLowerCase())) {
				isMacroOrDelayed = true;
				break;
			}
		}

		if (!isMacroOrDelayed) return [];

		return await findWordReferences(word, document.uri, this.state);
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
		const references = await findWordReferences(word, document.uri, this.state);
		const edit = new vscode.WorkspaceEdit();

		for (const ref of references) {
			edit.replace(ref.uri, ref.range, newName);
		}

		return edit;
	}
}

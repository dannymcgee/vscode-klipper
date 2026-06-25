import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface Definition {
	name: string;
	type: 'gcode_macro' | 'delayed_gcode';
	uri: vscode.Uri;
	line: number;
	startCol: number;
	endCol: number;
}

export function stripComments(line: string): string {
	let inDoubleQuote = false;
	let inSingleQuote = false;
	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
			inDoubleQuote = !inDoubleQuote;
		} else if (char === "'" && (i === 0 || line[i - 1] !== '\\')) {
			inSingleQuote = !inSingleQuote;
		} else if ((char === '#' || char === ';') && !inDoubleQuote && !inSingleQuote) {
			return line.substring(0, i);
		}
	}
	return line;
}

function splitGlobPath(basePath: string, relPath: string): { baseDir: string; pattern: string } {
	const wildcardIndex = relPath.search(/[*?]/);
	if (wildcardIndex === -1) {
		return { baseDir: path.resolve(basePath, relPath), pattern: '' };
	}

	const beforeWildcard = relPath.substring(0, wildcardIndex);
	const lastSlash = beforeWildcard.lastIndexOf('/');
	const lastBackslash = beforeWildcard.lastIndexOf('\\');
	const slashIndex = Math.max(lastSlash, lastBackslash);

	if (slashIndex === -1) {
		return { baseDir: basePath, pattern: relPath };
	}

	const dirPart = relPath.substring(0, slashIndex);
	const patternPart = relPath.substring(slashIndex + 1);

	return {
		baseDir: path.resolve(basePath, dirPart),
		pattern: patternPart
	};
}

async function resolveIncludePath(
	currentFileUri: vscode.Uri,
	includePath: string,
	workspaceFolder?: vscode.WorkspaceFolder
): Promise<vscode.Uri[]> {
	const cleanPath = includePath.replace(/\\/g, '/');
	let baseDir = path.dirname(currentFileUri.fsPath);
	let relPath = cleanPath;

	if (relPath.includes('*') || relPath.includes('?')) {
		const { baseDir: resolvedBaseDir, pattern } = splitGlobPath(baseDir, relPath);
		const relativePattern = new vscode.RelativePattern(vscode.Uri.file(resolvedBaseDir), pattern);
		try {
			return await vscode.workspace.findFiles(relativePattern);
		} catch (e) {
			console.error(`Error finding files for include pattern: ${relPath}`, e);
			return [];
		}
	} else {
		const resolvedPath = path.resolve(baseDir, relPath);
		return [vscode.Uri.file(resolvedPath)];
	}
}

export async function parseFile(
	uri: vscode.Uri,
	workspaceFolder?: vscode.WorkspaceFolder
): Promise<{ includes: vscode.Uri[]; definitions: Definition[] }> {
	const includes: vscode.Uri[] = [];
	const definitions: Definition[] = [];

	let text = '';
	const openDoc = vscode.workspace.textDocuments.find(doc => doc.uri.fsPath === uri.fsPath);
	if (openDoc) {
		text = openDoc.getText();
	} else {
		try {
			const buffer = await fs.readFile(uri.fsPath);
			text = buffer.toString('utf8');
		} catch (e) {
			return { includes, definitions };
		}
	}

	const lines = text.split(/\r?\n/);
	for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		const originalLine = lines[lineIndex];
		const stripped = stripComments(originalLine);

		// 1. Check for [include ...]
		const includeMatch = stripped.match(/^\s*\[include\s+([^\]]+)\]/i);
		if (includeMatch) {
			const rawPath = includeMatch[1].trim();
			const resolved = await resolveIncludePath(uri, rawPath, workspaceFolder);
			includes.push(...resolved);
			continue;
		}

		// 2. Check for [gcode_macro ...]
		const macroMatch = stripped.match(/^\s*\[gcode_macro\s+([^\]]+)\]/i);
		if (macroMatch) {
			const name = macroMatch[1].trim();
			const startCol = originalLine.indexOf(name);
			definitions.push({
				name,
				type: 'gcode_macro',
				uri,
				line: lineIndex,
				startCol: startCol !== -1 ? startCol : originalLine.indexOf('['),
				endCol: startCol !== -1 ? startCol + name.length : originalLine.indexOf(']')
			});
			continue;
		}

		// 3. Check for [delayed_gcode ...]
		const delayedMatch = stripped.match(/^\s*\[delayed_gcode\s+([^\]]+)\]/i);
		if (delayedMatch) {
			const name = delayedMatch[1].trim();
			const startCol = originalLine.indexOf(name);
			definitions.push({
				name,
				type: 'delayed_gcode',
				uri,
				line: lineIndex,
				startCol: startCol !== -1 ? startCol : originalLine.indexOf('['),
				endCol: startCol !== -1 ? startCol + name.length : originalLine.indexOf(']')
			});
			continue;
		}
	}

	return { includes, definitions };
}

export class KlipperWorkspaceState {
	// Map from file fsPath to resolved include URIs
	public includes = new Map<string, vscode.Uri[]>();
	// Map from file fsPath to list of definitions in that file
	public definitions = new Map<string, Definition[]>();

	private disposables: vscode.Disposable[] = [];

	constructor() {}

	public async init() {
		// 1. Scan initial workspace files
		await this.scanWorkspace();

		// 2. Set up document change listener for active editor updates
		this.disposables.push(
			vscode.workspace.onDidChangeTextDocument(async event => {
				const ext = path.extname(event.document.uri.fsPath).toLowerCase();
				if (ext === '.cfg' || ext === '.gcode') {
					await this.updateFile(event.document.uri);
				}
			})
		);

		// 3. Set up file watchers for creation, changes, and deletions on disk
		const watcher = vscode.workspace.createFileSystemWatcher('**/*.{cfg,gcode}');
		watcher.onDidCreate(async uri => await this.updateFile(uri));
		watcher.onDidChange(async uri => await this.updateFile(uri));
		watcher.onDidDelete(uri => this.removeFile(uri));
		this.disposables.push(watcher);
	}

	public dispose() {
		for (const d of this.disposables) {
			d.dispose();
		}
		this.disposables = [];
	}

	private async scanWorkspace() {
		const uris = await vscode.workspace.findFiles('**/*.{cfg,gcode}');
		// Parse files concurrently
		await Promise.all(uris.map(uri => this.updateFile(uri)));
	}

	public async updateFile(uri: vscode.Uri) {
		const wsFolder = vscode.workspace.getWorkspaceFolder(uri);
		const { includes, definitions } = await parseFile(uri, wsFolder);
		const fsPath = uri.fsPath;
		this.includes.set(fsPath, includes);
		this.definitions.set(fsPath, definitions);
	}

	public removeFile(uri: vscode.Uri) {
		const fsPath = uri.fsPath;
		this.includes.delete(fsPath);
		this.definitions.delete(fsPath);
	}

	/**
	 * Returns the undirected connected component of files connected to the startUri.
	 */
	public getConnectedFiles(startUri: vscode.Uri): Set<string> {
		const connected = new Set<string>();
		const queue: string[] = [startUri.fsPath];
		connected.add(startUri.fsPath);

		// Build undirected adjacency map
		const adj = new Map<string, Set<string>>();
		for (const [fromPath, toUris] of this.includes.entries()) {
			for (const toUri of toUris) {
				const toPath = toUri.fsPath;
				if (!adj.has(fromPath)) adj.set(fromPath, new Set());
				if (!adj.has(toPath)) adj.set(toPath, new Set());
				adj.get(fromPath)!.add(toPath);
				adj.get(toPath)!.add(fromPath);
			}
		}

		while (queue.length > 0) {
			const current = queue.shift()!;
			const neighbors = adj.get(current);
			if (neighbors) {
				for (const neighbor of neighbors) {
					if (!connected.has(neighbor)) {
						connected.add(neighbor);
						queue.push(neighbor);
					}
				}
			}
		}

		return connected;
	}
}

import * as vscode from 'vscode';
import { KlipperWorkspaceState } from './klipper-state';
import { KlipperDefinitionProvider, KlipperReferenceProvider, KlipperRenameProvider } from './providers';

let state: KlipperWorkspaceState | undefined;

export async function activate(context: vscode.ExtensionContext) {
	state = new KlipperWorkspaceState();
	await state.init();
	context.subscriptions.push(state);

	const selector: vscode.DocumentSelector = [
		{ language: 'klipper-cfg', scheme: 'file' },
		{ language: 'klipper-gcode', scheme: 'file' }
	];

	context.subscriptions.push(
		vscode.languages.registerDefinitionProvider(selector, new KlipperDefinitionProvider(state))
	);

	context.subscriptions.push(
		vscode.languages.registerReferenceProvider(selector, new KlipperReferenceProvider(state))
	);

	context.subscriptions.push(
		vscode.languages.registerRenameProvider(selector, new KlipperRenameProvider(state))
	);
}

export function deactivate() {
	if (state) {
		state.dispose();
		state = undefined;
	}
}

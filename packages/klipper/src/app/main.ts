import { ExtensionContext, languages } from "vscode";
import {
	KlipperCfgDocumentSymbolProvider,
	KlipperGcodeDocumentSymbolProvider,
} from "./documentSymbols";

export function activate(context: ExtensionContext) {
	context.subscriptions.push(
		languages.registerDocumentSymbolProvider(
			{ language: "klipper-cfg" },
			new KlipperCfgDocumentSymbolProvider(),
		),
		languages.registerDocumentSymbolProvider(
			{ language: "klipper-gcode" },
			new KlipperGcodeDocumentSymbolProvider(),
		),
	);
}

export function deactivate() {}

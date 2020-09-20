import * as vscode from 'vscode'
import { RemoteLogServer } from './remotes_scroll'

export function activate(context: vscode.ExtensionContext) {
	let rls = new RemoteLogServer()
	context.subscriptions.push(vscode.commands.registerCommand('extension.start_rls', () => { rls.start() }))
	context.subscriptions.push(vscode.commands.registerCommand('extension.stop_rls', () => { rls.stop() }))
	context.subscriptions.push(vscode.commands.registerCommand('extension.toggle_rls', () => { rls.toggle() }))
}

export function deactivate() { }
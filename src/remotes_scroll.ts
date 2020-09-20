import * as net from 'net'
import * as vscode from 'vscode'

export class RemoteLogServer {
	enabled: boolean
	server: net.Server

	constructor() {
		this.enabled = true
		this.server = net.createServer({ allowHalfOpen: true }, (socket: net.Socket) => {
			socket.setEncoding('utf8')
			socket.setKeepAlive(true)

			let remoteAddress = socket.remoteAddress + ':' + socket.remotePort?.toString()
			vscode.window.showInformationMessage(`Logger connected: ${remoteAddress}`)

			socket.on('data', (data: Buffer) => {
				if (!this.enabled) return
				let activeEditor = vscode.window.activeTextEditor
				if (!activeEditor) return
				const edit = new vscode.WorkspaceEdit()
				edit.insert(activeEditor.document.uri, new vscode.Position(activeEditor.document.lineCount, 0), data.toString(), {
					needsConfirmation: false,
					label: new Date().toISOString().substring(0, 16)
				})
				vscode.workspace.applyEdit(edit)
			})

			socket.on('end', () => {
				vscode.window.showInformationMessage(`Logger done: ${remoteAddress}`)
			})

			socket.on('close', (err) => {
				vscode.window.showInformationMessage(`Logger disconnected: ${remoteAddress}${err ? `, error ${err}` : ''}`)
			})
		})
	}

	public start() {
		this.enabled = true
		let conf = vscode.workspace.getConfiguration('RemoteLogServer')
		this.server.listen(conf.get('port'), conf.get('host'), () => {
			vscode.window.showInformationMessage(`Log server started: ${JSON.stringify(this.server.address())}`)
		})
	}

	public stop() {
		this.enabled = false
		this.server.close()
		vscode.window.showInformationMessage('Log server stopped')
	}

	public toggle() {
		this.enabled = !this.enabled
		vscode.window.showInformationMessage(this.enabled ? 'Log server resumes' : 'Log server is paused')
	}
}
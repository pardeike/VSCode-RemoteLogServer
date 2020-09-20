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
			vscode.window.setStatusBarMessage(`Logger connected: ${remoteAddress}`, 1000)

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
				vscode.window.setStatusBarMessage(`Logger done: ${remoteAddress}`, 1000)
			})

			socket.on('close', (err) => {
				vscode.window.setStatusBarMessage(`Logger disconnected: ${remoteAddress}${err ? `, error ${err}` : ''}`, 1000)
			})
		})
	}

	public start() {
		this.enabled = true
		let conf = vscode.workspace.getConfiguration('RemoteLogServer')
		this.server.listen(conf.get('port'), conf.get('host'), () => {
			vscode.window.setStatusBarMessage(`Log server started: ${JSON.stringify(this.server.address())}`, 3000)
		})
	}

	public stop() {
		this.enabled = false
		this.server.close()
		vscode.window.setStatusBarMessage('Log server stopped', 1000)
	}

	public toggle() {
		this.enabled = !this.enabled
		vscode.window.setStatusBarMessage(this.enabled ? 'Log server resumes' : 'Log server is paused', 2000)
	}
}
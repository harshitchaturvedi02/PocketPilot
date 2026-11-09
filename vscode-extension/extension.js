const vscode = require('vscode');
function activate(context) { context.subscriptions.push(vscode.commands.registerCommand('pocketPilot.startBridge', () => { vscode.window.showInformationMessage('Pocket Pilot bridge started. Open the phone app and pair this workspace.'); })); }
function deactivate() {}
module.exports = { activate, deactivate };

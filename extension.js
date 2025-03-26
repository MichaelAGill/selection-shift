
const vscode = require('vscode');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const moveRight = vscode.commands.registerCommand('extension.moveSelectionRight', async () => {
	  const editor = vscode.window.activeTextEditor;
	  if (!editor) return;
  
	  const doc = editor.document;
	  const selections = editor.selections;
	  const texts = selections.map(sel => doc.getText(sel));
	  const lengths = texts.map(text => text.length);
  
	  await editor.edit(editBuilder => {
		selections.forEach(sel => editBuilder.delete(sel));
	  });
  
	  const newPositions = selections.map(sel => {
		const offset = Math.min(doc.getText().length, doc.offsetAt(sel.end) + 1 - lengths[i]);
		return doc.positionAt(offset);
	  });
  
	  const newSelections = [];
  
	  await editor.edit(editBuilder => {
		texts.forEach((text, i) => {
		  editBuilder.insert(newPositions[i], text);
		  const start = newPositions[i];
		  const end = start.translate(0, text.length);
		  newSelections.push(new vscode.Selection(start, end));
		});
	  });
  
	  editor.selections = newSelections;
	});
  
	context.subscriptions.push(moveRight);

	const moveLeft = vscode.commands.registerCommand('extension.moveSelectionLeft', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
	  
		const doc = editor.document;
		const selections = editor.selections;
	  
		const texts = selections.map(sel => doc.getText(sel));
	  
		await editor.edit(editBuilder => {
		  selections.forEach(sel => editBuilder.delete(sel));
		});
	  
		const newPositions = selections.map(sel => {
		  const offset = Math.max(0, doc.offsetAt(sel.start) - 1);
		  return doc.positionAt(offset);
		});
	  
		const newSelections = [];
	  
		await editor.edit(editBuilder => {
		  texts.forEach((text, i) => {
			editBuilder.insert(newPositions[i], text);
			const start = newPositions[i];
			const end = start.translate(0, text.length);
			newSelections.push(new vscode.Selection(start, end));
		  });
		});
	  
		editor.selections = newSelections;
	  });
	  
	  context.subscriptions.push(moveLeft);
  }

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

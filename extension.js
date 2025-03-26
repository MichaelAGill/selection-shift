const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const moveSelection = async (direction) => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		const doc = editor.document;
		let selections = editor.selections;
		const texts = selections.map(sel => doc.getText(sel));
		const isMultiline = texts.some(text => text.includes('\n'));

		// Delete selections
		await editor.edit(editBuilder => {
			selections.forEach(sel => editBuilder.delete(sel));
		});

		// Recalculate positions after deletion
		const allText = doc.getText();
		const newPositions = selections.map((sel, i) => {
			const startOffset = doc.offsetAt(sel.start);
			const moveBy = direction === 'right' ? 1 : -1;
			let newOffset = startOffset + moveBy;
		
			// Clamp offset
			newOffset = Math.max(0, Math.min(doc.getText().length, newOffset));
		
			return doc.positionAt(newOffset);
		});
		

		// If moving left, reverse insert order to prevent offset drift
		const insertOrder = direction === 'right' ? [...texts.keys()] : [...texts.keys()].reverse();

		const newSelections = Array(texts.length);

		await editor.edit(editBuilder => {
			insertOrder.forEach(i => {
				const pos = newPositions[i];
				editBuilder.insert(pos, texts[i]);
				newSelections[i] = new vscode.Selection(pos, pos.translate(0, texts[i].length));
			});
		});

		editor.selections = newSelections;
	};

	const moveRight = vscode.commands.registerCommand('selection-shift.moveSelectionRight', () => moveSelection('right'));
	const moveLeft = vscode.commands.registerCommand('selection-shift.moveSelectionLeft', () => moveSelection('left'));

	context.subscriptions.push(moveRight, moveLeft);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};

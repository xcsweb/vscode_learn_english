// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "learn-english" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let isShow=false;
    let textBar:any=null;
    let disposable2=vscode.commands.registerCommand('extension.showEnglish', () => {
		//显示文字
        if(isShow===false){
            textBar=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 8);
            textBar.text="I love learn english";
            textBar.show();
            isShow=true;
        }else{
            textBar.hide();
            isShow=false;
        }
       
		//需要释放的资源都在这里依次push到这个数组里面
		// context.subscriptions.push(counter);
    });
    
	let disposable1 = vscode.commands.registerCommand('extension.learnEnglish', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
        let bookButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 5.5);
        bookButton.command = 'extension.showEnglish';
        bookButton.text = `$(book)`;
        bookButton.tooltip = "learn english";
        bookButton.show();
		//需要释放的资源都在这里依次push到这个数组里面
		// context.subscriptions.push(counter);
    });
    // context.subscriptions.push(disposable);
    context.subscriptions.push(...[disposable1,disposable2]);
}

// this method is called when your extension is deactivated
export function deactivate() {}
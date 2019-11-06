// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {commands,ExtensionContext,window,StatusBarAlignment} from 'vscode';
import * as book from './book';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "learn-english" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let isShow=false;
    let textBar:any=null;
    let disposable2=commands.registerCommand('extension.showEnglish', () => {
		//显示文字
        if(isShow===false){
            textBar=window.createStatusBarItem(StatusBarAlignment.Right, 8);
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
    
	let disposable1 = commands.registerCommand('extension.learnEnglish', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
        let bookButton =window.createStatusBarItem(StatusBarAlignment.Right, 5.5);
        bookButton.command = 'extension.showEnglish';
        bookButton.text = `$(book)`;
        bookButton.tooltip = "learn english";
        bookButton.show();
		//需要释放的资源都在这里依次push到这个数组里面
		// context.subscriptions.push(counter);
    });
    // context.subscriptions.push(disposable);
    // 下一页
    // 老板键
	let displayCode = commands.registerCommand('extension.displayCode', () => {

		let lauage_arr_list = [
			'Java - System.out.println("Hello World");',
			'C++ - cout << "Hello, world!" << endl;',
			'C - printf("Hello, World!");',
			'Python - print("Hello, World!")',
			'PHP - echo "Hello World!";',
			'Ruby - puts "Hello World!";',
			'Perl - print "Hello, World!";',
			'Lua - print("Hello World!")',
			'Scala - println("Hello, world!")',
			'Golang - fmt.Println("Hello, World!")'
		];

		var index = Math.floor((Math.random() * lauage_arr_list.length));
		window.setStatusBarMessage(lauage_arr_list[index]);
	});
	let getNextPage = commands.registerCommand('extension.getNextPage', () => {
        let books = new book.Book(context);
        setInterval(async()=>{
            window.setStatusBarMessage(await books.getNextPage());
        },100);
	});

	// 上一页
	let getPreviousPage = commands.registerCommand('extension.getPreviousPage',async () => {
		let books = new book.Book(context);
		window.setStatusBarMessage(await books.getPreviousPage());
	});

	// 跳转某个页面
	let getJumpingPage = commands.registerCommand('extension.getJumpingPage',async () => {
		let books = new book.Book(context);
		window.setStatusBarMessage(await books.getJumpingPage());
	});
    context.subscriptions.push(...[disposable1,disposable2,getNextPage,getPreviousPage,getJumpingPage,displayCode]);
}

// this method is called when your extension is deactivated
export function deactivate() {}
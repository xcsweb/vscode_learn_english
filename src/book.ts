import { ExtensionContext, workspace, window } from 'vscode';
import * as fs from "fs";
import * as cheerio from 'cheerio';
import * as superagent from './super';

export class Book {
    curr_page_number: number = 1;
    page_size: number | undefined = 50;
    page = 0;
    start = 0;
    end = this.page_size;
    filePath: string | undefined = "";
    extensionContext: ExtensionContext;
    acticleUrl:string="http://www.dioenglish.com/home.php?mod=space&uid=114334&do=blog&id=58124";

    constructor(extensionContext: ExtensionContext) {
        this.extensionContext = extensionContext;
    }

    getSize(text: string) {
        let size = text.length;
        this.page = Math.ceil(size / this.page_size!);
    }

    getFileName() {
        var file_name: string | undefined = this.filePath!.split("/").pop();
        console.log(file_name);
    }

    getPage(type: string) {

        var curr_page = <number>workspace.getConfiguration().get('thiefBook.currPageNumber');
        var page = 0;

        if (type === "previous") {
            if (curr_page! <= 1) {
                page = 1;
            } else {
                page = curr_page - 1;
            }
        } else if (type === "next") {
            if (curr_page! >= this.page) {
                page = this.page;
            } else {
                page = curr_page + 1;
            }
        } else if (type === "curr") {
            page = curr_page;
        }

        this.curr_page_number = page;
        // this.curr_page_number = this.extensionContext.globalState.get("book_page_number", 1);
    }

    updatePage() {
        // var page = 0;

        // if (type === "previous") {
        //     if (this.curr_page_number! <= 1) {
        //         page = 1;
        //     } else {
        //         page = this.curr_page_number! - 1;
        //     }
        // } else if (type === "next") {
        //     if (this.curr_page_number! >= this.page) {
        //         page = this.page;
        //     } else {
        //         page = this.curr_page_number! + 1;
        //     }
        // }

        workspace.getConfiguration().update('thiefBook.currPageNumber', this.curr_page_number, true);
        // this.extensionContext.globalState.update("book_page_number", page);
    }

    getStartEnd() {
        this.start = this.curr_page_number * this.page_size!;
        this.end = this.curr_page_number * this.page_size! - this.page_size!+100;
    }

    readFile() {
        if (this.filePath === "" || typeof (this.filePath) === "undefined") {
            window.showWarningMessage("请填写TXT格式的小说文件路径 & Please fill in the path of the TXT format novel file");
        }

        var data = fs.readFileSync(this.filePath!, 'utf-8');
        
        var line_break = <string>workspace.getConfiguration().get('thiefBook.lineBreak');

        return data.toString().replace(/\n/g, line_break).replace(/\r/g, " ").replace(/　　/g, " ").replace(/ /g, " ");
    }

    init() {
        this.filePath = workspace.getConfiguration().get('thiefBook.filePath');
        // var is_english = <boolean>workspace.getConfiguration().get('thiefBook.isEnglish');
        let is_english=true;

        if (is_english === true) {
            // this.page_size = <number>workspace.getConfiguration().get('thiefBook.pageSize') * 2;
            this.page_size=1;
        } else {
            this.page_size = workspace.getConfiguration().get('thiefBook.pageSize');
        }
    }
    async getArticle(){
        let res= await this.getDom(this.acticleUrl);
        let $ = cheerio.load(res);
        return $("#blog_article").text();
    }

    async getDom(url:string){
        let res:any = await superagent.req(url,'GET');
        return res.text;
    }

    async getPreviousPage() {
        this.init();

        // let text = this.readFile();
        let text=await this.getArticle();

        this.getSize(text);
        this.getPage("previous");
        this.getStartEnd();

        var page_info = this.curr_page_number.toString() + "/" + this.page.toString();

        this.updatePage();
        return text.substring(this.start, this.end) + "    " + page_info;
    }
    setArticle(acticleUrl:string){
       this.acticleUrl=acticleUrl;
    }

    async getNextPage() {
        this.init();

        let text =await this.getArticle();

        this.getSize(text);
        this.getPage("next");
        this.getStartEnd();

        var page_info = this.curr_page_number.toString() + "/" + this.page.toString();

        this.updatePage();

        return text.substring(this.start, this.end) + "    " + page_info;
    }

    async getJumpingPage() {
        this.init();

        let text =await this.getArticle();

        this.getSize(text);
        this.getPage("curr");
        this.getStartEnd();

        var page_info = this.curr_page_number.toString() + "/" + this.page.toString();

        this.updatePage();

        return text.substring(this.start, this.end) + "    " + page_info;
    }
}
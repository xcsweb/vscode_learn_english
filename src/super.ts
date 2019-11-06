import * as superagent from "superagent";

//请求
function req(url:string,method:string, params?:object, data?:object) {
  return new Promise(function (resolve,reject) {
	superagent(method, url)
		.query(params||{})
		.send(data||{})
		.set('Content-Type','application/x-www-form-urlencoded')
		.end(function (err:any, response:any) {
		  if (err) {
			reject(err);
		  }
		  resolve(response);
		});
  });
}
export{
	req
};

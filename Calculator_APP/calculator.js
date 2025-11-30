const http=require("http")
const url=require('url')
const server =http.createServer((req,res)=>{
    let ur=req.url
    let operation=ur.slice(1,ur.indexOf('?'))  //http://localhost:3000/add?a=3&b=6
    let a=Number(ur[ur.lastIndexOf('a')+2]);
    let b=Number(ur[ur.lastIndexOf('b')+2]);
    switch(operation){
        case 'add':
            res.writeHead(200,{"content-type":'text/html'})
            res.end(`<h2>response => ${a+b}</h2>`);
            break;
        case 'subtract':
            res.writeHead(200,{"content-type":'text/html'})
            res.end(`<h2>response => ${a-b}</h2>`)
            break; 
        case 'multiply':
            res.writeHead(200,{"content-type":'text/html'})
            res.end(`<h2>response => ${a*b}</h2>`)
            break;
        case 'divide':
            res.writeHead(200,{"content-type":'text/html'})
            res.end(`<h2>response => ${a/b}</h2>`)
            break;
        default :
            res.writeHead(400,{"content-type":'text/html'})
            res.end(`<h2>Bad Request</h2>`)
    }    

})
const port=3000;
server.listen(port,()=>{
    console.log(`Running on port ${port}`);
})
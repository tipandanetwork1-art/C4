const https=require('https');
const config={baseUrl:'https://191.7.184.11/webservice/v1',token:'339:500a9bb5ece76c8648cd4c47da81b48c71734ff1d46f525b5a31f2f45bd81d84'};
const payload=JSON.stringify({qtype:'cliente.id',query:'1',oper:'=',page:1,rp:1,sortname:'cliente.id',sortorder:'desc'});
const auth=Buffer.from(config.token).toString('base64');
const url=config.baseUrl + '/cliente';
const req=https.request(url,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Basic '+auth,ixcsoft:'listar','Content-Length':Buffer.byteLength(payload)},agent:new https.Agent({rejectUnauthorized:false})},res=>{let raw='';res.on('data',c=>raw+=c);res.on('end',()=>{console.log('status',res.statusCode);console.log('body',raw.slice(0,500));});});
req.on('error',err=>console.error('ERR',err));
req.write(payload);
req.end();

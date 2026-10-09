import http from 'node:http';
import { createPaystackHandler } from './server/paystack-api.js';

const handler=createPaystackHandler({secretKey:process.env.PAYSTACK_SECRET_KEY,appUrl:process.env.APP_URL||'http://localhost:5173',currency:process.env.PAYSTACK_CURRENCY||'USD'});
const port=Number(process.env.PORT||3001);
http.createServer((req,res)=>{Promise.resolve(handler(req,res)).then(handled=>{if(!handled){res.writeHead(404);res.end();}}).catch(()=>{res.writeHead(500);res.end();});}).listen(port,()=>process.stdout.write(`Marketplace API listening on ${port}\n`));

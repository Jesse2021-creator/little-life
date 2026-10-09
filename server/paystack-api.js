const products={
  'Midnight Bloom':{id:'Midnight Bloom',amount:299,currency:'USD',name:'Midnight Bloom premium theme'},
  'Starlit Atelier':{id:'Starlit Atelier',amount:399,currency:'USD',name:'Starlit Atelier premium theme'},
};
const json=(res,status,data)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(data));};
async function readBody(req){let body='';for await(const chunk of req){body+=chunk;if(body.length>12000)throw new Error('Request too large');}return body?JSON.parse(body):{};}

export function createPaystackHandler({secretKey='',appUrl='http://localhost:5173',currency='USD'}={}){
  return async function paystackHandler(req,res){
    const route=new URL(req.url,'http://localhost').pathname;
    if(!route.startsWith('/api/paystack/'))return false;
    if(req.method!=='POST'){json(res,405,{error:'Method not allowed.'});return true;}
    if(!secretKey){json(res,503,{error:'Checkout is not configured. Add a rotated Paystack secret key to the server environment.'});return true;}
    try{
      const body=await readBody(req);
      if(route==='/api/paystack/initialize'){
        const product=products[body.productId];
        const email=String(body.email||'').trim().toLowerCase();
        if(!product){json(res,400,{error:'That marketplace item is unavailable.'});return true;}
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){json(res,400,{error:'Enter a valid email address for your receipt.'});return true;}
        if(currency!==product.currency){json(res,503,{error:`This item is priced in ${product.currency}; configure PAYSTACK_CURRENCY=${product.currency}.`});return true;}
        const callbackUrl=new URL('/',appUrl);callbackUrl.searchParams.set('paystack','return');
        const response=await fetch('https://api.paystack.co/transaction/initialize',{method:'POST',headers:{authorization:`Bearer ${secretKey}`,'content-type':'application/json'},body:JSON.stringify({email,amount:String(product.amount),currency:product.currency,callback_url:callbackUrl.toString(),metadata:{themeId:product.id,productName:product.name}})});
        const payload=await response.json();
        if(!response.ok||!payload.status||!payload.data?.authorization_url){json(res,502,{error:'Paystack could not start checkout. Check your server key and Paystack account settings.'});return true;}
        json(res,200,{authorizationUrl:payload.data.authorization_url,reference:payload.data.reference});return true;
      }
      if(route==='/api/paystack/verify'){
        const reference=String(body.reference||'');
        if(!/^[A-Za-z0-9.=_-]{4,120}$/.test(reference)){json(res,400,{error:'A valid payment reference is required.'});return true;}
        const response=await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,{headers:{authorization:`Bearer ${secretKey}`}});
        const payload=await response.json();const transaction=payload.data;
        const product=products[transaction?.metadata?.themeId];
        if(!response.ok||!payload.status||!transaction){json(res,502,{error:'Could not verify this payment with Paystack.'});return true;}
        if(transaction.status!=='success'){json(res,402,{error:'Paystack has not confirmed a successful payment.'});return true;}
        if(!product||transaction.amount!==product.amount||transaction.currency!==product.currency){json(res,400,{error:'Payment details did not match this marketplace item.'});return true;}
        json(res,200,{verified:true,productId:product.id,reference:transaction.reference,amount:transaction.amount,currency:transaction.currency});return true;
      }
      json(res,404,{error:'Payment endpoint not found.'});return true;
    }catch(error){
      json(res,400,{error:error instanceof SyntaxError?'Invalid request body.':'Payment service is temporarily unavailable.'});return true;
    }
  };
}

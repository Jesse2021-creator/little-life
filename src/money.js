const fullCurrency=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
const shortNumber=new Intl.NumberFormat('en-US',{maximumFractionDigits:2});
export function formatMoney(value){
 const amount=Number(value)||0;const magnitude=Math.abs(amount);
 if(magnitude<100_000_000)return fullCurrency.format(amount);
 const [divisor,suffix]=magnitude>=1_000_000_000_000?[1e12,'t']:magnitude>=1_000_000_000?[1e9,'b']:[1e6,'m'];
 return `${amount<0?'-':''}$${shortNumber.format(magnitude/divisor)}${suffix}`;
}

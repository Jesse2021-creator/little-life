export function sortShopItems(items,category='All',direction='ascending'){
  return items.filter(item=>category==='All'||item.category===category).sort((a,b)=>{
    const left=Number(a.price),right=Number(b.price);
    const difference=(Number.isFinite(left)?left:Infinity)-(Number.isFinite(right)?right:Infinity);
    return (direction==='descending'?-difference:difference)||a.name.localeCompare(b.name);
  });
}

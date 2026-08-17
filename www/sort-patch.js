(()=>{
  if(typeof all!=='function') return;
  const originalAll=all;
  all=async function(store){
    const rows=await originalAll(store);
    if(store==='categories'||store==='wallets'){
      return [...rows].sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'id',{sensitivity:'base',numeric:true}));
    }
    return rows;
  };
  if(typeof render==='function') setTimeout(()=>render(),0);
})();

(()=>{
  const svg=(path)=>`<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${path}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const icons={
    settings:'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.86 2.86-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1A1.7 1.7 0 0 0 8.2 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.86-2.86.06-.06A1.7 1.7 0 0 0 3.8 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2V9.6h.1A1.7 1.7 0 0 0 3.8 8.2a1.7 1.7 0 0 0-.34-1.88l-.06-.06L6.26 3.4l.06.06A1.7 1.7 0 0 0 8.2 3.8a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2h4v.1a1.7 1.7 0 0 0 1.4 1.7 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.86 2.86-.06.06A1.7 1.7 0 0 0 19.4 8.2a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4h.1v4h-.1a1.7 1.7 0 0 0-1.7 1.4Z',
    expense:'M12 4v16m0 0 6-6m-6 6-6-6',
    income:'M12 20V4m0 0 6 6m-6-6-6 6',
    wallet:'M4 7.5h14a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h11v3.5M16 13h4',
    up:'M7 17 17 7m0 0h-7m7 0v7',
    down:'M17 7 7 17m0 0h7m-7 0v-7',
    swap:'M7 7h12m0 0-3-3m3 3-3 3M17 17H5m0 0 3 3m-3-3 3-3',
    history:'M3 12a9 9 0 1 0 3-6.7L3 8m0 0V3m0 5h5M12 7v5l3 2',
    search:'M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm5-2 4 4',
    shield:'M12 3 5 6v5c0 4.8 3 8.2 7 10 4-1.8 7-5.2 7-10V6l-7-3Zm-3 9 2 2 4-5',
    credit:'M3 7h18v10H3zM3 10h18M7 14h3'
  };

  topbar=function(){
    const logo=(typeof NADMO_LOGO!=='undefined'&&NADMO_LOGO)?`<div class="nadmo-logo-wrap"><img class="nadmo-logo" src="${NADMO_LOGO}" alt="NADMO AI"></div>`:'';
    return `<div class="topbar"><div class="nadmo-brand">${logo}<div class="brand-copy"><div class="brand-title">NADMO AI <span class="pro-badge">PRIVATE</span></div><div class="brand-sub">Personal Finance Intelligence</div></div></div><button class="iconbtn" aria-label="Pengaturan" onclick="go('settings')">${svg(icons.settings)}</button></div>`;
  };

  bottom=function(){
    return `<nav class="bottom" aria-label="Aksi utama">
      <button class="bottom-btn exp" onclick="go('expense')"><span class="nav-icon">${svg(icons.expense)}</span><span>PENGELUARAN</span></button>
      <button class="bottom-btn inc" onclick="go('income')"><span class="nav-icon">${svg(icons.income)}</span><span>PEMASUKAN</span></button>
      <button class="bottom-btn sal" onclick="go('balance')"><span class="nav-icon">${svg(icons.wallet)}</span><span>SALDO</span></button>
    </nav>`;
  };

  iconFor=function(t){
    if(t==='income') return svg(icons.up);
    if(t==='expense') return svg(icons.down);
    return svg(icons.swap);
  };

  txHtml=function(t){
    const dt=new Date(t.timestamp);
    const when=dt.toLocaleDateString('id-ID',{day:'2-digit',month:'short'})+' · '+dt.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
    return `<div class="tx" onclick="editTx('${t.id}')"><div class="tx-ico">${iconFor(t.type)}</div><div><div class="tx-title">${esc(t.description||t.categoryName||'Transaksi')}</div><div class="tx-sub">${esc(t.categoryName||'')} · ${esc(t.walletName||'')} · ${when}</div></div><div class="tx-amount ${t.type==='income'?'income':'expense'}">${t.type==='income'?'+ ':'- '}${rupiah(t.amount)}</div></div>`;
  };


  window.paylaterLimitEditor=async function(){
    const wallets=(await all('wallets')).filter(w=>w.type==='Kredit/Paylater');
    if(!wallets.length) return toast('Belum ada wallet Paylater.');
    const rows=[];
    for(const w of wallets) rows.push({...w,current:await walletBalance(w)});
    modal(`<h2>Limit / Saldo Paylater</h2>
      <div class="paylater-help">Pilih layanan Paylater lalu isi <b>saldo/limit yang tersedia sekarang</b>. Penyesuaian ini tidak dicatat sebagai pemasukan.</div>
      <div class="paylater-list">${rows.map(w=>`<button class="paylater-row" onclick="paylaterLimitInput('${w.id}')"><span><b>${esc(w.name)}</b><small>Limit / saldo tersedia</small></span><strong>${rupiah(w.current)}</strong></button>`).join('')}</div>`);
  };

  window.paylaterLimitInput=async function(id){
    const w=await get('wallets',id);
    if(!w) return toast('Wallet Paylater tidak ditemukan.');
    const current=await walletBalance(w);
    closeModal();
    modal(`<h2>${esc(w.name)}</h2>
      <div class="paylater-current"><span>Saldo / limit tersedia saat ini</span><strong>${rupiah(current)}</strong></div>
      <div class="field"><div class="label">Limit / saldo tersedia terbaru</div><input id="paylaterLimit" class="input amount-input" inputmode="numeric" value="${Math.round(current).toLocaleString('id-ID')}" oninput="fmtAmount(this)"></div>
      <div class="paylater-help">Masukkan angka yang tampil sebagai limit tersedia di aplikasi Paylater. NADMO akan menyesuaikan saldo tanpa membuat transaksi pemasukan palsu.</div>
      <button class="primary" onclick="savePaylaterLimit('${id}')">SIMPAN LIMIT TERSEDIA</button>`);
  };

  window.savePaylaterLimit=async function(id){
    const el=document.querySelector('#paylaterLimit');
    const raw=(el?.dataset.raw||el?.value||'').replace(/\D/g,'');
    if(raw==='') return toast('Masukkan limit / saldo tersedia.');
    const target=Number(raw);
    const w=await get('wallets',id);
    if(!w) return toast('Wallet Paylater tidak ditemukan.');
    const current=await walletBalance(w);
    w.initialBalance=(Number(w.initialBalance)||0)+(target-current);
    w.updatedAt=now();
    await put('wallets',w);
    closeModal();
    toast('Limit Paylater diperbarui.');
    go('income');
  };

  if(typeof form==='function'){
    const baseForm=form;
    form=async function(type,draft={}){
      let html=await baseForm(type,draft);
      if(type==='income'){
        const shortcut=`<button type="button" class="choice paylater-shortcut" onclick="paylaterLimitEditor()"><span class="paylater-choice-title">${svg(icons.credit)}<b>Paylater</b></span><small>Limit / saldo</small></button>`;
        html=html.replace(/(<div class="grid" id="catGrid">[\s\S]*?)(<\/div><div class="section-title"><span>Dompet Tujuan<\/span>)/, (match,grid,tail)=>grid+shortcut+tail);
      }
      return html;
    };
  }

  if(typeof home==='function'){
    const baseHome=home;
    home=async function(){
      let html=await baseHome();
      html=html.replace('<div style="margin:4px 2px 14px"><div class="muted small">Selamat Datang di</div><div style="font-size:25px;font-weight:900">NADMO AI</div></div>','<div class="home-intro"><div class="home-kicker">Financial control center</div><div class="home-title">Ringkasan Keuangan</div></div>');
      html=html.replace('<div class="eyebrow">Total saldo aktual</div>','<div class="eyebrow">Total saldo aktual <span class="hero-status">TERKINI</span></div>');
      html=html.replace('<div class="fabrow"><button class="ghost" onclick="go(\'history\')">🧾 Riwayat</button><button class="ghost" onclick="go(\'transfer\')">⇄ Pindah Saldo</button></div>',`<div class="fabrow"><button class="ghost" onclick="go('history')">${svg(icons.history)}<span>Riwayat</span></button><button class="ghost" onclick="go('transfer')">${svg(icons.swap)}<span>Pindah Saldo</span></button></div>`);
      html=html.replace('<div class="section-title"><span>NADMO AI</span><span class="muted small">Natural input</span></div>','<div class="section-title"><span>Smart Entry</span><span class="muted small">Local intelligence</span></div>');
      html=html.replace('Buat Draft Transaksi','Analisis Transaksi');
      html=html.replace('<div class="section-title"><span>Ringkasan Bulanan</span></div>','<div class="section-title"><span>Arus Kas Bulan Ini</span><span class="muted small">Income vs expense</span></div>');
      html=html.replace('<div class="section-title"><span>Kategori Pengeluaran Terbesar</span></div>','<div class="section-title"><span>Pengeluaran Terbesar</span><span class="muted small">By category</span></div>');
      html=html.replace('<div class="section-title"><span>Transaksi terbaru</span>','<div class="section-title"><span>Aktivitas Terbaru</span>');
      return html;
    };
  }

  if(typeof balance==='function'){
    const baseBalance=balance;
    balance=async function(){
      let html=await baseBalance();
      html=html.replace('<h1>Cek Saldo</h1>','<h1>Saldo & Wallet</h1>');
      html=html.replace('<div class="eyebrow">TOTAL SALDO</div>','<div class="eyebrow">TOTAL ASET TERLACAK <span class="hero-status">LIVE</span></div>');
      return html;
    };
  }

  if(typeof history==='function'){
    const baseHistory=history;
    history=async function(){
      let html=await baseHistory();
      html=html.replace('<h1>Riwayat</h1>','<h1>Riwayat Transaksi</h1>');
      html=html.replace('<button class="iconbtn" onclick="go(\'history\')">⌕</button>',`<button class="iconbtn" aria-label="Cari" onclick="go('history')">${svg(icons.search)}</button>`);
      html=html.replace('Custom Date','Tanggal');
      return html;
    };
  }

  if(typeof settings==='function'){
    const baseSettings=settings;
    settings=async function(){
      let html=await baseSettings();
      const about=`<div class="section-title"><span>Tentang NADMO AI</span></div>
      <div class="card release-card"><div class="release-row"><div><div class="release-name">NADMO AI</div><div class="privacy-note">Personal finance intelligence dengan data utama tersimpan lokal di perangkat.</div></div><div class="release-version">v1.3.0</div></div></div>`;
      const safety=`<div class="section-title"><span>Data Protection</span></div>
      <div class="card safety-card"><div class="safety-row"><div class="safety-icon">${svg(icons.shield)}</div><div><div class="safety-title">Backup sebelum perubahan besar</div><div class="safety-copy">Gunakan Backup Database sebelum pindah perangkat, reset aplikasi, atau perubahan sistem.</div></div></div></div>`;
      html=html.replace('<div class="section-title"><span>Data & Backup</span></div>',about+safety+'<div class="section-title"><span>Data & Backup</span></div>');
      return html;
    };
  }

  if(typeof render==='function'){
    const baseRender=render;
    render=async function(...args){
      await baseRender(...args);
      const app=document.querySelector('.app');
      if(app){
        app.dataset.view=(typeof state!=='undefined'&&state.view)||'home';
        app.classList.remove('view-enter');
        requestAnimationFrame(()=>app.classList.add('view-enter'));
      }
    };
  }

  document.documentElement.dataset.nadmoEdition='premium-v13';
  setTimeout(()=>{if(typeof render==='function')render()},0);
})();
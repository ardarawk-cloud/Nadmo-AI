(()=>{
  const svg=(path)=>`<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${path}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const icons={
    settings:'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.86 2.86-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1A1.7 1.7 0 0 0 8.2 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.86-2.86.06-.06A1.7 1.7 0 0 0 3.8 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2V9.6h.1A1.7 1.7 0 0 0 3.8 8.2a1.7 1.7 0 0 0-.34-1.88l-.06-.06L6.26 3.4l.06.06A1.7 1.7 0 0 0 8.2 3.8a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2h4v.1a1.7 1.7 0 0 0 1.4 1.7 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.86 2.86-.06.06A1.7 1.7 0 0 0 19.4 8.2a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4h.1v4h-.1a1.7 1.7 0 0 0-1.7 1.4Z',
    expense:'M12 4v16m0 0 6-6m-6 6-6-6',
    income:'M12 20V4m0 0 6 6m-6-6-6 6',
    wallet:'M4 7.5h14a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h11v3.5M16 13h4',
    up:'M7 17 17 7m0 0h-7m7 0v7',
    down:'M17 7 7 17m0 0h7m-7 0v-7',
    swap:'M7 7h12m0 0-3-3m3 3-3 3M17 17H5m0 0 3 3m-3-3 3-3'
  };

  topbar=function(){
    const logo=(typeof NADMO_LOGO!=='undefined'&&NADMO_LOGO)?`<div class="nadmo-logo-wrap"><img class="nadmo-logo" src="${NADMO_LOGO}" alt="NADMO AI"></div>`:'';
    return `<div class="topbar"><div class="nadmo-brand">${logo}<div class="brand-copy"><div class="brand-title">NADMO AI <span class="pro-badge">PRO</span></div><div class="brand-sub">Private Finance Intelligence</div></div></div><button class="iconbtn" aria-label="Pengaturan" onclick="go('settings')">${svg(icons.settings)}</button></div>`;
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

  if(typeof home==='function'){
    const baseHome=home;
    home=async function(){
      let html=await baseHome();
      html=html.replace('<div style="margin:4px 2px 14px"><div class="muted small">Selamat Datang di</div><div style="font-size:25px;font-weight:900">NADMO AI</div></div>','<div class="home-intro"><div class="home-kicker">Financial overview</div><div class="home-title">Ringkasan Keuangan</div></div>');
      html=html.replace('<div class="section-title"><span>NADMO AI</span><span class="muted small">Natural input</span></div>','<div class="section-title"><span>Smart Entry</span><span class="muted small">Tulis seperti biasa</span></div>');
      html=html.replace('Buat Draft Transaksi','Analisis Transaksi');
      return html;
    };
  }

  if(typeof settings==='function'){
    const baseSettings=settings;
    settings=async function(){
      let html=await baseSettings();
      const about=`<div class="section-title"><span>Tentang NADMO AI</span></div>
      <div class="card release-card"><div class="release-row"><div><div class="release-name">NADMO AI</div><div class="privacy-note">Personal finance intelligence yang menyimpan data utama secara lokal di perangkat.</div></div><div class="release-version">v1.1 PRO</div></div></div>`;
      html=html.replace('<div class="section-title"><span>Data & Backup</span></div>',about+'<div class="section-title"><span>Data & Backup</span></div>');
      return html;
    };
  }

  document.documentElement.dataset.nadmoEdition='pro';
  setTimeout(()=>{if(typeof render==='function')render()},0);
})();
let data = JSON.parse(localStorage.getItem('dyllBinder')) || { transactions: [], theme: 'light', accent: '#4CAF50', text: '#333333' };

const el = id => document.getElementById(id);
const saldoEl = el('saldo'), pemasukanEl = el('pemasukan'), pengeluaranEl = el('pengeluaran');
const listEl = el('listCatatan');

function init() {
    document.documentElement.setAttribute('data-theme', data.theme);
    document.documentElement.style.setProperty('--accent', data.accent);
    document.documentElement.style.setProperty('--text', data.text);
    el('warnaAksen').value = data.accent;
    el('warnaTeks').value = data.text;
    render();
}

function render() {
    let masuk = 0, keluar = 0;
    listEl.innerHTML = '';
    
    data.transactions.forEach(t => {
        if (t.tipe === 'masuk') masuk += t.jumlah;
        else keluar += t.jumlah;
        
        const li = document.createElement('li');
        li.innerHTML = `<span>${t.catatan} (${t.kategori})</span><span>Rp ${t.jumlah.toLocaleString()}</span>`;
        listEl.appendChild(li);
    });

    saldoEl.textContent = `Rp ${(masuk - keluar).toLocaleString()}`;
    pemasukanEl.textContent = `Rp ${masuk.toLocaleString()}`;
    pengeluaranEl.textContent = `Rp ${keluar.toLocaleString()}`;
}

function save() { localStorage.setItem('dyllBinder', JSON.stringify(data)); }

el('btnTambah').onclick = () => {
    const catatan = el('catatan').value || 'Tanpa Judul';
    const jumlah = parseInt(el('jumlah').value) || 0;
    const tipe = el('tipe').value;
    const kategori = el('kategori').value;

    if (jumlah > 0) {
        data.transactions.unshift({ catatan, jumlah, tipe, kategori });
        save(); render();
        el('catatan').value = ''; el('jumlah').value = '';
    }
};

el('btnTema').onclick = () => {
    data.theme = data.theme === 'light' ? 'dark' : 'light';
    init(); save();
};

el('warnaAksen').oninput = (e) => { data.accent = e.target.value; init(); save(); };
el('warnaTeks').oninput = (e) => { data.text = e.target.value; init(); save(); };

el('btnEkspor').onclick = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dyll_binder_backup.json';
    a.click();
};

el('btnImpor').onclick = () => el('fileImpor').click();
el('fileImpor').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            data = JSON.parse(ev.target.result);
            save(); init();
        } catch (err) { alert('File tidak valid!'); }
    };
    reader.readAsText(e.target.files[0]);
};

el('btnHapus').onclick = () => {
    if (confirm('Hapus semua data?')) {
        data.transactions = [];
        save(); render();
    }
};

init();
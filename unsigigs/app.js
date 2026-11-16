let currentUser = null;
let activeTab = 'all';
let selectedGigForOrder = null;
let gigs = [];

async function loadGigs() {
    try {
        const res = await fetch('api.php?action=gigs');
        if (res.ok) {
            const json = await res.json();
            if (json.status === 'success' && Array.isArray(json.data)) {
                gigs = json.data;
            }
        }
    } catch (e) {
        gigs = [];
    }
    renderGigs();
}

function renderGigs() {
    const grid = document.getElementById('gigsGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    const searchVal = searchInput ? searchInput.value.toLowerCase() : '';
    const catVal = categoryFilter ? categoryFilter.value : 'all';
    
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = gigs.filter(g => {
        const matchTab = (activeTab === 'all' || g.category === activeTab);
        const matchCat = (catVal === 'all' || g.category === catVal);
        const searchTxt = (g.title + ' ' + g.desc + ' ' + g.provider).toLowerCase();
        const matchSearch = searchTxt.includes(searchVal);
        return matchTab && matchCat && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state">Belum ada jasa yang tersedia. Silakan pasang jasa terlebih dahulu.</div>`;
        return;
    }

    filtered.forEach(g => {
        grid.innerHTML += `
            <div class="card">
                <div>
                    <div class="card-top">
                        <span class="pill">${g.category}</span>
                        <span class="rating">★ ${g.rating || '5.0'} (${g.orders || 0})</span>
                    </div>
                    <h3 class="card-title">${g.title}</h3>
                    <p class="card-desc">${g.desc}</p>
                </div>
                <div class="card-foot">
                    <div>
                        <span class="price-label">Tarif</span>
                        <span class="price-val">Rp ${Number(g.price).toLocaleString('id-ID')}</span>
                    </div>
                    <button onclick="openOrderModal(${g.id})" class="btn btn-white">Pesan</button>
                </div>
            </div>
        `;
    });
}

function setTab(tab) {
    activeTab = tab;
    ['all', 'U-Ride', 'U-Food', 'U-Help', 'U-Design', 'Les Privat'].forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        if (btn) btn.className = (t === tab) ? "tab active" : "tab";
    });
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = tab;
    }
    renderGigs();
}

function filterGigs() { 
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        activeTab = categoryFilter.value;
        ['all', 'U-Ride', 'U-Food', 'U-Help', 'U-Design', 'Les Privat'].forEach(t => {
            const btn = document.getElementById(`tab-${t}`);
            if (btn) btn.className = (t === activeTab) ? "tab active" : "tab";
        });
    }
    renderGigs(); 
}

function openAuthModal() { document.getElementById('authModal').classList.remove('hidden'); }
function closeAuthModal() { document.getElementById('authModal').classList.add('hidden'); }
function fillDemoUser() {
    document.getElementById('loginName').value = "Fahmi Mubaroq";
    document.getElementById('loginEmail').value = "2510631170034@student.unsika.ac.id";
}

async function handleLogin(e) {
    e.preventDefault();
    const name = document.getElementById('loginName').value.trim();
    const email = document.getElementById('loginEmail').value.trim();
    if (!email.includes('@unsika.ac.id')) {
        alert('Gunakan email resmi kampus (@unsika.ac.id)!');
        return;
    }
    let userId = 1;
    try {
        const res = await fetch('api.php?action=auth', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name, email}) });
        const data = await res.json();
        if (data.status === 'success') userId = data.user.id;
    } catch(e) {}
    currentUser = { id: userId, name, email };
    closeAuthModal();
    document.getElementById('authContainer').innerHTML = `
        <div class="user-chip">
            <div class="user-info">
                <strong>${currentUser.name}</strong><br>
                <span class="text-lime">Terverifikasi @unsika.ac.id</span>
            </div>
            <div class="avatar">${currentUser.name.charAt(0)}</div>
        </div>
    `;
    alert(`Berhasil masuk! Selamat datang ${currentUser.name}.`);
}

function openOrderModal(id) {
    const gig = gigs.find(g => g.id === id);
    if (!gig) return;
    selectedGigForOrder = gig;
    document.getElementById('orderCategoryBadge').innerText = gig.category;
    document.getElementById('orderTitle').innerText = gig.title;
    document.getElementById('orderProvider').innerText = `Oleh: ${gig.provider} (NPM: ${gig.npm || '-'})`;
    document.getElementById('orderBasePrice').innerText = `Rp ${Number(gig.price).toLocaleString('id-ID')}`;
    document.getElementById('orderTotalPrice').innerText = `Rp ${(Number(gig.price) + 1000).toLocaleString('id-ID')}`;
    document.getElementById('orderModal').classList.remove('hidden');
}

function closeOrderModal() { document.getElementById('orderModal').classList.add('hidden'); }

async function submitOrder(e) {
    e.preventDefault();
    if (!currentUser) {
        closeOrderModal();
        openAuthModal();
        alert('Silakan login terlebih dahulu.');
        return;
    }
    const notes = document.getElementById('orderNotes').value;
    const payment = document.getElementById('orderPayment').value;
    const total = Number(selectedGigForOrder.price) + 1000;
    try {
        await fetch('api.php?action=orders', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ gig_id: selectedGigForOrder.id, client_id: currentUser.id, notes, payment, base_price: selectedGigForOrder.price }) });
    } catch(e) {}
    const waMsg = `Halo ${selectedGigForOrder.provider}, saya ${currentUser.name} memesan "${selectedGigForOrder.title}".%0A%0ACatatan: ${notes}%0AMetode: ${payment}%0ATotal: Rp ${total.toLocaleString('id-ID')}`;
    window.open(`https://wa.me/${selectedGigForOrder.whatsapp}?text=${waMsg}`, '_blank');
    closeOrderModal();
    alert('Pesanan dicatat! Dialihkan ke WhatsApp penyedia jasa.');
}

function openPostModal() {
    if (!currentUser) {
        openAuthModal();
        alert('Silakan login terlebih dahulu.');
        return;
    }
    document.getElementById('postModal').classList.remove('hidden');
}

function closePostModal() { document.getElementById('postModal').classList.add('hidden'); }

async function handlePostGig(e) {
    e.preventDefault();
    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const price = parseInt(document.getElementById('postPrice').value);
    const desc = document.getElementById('postDesc').value;
    const whatsapp = document.getElementById('postWa').value;
    try {
        const res = await fetch('api.php?action=gigs', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({ user_id: currentUser.id, title, category, price, desc, whatsapp }) 
        });
        const json = await res.json();
        if (json.status !== 'success') {
            alert('Gagal mempublikasikan jasa: ' + (json.message || 'Kesalahan server'));
            return;
        }
    } catch(e) {
        alert('Gagal terhubung ke server.');
        return;
    }
    loadGigs();
    closePostModal();
    alert('Jasa berhasil dipublikasikan!');
}

loadGigs();
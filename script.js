/* ═══════════════════════════════════════════════
   LOST & FOUND SYSTEM — Shared JavaScript
   ═══════════════════════════════════════════════ */

/* ══════════════════════════════════
   MOBILE NAV TOGGLE
══════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('nav-toggle');
    const nav    = document.getElementById('main-nav');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('open');
        });
        // Close nav when a link is clicked
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => nav.classList.remove('open'));
        });
    }

    // Mark the active nav link based on current page filename
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#main-nav a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === page) a.classList.add('active');
    });

    // Default date for report form
    const dateInput = document.getElementById('r-date');
    if (dateInput) dateInput.valueAsDate = new Date();
});

/* ══════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════ */
function showToast(msg, bg = '#1a7d47') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.background = bg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ══════════════════════════════════
   ITEM DETAIL MODAL
══════════════════════════════════ */
function openModal(name, type, loc, date, desc, img) {
    document.getElementById('modal-img').src   = img;
    document.getElementById('modal-title').textContent = name;
    document.getElementById('modal-loc').textContent   = '📍 Location: ' + loc;
    document.getElementById('modal-date').textContent  = '📅 Date: ' + date;
    document.getElementById('modal-desc').textContent  = desc;

    const badge = document.getElementById('modal-badge');
    badge.textContent = type === 'lost' ? 'Lost' : 'Found';
    badge.className   = 'badge ' + (type === 'lost' ? 'badge-lost' : 'badge-found');

    document.getElementById('modal-overlay').classList.add('open');
}

function closeModal(e) {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    if (!e || e.target === overlay) overlay.classList.remove('open');
}

function claimItem() {
    document.getElementById('modal-overlay').classList.remove('open');
    showToast('📬 Please fill the contact form to reach the reporter.');
    setTimeout(() => { window.location.href = 'contact.html'; }, 800);
}

// Close modal on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

/* ══════════════════════════════════
   REPORT TYPE TOGGLE
══════════════════════════════════ */
let reportType = 'lost';

function setType(t) {
    reportType = t;
    const btnLost  = document.getElementById('btn-lost');
    const btnFound = document.getElementById('btn-found');
    if (btnLost)  btnLost.className  = 'type-btn' + (t === 'lost'  ? ' selected-lost'  : '');
    if (btnFound) btnFound.className = 'type-btn' + (t === 'found' ? ' selected-found' : '');
}

/* ══════════════════════════════════
   SUBMIT REPORT FORM
══════════════════════════════════ */
function submitReport() {
    const name = document.getElementById('r-name')?.value.trim();
    const loc  = document.getElementById('r-location')?.value.trim();
    const desc = document.getElementById('r-desc')?.value.trim();
    const con  = document.getElementById('r-contact')?.value.trim();

    if (!name || !loc || !desc || !con) {
        showToast('⚠️ Please fill all required fields.', '#c0392b');
        return;
    }
    showToast('✅ Report submitted successfully!', '#1a7d47');
    ['r-name', 'r-location', 'r-desc', 'r-contact'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    setType('lost'); // reset toggle
}

/* ══════════════════════════════════
   SUBMIT CONTACT FORM
══════════════════════════════════ */
function submitContact() {
    const name  = document.getElementById('c-name')?.value.trim();
    const email = document.getElementById('c-email')?.value.trim();
    const msg   = document.getElementById('c-message')?.value.trim();

    if (!name || !email || !msg) {
        showToast('⚠️ Please fill all required fields.', '#c0392b');
        return;
    }
    if (!email.includes('@')) {
        showToast('⚠️ Please enter a valid email address.', '#c0392b');
        return;
    }
    showToast("✅ Message sent! We'll get back to you soon.", '#1a7d47');
    ['c-name', 'c-email', 'c-message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

/* ══════════════════════════════════
   HERO SEARCH (index.html)
══════════════════════════════════ */
function heroSearch() {
    const q = document.getElementById('hero-search')?.value.trim();
    if (!q) { showToast('⚠️ Please enter a search term.', '#c0392b'); return; }
    // Redirect to lost.html with query param
    window.location.href = 'lost.html?q=' + encodeURIComponent(q);
}

// Support pressing Enter in hero search
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('hero-search');
    if (input) {
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') heroSearch();
        });
    }
});

/* ══════════════════════════════════
   FILTER / SEARCH ITEMS
══════════════════════════════════ */
function filterItems(type) {
    const searchInput = document.getElementById(type + '-search');
    const catSelect   = document.getElementById(type + '-category');
    const locSelect   = document.getElementById(type + '-location');
    const container   = document.getElementById(type + '-cards');

    if (!container) return;

    const query    = searchInput  ? searchInput.value.trim().toLowerCase()  : '';
    const category = catSelect    ? catSelect.value.toLowerCase()            : '';
    const location = locSelect    ? locSelect.value.toLowerCase()            : '';

    const cards = container.querySelectorAll('.card');
    let visible = 0;

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const matchQ   = !query    || text.includes(query);
        const matchCat = !category || text.includes(category);
        const matchLoc = !location || text.includes(location);

        if (matchQ && matchCat && matchLoc) {
            card.style.display = '';
            visible++;
        } else {
            card.style.display = 'none';
        }
    });

    // Empty state
    let emptyMsg = container.querySelector('.empty-state');
    if (visible === 0) {
        if (!emptyMsg) {
            emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-state';
            emptyMsg.innerHTML = '<span>🔍</span><p>No items match your search.</p>';
            container.appendChild(emptyMsg);
        }
    } else if (emptyMsg) {
        emptyMsg.remove();
    }

    showToast(`🔍 Showing ${visible} result${visible !== 1 ? 's' : ''}.`, '#333');
}

// Pre-fill search from URL query param (e.g. ?q=wallet)
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
        const input = document.getElementById('lost-search') || document.getElementById('found-search');
        if (input) {
            input.value = q;
            const type = document.getElementById('lost-search') ? 'lost' : 'found';
            filterItems(type);
        }
    }
});

/* ══════════════════════════════════
   COUNTER ANIMATION (index.html)
══════════════════════════════════ */
function animateCounters() {
    document.querySelectorAll('.stat .num').forEach(el => {
        const target = parseInt(el.getAttribute('data-target') || el.textContent, 10);
        el.textContent = '0';
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current;
            if (current >= target) clearInterval(timer);
        }, 18);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const statsStrip = document.querySelector('.stats-strip');
    if (!statsStrip) return;
    // Trigger when strip enters viewport
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateCounters();
            observer.disconnect();
        }
    }, { threshold: 0.3 });
    observer.observe(statsStrip);
});

import store from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const dashShell = document.getElementById('dashShell');

    // Open access (no auth required)
    if(dashShell) dashShell.style.display = 'flex';

    // Welcome banner
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const greetEl = document.getElementById('welcomeGreeting');
    if (greetEl) greetEl.innerHTML = `${greeting}, <em>welcome back.</em>`;
    const dateEl = document.getElementById('welcomeDate');
    if (dateEl) dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
    document.querySelectorAll('[data-goto]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(`.dash-nav a[data-view="${btn.dataset.goto}"]`)?.click();
        });
    });

    // Label cells with their column header so rows can stack as cards on mobile
    document.querySelectorAll('.table-wrapper table').forEach(table => {
        const labels = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        const applyLabels = () => table.querySelectorAll('tbody tr').forEach(tr => {
            Array.from(tr.children).forEach((td, i) => {
                if (td.colSpan > 1) td.classList.add('td-empty');
                else td.dataset.label = labels[i] || '';
            });
        });
        new MutationObserver(applyLabels).observe(table.querySelector('tbody'), { childList: true });
        applyLabels();
    });

    // Sidebar navigation
    const navLinks = document.querySelectorAll('.dash-nav a[data-view]');
    const views = document.querySelectorAll('.view-panel');
    const pageTitle = document.getElementById('pageTitle');
    const sidebar = document.getElementById('sidebar');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.dataset.view;
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            views.forEach(v => {
                if(v.id === `view-${viewId}`) v.style.display = 'block';
                else v.style.display = 'none';
            });
            
            if(pageTitle) pageTitle.textContent = link.textContent.trim();
            if(window.innerWidth <= 1024) sidebar.classList.remove('open');
        });
    });

    // Mobile sidebar toggle
    document.getElementById('openSidebar')?.addEventListener('click', () => sidebar.classList.add('open'));
    document.getElementById('closeSidebar')?.addEventListener('click', () => sidebar.classList.remove('open'));

    // --- Overview Logic ---
    function renderOverview() {
        const appointments = store.get('appointments');
        const treatments = store.get('treatments');
        const experts = store.get('experts');

        document.getElementById('stat-total').textContent = appointments.length;
        const pending = appointments.filter(a => a.status === 'pending').length;
        const confirmed = appointments.filter(a => a.status === 'confirmed').length;
        document.getElementById('stat-status').textContent = `${pending} / ${confirmed}`;
        document.getElementById('stat-treatments').textContent = treatments.filter(t => t.status === 'published').length;
        document.getElementById('stat-experts').textContent = experts.filter(e => e.status === 'active').length;

        // Render simple charts (inline styles)
        const chartLine = document.getElementById('chartLine');
        if(chartLine) {
            chartLine.innerHTML = '';
            const heights = [20, 60, 40, 80, 50, 30]; // Fake data
            heights.forEach(h => {
                const bar = document.createElement('div');
                bar.style.width = '30px';
                bar.style.height = `${h}%`;
                bar.style.background = 'var(--clr-primary)';
                bar.style.borderRadius = '4px 4px 0 0';
                bar.style.flex = '1';
                chartLine.appendChild(bar);
            });
        }

        const chartBar = document.getElementById('chartBar');
        if(chartBar) {
            chartBar.innerHTML = '';
            const statuses = [
                { s: 'Pending', h: (pending/appointments.length*100)||10, c: '#eab308' },
                { s: 'Confirmed', h: (confirmed/appointments.length*100)||10, c: 'var(--clr-primary)' },
                { s: 'Completed', h: 30, c: 'var(--clr-success)' }
            ];
            statuses.forEach(st => {
                const col = document.createElement('div');
                col.className = 'flex flex-col items-center gap-2';
                col.style.height = '100%';
                col.style.justifyContent = 'flex-end';
                const bar = document.createElement('div');
                bar.style.width = '40px';
                bar.style.height = `${Math.max(st.h, 5) * 0.85}%`;
                bar.style.background = st.c;
                bar.style.borderRadius = '4px 4px 0 0';
                const lbl = document.createElement('span');
                lbl.className = 'text-xs text-light';
                lbl.textContent = st.s;
                col.appendChild(bar);
                col.appendChild(lbl);
                chartBar.appendChild(col);
            });
        }
    }

    document.getElementById('resetDemoBtn')?.addEventListener('click', () => {
        if(confirm('Are you sure you want to reset all demo data?')) {
            store.reset();
            window.location.reload();
        }
    });

    // --- Treatments Logic ---
    function renderTreatments() {
        const tbody = document.querySelector('#treatmentsTable tbody');
        if(!tbody) return;
        const treatments = store.get('treatments');
        const search = document.getElementById('searchTreatments').value.toLowerCase();
        const cat = document.getElementById('filterCategory').value;

        tbody.innerHTML = '';
        const filtered = treatments.filter(t => 
            (cat === 'all' || t.category === cat) &&
            t.name.toLowerCase().includes(search)
        );

        if(filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-light py-4">No treatments found.</td></tr>`;
            return;
        }

        filtered.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${t.name}</strong></td>
                <td><span class="badge" style="font-size:0.7rem;">${t.category}</span></td>
                <td>$${t.priceMin} - $${t.priceMax}</td>
                <td><span style="color: ${t.status==='published' ? 'var(--clr-success)' : 'var(--clr-text-light)'}">${t.status}</span></td>
                <td>
                    <button class="btn btn-outline edit-treatment" data-id="${t.id}" style="padding: 4px 8px; font-size: 0.8rem;">Edit</button>
                    <button class="btn btn-outline text-error del-treatment" data-id="${t.id}" style="padding: 4px 8px; font-size: 0.8rem; border-color: var(--clr-error); color: var(--clr-error);">Del</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.del-treatment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if(confirm('Delete this treatment?')) {
                    const id = e.target.dataset.id;
                    const newData = treatments.filter(x => x.id !== id);
                    store.set('treatments', newData);
                    renderTreatments();
                }
            });
        });
        
        document.querySelectorAll('.edit-treatment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                alert('Edit modal placeholder - In a full build, this opens a pre-filled form modal.');
            });
        });
    }

    document.getElementById('searchTreatments')?.addEventListener('input', renderTreatments);
    document.getElementById('filterCategory')?.addEventListener('change', renderTreatments);
    document.getElementById('addTreatmentBtn')?.addEventListener('click', () => {
        alert('Add Treatment modal placeholder. Validates form and saves to store.');
    });

    // --- Experts Logic ---
    function renderExperts() {
        const tbody = document.querySelector('#expertsTable tbody');
        if(!tbody) return;
        const experts = store.get('experts');
        const search = document.getElementById('searchExperts').value.toLowerCase();

        tbody.innerHTML = '';
        const filtered = experts.filter(e => e.name.toLowerCase().includes(search));

        if(filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-light py-4">No experts found.</td></tr>`;
            return;
        }

        filtered.forEach(e => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${e.name}</strong></td>
                <td>${e.role}</td>
                <td>$${e.fee}</td>
                <td><span style="color: ${e.status==='active' ? 'var(--clr-success)' : 'var(--clr-text-light)'}">${e.status}</span></td>
                <td>
                    <button class="btn btn-outline edit-expert" data-id="${e.id}" style="padding: 4px 8px; font-size: 0.8rem;">Edit</button>
                    <button class="btn btn-outline text-error del-expert" data-id="${e.id}" style="padding: 4px 8px; font-size: 0.8rem; border-color: var(--clr-error); color: var(--clr-error);">Del</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.del-expert').forEach(btn => {
            btn.addEventListener('click', (ev) => {
                if(confirm('Delete this expert?')) {
                    const id = ev.target.dataset.id;
                    const newData = experts.filter(x => x.id !== id);
                    store.set('experts', newData);
                    renderExperts();
                }
            });
        });
        
        document.querySelectorAll('.edit-expert').forEach(btn => {
            btn.addEventListener('click', () => alert('Edit expert modal placeholder.'));
        });
    }

    document.getElementById('searchExperts')?.addEventListener('input', renderExperts);
    document.getElementById('addExpertBtn')?.addEventListener('click', () => alert('Add Expert modal placeholder.'));

    // --- Appointments Logic ---
    function renderAppointments() {
        const tbody = document.querySelector('#appointmentsTable tbody');
        if(!tbody) return;
        const appointments = store.get('appointments');
        const treatments = store.get('treatments');
        const experts = store.get('experts');
        const search = document.getElementById('searchAppt').value.toLowerCase();
        const stat = document.getElementById('filterApptStatus').value;

        tbody.innerHTML = '';
        const filtered = appointments.filter(a => {
            const matchSearch = a.reference.toLowerCase().includes(search) || a.clientName.toLowerCase().includes(search);
            const matchStat = (stat === 'all' || a.status === stat);
            return matchSearch && matchStat;
        });

        if(filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-light py-4">No appointments found.</td></tr>`;
            return;
        }

        filtered.forEach(a => {
            const tr = document.createElement('tr');
            const t = treatments.find(x => x.id === a.treatmentId);
            const e = experts.find(x => x.id === a.expertId);
            
            tr.innerHTML = `
                <td><span class="tabular-nums font-medium">${a.reference}</span></td>
                <td>${a.clientName}<br><span class="text-xs text-light">${a.clientEmail}</span></td>
                <td>${a.date} <span class="tabular-nums">${a.time}</span></td>
                <td>${t ? t.name : 'Unknown'}</td>
                <td>${e ? e.name : 'Any'}</td>
                <td>
                    <select class="status-select" data-id="${a.id}" style="padding: 4px; font-size: 0.8rem; width: 100px;">
                        <option value="pending" ${a.status==='pending'?'selected':''}>Pending</option>
                        <option value="confirmed" ${a.status==='confirmed'?'selected':''}>Confirmed</option>
                        <option value="completed" ${a.status==='completed'?'selected':''}>Completed</option>
                        <option value="cancelled" ${a.status==='cancelled'?'selected':''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.8rem;" onclick="alert('Appointment detail modal placeholder\\nNote: ${a.note}')">View</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.status-select').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const id = e.target.dataset.id;
                const newStatus = e.target.value;
                const appts = store.get('appointments');
                const idx = appts.findIndex(x => x.id === id);
                if(idx > -1) {
                    appts[idx].status = newStatus;
                    store.set('appointments', appts);
                    renderOverview(); // update stats
                }
            });
        });
    }

    document.getElementById('searchAppt')?.addEventListener('input', renderAppointments);
    document.getElementById('filterApptStatus')?.addEventListener('change', renderAppointments);

    // Initial render
    renderOverview();
    renderTreatments();
    renderExperts();
    renderAppointments();
});

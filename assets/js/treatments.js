import store from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('treatmentsGrid');
    const emptyState = document.getElementById('treatmentsEmpty');
    const searchInput = document.getElementById('treatmentSearch');
    const sortSelect = document.getElementById('treatmentSort');
    const tabs = document.querySelectorAll('#treatmentTabs .tab-btn');
    const resetBtn = document.getElementById('resetTreatmentsBtn');
    
    if (!grid) return;

    let currentFilter = 'all';

    function renderTreatments() {
        const query = searchInput.value.toLowerCase();
        const sort = sortSelect.value;
        const treatments = store.get('treatments').filter(t => t.status === 'published');

        let filtered = treatments.filter(t => {
            const matchFilter = currentFilter === 'all' || t.category === currentFilter;
            const matchQuery = t.name.toLowerCase().includes(query) || t.shortDesc.toLowerCase().includes(query);
            return matchFilter && matchQuery;
        });

        if (sort === 'featured') {
            filtered.sort((a, b) => (b.featured === true) - (a.featured === true));
        } else if (sort === 'price-low') {
            filtered.sort((a, b) => a.priceMin - b.priceMin);
        } else if (sort === 'price-high') {
            filtered.sort((a, b) => b.priceMin - a.priceMin);
        } else if (sort === 'duration') {
            filtered.sort((a, b) => a.duration - b.duration);
        }

        grid.innerHTML = '';
        if (filtered.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            grid.style.display = 'grid';
            emptyState.style.display = 'none';
            filtered.forEach(t => {
                const card = document.createElement('div');
                card.className = 'card card-hover t-card';
                card.innerHTML = `
                    <div class="t-media">
                        <img src="${t.image}" alt="${t.name}" class="card-img" loading="lazy">
                        <span class="badge">${t.category}</span>
                        ${t.featured ? '<span class="badge badge-featured">Featured</span>' : ''}
                    </div>
                    <div class="t-body">
                        <h3>${t.name}</h3>
                        <p class="t-desc">${t.shortDesc}</p>
                        <div class="t-meta">
                            <div><small>Duration</small><span>${t.duration} min</span></div>
                            <div><small>Downtime</small><span>${t.downtimeLevel}</span></div>
                            <div><small>From (demo)</small><span>$${t.priceMin}</span></div>
                        </div>
                        <button class="btn btn-outline w-100 view-treatment-btn" data-id="${t.id}">View details <i class="ph ph-arrow-right"></i></button>
                    </div>
                `;
                grid.appendChild(card);
            });

            document.querySelectorAll('.view-treatment-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    openTreatmentModal(e.currentTarget.dataset.id);
                });
            });
        }
    }

    function openTreatmentModal(id) {
        const t = store.get('treatments').find(x => x.id === id);
        if (!t) return;
        
        document.getElementById('tmImage').src = t.image;
        document.getElementById('tmImage').alt = t.name;
        document.getElementById('tmCategory').textContent = t.category;
        document.getElementById('tmTitle').textContent = t.name;
        document.getElementById('tmShortDesc').textContent = t.shortDesc;
        document.getElementById('tmDuration').textContent = t.duration;
        document.getElementById('tmPrice').textContent = `$${t.priceMin} - $${t.priceMax}`;
        document.getElementById('tmDowntime').textContent = t.downtimeLevel;
        
        document.getElementById('tmLongDesc').textContent = t.longDesc;
        document.getElementById('tmSuitable').textContent = t.suitableFor;
        document.getElementById('tmSideEffects').textContent = t.sideEffects;
        document.getElementById('tmConsiderations').textContent = t.considerations;

        // Find experts offering this
        const expertList = document.getElementById('tmExpertList');
        expertList.innerHTML = '';
        const experts = store.get('experts').filter(e => e.status === 'active' && e.treatments.includes(id));
        
        if (experts.length > 0) {
            experts.forEach(e => {
                const el = document.createElement('div');
                el.className = 'flex justify-between items-center bg-surface-alt p-3 rounded border';
                el.style.background = 'var(--clr-surface-alt)';
                el.style.padding = 'var(--space-3)';
                el.style.borderRadius = 'var(--radius-sm)';
                el.style.border = '1px solid var(--clr-border)';
                el.innerHTML = `
                    <div class="flex items-center gap-3">
                        <img src="${e.image}" alt="${e.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                        <div>
                            <div class="font-medium">${e.name}</div>
                            <div class="text-xs text-light">${e.role}</div>
                        </div>
                    </div>
                    <button class="btn btn-outline book-expert-btn" data-eid="${e.id}" data-tid="${t.id}" style="padding: 4px 12px; font-size: 0.875rem;">Book This</button>
                `;
                expertList.appendChild(el);
            });
            
            document.querySelectorAll('.book-expert-btn').forEach(btn => {
                btn.addEventListener('click', (ev) => {
                    window.closeModal('treatmentModal');
                    // Prepare booking state
                    sessionStorage.setItem('prefill_treatment', ev.target.dataset.tid);
                    sessionStorage.setItem('prefill_expert', ev.target.dataset.eid);
                    window.location.hash = '#booking';
                    window.dispatchEvent(new Event('hashchange'));
                });
            });
        } else {
            expertList.innerHTML = '<p class="text-light">No specific expert assigned. Any available expert can perform this.</p>';
        }
        
        // Reset tabs
        document.querySelectorAll('#tmTabs .tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('#tmTabs .tab-btn').classList.add('active');
        document.querySelectorAll('#treatmentModal .tab-pane').forEach(p => p.classList.remove('active'));
        document.getElementById('tmOverview').classList.add('active');

        window.openModal('treatmentModal');
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTreatments();
        });
    });

    searchInput.addEventListener('input', renderTreatments);
    sortSelect.addEventListener('change', renderTreatments);
    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        sortSelect.value = 'featured';
        currentFilter = 'all';
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelector('#treatmentTabs .tab-btn[data-filter="all"]').classList.add('active');
        renderTreatments();
    });

    renderTreatments();
});

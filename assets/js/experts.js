import store from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('expertsGrid');
    const filter = document.getElementById('expertSpecialtyFilter');
    if (!grid) return;

    function renderSpecialties() {
        const experts = store.get('experts').filter(e => e.status === 'active');
        const specs = new Set();
        experts.forEach(e => e.specialties.forEach(s => specs.add(s)));
        
        filter.innerHTML = '<option value="all">All Specialties</option>';
        Array.from(specs).sort().forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s;
            filter.appendChild(opt);
        });
    }

    function renderExperts() {
        const val = filter.value;
        const experts = store.get('experts').filter(e => e.status === 'active');
        
        const filtered = val === 'all' ? experts : experts.filter(e => e.specialties.includes(val));
        
        grid.innerHTML = '';
        filtered.forEach(e => {
            const card = document.createElement('div');
            card.className = 'card card-hover expert-card';
            card.innerHTML = `
                <div class="e-media"><img src="${e.image}" alt="${e.name}" loading="lazy"></div>
                <div class="e-body">
                    <h3>${e.name}</h3>
                    <p class="e-role">${e.role}</p>
                    <p class="e-cred">${e.credentials}</p>
                    <div class="chip-row">
                        ${e.specialties.slice(0, 3).map(s => `<span class="chip">${s}</span>`).join('')}
                    </div>
                    <button class="btn btn-outline w-100 view-expert-btn" data-id="${e.id}">View profile <i class="ph ph-arrow-right"></i></button>
                </div>
            `;
            grid.appendChild(card);
        });

        document.querySelectorAll('.view-expert-btn').forEach(btn => {
            btn.addEventListener('click', (ev) => {
                openExpertModal(ev.currentTarget.dataset.id);
            });
        });
    }

    function openExpertModal(id) {
        const e = store.get('experts').find(x => x.id === id);
        if (!e) return;

        document.getElementById('emImage').src = e.image;
        document.getElementById('emImage').alt = e.name;
        document.getElementById('emTitle').textContent = e.name;
        document.getElementById('emRole').textContent = e.role;
        document.getElementById('emCredentials').textContent = e.credentials;
        document.getElementById('emYears').textContent = e.years;
        document.getElementById('emLanguages').textContent = e.languages;
        document.getElementById('emSpecialties').textContent = e.specialties.join(', ');
        document.getElementById('emBio').textContent = e.bio;
        
        const trList = document.getElementById('emTreatments');
        trList.innerHTML = '';
        const treatments = store.get('treatments');
        e.treatments.forEach(tid => {
            const t = treatments.find(x => x.id === tid);
            if(t) {
                const li = document.createElement('li');
                li.textContent = t.name;
                trList.appendChild(li);
            }
        });

        const bookBtn = document.getElementById('btnBookExpert');
        bookBtn.onclick = () => {
            window.closeModal('expertModal');
            sessionStorage.setItem('prefill_expert', e.id);
            window.location.hash = '#booking';
            window.dispatchEvent(new Event('hashchange'));
        };

        window.openModal('expertModal');
    }

    filter.addEventListener('change', renderExperts);

    renderSpecialties();
    renderExperts();
});

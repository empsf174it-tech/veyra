import store from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('galleryContainer');
    const filter = document.getElementById('galleryFilter');
    if (!container) return;

    function renderGallery() {
        const val = filter.value;
        const gallery = store.get('gallery');
        
        const filtered = val === 'all' ? gallery : gallery.filter(g => g.category === val);
        container.innerHTML = '';
        
        if(filtered.length === 0) {
            container.innerHTML = '<p class="text-light">No demo outcomes for this category.</p>';
            return;
        }

        filtered.forEach(g => {
            const wrapper = document.createElement('div');
            wrapper.style.width = '100%';
            wrapper.innerHTML = `
                <div class="flex justify-between items-end mb-2 px-4" style="max-width: 800px; margin: 0 auto;">
                    <div>
                        <span class="badge">${g.category}</span>
                        <div class="text-sm font-medium mt-1">Timeline: ${g.timeframe} | ${g.sessions}</div>
                    </div>
                </div>
                <div class="comparison-slider" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-label="Before and after comparison">
                    <img src="${g.beforeImage}" alt="Before treatment demo" class="comparison-before">
                    <img src="${g.afterImage}" alt="After treatment demo" class="comparison-after">
                    <span class="cmp-label cmp-label-before">Before</span>
                    <span class="cmp-label cmp-label-after">After</span>
                    <div class="slider-handle" aria-hidden="true"></div>
                </div>
            `;
            container.appendChild(wrapper);
            initSlider(wrapper.querySelector('.comparison-slider'));
        });
    }

    function initSlider(slider) {
        const afterImg = slider.querySelector('.comparison-after');
        const handle = slider.querySelector('.slider-handle');
        let isDown = false;

        function update(x) {
            const rect = slider.getBoundingClientRect();
            let pos = Math.max(0, Math.min(x - rect.left, rect.width));
            let pct = (pos / rect.width) * 100;
            afterImg.style.clipPath = `inset(0 0 0 ${pct}%)`;
            handle.style.left = `${pct}%`;
            slider.setAttribute('aria-valuenow', Math.round(pct));
        }

        slider.addEventListener('mousedown', (e) => { isDown = true; update(e.clientX); });
        window.addEventListener('mouseup', () => isDown = false);
        window.addEventListener('mousemove', (e) => { if(isDown) update(e.clientX); });
        
        slider.addEventListener('touchstart', (e) => { isDown = true; update(e.touches[0].clientX); });
        window.addEventListener('touchend', () => isDown = false);
        window.addEventListener('touchmove', (e) => { if(isDown) update(e.touches[0].clientX); });

        // Keyboard control
        slider.addEventListener('keydown', (e) => {
            let val = parseInt(slider.getAttribute('aria-valuenow'));
            if (e.key === 'ArrowLeft') val = Math.max(0, val - 5);
            else if (e.key === 'ArrowRight') val = Math.min(100, val + 5);
            else return;
            
            e.preventDefault();
            afterImg.style.clipPath = `inset(0 0 0 ${val}%)`;
            handle.style.left = `${val}%`;
            slider.setAttribute('aria-valuenow', val);
        });
    }

    filter.addEventListener('change', renderGallery);
    renderGallery();
});

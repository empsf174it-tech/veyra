import store from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.finder-step');
    if (steps.length === 0) return;

    const nextBtn = document.getElementById('finderNext');
    const prevBtn = document.getElementById('finderPrev');
    const restartBtn = document.getElementById('finderRestart');
    const progress = document.getElementById('finderProgressBar');
    const resultsArea = document.getElementById('finderResults');
    const questionsArea = document.getElementById('finderQuestions');
    
    let currentStep = 1;
    const totalSteps = steps.length;
    let answers = { concern: '', type: '', downtime: '' };

    // Select options
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const parent = e.target.closest('.options-grid');
            parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            e.target.classList.add('selected');
            
            const step = e.target.closest('.finder-step').dataset.step;
            document.getElementById(`finderErr${step}`).style.display = 'none';
        });
    });

    function updateView() {
        steps.forEach(s => {
            if (parseInt(s.dataset.step) === currentStep) s.classList.add('active');
            else s.classList.remove('active');
        });

        progress.style.width = `${((currentStep - 1) / totalSteps) * 100}%`;
        prevBtn.style.visibility = currentStep > 1 ? 'visible' : 'hidden';

        if (currentStep > totalSteps) {
            questionsArea.style.display = 'none';
            resultsArea.style.display = 'block';
            nextBtn.style.display = 'none';
            prevBtn.style.display = 'none';
            restartBtn.style.display = 'block';
            progress.style.width = '100%';
            generateResults();
        }
    }

    nextBtn.addEventListener('click', () => {
        const currentActive = document.querySelector(`.finder-step[data-step="${currentStep}"]`);
        const selected = currentActive.querySelector('.option-card.selected');
        
        if (!selected) {
            document.getElementById(`finderErr${currentStep}`).style.display = 'block';
            return;
        }

        if (currentStep === 1) answers.concern = selected.dataset.value;
        if (currentStep === 2) answers.type = selected.dataset.value;
        if (currentStep === 3) answers.downtime = selected.dataset.value;

        currentStep++;
        updateView();
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateView();
        }
    });

    restartBtn.addEventListener('click', () => {
        currentStep = 1;
        answers = { concern: '', type: '', downtime: '' };
        document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        questionsArea.style.display = 'block';
        resultsArea.style.display = 'none';
        nextBtn.style.display = 'block';
        restartBtn.style.display = 'none';
        updateView();
    });

    function generateResults() {
        const container = document.getElementById('finderSuggestions');
        container.innerHTML = '';
        
        const treatments = store.get('treatments');
        // Very basic demo ranking logic
        let ranked = treatments.map(t => {
            let score = 0;
            if (t.shortDesc.toLowerCase().includes(answers.concern) || t.longDesc.toLowerCase().includes(answers.concern)) score += 3;
            if (t.suitableFor.toLowerCase().includes(answers.type) || t.suitableFor.toLowerCase().includes('all')) score += 2;
            if (answers.downtime === 'none' && t.downtimeLevel.toLowerCase() === 'none') score += 2;
            if (answers.downtime === 'moderate' && t.downtimeLevel.toLowerCase() === 'moderate') score += 2;
            return { ...t, score };
        }).filter(t => t.score > 2).sort((a, b) => b.score - a.score).slice(0, 2);

        if (ranked.length === 0) {
            ranked = [treatments[0]]; // Fallback
        }

        ranked.forEach((t, i) => {
            const div = document.createElement('div');
            div.className = 'card flex items-center justify-between text-left';
            div.style.flexDirection = 'row';
            div.style.flexWrap = 'wrap';
            div.style.padding = 'var(--space-4)';
            div.innerHTML = `
                <div>
                    <div class="badge mb-2">${i === 0 ? 'Top Match' : 'Alternative'}</div>
                    <h4 class="mb-1">${t.name}</h4>
                    <p class="text-sm text-light mb-2">Because it is suitable for ${answers.type} skin and targets ${answers.concern}.</p>
                    <p class="text-xs"><strong>Suggested specialty:</strong> ${t.category}</p>
                </div>
                <button class="btn btn-primary btn-book-suggested" data-id="${t.id}" style="white-space: nowrap;">Book this</button>
            `;
            container.appendChild(div);
        });

        document.querySelectorAll('.btn-book-suggested').forEach(btn => {
            btn.addEventListener('click', (e) => {
                sessionStorage.setItem('prefill_treatment', e.target.dataset.id);
                window.location.hash = '#booking';
                window.dispatchEvent(new Event('hashchange'));
            });
        });
    }
});

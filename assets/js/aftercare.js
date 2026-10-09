document.addEventListener('DOMContentLoaded', () => {
    const checklist = document.getElementById('acChecklist');
    if (!checklist) return;

    // Load saved checklist state
    const userStr = localStorage.getItem('veyra_user');
    let prefix = 'guest';
    if (userStr) {
        const user = JSON.parse(userStr);
        prefix = user.email;
    }
    const storageKey = `veyra_aftercare_${prefix}`;

    let savedState = JSON.parse(localStorage.getItem(storageKey)) || {};

    const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (savedState[cb.value]) {
            cb.checked = true;
        }

        cb.addEventListener('change', () => {
            savedState[cb.value] = cb.checked;
            localStorage.setItem(storageKey, JSON.stringify(savedState));
        });
    });

    // Handle Auth changes (refresh state if logged in/out)
    window.addEventListener('storage', (e) => {
        if (e.key === 'veyra_user') {
            const newUserStr = localStorage.getItem('veyra_user');
            let newPrefix = 'guest';
            if (newUserStr) {
                const newUser = JSON.parse(newUserStr);
                newPrefix = newUser.email;
            }
            const newKey = `veyra_aftercare_${newPrefix}`;
            savedState = JSON.parse(localStorage.getItem(newKey)) || {};
            checkboxes.forEach(cb => {
                cb.checked = !!savedState[cb.value];
            });
        }
    });
});

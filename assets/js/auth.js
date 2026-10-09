document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabs = document.querySelectorAll('.auth-tab');
    const panes = document.querySelectorAll('.auth-pane');
    const switchLinks = document.querySelectorAll('.switch-tab');

    function switchTab(targetId) {
        tabs.forEach(t => {
            if (t.dataset.target === targetId) t.classList.add('active');
            else t.classList.remove('active');
        });
        panes.forEach(p => {
            if (p.id === targetId) p.classList.add('active');
            else p.classList.remove('active');
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.target));
    });

    switchLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(link.dataset.target);
        });
    });

    // Form Validation & Submission
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const adminEmail = 'admin@veyra.demo';

    function showError(inputId, errorId, show) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (!input || !error) return;
        if (show) {
            input.classList.add('error');
            input.classList.remove('success');
            error.style.display = 'block';
        } else {
            input.classList.remove('error');
            input.classList.add('success');
            error.style.display = 'none';
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('l_email').value.trim();
            const password = document.getElementById('l_password').value;
            let valid = true;

            if (!email || !/\S+@\S+\.\S+/.test(email)) {
                showError('l_email', 'err_l_email', true);
                valid = false;
            } else {
                showError('l_email', 'err_l_email', false);
            }

            if (!password) {
                showError('l_password', 'err_l_password', true);
                valid = false;
            } else {
                showError('l_password', 'err_l_password', false);
            }

            if (valid) {
                // Demo auth logic
                const role = (email === adminEmail) ? 'admin' : 'user';
                const user = { name: email.split('@')[0], email, role };
                localStorage.setItem('veyra_user', JSON.stringify(user));
                
                if (role === 'admin') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'index.html#booking';
                }
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('r_name').value.trim();
            const email = document.getElementById('r_email').value.trim();
            const pwd = document.getElementById('r_password').value;
            const confirm = document.getElementById('r_confirm').value;
            const terms = document.getElementById('r_terms').checked;
            let valid = true;

            if (!name) { showError('r_name', 'err_r_name', true); valid = false; }
            else { showError('r_name', 'err_r_name', false); }

            if (!email || !/\S+@\S+\.\S+/.test(email)) { showError('r_email', 'err_r_email', true); valid = false; }
            else { showError('r_email', 'err_r_email', false); }

            if (pwd.length < 8) { showError('r_password', 'err_r_password', true); valid = false; }
            else { showError('r_password', 'err_r_password', false); }

            if (pwd !== confirm) { showError('r_confirm', 'err_r_confirm', true); valid = false; }
            else { showError('r_confirm', 'err_r_confirm', false); }

            if (!terms) { document.getElementById('err_r_terms').style.display = 'block'; valid = false; }
            else { document.getElementById('err_r_terms').style.display = 'none'; }

            if (valid) {
                // Demo register logic
                const user = { name, email, role: 'user' };
                localStorage.setItem('veyra_user', JSON.stringify(user));
                window.location.href = 'index.html#booking';
            }
        });
    }
});

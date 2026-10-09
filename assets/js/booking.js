import store from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const bookingSection = document.getElementById('booking');
    if (!bookingSection) return;

    const guestState = document.getElementById('bookingGuestState');
    const authArea = document.getElementById('bookingAuthArea');
    const steps = document.querySelectorAll('.booking-step');
    const btnNext = document.getElementById('b_next');
    const btnPrev = document.getElementById('b_prev');
    const stepCount = document.getElementById('bookingStepCount');
    const stepTitle = document.getElementById('bookingStepTitle');
    const confirmation = document.getElementById('bookingConfirmation');
    const controls = document.getElementById('bookingControls');
    
    let user = null;
    let currentStep = 1;
    let bookingData = {
        treatment: '', mode: 'in-clinic', expert: '', date: '', time: '', phone: '', note: ''
    };

    function checkAuth() {
        const u = localStorage.getItem('veyra_user');
        if (u) {
            user = JSON.parse(u);
            guestState.style.display = 'none';
            authArea.style.display = 'block';
            initBookingForm();
            renderMyBookings();
        } else {
            guestState.style.display = 'block';
            authArea.style.display = 'none';
        }
    }

    function initBookingForm() {
        // Populate dropdowns
        const tSelect = document.getElementById('b_treatment');
        const eSelect = document.getElementById('b_expert');
        const treatments = store.get('treatments').filter(t => t.status === 'published');
        const experts = store.get('experts').filter(e => e.status === 'active');

        // Preserve "Not sure" default, then add options
        tSelect.innerHTML = '<option value="">Not sure, advise me</option>';
        treatments.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = `${t.name} ($${t.priceMin}+)`;
            tSelect.appendChild(opt);
        });

        eSelect.innerHTML = '<option value="">Any available expert</option>';
        experts.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.id;
            opt.textContent = `${e.name} (${e.role})`;
            eSelect.appendChild(opt);
        });

        // Prefill from session (finder/expert profile)
        const prefT = sessionStorage.getItem('prefill_treatment');
        if (prefT) { tSelect.value = prefT; sessionStorage.removeItem('prefill_treatment'); }
        const prefE = sessionStorage.getItem('prefill_expert');
        if (prefE) { eSelect.value = prefE; sessionStorage.removeItem('prefill_expert'); }

        initCalendar();
    }

    // -- Calendar Logic --
    let calDate = new Date(2026, 10, 1); // Nov 2026 for demo
    let selectedDateStr = null;

    function initCalendar() {
        renderCalendar();
        document.getElementById('calPrev').onclick = () => { calDate.setMonth(calDate.getMonth() - 1); renderCalendar(); };
        document.getElementById('calNext').onclick = () => { calDate.setMonth(calDate.getMonth() + 1); renderCalendar(); };
    }

    function renderCalendar() {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        document.getElementById('calMonthYear').textContent = `${monthNames[calDate.getMonth()]} ${calDate.getFullYear()}`;
        
        const grid = document.getElementById('calGrid');
        grid.innerHTML = '';
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(d => {
            const el = document.createElement('div');
            el.className = 'calendar-day-name';
            el.textContent = d;
            grid.appendChild(el);
        });

        const firstDay = new Date(calDate.getFullYear(), calDate.getMonth(), 1).getDay();
        const daysInMonth = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0).getDate();
        const today = new Date(2026, 9, 9); // mock today

        for (let i = 0; i < firstDay; i++) {
            grid.appendChild(document.createElement('div'));
        }

        const expId = document.getElementById('b_expert').value;
        const expert = expId ? store.get('experts').find(e => e.id === expId) : null;

        for (let i = 1; i <= daysInMonth; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-day';
            cell.textContent = i;
            
            const cellDateStr = `${calDate.getFullYear()}-${String(calDate.getMonth()+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
            const cellDateObj = new Date(calDate.getFullYear(), calDate.getMonth(), i);
            const dayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][cellDateObj.getDay()];
            
            let disabled = false;
            if (cellDateObj < today) disabled = true;
            if (expert) {
                if (expert.blockedDates.includes(cellDateStr)) disabled = true;
                if (!expert.availability[dayName]) disabled = true;
            }

            if (disabled) {
                cell.classList.add('disabled');
                cell.title = "Unavailable";
            } else {
                cell.tabIndex = 0;
                cell.setAttribute('role', 'button');
                if (selectedDateStr === cellDateStr) cell.classList.add('selected');
                
                const selectDate = () => {
                    document.querySelectorAll('.calendar-day').forEach(c => c.classList.remove('selected'));
                    cell.classList.add('selected');
                    selectedDateStr = cellDateStr;
                    bookingData.date = cellDateStr;
                    bookingData.time = '';
                    renderTimeSlots(dayName);
                };

                cell.onclick = selectDate;
                cell.onkeydown = (e) => { if(e.key === 'Enter' || e.key === ' ') selectDate(); };
            }
            grid.appendChild(cell);
        }
    }

    function renderTimeSlots(dayName) {
        document.querySelector('.time-slots-wrapper').style.display = 'block';
        const slotsGrid = document.getElementById('timeSlots');
        slotsGrid.innerHTML = '';
        
        const expId = document.getElementById('b_expert').value;
        let availableSlots = [];
        
        if (expId) {
            const expert = store.get('experts').find(e => e.id === expId);
            availableSlots = expert.availability[dayName] || [];
        } else {
            // Mock slots if "Any expert"
            availableSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
        }

        // Filter out already booked slots
        const appointments = store.get('appointments');
        const bookedForDate = appointments.filter(a => a.date === selectedDateStr && a.status !== 'cancelled');

        if (availableSlots.length === 0) {
            slotsGrid.innerHTML = '<p class="text-light" style="grid-column: 1/-1;">No slots available.</p>';
            return;
        }

        availableSlots.forEach(time => {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.textContent = time;
            
            const isBooked = bookedForDate.some(a => a.time === time && (expId ? a.expertId === expId : true));
            if (isBooked) {
                slot.classList.add('disabled');
                slot.title = "Already booked";
            } else {
                slot.tabIndex = 0;
                slot.setAttribute('role', 'button');
                slot.onclick = () => {
                    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                    slot.classList.add('selected');
                    bookingData.time = time;
                    document.getElementById('b_err_date').style.display = 'none';
                };
                slot.onkeydown = (e) => { if(e.key==='Enter'||e.key===' ') slot.onclick(); };
            }
            slotsGrid.appendChild(slot);
        });
    }

    document.getElementById('b_expert').addEventListener('change', () => {
        bookingData.time = '';
        document.querySelector('.time-slots-wrapper').style.display = 'none';
        renderCalendar();
    });

    // -- Step Navigation --
    const titles = ['1. Select Treatment', '2. Expert & Date', '3. Your Details', '4. Review & Confirm'];
    
    function updateSteps() {
        steps.forEach(s => {
            if (parseInt(s.dataset.step) === currentStep) s.style.display = 'block';
            else s.style.display = 'none';
        });
        stepCount.textContent = currentStep;
        stepTitle.textContent = titles[currentStep - 1];
        
        btnPrev.style.visibility = currentStep > 1 ? 'visible' : 'hidden';
        btnNext.textContent = currentStep === 4 ? 'Confirm Booking' : 'Next';

        // Prepare Review Step
        if (currentStep === 4) {
            const t = store.get('treatments').find(x => x.id === bookingData.treatment);
            const e = store.get('experts').find(x => x.id === bookingData.expert);
            document.getElementById('r_treatment').textContent = t ? t.name : 'Consultation / Advise Me';
            document.getElementById('r_expert').textContent = e ? e.name : 'Any Available';
            document.getElementById('r_mode').textContent = bookingData.mode === 'video' ? 'Video' : 'In-Clinic';
            document.getElementById('r_datetime').textContent = `${bookingData.date} at ${bookingData.time}`;
        }
    }

    btnNext.addEventListener('click', () => {
        if (currentStep === 1) {
            bookingData.treatment = document.getElementById('b_treatment').value;
            bookingData.mode = document.getElementById('b_mode').value;
        }
        else if (currentStep === 2) {
            bookingData.expert = document.getElementById('b_expert').value;
            if (!bookingData.date || !bookingData.time) {
                document.getElementById('b_err_date').style.display = 'block';
                return;
            }
        }
        else if (currentStep === 3) {
            const phone = document.getElementById('b_phone').value;
            const consent = document.getElementById('b_consent').checked;
            let valid = true;
            if (phone.length < 5) {
                document.getElementById('b_phone').classList.add('error');
                valid = false;
            } else document.getElementById('b_phone').classList.remove('error');
            
            if (!consent) {
                document.getElementById('b_err_consent').style.display = 'block';
                valid = false;
            } else document.getElementById('b_err_consent').style.display = 'none';
            
            if (!valid) return;
            bookingData.phone = phone;
            bookingData.note = document.getElementById('b_note').value;
        }
        else if (currentStep === 4) {
            submitBooking();
            return;
        }
        
        currentStep++;
        updateSteps();
    });

    btnPrev.addEventListener('click', () => {
        if (currentStep > 1) { currentStep--; updateSteps(); }
    });

    // Note counter
    const noteEl = document.getElementById('b_note');
    if (noteEl) {
        noteEl.addEventListener('input', () => {
            document.getElementById('b_note_count').textContent = noteEl.value.length;
        });
    }

    // -- Submission & Reset --
    let currentRef = '';
    function submitBooking() {
        currentRef = 'REF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const appts = store.get('appointments');
        appts.push({
            id: 'a_' + Date.now(),
            clientName: user.name,
            clientEmail: user.email,
            treatmentId: bookingData.treatment,
            expertId: bookingData.expert,
            mode: bookingData.mode,
            date: bookingData.date,
            time: bookingData.time,
            note: bookingData.note,
            reference: currentRef,
            status: 'pending'
        });
        store.set('appointments', appts);

        // UI switch
        document.getElementById('bookingSteps').style.display = 'none';
        controls.style.display = 'none';
        confirmation.style.display = 'block';
        document.getElementById('conf_ref').textContent = currentRef;
        document.getElementById('bookingStepTitle').parentElement.style.display = 'none';
        
        renderMyBookings();
    }

    document.getElementById('btnBookAnother')?.addEventListener('click', () => {
        currentStep = 1;
        bookingData = { treatment: '', mode: 'in-clinic', expert: '', date: '', time: '', phone: '', note: '' };
        document.getElementById('bookingSteps').style.display = 'block';
        controls.style.display = 'flex';
        confirmation.style.display = 'none';
        document.getElementById('bookingStepTitle').parentElement.style.display = 'flex';
        document.getElementById('b_consent').checked = false;
        document.getElementById('b_note').value = '';
        selectedDateStr = null;
        updateSteps();
        initBookingForm();
    });

    document.getElementById('btnAddToCal')?.addEventListener('click', () => {
        const calData = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Veyra Demo Consultation\nDTSTART:${bookingData.date.replace(/-/g,'')}T${bookingData.time.replace(':','')}00Z\nDESCRIPTION:Ref: ${currentRef}\nEND:VEVENT\nEND:VCALENDAR`;
        const blob = new Blob([calData], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `veyra_${currentRef}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // -- My Bookings Panel --
    function renderMyBookings() {
        const list = document.getElementById('myBookingsList');
        if (!list || !user) return;
        const appts = store.get('appointments').filter(a => a.clientEmail === user.email);
        
        list.innerHTML = '';
        if (appts.length === 0) {
            list.innerHTML = '<p class="text-light text-sm">No upcoming bookings.</p>';
            return;
        }

        appts.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(a => {
            const card = document.createElement('div');
            card.className = 'p-3 border rounded mb-3 bg-surface-alt flex flex-col gap-2';
            card.style.padding = 'var(--space-3)';
            card.style.border = '1px solid var(--clr-border)';
            card.style.borderRadius = 'var(--radius-sm)';
            card.style.marginBottom = 'var(--space-3)';
            card.style.background = 'var(--clr-surface-alt)';
            
            let statusColor = 'var(--clr-text-light)';
            if(a.status === 'confirmed') statusColor = 'var(--clr-success)';
            if(a.status === 'cancelled') statusColor = 'var(--clr-error)';

            card.innerHTML = `
                <div class="flex justify-between items-center">
                    <strong>${a.date} <span class="tabular-nums">${a.time}</span></strong>
                    <span class="badge" style="background:transparent; border:1px solid ${statusColor}; color:${statusColor}">${a.status}</span>
                </div>
                <div class="text-sm">Ref: <span class="tabular-nums">${a.reference}</span></div>
                ${a.status !== 'cancelled' && a.status !== 'completed' ? `<button class="btn btn-outline text-error cancel-btn w-100 mt-2" data-id="${a.id}" style="padding: 4px; font-size: 0.8rem; border-color: var(--clr-error); color: var(--clr-error);">Cancel Demo Booking</button>` : ''}
            `;
            list.appendChild(card);
        });

        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (confirm('Cancel this demo booking? The slot will become available again.')) {
                    const id = e.target.dataset.id;
                    const all = store.get('appointments');
                    const idx = all.findIndex(x => x.id === id);
                    if (idx > -1) {
                        all[idx].status = 'cancelled';
                        store.set('appointments', all);
                        renderMyBookings();
                        // re-render calendar if on step 2
                        if (currentStep === 2) renderCalendar();
                    }
                }
            });
        });
    }

    // Listen to hash changes for deep linking to booking with prefill
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '#booking' && user) {
            initBookingForm();
        }
    });

    checkAuth();
});

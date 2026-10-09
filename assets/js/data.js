// assets/js/data.js
const defaultData = {
    settings: {
        currency: 'USD',
        currencySymbol: '$'
    },
    treatments: [
        {
            id: 't1',
            name: 'HydraGlow Facial',
            category: 'facials',
            shortDesc: 'Deep cleansing and hydration for a radiant complexion.',
            longDesc: 'The HydraGlow Facial uses advanced vortex technology to gently extract impurities while infusing the skin with intense hydrating serums. Perfect for events or monthly maintenance.',
            duration: 45,
            downtimeLevel: 'None',
            suitableFor: 'All skin types',
            priceMin: 150,
            priceMax: 180,
            considerations: 'Avoid retinoids for 48 hours prior. Safe for pregnancy but inform your clinician.',
            sideEffects: 'Mild redness for 1-2 hours.',
            image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
            featured: true,
            status: 'published'
        },
        {
            id: 't2',
            name: 'Advanced Cellular Peel',
            category: 'peels',
            shortDesc: 'Medical-grade peel to target hyperpigmentation and texture.',
            longDesc: 'A controlled chemical exfoliation using a blend of AHA/BHA and brightening agents. It removes dead skin cells and stimulates collagen production for a smoother, more even tone.',
            duration: 30,
            downtimeLevel: 'Moderate',
            suitableFor: 'Oily, Combination, Normal',
            priceMin: 220,
            priceMax: 280,
            considerations: 'Must avoid direct sun exposure. Not suitable during pregnancy or for sensitive skin types.',
            sideEffects: 'Visible peeling for 3-5 days. Temporary redness and tightness.',
            image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
            featured: true,
            status: 'published'
        },
        {
            id: 't3',
            name: 'Laser Genesis',
            category: 'laser',
            shortDesc: 'Non-invasive laser to diffuse redness and boost collagen.',
            longDesc: 'Laser Genesis gently heats the upper dermis well below your skin\'s surface to stimulate collagen regrowth. Effectively treats fine lines, large pores, and uneven texture.',
            duration: 45,
            downtimeLevel: 'None',
            suitableFor: 'All skin types, including sensitive',
            priceMin: 350,
            priceMax: 450,
            considerations: 'Stop active skincare ingredients 3 days prior. Patch test recommended for darker skin tones.',
            sideEffects: 'Slight warmth and pinkness immediately after, fading quickly.',
            image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
            featured: false,
            status: 'published'
        },
        {
            id: 't4',
            name: 'Pro-Age Microneedling',
            category: 'anti-aging',
            shortDesc: 'Collagen induction therapy for firmness and scar reduction.',
            longDesc: 'Using ultra-fine sterile needles, this treatment creates micro-punctures to trigger the body\'s natural healing process. Excellent for acne scars, fine lines, and overall skin rejuvenation.',
            duration: 60,
            downtimeLevel: 'Moderate',
            suitableFor: 'All skin types except active acne',
            priceMin: 300,
            priceMax: 400,
            considerations: 'Cannot be performed on active acne breakouts. Professional consultation mandatory.',
            sideEffects: 'Redness similar to a sunburn for 24-48 hours. Mild flaking may occur.',
            image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
            featured: true,
            status: 'published'
        },
        {
            id: 't5',
            name: 'Barrier Repair Facial',
            category: 'facials',
            shortDesc: 'Calming ceramide therapy to soothe redness and dryness.',
            longDesc: 'A gentle, restorative facial built around ceramides, niacinamide and cooling LED to rebuild a compromised skin barrier. Ideal for reactive, dehydrated or over-exfoliated skin.',
            duration: 50,
            downtimeLevel: 'None',
            suitableFor: 'Dry, Sensitive, Redness-prone',
            priceMin: 130,
            priceMax: 160,
            considerations: 'Pause exfoliating acids for 48 hours prior. Suitable during pregnancy with clinician approval.',
            sideEffects: 'Rarely, brief flushing from LED that settles within an hour.',
            image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80',
            featured: false,
            status: 'published'
        },
        {
            id: 't6',
            name: 'Brightening Pigment Peel',
            category: 'peels',
            shortDesc: 'Targeted peel to fade dark spots and even skin tone.',
            longDesc: 'A layered mandelic and tranexamic acid peel designed to lift sun spots and post-blemish marks with less irritation than traditional peels. Best as a course of three sessions.',
            duration: 40,
            downtimeLevel: 'Moderate',
            suitableFor: 'Normal, Combination, Oily, Dark spots',
            priceMin: 240,
            priceMax: 300,
            considerations: 'Strict daily SPF required for 4 weeks. Not suitable during pregnancy.',
            sideEffects: 'Light flaking for 2-4 days and temporary darkening of spots before they fade.',
            image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80',
            featured: false,
            status: 'published'
        }
    ],
    experts: [
        {
            id: 'e1',
            name: 'Elena Rostova',
            role: 'Consulting Dermatologist',
            credentials: 'MD, FAAD (Demo)',
            years: 12,
            specialties: ['Acne', 'Anti-aging', 'Laser'],
            languages: 'English, Russian',
            bio: 'Elena specializes in complex skin concerns and advanced laser therapies. With over a decade of experience, she focuses on evidence-based, results-driven protocols.',
            fee: 150,
            treatments: ['t3', 't4'],
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
            availability: {
                'Monday': ['09:00', '10:00', '14:00', '15:00'],
                'Wednesday': ['10:00', '11:00', '16:00'],
                'Friday': ['09:00', '12:00']
            },
            blockedDates: ['2026-11-01', '2026-11-02'],
            status: 'active'
        },
        {
            id: 'e2',
            name: 'David Chen',
            role: 'Licensed Esthetician',
            credentials: 'LE (Demo)',
            years: 8,
            specialties: ['Facials', 'Peels', 'Hyperpigmentation'],
            languages: 'English, Mandarin',
            bio: 'David is a master of barrier repair and restorative facials. His approach combines clinical efficacy with deep relaxation, making every treatment an experience.',
            fee: 80,
            treatments: ['t1', 't2'],
            image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
            availability: {
                'Tuesday': ['10:00', '11:00', '13:00', '15:00'],
                'Thursday': ['09:00', '10:00', '14:00', '16:00'],
                'Saturday': ['10:00', '11:00', '12:00']
            },
            blockedDates: [],
            status: 'active'
        },
        {
            id: 'e3',
            name: 'Amara Okafor',
            role: 'Aesthetic Nurse Practitioner',
            credentials: 'RN, NP-C (Demo)',
            years: 10,
            specialties: ['Microneedling', 'Barrier repair', 'Pigmentation'],
            languages: 'English, French',
            bio: 'Amara specialises in collagen-induction and pigment treatments for all skin tones, with a careful, conservative approach to sensitive and reactive skin.',
            fee: 100,
            treatments: ['t4', 't5', 't6'],
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80',
            availability: {
                'Monday': ['10:00', '11:00', '14:00', '16:00'],
                'Wednesday': ['09:00', '12:00', '15:00'],
                'Friday': ['10:00', '13:00', '15:00']
            },
            blockedDates: [],
            status: 'active'
        }
    ],
    appointments: [
        {
            id: 'a1',
            clientName: 'Jane Doe',
            clientEmail: 'jane@example.com',
            treatmentId: 't1',
            expertId: 'e2',
            mode: 'in-clinic',
            date: '2026-11-15',
            time: '10:00',
            note: 'First time facial.',
            reference: 'REF-8X9P2',
            status: 'confirmed'
        }
    ],
    testimonials: [
        {
            id: 'ts1',
            initials: 'M. K.',
            text: 'The HydraGlow completely transformed my skin before my wedding. The team was incredibly professional and explained every step.',
            rating: 5,
            treatmentId: 't1',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80'
        },
        {
            id: 'ts2',
            initials: 'S. J.',
            text: 'I was nervous about my first chemical peel, but David made me feel completely at ease. The results speak for themselves.',
            rating: 5,
            treatmentId: 't2',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&h=160&q=80'
        },
        {
            id: 'ts3',
            initials: 'R. P.',
            text: 'Amara was thorough and honest about what microneedling could and could not do. Six weeks on, my scarring is visibly softer.',
            rating: 5,
            treatmentId: 't4',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80'
        }
    ],
    gallery: [
        {
            id: 'g1',
            beforeImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1400&q=80',
            afterImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1400&q=80',
            category: 'anti-aging',
            timeframe: '12 weeks (Demo)',
            sessions: '3 sessions (Demo)',
            treatmentId: 't4'
        },
        {
            id: 'g2',
            beforeImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1400&q=80',
            afterImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1400&q=80',
            category: 'peels',
            timeframe: '6 weeks (Demo)',
            sessions: '2 sessions (Demo)',
            treatmentId: 't6'
        }
    ]
};

const store = {
    init() {
        if (!localStorage.getItem('veyra_data')) {
            localStorage.setItem('veyra_data', JSON.stringify(defaultData));
            return;
        }
        // Add any newly shipped default treatments to existing saved data (once each)
        const data = JSON.parse(localStorage.getItem('veyra_data'));
        // Gallery isn't editable in the dashboard, so always use the shipped set
        data.gallery = defaultData.gallery;
        data.testimonials = defaultData.testimonials;
        localStorage.setItem('veyra_data', JSON.stringify(data));
        const seen = data.seededTreatments || data.treatments.map(t => t.id);
        const added = defaultData.treatments.filter(t => !seen.includes(t.id));
        if (added.length || !data.seededTreatments) {
            data.treatments.push(...added.filter(t => !data.treatments.some(x => x.id === t.id)));
            data.seededTreatments = [...seen, ...added.map(t => t.id)];
            localStorage.setItem('veyra_data', JSON.stringify(data));
        }
        // Same for newly shipped default experts
        const seenE = data.seededExperts || data.experts.map(e => e.id);
        const addedE = defaultData.experts.filter(e => !seenE.includes(e.id));
        if (addedE.length || !data.seededExperts) {
            data.experts.push(...addedE.filter(e => !data.experts.some(x => x.id === e.id)));
            data.seededExperts = [...seenE, ...addedE.map(e => e.id)];
            localStorage.setItem('veyra_data', JSON.stringify(data));
        }
    },
    get(key) {
        const data = JSON.parse(localStorage.getItem('veyra_data'));
        return data[key];
    },
    set(key, value) {
        const data = JSON.parse(localStorage.getItem('veyra_data'));
        data[key] = value;
        localStorage.setItem('veyra_data', JSON.stringify(data));
    },
    reset() {
        localStorage.setItem('veyra_data', JSON.stringify(defaultData));
    }
};

store.init();
export default store;

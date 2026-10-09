# Veyra - Skincare Treatments Expert Advisory & Consultation Hub

This is a premium, single-page web app built with vanilla HTML, CSS, and JS (no frameworks). It features responsive UI, user authentication (demo), interactive workflow features (treatments, skin-concern finder, experts, booking, aftercare), and a fully functional admin dashboard using `localStorage`.

## Included Files

Exactly 3 HTML files per specification:
1. `index.html` - The public website containing 12 functional sections in a long-scroll format.
2. `auth.html` - A dedicated authentication page with Login and Register tabs.
3. `dashboard.html` - The Admin dashboard for managing treatments, experts, and appointments.

## Features & Workflows

- **Treatments**: Searchable, filterable catalog of treatments with detailed accessible modals.
- **Skin-Concern Finder**: A multi-step questionnaire that recommends treatments based on user input. (Note: Not a medical diagnosis).
- **Expert Profiles**: Directory of fictional experts with filterable specialties and detail modals.
- **Book Consultation**: A multi-step inline booking flow with an interactive calendar, time slots, and a `.ics` calendar download.
- **Before/After Gallery**: A drag-to-compare slider for clinical outcomes.
- **Aftercare Guide**: An interactive guide with printable styles and a savable checklist.
- **Admin Dashboard**: Full CRUD for treatments, experts, and appointments. Charts, statistics, and a reset demo data feature.

## Authentication (Demo Only)

Authentication is handled entirely on the client-side using `localStorage`. **No passwords are stored**, and this is not secure for real-world use.

- **Guest**: Can browse `index.html`. Guest booking redirects to `auth.html`.
- **User**: Registering or logging in with any email (except the admin email) creates a `user` session.
- **Admin**: Log in with the email `admin@veyra.demo` (any password) to access the Admin Dashboard. Non-admin users are blocked from viewing `dashboard.html`.

## Integration Placeholders

- **Analytics**: Search for `<!-- GA_TAG -->` to insert Google Analytics.
- **Contact Form**: The contact form is wired with an `onsubmit` placeholder; update the `action` attribute with Formspree or Netlify Forms.
- **Newsletter**: Similar to the contact form, use Mailchimp or another provider by replacing the form's `action`.
- **Calendar**: Booking uses a client-side generated `.ics` file. Real calendar integration would require a backend.
- **Images**: All images are provided via Unsplash CDN.
- **Icons**: Phosphor Icons CDN is used for vector iconography.

## Disclaimer

This is a demo application created for illustrative purposes. **Informational content only, not medical advice.** Expert credentials, prices, results, durations, and testimonials are placeholder data. It creates no clinician-patient relationship.

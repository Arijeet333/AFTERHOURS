# AFTERHOURS — Event Discovery

A responsive, dark editorial-style event discovery and registration website built with **HTML5, CSS3 and vanilla JavaScript**. No framework, build step, package manager or backend required.

## Features

- Responsive layout for mobile, tablet and desktop.
- Event cards rendered from one JavaScript data array.
- Live search across event name, category, city and description.
- Category filters (Technology, Music, Design and Culture).
- Event detail dialog with date, time, venue and description.
- Registration dialog with client-side validation for name, email, phone, event selection and consent.
- Successful registrations saved in browser `localStorage`.
- Light/dark theme toggle with saved preference.
- Newsletter demo with email validation and local persistence.
- Keyboard shortcut: `Ctrl + K` / `Cmd + K` focuses event search.
- Reduced-motion support and accessible labels / dialog controls.
- Original, lightweight SVG event artwork bundled locally in `images/`.

## Run locally

No installation is needed. Open `index.html` in a browser, or use a local development server:

```bash
# Python (from the project directory)
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploy

### GitHub Pages
1. Create a GitHub repository and upload the contents of this folder.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select `main` and `/ (root)`, then save.

### Netlify / Vercel
Import the repository and deploy it as a static site. No build command is required; the publish directory is the project root (`.`).

## Project structure

```text
eventify/
├── index.html       # Page structure and dialogs
├── style.css        # Theme, layout, responsive rules and motion
├── script.js        # Event data, filtering, details and registration logic
├── images/          # Local SVG artwork (no external image requests)
└── README.md
```

## Registration storage

Successful registrations are stored in the browser under `afterhours-registrations`. Newsletter demo addresses use `afterhours-newsletter`, and the theme preference uses `afterhours-theme`.

**Important:** this is a front-end demonstration, not a production registration service. Data is stored only in the visitor's browser and is not sent to an organiser or server. For real event operations, connect a backend/API, add server-side validation, privacy/consent handling and secure data storage. Do not collect real personal information with this demo as-is.

## Customising events

Edit the `EVENTS` array near the top of `script.js`. Each event uses:

- `id`, `number`, `title`, `category`
- `date` in `YYYY-MM-DD` format, `time`
- `venue`, `city`, `image`
- `description`, `tagline`, `spots`

Add a category to the filter row in `index.html` if you introduce a new category. The event cards and registration select are generated from the data automatically.

## Performance notes

- No JavaScript dependencies or runtime framework.
- Event content is generated from a single source of truth.
- Event images are local SVG files and load quickly without third-party image requests.
- Event-card images use lazy loading and async decoding.
- CSS uses responsive grid/flex layouts, fluid type and a reduced-motion media query.
- Event filtering is performed in memory on a small static dataset.

## Credits

Original visual identity and SVG event illustrations created for this project. Google Fonts are loaded from Google Fonts; system fallbacks are provided.

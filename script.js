'use strict';

const EVENTS = [
  {id:'signal-summit',number:'001',title:'The Signal Summit',category:'Technology',date:'2026-11-21',time:'10:00 AM — 6:00 PM',venue:'Mayfair Convention, Bhubaneswar',city:'Bhubaneswar',image:'images/event-tech.svg',description:'A one-day collision of builders, thinkers and people shaping what comes next. Expect sharp conversations on AI, the open web and the future of making.',tagline:'Ideas for what comes next',spots:42},
  {id:'afterglow',number:'002',title:'Afterglow Sessions',category:'Music',date:'2026-11-28',time:'7:00 PM — 11:30 PM',venue:'The Warehouse, Kolkata',city:'Kolkata',image:'images/event-music.svg',description:'An intimate night of left-field electronic music, live visuals and sound-system culture. No headliners. Just a room full of discovery.',tagline:'Sound after sundown',spots:28},
  {id:'form-function',number:'003',title:'Form / Function',category:'Design',date:'2026-12-05',time:'11:00 AM — 4:00 PM',venue:'Studio 44, Bengaluru',city:'Bengaluru',image:'images/event-design.svg',description:'A hands-on design gathering exploring the beautiful tension between utility and expression. Talks, workshops and thoughtful people.',tagline:'Design without the noise',spots:35},
  {id:'founders-table',number:'004',title:'The Founders Table',category:'Technology',date:'2026-12-12',time:'5:00 PM — 9:00 PM',venue:'The Park, New Delhi',city:'New Delhi',image:'images/event-startup.svg',description:'A no-pitch, no-posturing evening for early builders. Honest stories, useful connections and conversations that continue long after the room clears.',tagline:'Build. Share. Repeat.',spots:18},
  {id:'art-after-dark',number:'005',title:'Art After Dark',category:'Culture',date:'2026-12-19',time:'6:00 PM — 10:00 PM',venue:'Gallery 9, Mumbai',city:'Mumbai',image:'images/event-art.svg',description:'A late-night celebration of emerging artists, experimental installations and unexpected collaborations. Come curious; leave inspired.',tagline:'A different point of view',spots:56},
  {id:'zero-day',number:'006',title:'Zero Day Lab',category:'Technology',date:'2027-01-09',time:'9:30 AM — 5:30 PM',venue:'T-Hub, Hyderabad',city:'Hyderabad',image:'images/event-cyber.svg',description:'A practical security and systems day for curious minds. Explore threat thinking, digital privacy and the craft of building resilient products.',tagline:'Think like the edge',spots:31},
  {id:'frequency-fest',number:'007',title:'Frequency Festival',category:'Music',date:'2027-01-16',time:'4:00 PM — 11:00 PM',venue:'Eco Park, Kolkata',city:'Kolkata',image:'images/event-music.svg',description:'A sunset-to-night open-air gathering with independent artists, immersive projections and a community that moves to its own rhythm.',tagline:'Find your rhythm',spots:74},
  {id:'future-objects',number:'008',title:'Future Objects',category:'Design',date:'2027-01-23',time:'12:00 PM — 6:00 PM',venue:'The Courtyard, Pune',city:'Pune',image:'images/event-design.svg',description:'A showcase of ideas becoming objects: speculative design, material experiments and the makers asking better questions about tomorrow.',tagline:'Tomorrow, made tangible',spots:24}
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const grid = $('#event-grid');
const searchInput = $('#event-search');
const filters = $('#category-filters');
const eventDialog = $('#event-dialog');
const registerDialog = $('#register-dialog');
const registrationForm = $('#registration-form');
const eventSelect = $('#registration-event');
const toast = $('#toast');
let activeCategory = 'All';
let toastTimer;

const formatDate = (iso, options = {day:'2-digit', month:'short', year:'numeric'}) => new Intl.DateTimeFormat('en-IN', options).format(new Date(`${iso}T12:00:00`)).toUpperCase();
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function renderEvents() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = EVENTS.filter(event => {
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
    const haystack = `${event.title} ${event.category} ${event.city} ${event.description}`.toLowerCase();
    return matchesCategory && haystack.includes(query);
  });
  $('#results-count').textContent = `${String(visible.length).padStart(2, '0')} EVENTS FOUND`;
  grid.innerHTML = visible.map((event, index) => `
    <article class="event-card" data-event-id="${event.id}" tabindex="0" role="button" aria-label="View ${escapeHTML(event.title)} details" style="animation-delay:${Math.min(index * 45, 270)}ms">
      <div class="event-image"><img src="${event.image}" alt="${escapeHTML(event.title)} event artwork" loading="lazy" decoding="async"><span class="event-category">${escapeHTML(event.category)}</span><span class="event-number">AH / ${event.number}</span></div>
      <div class="event-info"><span class="event-date">${formatDate(event.date)} &nbsp; / &nbsp; ${event.time.split(' — ')[0]}</span><div class="event-title-row"><h3 class="event-title">${escapeHTML(event.title)}</h3><span class="event-arrow" aria-hidden="true">↗</span></div><p class="event-description">${escapeHTML(event.description)}</p><div class="event-location"><span>⌖</span>${escapeHTML(event.venue.toUpperCase())}</div></div>
    </article>`).join('');
  $('#empty-state').hidden = visible.length !== 0;
}

function fillEventOptions() {
  eventSelect.innerHTML = '<option value="">Select an event</option>' + EVENTS.map(event => `<option value="${event.id}">${escapeHTML(event.title)} — ${formatDate(event.date, {day:'numeric',month:'short'})}</option>`).join('');
}

function openEvent(id) {
  const event = EVENTS.find(item => item.id === id);
  if (!event) return;
  $('#event-detail-content').innerHTML = `
    <div class="detail-hero"><img src="${event.image}" alt="${escapeHTML(event.title)} artwork"></div>
    <div class="detail-body"><p class="eyebrow">${event.category.toUpperCase()} / AFTERHOURS ${event.number}</p><h2 id="dialog-title">${escapeHTML(event.title)}</h2><p class="detail-description">${escapeHTML(event.description)}</p>
    <div class="detail-meta"><div><span>DATE & TIME</span><strong>${formatDate(event.date)}<br>${event.time}</strong></div><div><span>LOCATION</span><strong>${escapeHTML(event.venue)}</strong></div><div><span>THE VIBE</span><strong>${escapeHTML(event.tagline)}</strong></div></div>
    <button class="button button-primary" type="button" data-register-event="${event.id}">Save my place <span>↗</span></button></div>`;
  eventDialog.showModal();
}

function openRegistration(eventId = '') {
  registrationForm.hidden = false;
  $('#success-state').hidden = true;
  $('#form-error').textContent = '';
  registrationForm.reset();
  eventSelect.value = eventId;
  if (eventDialog.open) eventDialog.close();
  registerDialog.showModal();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function validateRegistration(data) {
  if (data.name.trim().length < 2) return 'Add your name (at least 2 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) return 'That email address does not look right.';
  const digits = data.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return 'Enter a valid phone number (10–15 digits).';
  if (!EVENTS.some(event => event.id === data.event)) return 'Choose an event from the lineup.';
  if (!data.consent) return 'Please confirm that we can send event updates.';
  return '';
}

function handleRegistration(submitEvent) {
  submitEvent.preventDefault();
  const formData = new FormData(registrationForm);
  const data = Object.fromEntries(formData.entries());
  const error = validateRegistration(data);
  $('#form-error').textContent = error;
  if (error) return;

  const selectedEvent = EVENTS.find(event => event.id === data.event);
  const registration = {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: data.name.trim(), email: data.email.trim().toLowerCase(), phone: data.phone.trim(),
    eventId: selectedEvent.id, eventTitle: selectedEvent.title, registeredAt: new Date().toISOString()
  };
  try {
    const saved = JSON.parse(localStorage.getItem('afterhours-registrations') || '[]');
    saved.push(registration);
    localStorage.setItem('afterhours-registrations', JSON.stringify(saved));
  } catch (storageError) {
    $('#form-error').textContent = 'Your browser could not save this registration. Please check storage settings and try again.';
    return;
  }
  registrationForm.hidden = true;
  $('#success-copy').textContent = `You're registered for ${selectedEvent.title}. We saved your details on this device.`;
  $('#success-state').hidden = false;
}

filters.addEventListener('click', event => {
  const chip = event.target.closest('[data-category]');
  if (!chip) return;
  activeCategory = chip.dataset.category;
  $$('.filter-chip', filters).forEach(button => button.classList.toggle('is-active', button === chip));
  renderEvents();
});
searchInput.addEventListener('input', renderEvents);
grid.addEventListener('click', event => {
  const card = event.target.closest('[data-event-id]');
  if (card) openEvent(card.dataset.eventId);
});
grid.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-event-id]')) {
    event.preventDefault(); openEvent(event.target.dataset.eventId);
  }
});
$('#clear-filters').addEventListener('click', () => {
  activeCategory = 'All'; searchInput.value = '';
  $$('.filter-chip', filters).forEach(button => button.classList.toggle('is-active', button.dataset.category === 'All'));
  renderEvents();
});
document.addEventListener('click', event => {
  const registerButton = event.target.closest('[data-open-register]');
  const eventRegisterButton = event.target.closest('[data-register-event]');
  if (registerButton) openRegistration();
  if (eventRegisterButton) openRegistration(eventRegisterButton.dataset.registerEvent);
});
$$('.dialog-close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
[ eventDialog, registerDialog ].forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
}));
registrationForm.addEventListener('submit', handleRegistration);
$('#close-success').addEventListener('click', () => registerDialog.close());

// Theme preference is optional; storage failures never block the page.
const themeToggle = $('.theme-toggle');
try {
  if (localStorage.getItem('afterhours-theme') === 'light') document.body.classList.add('light-theme');
} catch (_) { /* Private browsing can disable storage. */ }
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  try { localStorage.setItem('afterhours-theme', theme); } catch (_) { /* Theme still works for this visit. */ }
  $('.theme-icon').textContent = theme === 'light' ? '☾' : '☼';
});
if (document.body.classList.contains('light-theme')) $('.theme-icon').textContent = '☾';

// Tiny mobile navigation, no dependency required.
const menuToggle = $('.menu-toggle');
menuToggle.addEventListener('click', () => {
  const isOpen = $('.desktop-nav').classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
$$('.desktop-nav a').forEach(link => link.addEventListener('click', () => {
  $('.desktop-nav').classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false');
}));

// Keyboard shortcut: Cmd/Ctrl + K jumps straight to event search.
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault(); searchInput.focus(); searchInput.scrollIntoView({block:'center',behavior:'smooth'});
  }
});

$('#newsletter-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = $('#newsletter-email');
  const message = $('#newsletter-message');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim())) {
    message.textContent = 'PLEASE ENTER A VALID EMAIL ADDRESS.'; message.style.color = '#ff8d8d'; return;
  }
  try {
    const emails = JSON.parse(localStorage.getItem('afterhours-newsletter') || '[]');
    if (!emails.includes(input.value.trim().toLowerCase())) emails.push(input.value.trim().toLowerCase());
    localStorage.setItem('afterhours-newsletter', JSON.stringify(emails));
    message.textContent = 'YOU’RE ON THE LIST. KEEP AN EYE OUT.'; message.style.color = 'var(--acid)';
    input.value = '';
  } catch (_) {
    message.textContent = 'COULD NOT SAVE LOCALLY. PLEASE TRY AGAIN.'; message.style.color = '#ff8d8d';
  }
});

fillEventOptions();
renderEvents();

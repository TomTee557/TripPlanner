import { postJson } from './fetch.js';

// Session management configuration
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
let sessionTimer;
let lastActivity = Date.now();

// Session timeout management
function resetSessionTimer() {
  lastActivity = Date.now();
  clearTimeout(sessionTimer);
  sessionTimer = setTimeout(logoutDueToInactivity, SESSION_TIMEOUT);
}

function logoutDueToInactivity() {
  showPopup("Your session will expire in 30 seconds due to inactivity. You will be automatically logged out.", "Session Expiring");
  
  // Show countdown popup for 30 seconds then logout
  setTimeout(() => {
    performLogoutViaForm('inactivity');
  }, 30000);
}

function performLogoutViaForm(reason = 'manual') {
  // Create a form element dynamically - same as logout button
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/logout';
  form.style.display = 'none';
  
  const reasonInput = document.createElement('input');
  reasonInput.type = 'hidden';
  reasonInput.name = 'logout_reason';
  reasonInput.value = reason;
  form.appendChild(reasonInput);
  
  document.body.appendChild(form);
  form.submit();
}


function trackActivity() {
  resetSessionTimer();
}

// Events that indicate user activity
const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

// Initialize activity tracking
function initSessionManagement() {
  // Start the timer
  resetSessionTimer();
  
  activityEvents.forEach(event => {
    document.addEventListener(event, trackActivity, true);
  });
  
  // Handle page visibility change - tab switching
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      resetSessionTimer();
    }
  });
  
  // Handle browser/tab close
  window.addEventListener('beforeunload', () => {
    // Create form for logout
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/logout';
    
    const reasonInput = document.createElement('input');
    reasonInput.name = 'logout_reason';
    reasonInput.value = 'browser_close';
    form.appendChild(reasonInput);
    
    // For beforeunload, use sendBeacon as backup
    const formData = new FormData();
    formData.append('logout_reason', 'browser_close');
    navigator.sendBeacon('/logout', formData);
  });
}

// Mock data for trips
const mockTrips = [
  {
    id: "trip_1",
    title: "My Taiwan",
    dateFrom: "2025-07-20",
    dateTo: "2025-08-11",
    country: "Taiwan",
    tripType: ["exotic", "cultural"],
    tags: ["Holidays", "Trip of the month"],
    budget: "$3,000",
    description: "Explore the beautiful island of Taiwan with its stunning mountains, vibrant culture, and delicious cuisine.",
    image: "/public/assets/mountains.jpg"
  },
  {
    id: "trip_2",
    title: "Paris Adventure", 
    dateFrom: "2025-09-15",
    dateTo: "2025-09-22",
    country: "France",
    tripType: ["city-break", "cultural"],
    tags: ["Weekend", "Romance"],
    budget: "€1,500",
    description: "A romantic getaway to the City of Light. Visit iconic landmarks, enjoy world-class cuisine, and stroll along the Seine.",
    image: "/public/assets/mountains.jpg"
  },
  {
    id: "trip_3",
    title: "Alps Trekking",
    dateFrom: "2025-06-10",
    dateTo: "2025-06-17",
    country: "Switzerland", 
    tripType: ["mountain", "trekking"],
    tags: ["Adventure", "Sports"],
    budget: "CHF 2,200",
    description: "Challenge yourself with breathtaking mountain trails in the Swiss Alps. Experience pristine nature and stunning vistas.",
    image: "/public/assets/mountains.jpg"
  },
  {
    id: "trip_4",
    title: "Family Beach Vacation",
    dateFrom: "2025-08-01",
    dateTo: "2025-08-14",
    country: "Spain",
    tripType: ["family", "last-minute"],
    tags: ["Beach", "Relaxation"],
    budget: "€2,800",
    description: "Perfect family vacation on the Spanish coast. Sun, sand, and relaxation for the whole family.",
    image: "/public/assets/mountains-3.jpg"
  }
];

// Available pictures for trips
const availablePictures = {
  'mountains': {
    name: 'Mountains',
    path: '/public/assets/mountains.jpg'
  },
  'mountains-2': {
    name: 'Mountains 2',
    path: '/public/assets/mountains-2.jpg'
  },
  'oriental': {
    name: 'Oriental',
    path: '/public/assets/oriental.jpg'
  },
  'eiffel-tower': {
    name: 'Eiffel Tower',
    path: '/public/assets/eiffel-tower.jpg'
  },
  'mountain-3': {
    name: 'Mountains 3',
    path: '/public/assets/mountains-3.jpg'
  },
   'colosseum': {
    name: 'Colosseum',
    path: '/public/assets/colosseum.jpg'
  }
};

let selectedPicture = null;
// TODO: use a better counter
let nextTripIdCounter = 5; // Start from 5 since we have 4 mock trips
let filteredTrips = [...mockTrips];

// DOM elements - will be initialized after DOM is loaded
let searchPanel, showSearchBtn, closeSearchBtn, searchForm, clearFiltersBtn, tripsList, addTripBtn;

// Trip type mapping for display
const tripTypeLabels = {
  'city-break': 'City Break',
  'mountain': 'Mountain',
  'exotic': 'Exotic',
  'last-minute': 'Last Minute',
  'family': 'Family',
  'trekking': 'Trekking',
  'cultural': 'Cultural'
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  // Initialize DOM elements
  searchPanel = document.getElementById('searchPanel');
  showSearchBtn = document.getElementById('showSearchBtn');
  closeSearchBtn = document.getElementById('closeSearchBtn');
  searchForm = document.getElementById('searchForm');
  clearFiltersBtn = document.getElementById('clearFiltersBtn');
  tripsList = document.getElementById('tripsList');
  addTripBtn = document.getElementById('addTripBtn');
  
  
  initializeClock();
  renderTrips(filteredTrips);
  setupEventListeners();
  
  // Show search panel on desktop by default, hide on mobile
  if (window.innerWidth > 1000) {
    searchPanel.classList.remove('main-app__search-panel--hidden');
    searchPanel.style.display = 'flex';
    if (showSearchBtn) {
      showSearchBtn.style.display = 'none';
    }
  } else {
    searchPanel.classList.add('main-app__search-panel--hidden');
    searchPanel.style.display = 'none';
    if (showSearchBtn) {
      showSearchBtn.style.display = 'block';
    }
  }
  initSessionManagement();
});

// Clock functionality
function initializeClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const timeElement = document.getElementById('currentTime');
  const dateElement = document.getElementById('currentDate');
  const timeElementMobile = document.getElementById('currentTimeMobile');
  const dateElementMobile = document.getElementById('currentDateMobile');
  
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const dateString = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
  
  // Update desktop clock
  if (timeElement) timeElement.textContent = timeString;
  if (dateElement) dateElement.textContent = dateString;
  
  // Update mobile clock
  if (timeElementMobile) timeElementMobile.textContent = timeString;
  if (dateElementMobile) dateElementMobile.textContent = dateString;
}

// Event listeners setup
function setupEventListeners() {
  // Search panel toggle (mobile)
  showSearchBtn?.addEventListener('click', () => {
    searchPanel.classList.remove('main-app__search-panel--hidden');
    searchPanel.style.display = 'flex';
    showSearchBtn.style.display = 'none';
  });
  
  closeSearchBtn?.addEventListener('click', () => {
    searchPanel.classList.add('main-app__search-panel--hidden');
    searchPanel.style.display = 'none';
    if (window.innerWidth <= 1000) {
      showSearchBtn.style.display = 'block';
    }
  });
  
  // Search form
  searchForm?.addEventListener('submit', handleSearch);
  
  // Clear filters
  clearFiltersBtn?.addEventListener('click', clearFilters);
  
  // Add trip button
  addTripBtn?.addEventListener('click', handleAddTrip);
  
  // Trip type dropdown
  setupTripTypeDropdown();
  
  // Handle window resize
  window.addEventListener('resize', handleResize);
}

// Handle window resize
function handleResize() {
  if (window.innerWidth > 1000) {
    searchPanel.classList.remove('main-app__search-panel--hidden');
    searchPanel.style.display = 'flex';
    if (showSearchBtn) {
      showSearchBtn.style.display = 'none';
    }
  } else {
    searchPanel.classList.add('main-app__search-panel--hidden');
    searchPanel.style.display = 'none';
    if (showSearchBtn) {
      showSearchBtn.style.display = 'block';
    }
  }
}

// Setup trip type dropdown
function setupTripTypeDropdown() {
  const dropdown = document.getElementById('tripTypeDropdown');
  const toggle = document.getElementById('tripTypeToggle');
  const content = document.getElementById('tripTypeContent');
  const display = document.getElementById('tripTypeDisplay');
  
  // Toggle dropdown
  toggle?.addEventListener('click', () => {
    dropdown.classList.toggle('main-app__dropdown--open');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('main-app__dropdown--open');
    }
  });
  
  // Handle checkbox changes
  const checkboxes = content.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateTripTypeDisplay);
  });
  
  updateTripTypeDisplay();
}

// Update trip type display text
function updateTripTypeDisplay() {
  const checkboxes = document.querySelectorAll('#tripTypeContent input[type="checkbox"]:checked');
  const display = document.getElementById('tripTypeDisplay');
  
  if (checkboxes.length === 0) {
    display.textContent = 'Select trip types';
  } else if (checkboxes.length === 1) {
    display.textContent = checkboxes[0].nextElementSibling.textContent;
  } else {
    display.textContent = `${checkboxes.length} types selected`;
  }
}


function handleSearch(e) {
  e.preventDefault();
  
  const formData = new FormData(searchForm);
  
  // Get selected trip types from checkboxes
  const selectedTripTypes = Array.from(
    document.querySelectorAll('#tripTypeContent input[type="checkbox"]:checked')
  ).map(checkbox => checkbox.value);
  
  const filters = {
    dateFrom: formData.get('dateFrom'),
    dateTo: formData.get('dateTo'),
    tripType: selectedTripTypes,
    title: formData.get('title')?.toLowerCase(),
    country: formData.get('country')?.toLowerCase(),
    tags: formData.get('tags')?.toLowerCase()
  };
  
  filteredTrips = mockTrips.filter(trip => {
    // Date from filter
    if (filters.dateFrom && trip.dateFrom < filters.dateFrom) {
      return false;
    }
    
    // Date to filter  
    if (filters.dateTo && trip.dateTo > filters.dateTo) {
      return false;
    }
    
    // Trip type filter
    if (filters.tripType.length > 0) {
      const hasMatchingType = trip.tripType.some(type => 
        filters.tripType.includes(type)
      );
      if (!hasMatchingType) return false;
    }
    
    // Title filter
    if (filters.title && !trip.title.toLowerCase().includes(filters.title)) {
      return false;
    }
    
    // Country filter
    if (filters.country && !trip.country.toLowerCase().includes(filters.country)) {
      return false;
    }
    
    // Tags filter
    if (filters.tags) {
      const hasMatchingTag = trip.tags.some(tag => 
        tag.toLowerCase().includes(filters.tags)
      );
      if (!hasMatchingTag) return false;
    }
    
    return true;
  });
  
  renderTrips(filteredTrips);
  
  // Hide search panel on mobile after search
  if (window.innerWidth <= 1000) {
    searchPanel.classList.add('main-app__search-panel--hidden');
    searchPanel.style.display = 'none';
    showSearchBtn.style.display = 'block';
  }
}


function clearFilters() {
  searchForm.reset();
  
  const checkboxes = document.querySelectorAll('#tripTypeContent input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  updateTripTypeDisplay();
}

function renderTrips(trips) {
  if (!tripsList) return;
  
  if (trips.length === 0) {
    tripsList.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <p style="color: #333; font-size: 1.2rem; font-weight: 500; margin: 0;">No trips found matching your criteria.</p>
      </div>
    `;
    return;
  }
  
  tripsList.innerHTML = trips.map(trip => `
    <div class="main-app__trip-card">
      <img src="${trip.image}" alt="${trip.title}" class="main-app__trip-image" />
      <div class="main-app__trip-details">
        <h3 class="main-app__trip-title">Title: ${trip.title}</h3>
        <p class="main-app__trip-date">Date: ${formatDate(trip.dateFrom)} - ${formatDate(trip.dateTo)}</p>
        <div class="main-app__trip-tags">
          <span style="font-weight: 600; margin-right: 0.5rem;">Tags:</span>
          ${trip.tags.map(tag => `
            <span class="main-app__trip-tag">${tag}</span>
          `).join('')}
        </div>
      </div>
      <div class="main-app__trip-actions">
        <button class="main-app__trip-details" data-trip-id="${trip.id}" title="Show details">
          <img src="/public/assets/more_vert.png" alt="Details" class="main-app__trip-details-icon" />
        </button>
        <button class="main-app__trip-edit" data-trip-id="${trip.id}" title="Edit trip">
          <img src="/public/assets/edit.png" alt="Edit" class="main-app__trip-edit-icon" />
        </button>
      </div>
    </div>
  `).join('');
  
  // Setup event listeners for trip action buttons
  setupTripActionListeners();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function handleAddTrip() {
  showAddTripPopup();
}

function showAddTripPopup() {
  const overlay = document.getElementById('addTripPopupOverlay');
  const form = document.getElementById('addTripForm');
  
  // Reset form
  form.reset();
  selectedPicture = null;
  updatePicturePreview();
  
  // Show popup
  overlay.style.display = 'flex';
  
  // Setup event listeners for popup elements (needed each time popup opens)
  setupPopupEventListeners();
}


function setupPopupEventListeners() {
  // Close popup
  const closeBtn = document.getElementById('addTripPopupClose');
  const backBtn = document.getElementById('addTripBackBtn');
  const overlay = document.getElementById('addTripPopupOverlay');
  
  if (closeBtn) closeBtn.onclick = hideAddTripPopup;
  if (backBtn) backBtn.onclick = hideAddTripPopup;
  if (overlay) {
    overlay.onclick = (e) => {
      if (e.target === overlay) hideAddTripPopup();
    };
  }
  
  // Picture selection
  const choosePictureBtn = document.getElementById('choosePictureBtn');
  if (choosePictureBtn) {
    choosePictureBtn.onclick = showPictureSelectionPopup;
  }
  
  // Currency converter (placeholder)
  const currencyBtn = document.getElementById('currencyConverterBtn');
  if (currencyBtn) {
    currencyBtn.onclick = () => {
      // TODO: Implement currency converter feature
      showPopup("Currency converter feature coming soon", "Info");
    };
  }
  
  const form = document.getElementById('addTripForm');
  const submitBtn = document.getElementById('addTripSubmitBtn');
  
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      return false;
    };
  }
  
  if (submitBtn) {
    submitBtn.onclick = (e) => {
      e.preventDefault();
      handleAddTripSubmit();
    };
  }
}

function hideAddTripPopup() {
  document.getElementById('addTripPopupOverlay').style.display = 'none';
}

function showPictureSelectionPopup() {
  const overlay = document.getElementById('pictureSelectionPopupOverlay');
  const grid = document.getElementById('pictureSelectionGrid');
  
  // Clear grid
  grid.innerHTML = '';
  
  // Populate picture options
  Object.keys(availablePictures).forEach(key => {
    const picture = availablePictures[key];
    const option = document.createElement('div');
    option.className = 'picture-option';
    if (selectedPicture === key) {
      option.classList.add('selected');
    }
    
    option.innerHTML = `
      <img src="${picture.path}" alt="${picture.name}" class="picture-option__image" />
      <div class="picture-option__name">${picture.name}</div>
    `;
    
    option.onclick = () => selectPicture(key);
    grid.appendChild(option);
  });
  
  // Show popup
  overlay.style.display = 'flex';
  
  // Setup event listeners
  setupPictureSelectionEventListeners();
}

function setupPictureSelectionEventListeners() {
  const closeBtn = document.getElementById('pictureSelectionPopupClose');
  const backBtn = document.getElementById('pictureSelectionBackBtn');
  const overlay = document.getElementById('pictureSelectionPopupOverlay');
  
  closeBtn.onclick = hidePictureSelectionPopup;
  backBtn.onclick = hidePictureSelectionPopup;
  overlay.onclick = (e) => {
    if (e.target === overlay) hidePictureSelectionPopup();
  };
}

function hidePictureSelectionPopup() {
  document.getElementById('pictureSelectionPopupOverlay').style.display = 'none';
}

function selectPicture(key) {
  selectedPicture = key;
  updatePicturePreview();
  hidePictureSelectionPopup();
}

function updatePicturePreview() {
  const container = document.getElementById('previewContainer');
  
  if (selectedPicture && availablePictures[selectedPicture]) {
    const picture = availablePictures[selectedPicture];
    container.innerHTML = `
      <img src="${picture.path}" alt="${picture.name}" class="add-trip-form__preview-image" />
    `;
  } else {
    container.innerHTML = '<span class="add-trip-form__no-preview">No picture selected</span>';
  }
}

function handleAddTripSubmit() {
  const form = document.getElementById('addTripForm');
  const submitBtn = document.getElementById('addTripSubmitBtn');
  
  if (submitBtn.disabled) {
    return;
  }
  
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Adding...';
  
  const formData = new FormData(form);
  
  // Get form values
  const dateFrom = document.getElementById('addTripDateFrom').value;
  const dateTo = document.getElementById('addTripDateTo').value;
  const tripType = document.getElementById('addTripType').value;
  const title = document.getElementById('addTripTitle').value;
  const country = document.getElementById('addTripCountry').value;
  const tags = document.getElementById('addTripTags').value;
  const budget = document.getElementById('addTripBudget').value;
  const description = document.getElementById('addTripDescription').value;

  const reEnableButton = () => {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  };
  
  // Validate required fields
  if (!dateFrom || !dateTo || !tripType || !title || !country) {
    showPopup("Please fill in all required fields.", "Validation Error");
    reEnableButton();
    return;
  }
  
  // Validate date range
  if (new Date(dateFrom) >= new Date(dateTo)) {
    showPopup("Date from must be before date to.", "Validation Error");
    reEnableButton();
    return;
  }
  
  // Create new trip object
  const newTrip = {
    id: `trip_${nextTripIdCounter++}`,
    title: title,
    dateFrom: dateFrom,
    dateTo: dateTo,
    country: country,
    tripType: [tripType],
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    image: selectedPicture ? availablePictures[selectedPicture].path : '/public/assets/mountains.jpg',
    budget: budget || null,
    description: description || ''
  };
  
  // Add to mockTrips array
  mockTrips.push(newTrip);
  
  // Update filtered trips and re-render
  filteredTrips = [...mockTrips];
  renderTrips(filteredTrips);
  
  // Hide popup and show success message
  hideAddTripPopup();
  showPopup(`Trip "${title}" has been added successfully!`, "Success");
  
  // Re-enable button
  reEnableButton();
}

function editTrip(tripId) {
  // TODO: Implement popup for editing trip
  alert(`Edit trip functionality will be implemented with popup. Trip ID: ${tripId}`);
}

function showPopup(message, title = "Information") {
  const popupOverlay = document.getElementById('popupOverlay');
  const popupTitle = document.getElementById('popupTitle');
  const popupContent = document.getElementById('popupContent');
  const popupActions = document.getElementById('popupActions');
  const popupClose = document.getElementById('popupClose');
  const popupPrimaryBtn = document.getElementById('popupPrimaryBtn');

  // Set content
  popupTitle.textContent = title;
  popupContent.textContent = message;
  
  // Reset actions to just OK button
  popupActions.innerHTML = '<button class="popup__button popup__button--primary" id="popupPrimaryBtn">OK</button>';
  
  // Show popup
  popupOverlay.style.display = 'flex';

  // Add event listeners for closing
  const newPopupPrimaryBtn = document.getElementById('popupPrimaryBtn');
  const closePopup = () => {
    popupOverlay.style.display = 'none';
  };

  newPopupPrimaryBtn.onclick = closePopup;
  popupClose.onclick = closePopup;
  popupOverlay.onclick = (e) => {
    if (e.target === popupOverlay) {
      closePopup();
    }
  };
}

function showTripDetails(tripId) {
  const trip = mockTrips.find(t => t.id === tripId);
  if (!trip) {
    showPopup("Trip not found", "Error");
    return;
  }
  
  showTripDetailsPopup(trip);
}

function showTripDetailsPopup(trip) {
  const overlay = document.getElementById('tripDetailsPopupOverlay');
  const content = document.getElementById('tripDetailsContent');
  
  // Generate trip details HTML
  content.innerHTML = `
    <div class="trip-details">
      <div class="trip-details__image-container">
        <img src="${trip.image}" alt="${trip.title}" class="trip-details__image" />
      </div>
      <div class="trip-details__info">
        <div class="trip-details__field">
          <strong>Title:</strong> ${trip.title}
        </div>
        <div class="trip-details__field">
          <strong>Country:</strong> ${trip.country}
        </div>
        <div class="trip-details__field">
          <strong>Date From:</strong> ${formatDate(trip.dateFrom)}
        </div>
        <div class="trip-details__field">
          <strong>Date To:</strong> ${formatDate(trip.dateTo)}
        </div>
        <div class="trip-details__field">
          <strong>Trip Type:</strong> ${trip.tripType.map(type => tripTypeLabels[type] || type).join(', ')}
        </div>
        <div class="trip-details__field">
          <strong>Tags:</strong> ${trip.tags.length > 0 ? trip.tags.join(', ') : 'No tags'}
        </div>
        ${trip.budget ? `<div class="trip-details__field">
          <strong>Budget:</strong> ${trip.budget}
        </div>` : ''}
        ${trip.description ? `<div class="trip-details__field">
          <strong>Description:</strong> ${trip.description}
        </div>` : ''}
      </div>
    </div>
  `;
  
  // Show popup
  overlay.style.display = 'flex';
  
  // Setup event listeners
  setupTripDetailsEventListeners();
}

function setupTripDetailsEventListeners() {
  const closeBtn = document.getElementById('tripDetailsPopupClose');
  const backBtn = document.getElementById('tripDetailsBackBtn');
  const overlay = document.getElementById('tripDetailsPopupOverlay');
  
  if (closeBtn) closeBtn.onclick = hideTripDetailsPopup;
  if (backBtn) backBtn.onclick = hideTripDetailsPopup;
  if (overlay) {
    overlay.onclick = (e) => {
      if (e.target === overlay) hideTripDetailsPopup();
    };
  }
}

function hideTripDetailsPopup() {
  document.getElementById('tripDetailsPopupOverlay').style.display = 'none';
}

function setupTripActionListeners() {
  // Setup listeners for all trip details buttons
  const detailsButtons = document.querySelectorAll('.main-app__trip-details');
  detailsButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const tripId = e.currentTarget.getAttribute('data-trip-id');
      showTripDetails(tripId);
    });
  });
  
  // Setup listeners for all trip edit buttons  
  const editButtons = document.querySelectorAll('.main-app__trip-edit');
  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const tripId = e.currentTarget.getAttribute('data-trip-id');
      editTrip(tripId);
    });
  });
}

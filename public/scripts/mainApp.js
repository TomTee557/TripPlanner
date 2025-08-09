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
    id: 1,
    title: "My Taiwan",
    dateFrom: "2025-07-20",
    dateTo: "2025-08-11",
    country: "Taiwan",
    tripType: ["exotic", "cultural"],
    tags: ["Holidays", "Trip of the month"],
    image: "/public/assets/mountains.jpg"
  },
  {
    id: 2,
    title: "Paris Adventure", 
    dateFrom: "2025-09-15",
    dateTo: "2025-09-22",
    country: "France",
    tripType: ["city-break", "cultural"],
    tags: ["Weekend", "Romance"],
    image: "/public/assets/mountains.jpg"
  },
  {
    id: 3,
    title: "Alps Trekking",
    dateFrom: "2025-06-10",
    dateTo: "2025-06-17",
    country: "Switzerland", 
    tripType: ["mountain", "trekking"],
    tags: ["Adventure", "Sports"],
    image: "/public/assets/mountains.jpg"
  },
  {
    id: 4,
    title: "Family Beach Vacation",
    dateFrom: "2025-08-01",
    dateTo: "2025-08-14",
    country: "Spain",
    tripType: ["family", "last-minute"],
    tags: ["Beach", "Relaxation"],
    image: "/public/assets/mountains.jpg"
  }
];

let filteredTrips = [...mockTrips];

// DOM elements
const searchPanel = document.getElementById('searchPanel');
const showSearchBtn = document.getElementById('showSearchBtn');
const closeSearchBtn = document.getElementById('closeSearchBtn');
const searchForm = document.getElementById('searchForm');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const tripsList = document.getElementById('tripsList');
const addTripBtn = document.getElementById('addTripBtn');

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
  initializeClock();
  renderTrips(filteredTrips);
  setupEventListeners();
  
  // Show search panel on desktop by default
  if (window.innerWidth > 1000) {
    searchPanel.classList.remove('main-app__search-panel--hidden');
    showSearchBtn.style.display = 'none';
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
    showSearchBtn.style.display = 'none';
  });
  
  closeSearchBtn?.addEventListener('click', () => {
    searchPanel.classList.add('main-app__search-panel--hidden');
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
    showSearchBtn.style.display = 'none';
  } else {
    searchPanel.classList.add('main-app__search-panel--hidden');
    showSearchBtn.style.display = 'block';
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
    showSearchBtn.style.display = 'block';
  }
}


function clearFilters() {
  searchForm.reset();
  
  // Clear trip type checkboxes
  const checkboxes = document.querySelectorAll('#tripTypeContent input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  updateTripTypeDisplay();
  
  filteredTrips = [...mockTrips];
  renderTrips(filteredTrips);
}

// Render trips
function renderTrips(trips) {
  if (!tripsList) return;
  
  if (trips.length === 0) {
    tripsList.innerHTML = `
      <div style="text-align: center; color: #666; padding: 2rem;">
        <p>No trips found matching your criteria.</p>
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
        <button class="main-app__trip-edit" onclick="editTrip(${trip.id})" title="Edit trip">
          <img src="/public/assets/edit.png" alt="Edit" class="main-app__trip-edit-icon" />
        </button>
      </div>
    </div>
  `).join('');
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function handleAddTrip() {
  // TODO: Implement popup for adding trip
  alert('Add trip functionality will be implemented with popup');
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

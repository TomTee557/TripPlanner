<?php /** @var array $messages */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Trip Planner - Main App</title>
  <link rel="stylesheet" href="/public/styles/global.css" />
  <link rel="stylesheet" href="/public/styles/mainApp.css" />
</head>
<body class="main-app">
  <!-- Search Panel (Left Column) -->
  <div class="main-app__search-panel main-app__search-panel--hidden" id="searchPanel">
    <button class="main-app__button main-app__button--search main-app__close-search--mobile" id="closeSearchBtn">Hide search panel</button>
    
    <img src="/public/assets/logo.png" alt="Trip Planner Logo" class="main-app__logo"/>
    
    <form class="main-app__form" id="searchForm">
      <div class="main-app__field">
        <label class="main-app__label">Date from</label>
        <input type="date" class="main-app__input" id="dateFrom" name="dateFrom" />
      </div>
      
      <div class="main-app__field">
        <label class="main-app__label">Date to</label>
        <input type="date" class="main-app__input" id="dateTo" name="dateTo" />
      </div>
      
      <div class="main-app__field">
        <label class="main-app__label">Trip type</label>
        <div class="main-app__dropdown" id="tripTypeDropdown">
          <div class="main-app__dropdown-trigger" id="tripTypeToggle">
            <span id="tripTypeDisplay">Select trip types</span>
            <span class="main-app__dropdown-arrow">▼</span>
          </div>
          <div class="main-app__dropdown-content" id="tripTypeContent">
            <label class="main-app__checkbox-item">
              <input type="checkbox" name="tripType" value="city-break">
              <span>City Break</span>
            </label>
            <label class="main-app__checkbox-item">
              <input type="checkbox" name="tripType" value="mountain">
              <span>Mountain</span>
            </label>
            <label class="main-app__checkbox-item">
              <input type="checkbox" name="tripType" value="exotic">
              <span>Exotic</span>
            </label>
            <label class="main-app__checkbox-item">
              <input type="checkbox" name="tripType" value="last-minute">
              <span>Last Minute</span>
            </label>
            <label class="main-app__checkbox-item">
              <input type="checkbox" name="tripType" value="family">
              <span>Family</span>
            </label>
            <label class="main-app__checkbox-item">
              <input type="checkbox" name="tripType" value="trekking">
              <span>Trekking</span>
            </label>
            <label class="main-app__checkbox-item">
              <input type="checkbox" name="tripType" value="cultural">
              <span>Cultural</span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="main-app__field">
        <label class="main-app__label">Title</label>
        <input type="text" class="main-app__input" id="title" name="title" placeholder="My trip" />
      </div>
      
      <div class="main-app__field">
        <label class="main-app__label">Country</label>
        <input type="text" class="main-app__input" id="country" name="country" placeholder="Country" />
      </div>
      
      <div class="main-app__field">
        <label class="main-app__label">Tags</label>
        <input type="text" class="main-app__input" id="tags" name="tags" placeholder="Holiday" />
      </div>
      
      <div class="main-app__button-group">
        <button type="button" class="main-app__button main-app__button--clear" id="clearFiltersBtn">Clear filters</button>
        <button type="submit" class="main-app__button main-app__button--search" id="searchBtn">Search</button>
      </div>
    </form>
  </div>

  <!-- Main Content (Right Column) -->
  <div class="main-app__content">
    <!-- Mobile logo -->
    <div class="main-app__mobile-logo-container">
      <img src="/public/assets/logo-white.png" alt="Trip Planner Logo" class="main-app__mobile-logo"/>
    </div>
    
    <!-- Mobile header with search button and clock -->
    <div class="main-app__mobile-header">
      <button class="main-app__toggle-search" id="showSearchBtn">Show search panel</button>
      <div class="main-app__clock main-app__clock--mobile">
        <div class="main-app__time" id="currentTimeMobile">12:24</div>
        <div class="main-app__date" id="currentDateMobile">Monday 02.04.2025</div>
      </div>
    </div>
    
    <!-- Desktop Header with Clock -->
    <div class="main-app__header">
      <div class="main-app__clock">
        <div class="main-app__time" id="currentTime">12:24</div>
        <div class="main-app__date" id="currentDate">Monday 02.04.2025</div>
      </div>
    </div>

    <!-- Trips Section -->
    <div class="main-app__trips">
      <div class="main-app__trips-header">
        <h2 class="main-app__trips-title">All trips:</h2>
        <button class="main-app__add-trip" id="addTripBtn">
          <span>Add trip</span>
          <span>+</span>
        </button>
      </div>
      
      <div class="main-app__trips-list" id="tripsList">
        <!-- Trip cards will be rendered here by JavaScript -->
      </div>
    </div>
  </div>

  <script src="/public/scripts/mainApp.js" defer></script>
</body>
</html>

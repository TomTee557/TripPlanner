import { SESSION_TIMEOUT } from '/public/scripts/consts.js';

/**
 * InactivityTimer - Handles user session management and inactivity tracking
 * 
 * Features:
 * - Tracks user activity across multiple events
 * - Shows warning popup before logout
 * - Handles automatic logout due to inactivity
 * - Manages tab visibility changes
 * - Handles browser close events
 */
export class InactivityTimer {
  constructor(options = {}) {
    this.timeout = options.timeout || SESSION_TIMEOUT;
    this.warningTime = options.warningTime || 30000; // 30 seconds warning
    this.onShowWarning = options.onShowWarning || null;
    this.onLogout = options.onLogout || null;
    
    this.sessionTimer = null;
    this.lastActivity = Date.now();
    this.activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
    
    this.isInitialized = false;
  }

  /**
   * Initialize the inactivity timer
   */
  init() {
    if (this.isInitialized) {
      console.warn('InactivityTimer already initialized');
      return;
    }

    this.resetTimer();
    this.bindActivityEvents();
    this.bindVisibilityEvents();
    this.bindUnloadEvents();
    
    this.isInitialized = true;
    console.log('InactivityTimer initialized');
  }

  /**
   * Reset the inactivity timer
   */
  resetTimer() {
    this.lastActivity = Date.now();
    clearTimeout(this.sessionTimer);
    
    const timeUntilWarning = this.timeout - this.warningTime;
    this.sessionTimer = setTimeout(() => {
      this.showWarningAndScheduleLogout();
    }, timeUntilWarning);
  }

  /**
   * Show warning popup and schedule logout
   */
  showWarningAndScheduleLogout() {
    // Show warning via callback
    if (this.onShowWarning) {
      this.onShowWarning("Your session will expire in 30 seconds due to inactivity. You will be automatically logged out.", "Session Expiring");
    }
    
    // Schedule logout after warning period
    setTimeout(() => {
      this.performLogout('inactivity');
    }, this.warningTime);
  }

  /**
   * Perform logout
   */
  performLogout(reason = 'manual') {
    if (this.onLogout) {
      this.onLogout(reason);
    } else {
      this.defaultLogout(reason);
    }
  }

  /**
   * Default logout implementation
   */
  defaultLogout(reason = 'manual') {
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

  /**
   * Track user activity
   */
  trackActivity() {
    this.resetTimer();
  }

  /**
   * Bind activity event listeners
   */
  bindActivityEvents() {
    this.activityEvents.forEach(event => {
      document.addEventListener(event, () => this.trackActivity(), true);
    });
  }

  /**
   * Bind visibility change events (tab switching)
   */
  bindVisibilityEvents() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.resetTimer();
      }
    });
  }

  /**
   * Bind page unload events
   */
  bindUnloadEvents() {
    window.addEventListener('beforeunload', () => {
      // Create form for logout
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/logout';
      form.style.display = 'none';
      
      const reasonInput = document.createElement('input');
      reasonInput.type = 'hidden';
      reasonInput.name = 'logout_reason';
      reasonInput.value = 'page_close';
      form.appendChild(reasonInput);
      
      document.body.appendChild(form);
      
      // Use navigator.sendBeacon if available for more reliable sending
      if (navigator.sendBeacon) {
        const formData = new FormData(form);
        navigator.sendBeacon('/logout', formData);
      } else {
        form.submit();
      }
    });
  }

  /**
   * Destroy the timer and remove event listeners
   */
  destroy() {
    clearTimeout(this.sessionTimer);
    
    this.activityEvents.forEach(event => {
      document.removeEventListener(event, this.trackActivity, true);
    });
    
    this.isInitialized = false;
    console.log('InactivityTimer destroyed');
  }

  /**
   * Get time since last activity
   */
  getTimeSinceLastActivity() {
    return Date.now() - this.lastActivity;
  }

  /**
   * Check if user is inactive
   */
  isInactive(threshold = this.timeout) {
    return this.getTimeSinceLastActivity() > threshold;
  }
}

/**
 * Create and export a singleton instance
 */
export const inactivityTimer = new InactivityTimer();

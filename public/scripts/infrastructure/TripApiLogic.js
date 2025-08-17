// Basic API class for server communication
// Handles sessions, authentication errors and PHP routing

export class TripApiLogic {
    
    static async request(url, options = {}) {
        const defaultOptions = {
            credentials: 'same-origin', // sends session cookies
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        const response = await fetch(url, { ...defaultOptions, ...options });
        
        // Check if user is logged in
        if (response.status === 401) {
            const errorData = await response.json();
            console.warn('Authentication error:', errorData.message);
            
            // Show popup asking for re-login
            // PHP ROUTING manages views 
            this.showLoginPopup(errorData.message);
            throw new Error('Authentication required');
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    // Popup asking for re-login
    static showLoginPopup(message) {
        // Use existing popup system from mainApp.js
        if (typeof showPopup === 'function') {
            showPopup(message, "Session Expired", () => {
                // After closing popup, call logout service
                this.performLogout();
            });
        } else {
            // Fallback if showPopup doesn't exist
            if (confirm(message + "\n\nClick OK to log out and return to login page.")) {
                this.performLogout();
            }
        }
    }
    
    // Call logout service (PHP routing)
    static performLogout() {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/logout';
        form.style.display = 'none';
        
        const reasonInput = document.createElement('input');
        reasonInput.type = 'hidden';
        reasonInput.name = 'logout_reason';
        reasonInput.value = 'session_expired';
        form.appendChild(reasonInput);
        
        document.body.appendChild(form);
        form.submit(); // PHP routing manages redirect
    }
}

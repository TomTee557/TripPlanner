// Main export of all Trip API logic
// Enables easy import in mainApp.js

export { TripApiLogic } from './TripApiLogic.js';
export { GetTripsLogic } from './GetTripsLogic.js';
export { AddTripLogic } from './AddTripLogic.js';
export { DeleteTripLogic } from './DeleteTripLogic.js';

// Helper functions for compatibility with existing code
export async function loadUserTrips() {
    try {
        const result = await GetTripsLogic.getUserTrips();
        return result.data || []; // Return trips array for compatibility
    } catch (error) {
        // Return empty array - UI layer will handle error messages
        return [];
    }
}


// TODO: REMOVE IT

// // Export for use in mainApp.js (global scope)
// window.TripApiLogic = TripApiLogic;
// window.GetTripsLogic = GetTripsLogic;
// window.AddTripLogic = AddTripLogic;
// window.DeleteTripLogic = DeleteTripLogic;
// window.loadUserTrips = loadUserTrips;

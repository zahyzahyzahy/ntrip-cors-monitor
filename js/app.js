// Constants and configuration
const API_URL = 'https://asia-southeast1-cors-428306.cloudfunctions.net/getNtripData';
let stations = [];
let map = null;
let locationMap = null;
let locationMarker = null;
let isSelectingLocation = false;
let stationMarkers = {};
let updateInterval = 30000; // 30 seconds default
let updateTimer = null;
let isEditingStation = false;
let editingStationId = null;

// Default station coordinates (for known stations)
const defaultCoordinates = {
    'MLE': { lat: 4.1754, lng: 73.5093 },
    'HMLE': { lat: 4.2133, lng: 73.5566 },
    'OORR': { lat: -0.6287, lng: 73.1044 },
    'MAD': { lat: 0.5013, lng: 73.2564 },
    'SUN': { lat: 3.4825, lng: 72.8555 },
    'EYD': { lat: 5.1033, lng: 73.0707 }
};

// DOM Elements
const cardViewBtn = document.getElementById('card-view-btn');
const mapViewBtn = document.getElementById('map-view-btn');
const cardView = document.getElementById('card-view');
const mapView = document.getElementById('map-view');
const stationCards = document.getElementById('station-cards');
const addStationBtn = document.getElementById('add-station-btn');
const settingsBtn = document.getElementById('settings-btn');
const checkAllBtn = document.getElementById('check-all-btn');
const lastUpdateTime = document.getElementById('last-update-time');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingMessage = document.getElementById('loading-message');

// Modal Elements
const settingsModal = document.getElementById('settings-modal');
const stationModal = document.getElementById('station-modal');
const messageModal = document.getElementById('message-modal');
const stationModalTitle = document.getElementById('station-modal-title');
const stationForm = document.getElementById('station-form');
const stationIdInput = document.getElementById('station-id');
const stationNameInput = document.getElementById('station-name');
const stationLatInput = document.getElementById('station-lat');
const stationLngInput = document.getElementById('station-lng');
const stationEditIdInput = document.getElementById('station-edit-id');
const saveStationBtn = document.getElementById('save-station-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const clearDataBtn = document.getElementById('clear-data-btn');
const messageContent = document.getElementById('message-content');

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

// Dashboard initialization
async function initializeDashboard() {
    showLoading('Initializing dashboard...');
    
    // Load settings from cookies
    loadSettings();
    
    // Initialize map
    initializeMap();
    initializeLocationMap();
    
    // Load stations (from cookies first, then from API)
    await loadStations();
    
    // Start update timer
    startUpdateTimer();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Hide loading overlay
    hideLoading();
}

// Initialize the main map
function initializeMap() {
    map = L.map('map').setView([3.2028, 73.2207], 7); // Maldives center
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

// Initialize the location selection map
function initializeLocationMap() {
    locationMap = L.map('location-map').setView([3.2028, 73.2207], 7);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(locationMap);
    
    // Add click event for location selection
    locationMap.on('click', function(e) {
        if (isSelectingLocation) {
            const lat = e.latlng.lat.toFixed(4);
            const lng = e.latlng.lng.toFixed(4);
            
            // Update form fields
            stationLatInput.value = lat;
            stationLngInput.value = lng;
            
            // Update marker position
            if (locationMarker) {
                locationMarker.setLatLng(e.latlng);
            } else {
                locationMarker = L.marker(e.latlng).addTo(locationMap);
            }
        }
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // View tab buttons
    cardViewBtn.addEventListener('click', () => switchView('card'));
    mapViewBtn.addEventListener('click', () => switchView('map'));
    
    // Modal close buttons
    document.queryS

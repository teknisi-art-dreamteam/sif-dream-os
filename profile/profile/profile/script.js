// Profile Configuration
let userProfile = {
    username: "Dream User",
    avatar: "avatar1.png",
    wallpaper: "gradient1",
    theme: "dark",
    isSetupComplete: false,
    preferences: {
        animations: true,
        sound: true,
        notifications: true
    }
};

// Step Navigation
let currentStep = 1;
const totalSteps = 6;

function nextStep(stepNumber) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${stepNumber}`).classList.add('active');
    currentStep = stepNumber;
    
    // Update progress bar if you add one
    updateProgress();
}

// Avatar Selection
function selectAvatar(avatarNumber) {
    // Remove selected class from all avatars
    document.querySelectorAll('.avatar').forEach(avatar => {
        avatar.classList.remove('selected');
    });
    
    // Add selected class to clicked avatar
    event.target.classList.add('selected');
    userProfile.avatar = `avatar${avatarNumber}.png`;
    
    // Update summary preview
    document.getElementById('summaryAvatar').src = `../assets/avatars/avatar${avatarNumber}.png`;
}

// Username Handling
function saveUsername() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    
    if (username.length < 2) {
        alert('Username must be at least 2 characters');
        return;
    }
    
    if (username.length > 20) {
        alert('Username cannot exceed 20 characters');
        return;
    }
    
    userProfile.username = username;
    document.getElementById('summaryName').textContent = username;
    document.getElementById('usernamePreview').textContent = `@${username}`;
    
    nextStep(4);
}

// Wallpaper Selection
function selectWallpaper(wallpaperId) {
    // Remove selected class from all wallpapers
    document.querySelectorAll('.wallpaper').forEach(wp => {
        wp.classList.remove('selected');
    });
    
    // Add selected class to clicked wallpaper
    event.target.classList.add('selected');
    userProfile.wallpaper = wallpaperId;
    document.getElementById('summaryWallpaper').textContent = 
        wallpaperId.charAt(0).toUpperCase() + wallpaperId.slice(1);
}

// Theme Selection
function selectTheme(theme) {
    userProfile.theme = theme;
    document.getElementById('summaryTheme').textContent = 
        theme.charAt(0).toUpperCase() + theme.slice(1);
    
    // Update preview theme selection
    document.querySelectorAll('.theme-option').forEach(option => {
        option.style.opacity = '0.5';
    });
    event.target.closest('.theme-option').style.opacity = '1';
}

// Finish Setup
function finishSetup() {
    const privacyAgree = document.getElementById('privacyAgree').checked;
    
    if (!privacyAgree) {
        alert('Please agree to the privacy terms to continue');
        return;
    }
    
    // Save profile to localStorage
    saveProfileToLocalStorage();
    
    // Mark setup as complete
    userProfile.isSetupComplete = true;
    
    // Redirect to main OS
    window.location.href = "../dashboard.html";
}

// Save to LocalStorage
function saveProfileToLocalStorage() {
    try {
        localStorage.setItem('dreamOS_profile', JSON.stringify(userProfile));
        console.log('Profile saved successfully:', userProfile);
        
        // Also save timestamp
        localStorage.setItem('dreamOS_setup_date', new Date().toISOString());
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Error saving profile. Using default settings.');
    }
}

// Load Profile (for dashboard)
function loadProfile() {
    try {
        const savedProfile = localStorage.getItem('dreamOS_profile');
        if (savedProfile) {
            return JSON.parse(savedProfile);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
    return userProfile; // Return default if error
}

// Progress Bar Update
function updateProgress() {
    // If you add a progress bar
    const progress = (currentStep / totalSteps) * 100;
    document.querySelectorAll('.progress-bar').forEach(bar => {
        bar.style.width = `${progress}%`;
    });
}

// Initialize setup
document.addEventListener('DOMContentLoaded', function() {
    // Check if already setup
    const savedProfile = localStorage.getItem('dreamOS_profile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.isSetupComplete) {
            // Redirect to dashboard if already setup
            window.location.href = "../dashboard.html";
            return;
        }
    }
    
    // Start with step 1
    document.getElementById('step1').classList.add('active');
    
    // Auto-focus username input
    document.getElementById('username')?.focus();
});

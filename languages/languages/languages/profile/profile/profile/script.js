// Language System
let currentLanguage = 'en';
let translations = {};

// Load language file
async function loadLanguage(lang) {
    try {
        const response = await fetch(`../languages/${lang}.json`);
        translations = await response.json();
        applyTranslations();
    } catch (error) {
        console.error('Error loading language:', error);
        // Fallback to English
        await loadLanguage('en');
    }
}

// Apply translations to page
function applyTranslations() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[key]) {
            element.placeholder = translations[key];
        }
    });
    
    // Set RTL for Arabic
    if (currentLanguage === 'ar') {
        document.documentElement.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
    }
}

// Language selection
function selectLanguage(lang) {
    currentLanguage = lang;
    userProfile.language = lang;
    
    // Update UI
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.language-option').classList.add('selected');
}

// Save language and proceed
async function saveLanguage() {
    if (!currentLanguage) {
        alert('Please select a language');
        return;
    }
    
    // Save to profile
    userProfile.language = currentLanguage;
    
    // Load translations
    await loadLanguage(currentLanguage);
    
    // Update UI elements with translations
    document.getElementById('step1Title').textContent = translations.welcome || 'Welcome';
    document.getElementById('startButton').textContent = translations.start_setup || 'Start Setup';
    
    // Move to next step
    nextStep(2);
}

// Initialize with browser language
function detectBrowserLanguage() {
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'id', 'zh', 'ja', 'ko', 'ar'];
    
    if (supportedLangs.includes(browserLang)) {
        return browserLang;
    }
    return 'en'; // Default to English
}

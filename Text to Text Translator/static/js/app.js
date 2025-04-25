document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const sourceText = document.getElementById('source-text');
    const targetText = document.getElementById('target-text');
    const sourceLanguage = document.getElementById('source-language');
    const targetLanguage = document.getElementById('target-language');
    const swapBtn = document.getElementById('swap-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const charCount = document.querySelector('.char-count');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const translationStatus = document.getElementById('translation-status');

    // Translation timeout (for debouncing)
    let translationTimeout;
    
    // Initialize translation (empty at start)
    updateCharCount();
    
    // Event listeners
    sourceText.addEventListener('input', handleTextInput);
    swapBtn.addEventListener('click', swapLanguages);
    clearBtn.addEventListener('click', clearText);
    copyBtn.addEventListener('click', copyTranslation);
    sourceLanguage.addEventListener('change', handleLanguageChange);
    targetLanguage.addEventListener('change', handleLanguageChange);

    // Handle text input with debounce to prevent excessive API calls
    function handleTextInput() {
        const text = sourceText.value;
        updateCharCount();
        
        // Clear previous timeout
        clearTimeout(translationTimeout);
        
        // Show loading after short delay (only for longer texts)
        if (text.length > 5) {
            showLoading();
        }
        
        // Debounce: Wait 500ms after typing stops before translating
        translationTimeout = setTimeout(() => {
            if (text.trim() === '') {
                targetText.textContent = '';
                hideLoading();
                translationStatus.textContent = 'Ready';
                return;
            }
            
            translateText(text);
        }, 500);
    }

    // Translate text via API
    function translateText(text) {
        const source = sourceLanguage.value;
        const target = targetLanguage.value;
        
        // Check if languages are the same
        if (source === target) {
            targetText.textContent = text;
            hideLoading();
            translationStatus.textContent = 'Same language';
            return;
        }
        
        fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                source_lang: source,
                target_lang: target
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Translation failed');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                showError(data.error);
                return;
            }
            
            // Display translation with typewriter effect
            displayTranslation(data.translation);
            hideLoading();
            translationStatus.textContent = 'Translated';
        })
        .catch(error => {
            showError(error.message || 'Translation failed');
        });
    }

    // Display translation with typewriter effect for short texts
    function displayTranslation(translation) {
        targetText.innerHTML = '';
        
        // For short translations (under 100 chars), use typewriter effect
        if (translation.length < 100) {
            const span = document.createElement('span');
            span.textContent = translation;
            span.className = 'typewriter-effect';
            targetText.appendChild(span);
            
            // Remove animation class after it completes
            setTimeout(() => {
                span.className = '';
            }, 1500);
        } else {
            // For longer texts, just show them directly
            targetText.textContent = translation;
        }
    }

    // Swap source and target languages
    function swapLanguages() {
        const sourceLang = sourceLanguage.value;
        const targetLang = targetLanguage.value;
        
        // Animation for swap button
        swapBtn.classList.add('rotating');
        setTimeout(() => swapBtn.classList.remove('rotating'), 500);
        
        // Swap the languages
        sourceLanguage.value = targetLang;
        targetLanguage.value = sourceLang;
        
        // Swap the text content if there's content in both panels
        if (sourceText.value && targetText.textContent) {
            sourceText.value = targetText.textContent;
            updateCharCount();
            translateText(sourceText.value);
        }
    }

    // Clear source text
    function clearText() {
        sourceText.value = '';
        targetText.textContent = '';
        updateCharCount();
        translationStatus.textContent = 'Ready';
    }

    // Copy translation to clipboard
    function copyTranslation() {
        const text = targetText.textContent;
        if (!text) return;
        
        navigator.clipboard.writeText(text)
            .then(() => {
                // Visual feedback for copy action
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }

    // Handle language change
    function handleLanguageChange() {
        const text = sourceText.value.trim();
        if (text) {
            translateText(text);
        }
    }

    // Update character count
    function updateCharCount() {
        const count = sourceText.value.length;
        charCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    }

    // Show loading indicator
    function showLoading() {
        loadingIndicator.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    }

    // Hide loading indicator
    function hideLoading() {
        loadingIndicator.classList.add('hidden');
    }

    // Show error message
    function showError(message) {
        hideLoading();
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        translationStatus.textContent = 'Error';
    }

    // Add animation class to loading indicator
    document.querySelectorAll('.text-panel').forEach(panel => {
        panel.addEventListener('mouseenter', function() {
            this.classList.add('panel-hover');
        });
        panel.addEventListener('mouseleave', function() {
            this.classList.remove('panel-hover');
        });
    });
});
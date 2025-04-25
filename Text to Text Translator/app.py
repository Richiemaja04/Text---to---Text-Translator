from flask import Flask, render_template, request, jsonify
from transformers import MarianMTModel, MarianTokenizer
import torch

app = Flask(__name__)

# Available language pairs with their model names
LANGUAGE_PAIRS = {
    "en-fr": "Helsinki-NLP/opus-mt-en-fr",
    "fr-en": "Helsinki-NLP/opus-mt-fr-en",
    "en-de": "Helsinki-NLP/opus-mt-en-de",
    "de-en": "Helsinki-NLP/opus-mt-de-en",
    "en-es": "Helsinki-NLP/opus-mt-en-es",
    "es-en": "Helsinki-NLP/opus-mt-es-en",
    "en-ru": "Helsinki-NLP/opus-mt-en-ru",
    "ru-en": "Helsinki-NLP/opus-mt-ru-en",
}

# Cache for loaded models
model_cache = {}

def get_model_and_tokenizer(source_lang, target_lang):
    """Load or fetch model from cache for the specified language pair"""
    lang_pair = f"{source_lang}-{target_lang}"
    
    if lang_pair not in LANGUAGE_PAIRS:
        return None, None
    
    if lang_pair not in model_cache:
        model_name = LANGUAGE_PAIRS[lang_pair]
        tokenizer = MarianTokenizer.from_pretrained(model_name)
        model = MarianMTModel.from_pretrained(model_name)
        model_cache[lang_pair] = (model, tokenizer)
    
    return model_cache[lang_pair]

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html', languages=list(set([p[:2] for p in LANGUAGE_PAIRS.keys()] + 
                                                       [p[3:] for p in LANGUAGE_PAIRS.keys()])))

@app.route('/translate', methods=['POST'])
def translate():
    """API endpoint for text translation"""
    data = request.get_json()
    text = data.get('text', '')
    source_lang = data.get('source_lang', 'en')
    target_lang = data.get('target_lang', 'fr')
    
    if not text:
        return jsonify({'translation': ''})
    
    lang_pair = f"{source_lang}-{target_lang}"
    
    if lang_pair not in LANGUAGE_PAIRS:
        return jsonify({'error': 'Language pair not supported'}), 400
    
    model, tokenizer = get_model_and_tokenizer(source_lang, target_lang)
    
    try:
        # Prepare the text for translation
        encoded = tokenizer.encode(text, return_tensors="pt")
        
        # Generate translation
        with torch.no_grad():
            outputs = model.generate(encoded, max_length=512)
        
        # Decode the generated tokens back to text
        translated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        return jsonify({'translation': translated_text})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/languages')
def get_languages():
    """Return available languages"""
    # Extract unique languages from the language pairs
    source_languages = set([pair.split('-')[0] for pair in LANGUAGE_PAIRS.keys()])
    target_languages = set([pair.split('-')[1] for pair in LANGUAGE_PAIRS.keys()])
    
    return jsonify({
        'source_languages': list(source_languages),
        'target_languages': list(target_languages)
    })

if __name__ == '__main__':
    app.run(debug=True)
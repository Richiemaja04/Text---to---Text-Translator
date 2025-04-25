# Real-Time Language Translator

A web-based application that provides real-time translation between multiple languages using Hugging Face's MarianMT models.

![Real-Time Translator Screenshot](https://github.com/yourusername/real-time-translator/raw/main/screenshots/translator-demo.png)

## Features

- **Real-time translation** with debounced input for efficient API usage
- **Multiple language support**: English, French, German, Spanish, and Russian
- **Sleek, responsive UI** with animation effects
- **Character count** for input text
- **Copy to clipboard** functionality for translated text
- **Language swapping** with a single click
- **Error handling** for unsupported language pairs or API issues
- **Optimized performance** with model caching

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Translation Engine**: Hugging Face's MarianMT models
- **Other Libraries**: PyTorch, Transformers

## Installation

### Prerequisites

- Python 3.8+
- pip

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/real-time-translator.git
   cd real-time-translator
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. Start the Flask server:
   ```bash
   python app.py
   ```

2. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000/
   ```

3. Enter text in the source language panel and see the real-time translation appear in the target panel.

## Project Structure

```
real-time-translator/
├── app.py                 # Flask application and translation logic
├── requirements.txt       # Project dependencies
├── static/
│   ├── css/
│   │   └── styles.css     # Application styling
│   └── js/
│       └── app.js         # Frontend JavaScript
└── templates/
    └── index.html         # Main application HTML
```

## How It Works

1. The user inputs text in the source language
2. After a brief pause in typing (debounce), the text is sent to the server
3. The server loads the appropriate MarianMT model for the language pair
4. The text is tokenized and processed by the model
5. The translated text is returned to the client
6. The client displays the translation with a typewriter effect (for short texts)

## Performance Optimization

The application uses model caching to avoid reloading translation models for repeated language pairs. This significantly improves performance for subsequent translations.

## Browser Compatibility

- Chrome: 88+
- Firefox: 85+
- Safari: 14+
- Edge: 88+

## Limitations

- Currently supports only the following language pairs:
  - English ↔ French
  - English ↔ German
  - English ↔ Spanish
  - English ↔ Russian
- Maximum input text length is determined by the model's constraints (typically 512 tokens)

## Future Improvements

- [ ] Add more language support
- [ ] Implement text-to-speech for translated content
- [ ] Add language detection for source text
- [ ] Improve mobile UI/UX
- [ ] Add user accounts for saving translation history

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Hugging Face](https://huggingface.co/) for providing the MarianMT models
- [Flask](https://flask.palletsprojects.com/) for the web framework
- [Helsinki-NLP](https://github.com/Helsinki-NLP) for training the translation models

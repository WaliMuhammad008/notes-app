# NoteMaster Pro - Copilot Instructions

This workspace contains an advanced, professional-level Notes App built with vanilla HTML, CSS, and JavaScript.

## Project Overview
- **Type**: Standalone Web Application
- **Technology**: HTML5, CSS3, JavaScript (ES6+)
- **Architecture**: Single-file class-based design
- **Data Storage**: LocalStorage API
- **No Dependencies**: Pure vanilla implementation

## Key Features
1. Full CRUD operations for notes
2. Advanced search and filtering
3. Custom categories with color coding
4. Dark/Light theme support
5. Export/Import functionality
6. Rich text editing
7. Responsive mobile design
8. Keyboard shortcuts
9. Autosave capability
10. Statistics tracking

## File Structure
```
Notes App/
├── index.html           - Main HTML (structures UI with all components)
├── styles.css           - Advanced CSS (1200+ lines, variables, animations)
├── script.js            - Core logic (NotesApp class, all functionality)
├── README.md            - User documentation
└── .github/
    └── copilot-instructions.md  - This file
```

## How to Use
1. Simply open `index.html` in any modern web browser
2. No build process, no server required
3. All data persists in browser's localStorage

## Key Code Patterns
- **Class-based design**: Single NotesApp class manages all functionality
- **DOM manipulation**: Direct querySelector and event listeners
- **localStorage**: JSON serialization for persistence
- **CSS Variables**: Theme system with CSS custom properties
- **Responsive Design**: Mobile-first approach with media queries

## Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern mobile browsers

## Code Quality Notes
- Well-organized with clear section comments
- Comprehensive error handling
- Follows modern JavaScript practices
- Responsive and accessible design
- No external dependencies

## For Extension or Modification
If you need to extend this app:
1. Add new methods to the NotesApp class in `script.js`
2. Update styles in `styles.css` using existing CSS variables
3. Add HTML elements in `index.html` and hook them up in constructor
4. Follow the existing naming conventions and patterns

## Performance
- Instant loading (no network requests)
- Smooth animations with CSS transitions
- Efficient DOM updates
- Optimized for even large note collections

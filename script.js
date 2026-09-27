// ==================== NOTESAPP CLASS ==================== 
class NotesApp {
    constructor() {
        this.notes = [];
        this.categories = [];
        this.currentNote = null;
        this.currentView = 'all';
        this.searchTerm = '';
        this.sortBy = 'newest';
        this.isGridView = true;
        this.darkMode = this.getDarkModeSetting();
        this.autosave = true;
        this.autosaveTimeout = null;

        this.initializeDOM();
        this.loadNotes();
        this.setupEventListeners();
        this.applyTheme();
        this.renderNotes();
    }

    // ==================== DOM INITIALIZATION ====================
    initializeDOM() {
        // Header buttons
        this.themeToggle = document.getElementById('themeToggle');
        this.menuToggle = document.getElementById('menuToggle');

        // Sidebar
        this.sidebar = document.getElementById('sidebar');
        this.closeSidebar = document.getElementById('closeSidebar');
        this.categoriesList = document.getElementById('categoriesList');
        this.addCategoryBtn = document.getElementById('addCategoryBtn');

        // Search & Filter
        this.searchInput = document.getElementById('searchInput');
        this.sortSelect = document.getElementById('sortBy');
        this.viewToggle = document.getElementById('viewToggle');

        // Main content
        this.notesContainer = document.getElementById('notesContainer');
        this.newNoteBtn = document.getElementById('newNoteBtn');

        // Editor panel
        this.editorPanel = document.getElementById('editorPanel');
        this.closeEditor = document.getElementById('closeEditor');
        this.noteTitle = document.getElementById('noteTitle');
        this.noteEditor = document.getElementById('noteEditor');
        this.wordCount = document.getElementById('wordCount');
        this.charCount = document.getElementById('charCount');
        this.lastModified = document.getElementById('lastModified');
        this.saveBtn = document.getElementById('saveBtn');
        this.discardBtn = document.getElementById('discardBtn');
        this.categorySelect = document.getElementById('categorySelect');
        this.colorPicker = document.getElementById('colorPicker');

        // Toolbar buttons
        this.toolbarButtons = {
            bold: document.getElementById('boldBtn'),
            italic: document.getElementById('italicBtn'),
            underline: document.getElementById('underlineBtn'),
            strike: document.getElementById('strikeBtn'),
            code: document.getElementById('codeBtn'),
            quote: document.getElementById('quoteBtn'),
            link: document.getElementById('linkBtn'),
        };

        // Statistics
        this.totalNotes = document.getElementById('totalNotes');
        this.totalWords = document.getElementById('totalWords');
        this.pinnedCount = document.getElementById('pinnedCount');

        // Modals
        this.modalOverlay = document.getElementById('modalOverlay');
        this.noteCardPopup = document.getElementById('noteCardPopup');
        this.closePopup = document.getElementById('closePopup');

        // Dialogs
        this.categoryDialog = document.getElementById('categoryDialog');
        this.categoryInput = document.getElementById('categoryInput');
        this.confirmCategoryBtn = document.getElementById('confirmCategoryBtn');
        this.cancelCategoryBtn = document.getElementById('cancelCategoryBtn');

        this.settingsDialog = document.getElementById('settingsDialog');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.closeSetting sBtn = document.getElementById('closeSetting sBtn');
        this.autosaveToggle = document.getElementById('autosaveToggle');
        this.spellcheckToggle = document.getElementById('spellcheckToggle');
        this.compactModeToggle = document.getElementById('compactModeToggle');

        this.shortcutsDialog = document.getElementById('shortcutsDialog');
        this.closeShortcutsBtn = document.getElementById('closeShortcutsBtn');

        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.importFile = document.getElementById('importFile');
    }

    // ==================== EVENT LISTENERS ====================
    setupEventListeners() {
        // Theme
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Sidebar
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        this.closeSidebar.addEventListener('click', () => this.closeSidebar.click());
        this.addCategoryBtn.addEventListener('click', () => this.openCategoryDialog());

        // Search & Filter
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderNotes();
        });
        this.sortSelect.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.renderNotes();
        });
        this.viewToggle.addEventListener('click', () => this.toggleViewMode());

        // Editor
        this.newNoteBtn.addEventListener('click', () => this.createNewNote());
        this.closeEditor.addEventListener('click', () => this.closeEditorPanel());
        this.saveBtn.addEventListener('click', () => this.saveNote());
        this.discardBtn.addEventListener('click', () => this.discardNote());

        this.noteTitle.addEventListener('input', () => this.handleEditorInput());
        this.noteEditor.addEventListener('input', () => this.handleEditorInput());
        this.colorPicker.addEventListener('change', () => {
            if (this.currentNote) {
                this.currentNote.color = this.colorPicker.value;
            }
        });

        // Toolbar
        Object.entries(this.toolbarButtons).forEach(([action, btn]) => {
            btn.addEventListener('click', () => this.applyTextFormatting(action));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Modal
        this.closePopup.addEventListener('click', () => this.closeNotePopup());
        this.modalOverlay.addEventListener('click', () => this.closeAllModals());

        // Category dialog
        this.confirmCategoryBtn.addEventListener('click', () => this.createCategory());
        this.cancelCategoryBtn.addEventListener('click', () => this.closeCategoryDialog());
        this.categoryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createCategory();
        });

        // Settings dialog
        this.settingsBtn.addEventListener('click', () => this.settingsDialog.showModal());
        this.closeSetting sBtn.addEventListener('click', () => this.settingsDialog.close());
        this.autosaveToggle.addEventListener('change', (e) => {
            this.autosave = e.target.checked;
            localStorage.setItem('autosave', this.autosave);
        });
        this.spellcheckToggle.addEventListener('change', (e) => {
            this.noteEditor.spellcheck = e.target.checked;
            localStorage.setItem('spellcheck', e.target.checked);
        });

        // Export/Import
        this.exportBtn.addEventListener('click', () => this.exportNotes());
        this.importBtn.addEventListener('click', () => this.importFile.click());
        this.importFile.addEventListener('change', (e) => this.importNotesFromFile(e));

        // Sidebar navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.changeView(view);
            });
        });
    }

    // ==================== THEME MANAGEMENT ====================
    toggleTheme() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        this.applyTheme();
    }

    applyTheme() {
        if (this.darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.themeToggle.textContent = '☀️';
        } else {
            document.documentElement.removeAttribute('data-theme');
            this.themeToggle.textContent = '🌙';
        }
    }

    getDarkModeSetting() {
        return localStorage.getItem('darkMode') === 'true';
    }

    // ==================== SIDEBAR MANAGEMENT ====================
    toggleSidebar() {
        this.sidebar.classList.toggle('active');
    }

    closeSidebarIfOpen() {
        this.sidebar.classList.remove('active');
    }

    // ==================== VIEW MANAGEMENT ====================
    changeView(view) {
        this.currentView = view;
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === view) {
                item.classList.add('active');
            }
        });
        this.closeSidebarIfOpen();
        this.renderNotes();
    }

    toggleViewMode() {
        this.isGridView = !this.isGridView;
        this.renderNotes();
    }

    // ==================== NOTE CRUD ====================
    createNewNote() {
        const newNote = {
            id: Date.now(),
            title: 'Untitled Note',
            content: '',
            category: '',
            color: '#4F46E5',
            createdAt: new Date(),
            modifiedAt: new Date(),
            pinned: false,
            archived: false,
            wordCount: 0,
        };

        this.notes.unshift(newNote);
        this.currentNote = newNote;
        this.openEditorPanel();
        this.updateCategorySelect();
        this.noteTitle.focus();
    }

    saveNote() {
        if (!this.currentNote) return;

        this.currentNote.title = this.noteTitle.value || 'Untitled Note';
        this.currentNote.content = this.noteEditor.innerHTML;
        this.currentNote.modifiedAt = new Date();
        this.currentNote.wordCount = this.countWords();

        this.saveNotes();
        this.closeEditorPanel();
        this.renderNotes();
        this.showNotification('Note saved successfully!');
    }

    discardNote() {
        if (confirm('Are you sure you want to discard this note?')) {
            if (this.currentNote && !this.notes.includes(this.currentNote)) {
                this.notes = this.notes.filter(n => n.id !== this.currentNote.id);
            }
            this.closeEditorPanel();
            this.renderNotes();
        }
    }

    deleteNote(noteId) {
        if (confirm('Delete this note permanently?')) {
            this.notes = this.notes.filter(n => n.id !== noteId);
            this.saveNotes();
            this.renderNotes();
            this.showNotification('Note deleted');
        }
    }

    editNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            this.currentNote = note;
            this.noteTitle.value = note.title;
            this.noteEditor.innerHTML = note.content;
            if (note.category) {
                this.categorySelect.value = note.category;
            }
            this.colorPicker.value = note.color;
            this.openEditorPanel();
            this.noteEditor.focus();
        }
    }

    togglePin(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            note.pinned = !note.pinned;
            this.saveNotes();
            this.renderNotes();
        }
    }

    toggleArchive(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            note.archived = !note.archived;
            this.saveNotes();
            this.renderNotes();
        }
    }

    // ==================== EDITOR MANAGEMENT ====================
    openEditorPanel() {
        this.editorPanel.classList.add('active');
        this.modalOverlay.classList.add('active');
    }

    closeEditorPanel() {
        this.editorPanel.classList.remove('active');
        this.modalOverlay.classList.remove('active');
        this.currentNote = null;
    }

    handleEditorInput() {
        if (this.autosave) {
            clearTimeout(this.autosaveTimeout);
            this.autosaveTimeout = setTimeout(() => {
                this.saveNote();
            }, 2000);
        }
        this.updateStats();
    }

    updateStats() {
        if (!this.currentNote) return;

        const wordCount = this.countWords();
        const charCount = this.noteEditor.textContent.length;
        const words = wordCount === 1 ? 'word' : 'words';
        const chars = charCount === 1 ? 'character' : 'characters';

        this.wordCount.textContent = `Words: ${wordCount}`;
        this.charCount.textContent = `Characters: ${charCount}`;
        this.lastModified.textContent = `Last modified: ${new Date().toLocaleTimeString()}`;

        this.currentNote.wordCount = wordCount;
    }

    countWords() {
        const text = this.noteEditor.textContent.trim();
        return text ? text.split(/\s+/).length : 0;
    }

    applyTextFormatting(action) {
        const selection = window.getSelection();
        if (selection.toString().length === 0) return;

        switch (action) {
            case 'bold':
                document.execCommand('bold', false, null);
                break;
            case 'italic':
                document.execCommand('italic', false, null);
                break;
            case 'underline':
                document.execCommand('underline', false, null);
                break;
            case 'strike':
                document.execCommand('strikethrough', false, null);
                break;
            case 'code':
                document.execCommand('formatBlock', false, '<pre>');
                break;
            case 'quote':
                document.execCommand('formatBlock', false, '<blockquote>');
                break;
            case 'link':
                const url = prompt('Enter URL:');
                if (url) document.execCommand('createLink', false, url);
                break;
        }
    }

    // ==================== CATEGORY MANAGEMENT ====================
    openCategoryDialog() {
        this.categoryInput.value = '';
        this.categoryDialog.showModal();
        this.categoryInput.focus();
    }

    closeCategoryDialog() {
        this.categoryDialog.close();
    }

    createCategory() {
        const name = this.categoryInput.value.trim();
        if (!name) return;

        if (this.categories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
            alert('Category already exists!');
            return;
        }

        const category = {
            id: Date.now(),
            name: name,
            color: this.generateRandomColor(),
        };

        this.categories.push(category);
        this.saveCategoriesAndSort();
        this.updateCategorySelect();
        this.renderCategories();
        this.closeCategoryDialog();
        this.showNotification(`Category "${name}" created!`);
    }

    deleteCategory(categoryId) {
        if (confirm('Delete this category?')) {
            this.categories = this.categories.filter(c => c.id !== categoryId);
            this.notes.forEach(note => {
                if (note.category === categoryId.toString()) {
                    note.category = '';
                }
            });
            this.saveCategoriesAndSort();
            this.updateCategorySelect();
            this.renderCategories();
            this.renderNotes();
        }
    }

    updateCategorySelect() {
        this.categorySelect.innerHTML = '<option value="">Select Category...</option>';
        this.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            this.categorySelect.appendChild(option);
        });
    }

    renderCategories() {
        this.categoriesList.innerHTML = '';
        this.categories.forEach(cat => {
            const categoryItem = document.createElement('button');
            categoryItem.className = 'category-item';
            categoryItem.innerHTML = `
                <span class="category-color" style="background-color: ${cat.color}"></span>
                <span>${cat.name}</span>
            `;
            categoryItem.addEventListener('click', () => this.filterByCategory(cat.id));
            this.categoriesList.appendChild(categoryItem);
        });
    }

    filterByCategory(categoryId) {
        this.searchTerm = '';
        this.searchInput.value = '';
        this.currentView = 'category';
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        this.renderNotes(categoryId);
    }

    // ==================== NOTE RENDERING ====================
    renderNotes(filterCategoryId = null) {
        let filteredNotes = this.notes;

        // Filter by view
        if (this.currentView === 'pinned') {
            filteredNotes = filteredNotes.filter(n => n.pinned && !n.archived);
        } else if (this.currentView === 'archived') {
            filteredNotes = filteredNotes.filter(n => n.archived);
        } else if (this.currentView === 'today') {
            const today = new Date().toDateString();
            filteredNotes = filteredNotes.filter(
                n => new Date(n.createdAt).toDateString() === today && !n.archived
            );
        } else {
            filteredNotes = filteredNotes.filter(n => !n.archived);
        }

        // Filter by category
        if (filterCategoryId) {
            filteredNotes = filteredNotes.filter(n => n.category == filterCategoryId);
        }

        // Filter by search term
        if (this.searchTerm) {
            filteredNotes = filteredNotes.filter(n =>
                n.title.toLowerCase().includes(this.searchTerm) ||
                n.content.toLowerCase().includes(this.searchTerm)
            );
        }

        // Sort notes
        filteredNotes = this.sortNotes(filteredNotes);

        // Render
        if (filteredNotes.length === 0) {
            this.notesContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No notes yet</h3>
                    <p>Create your first note to get started!</p>
                </div>
            `;
        } else {
            this.notesContainer.innerHTML = '';
            filteredNotes.forEach(note => {
                const noteElement = this.createNoteElement(note);
                this.notesContainer.appendChild(noteElement);
            });
        }

        this.updateStatsBar();
    }

    createNoteElement(note) {
        const preview = this.stripHtmlTags(note.content).substring(0, 150);
        const formattedDate = this.formatDate(new Date(note.modifiedAt));

        if (this.isGridView) {
            const card = document.createElement('div');
            card.className = 'note-card';
            if (note.pinned) card.classList.add('pinned');
            card.style.setProperty('--card-color', note.color);

            const category = this.categories.find(c => c.id == note.category);

            card.innerHTML = `
                <div class="note-card-header">
                    <h3 class="note-title">${this.escapeHtml(note.title)}</h3>
                    <div class="note-card-actions">
                        <button class="btn-card-action" title="Pin note">
                            ${note.pinned ? '📌' : '📍'}
                        </button>
                        <button class="btn-card-action" title="Delete note">🗑️</button>
                    </div>
                </div>
                <p class="note-preview">${preview || 'No content'}</p>
                <div class="note-meta">
                    <div>
                        ${category ? `<span class="note-category"><span class="category-color" style="background-color: ${category.color}"></span>${category.name}</span>` : ''}
                    </div>
                    <span class="note-time">${formattedDate}</span>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-card-action')) {
                    this.showNotePopup(note);
                }
            });

            card.querySelector('.btn-card-action:first-child').addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePin(note.id);
            });

            card.querySelector('.btn-card-action:last-child').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteNote(note.id);
            });

            return card;
        } else {
            const item = document.createElement('div');
            item.className = 'note-list-item';
            item.style.setProperty('--card-color', note.color);

            const category = this.categories.find(c => c.id == note.category);

            item.innerHTML = `
                <div class="note-list-content">
                    <h3 class="note-list-title">${this.escapeHtml(note.title)}</h3>
                    <p class="note-list-preview">${preview || 'No content'}</p>
                    <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-secondary);">
                        ${category ? `<span><span class="category-color" style="background-color: ${category.color}"></span>${category.name}</span>` : ''}
                        <span>${formattedDate}</span>
                        <span>${note.wordCount} words</span>
                    </div>
                </div>
            `;

            item.addEventListener('click', () => this.editNote(note.id));

            return item;
        }
    }

    showNotePopup(note) {
        const category = this.categories.find(c => c.id == note.category);
        document.getElementById('popupTitle').textContent = note.title;
        document.getElementById('popupBody').innerHTML = note.content;
        document.getElementById('popupTime').textContent =
            `Created: ${this.formatDate(new Date(note.createdAt))} | Modified: ${this.formatDate(new Date(note.modifiedAt))}`;

        this.noteCardPopup.classList.add('active');
        this.modalOverlay.classList.add('active');
    }

    closeNotePopup() {
        this.noteCardPopup.classList.remove('active');
        this.modalOverlay.classList.remove('active');
    }

    closeAllModals() {
        this.closeNotePopup();
        this.closeSidebarIfOpen();
    }

    sortNotes(notes) {
        const copy = [...notes];

        switch (this.sortBy) {
            case 'oldest':
                return copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'title':
                return copy.sort((a, b) => a.title.localeCompare(b.title));
            case 'modified':
                return copy.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));
            case 'wordcount':
                return copy.sort((a, b) => b.wordCount - a.wordCount);
            case 'newest':
            default:
                return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }

    // ==================== STATISTICS ====================
    updateStatsBar() {
        const visibleNotes = this.getVisibleNotes();
        const totalWords = visibleNotes.reduce((sum, n) => sum + (n.wordCount || 0), 0);
        const pinnedNotes = this.notes.filter(n => n.pinned && !n.archived).length;

        this.totalNotes.textContent = visibleNotes.length;
        this.totalWords.textContent = totalWords;
        this.pinnedCount.textContent = pinnedNotes;
    }

    getVisibleNotes() {
        if (this.currentView === 'pinned') {
            return this.notes.filter(n => n.pinned && !n.archived);
        } else if (this.currentView === 'archived') {
            return this.notes.filter(n => n.archived);
        } else if (this.currentView === 'today') {
            const today = new Date().toDateString();
            return this.notes.filter(
                n => new Date(n.createdAt).toDateString() === today && !n.archived
            );
        }
        return this.notes.filter(n => !n.archived);
    }

    // ==================== STORAGE ====================
    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    loadNotes() {
        const stored = localStorage.getItem('notes');
        this.notes = stored ? JSON.parse(stored) : [];

        const storedCategories = localStorage.getItem('categories');
        this.categories = storedCategories ? JSON.parse(storedCategories) : [];

        this.updateCategorySelect();
        this.renderCategories();
    }

    saveCategoriesAndSort() {
        localStorage.setItem('categories', JSON.stringify(this.categories));
    }

    exportNotes() {
        const data = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            notes: this.notes,
            categories: this.categories,
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notes-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showNotification('Notes exported successfully!');
    }

    importNotesFromFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.notes = [...this.notes, ...data.notes];
                if (data.categories) {
                    this.categories = [...this.categories, ...data.categories];
                }
                this.saveNotes();
                this.saveCategoriesAndSort();
                this.updateCategorySelect();
                this.renderCategories();
                this.renderNotes();
                this.showNotification(`${data.notes.length} notes imported successfully!`);
            } catch (error) {
                alert('Error importing notes. Please check the file format.');
                console.error(error);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    // ==================== KEYBOARD SHORTCUTS ====================
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + N: New note
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.createNewNote();
            return;
        }

        // Ctrl/Cmd + /: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            this.searchInput.focus();
            this.searchInput.select();
            return;
        }

        // Ctrl/Cmd + S: Save note
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (this.currentNote && this.editorPanel.classList.contains('active')) {
                this.saveNote();
            }
            return;
        }

        // Escape: Close editor/modals
        if (e.key === 'Escape') {
            if (this.editorPanel.classList.contains('active')) {
                this.closeEditorPanel();
            } else if (this.noteCardPopup.classList.contains('active')) {
                this.closeNotePopup();
            } else if (this.sidebar.classList.contains('active')) {
                this.closeSidebarIfOpen();
            }
            return;
        }

        // Editor shortcuts
        if (this.editorPanel.classList.contains('active')) {
            // Ctrl/Cmd + B: Bold
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.applyTextFormatting('bold');
                return;
            }

            // Ctrl/Cmd + I: Italic
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault();
                this.applyTextFormatting('italic');
                return;
            }

            // Ctrl/Cmd + U: Underline
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                e.preventDefault();
                this.applyTextFormatting('underline');
                return;
            }
        }
    }

    // ==================== UTILITY FUNCTIONS ====================
    formatDate(date) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else if (date.getFullYear() === today.getFullYear()) {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        } else {
            return date.toLocaleDateString([], { year: '2-digit', month: 'short', day: 'numeric' });
        }
    }

    stripHtmlTags(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    generateRandomColor() {
        const colors = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    showNotification(message) {
        // Simple notification (you can enhance this with a toast library)
        console.log(message);
    }
}

// ==================== INITIALIZE APP ====================
document.addEventListener('DOMContentLoaded', () => {
    window.notesApp = new NotesApp();
});

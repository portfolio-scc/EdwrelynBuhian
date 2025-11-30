// Diary CRUD functionality
let entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
let editingEntryId = null;

// DOM Elements
const diaryEntries = document.getElementById('diaryEntries');
const emptyState = document.getElementById('emptyState');
const entryModal = document.getElementById('entryModal');
const deleteModal = document.getElementById('deleteModal');
const entryForm = document.getElementById('entryForm');
const addEntryBtn = document.getElementById('addEntryBtn');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const modalTitle = document.getElementById('modalTitle');
const entryTitle = document.getElementById('entryTitle');
const entryMood = document.getElementById('entryMood');
const entryContent = document.getElementById('entryContent');

let deleteEntryId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderEntries();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    addEntryBtn.addEventListener('click', openAddModal);
    closeModal.addEventListener('click', closeEntryModal);
    cancelBtn.addEventListener('click', closeEntryModal);
    closeDeleteModal.addEventListener('click', closeDeleteModalFunc);
    cancelDeleteBtn.addEventListener('click', closeDeleteModalFunc);
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    entryForm.addEventListener('submit', handleSubmit);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === entryModal) closeEntryModal();
        if (e.target === deleteModal) closeDeleteModalFunc();
    });
}

// Render Entries
function renderEntries() {
    if (entries.length === 0) {
        emptyState.style.display = 'block';
        diaryEntries.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        diaryEntries.style.display = 'grid';
        
        diaryEntries.innerHTML = entries.map(entry => `
            <article class="diary-entry" data-id="${entry.id}">
                <div class="entry-header">
                    <div class="entry-mood">${entry.mood}</div>
                    <div class="entry-actions">
                        <button class="btn-icon edit-btn" onclick="editEntry('${entry.id}')" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.33301 14.6667L2.66634 10.6667L11.333 2.00004Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button class="btn-icon delete-btn" onclick="openDeleteModal('${entry.id}')" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M2 4H3.33333H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M5.33301 4.00004V2.66671C5.33301 2.31309 5.47348 1.97395 5.72353 1.7239C5.97358 1.47385 6.31272 1.33337 6.66634 1.33337H9.33301C9.68663 1.33337 10.0258 1.47385 10.2758 1.7239C10.5259 1.97395 10.6663 2.31309 10.6663 2.66671V4.00004M12.6663 4.00004V13.3334C12.6663 13.687 12.5259 14.0261 12.2758 14.2762C12.0258 14.5262 11.6866 14.6667 11.333 14.6667H4.66634C4.31272 14.6667 3.97358 14.5262 3.72353 14.2762C3.47348 14.0261 3.33301 13.687 3.33301 13.3334V4.00004H12.6663Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <h3 class="entry-title">${escapeHtml(entry.title)}</h3>
                <p class="entry-date">${formatDate(entry.date)}</p>
                <p class="entry-content">${escapeHtml(entry.content)}</p>
            </article>
        `).join('');
    }
}

// Open Add Modal
function openAddModal() {
    editingEntryId = null;
    modalTitle.textContent = 'New Entry';
    entryTitle.value = '';
    entryMood.value = '😊';
    entryContent.value = '';
    entryModal.style.display = 'flex';
    entryTitle.focus();
}

// Edit Entry
function editEntry(id) {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    
    editingEntryId = id;
    modalTitle.textContent = 'Edit Entry';
    entryTitle.value = entry.title;
    entryMood.value = entry.mood;
    entryContent.value = entry.content;
    entryModal.style.display = 'flex';
    entryTitle.focus();
}

// Close Entry Modal
function closeEntryModal() {
    entryModal.style.display = 'none';
    editingEntryId = null;
    entryForm.reset();
}

// Handle Form Submit
function handleSubmit(e) {
    e.preventDefault();
    
    const title = entryTitle.value.trim();
    const mood = entryMood.value;
    const content = entryContent.value.trim();
    
    if (!title || !content) return;
    
    if (editingEntryId) {
        // Update existing entry
        const entryIndex = entries.findIndex(e => e.id === editingEntryId);
        if (entryIndex !== -1) {
            entries[entryIndex] = {
                ...entries[entryIndex],
                title,
                mood,
                content,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Create new entry
        const newEntry = {
            id: generateId(),
            title,
            mood,
            content,
            date: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        entries.unshift(newEntry);
    }
    
    saveEntries();
    renderEntries();
    closeEntryModal();
}

// Open Delete Modal
function openDeleteModal(id) {
    deleteEntryId = id;
    deleteModal.style.display = 'flex';
}

// Close Delete Modal
function closeDeleteModalFunc() {
    deleteModal.style.display = 'none';
    deleteEntryId = null;
}

// Confirm Delete
function confirmDelete() {
    if (deleteEntryId) {
        entries = entries.filter(e => e.id !== deleteEntryId);
        saveEntries();
        renderEntries();
        closeDeleteModalFunc();
    }
}

// Save to LocalStorage
function saveEntries() {
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
}

// Generate ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

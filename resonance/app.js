// Resonance - Intelligence Sources Application
// Handles search, filter, CRUD operations for job board tracking

class ResonanceApp {
    constructor() {
        // Load sources from localStorage or use default data
        this.sources = this.loadSources();
        this.filteredSources = [...this.sources];
        this.editingId = null;
        this.deletingId = null;

        // DOM Elements
        this.tableBody = document.getElementById('tableBody');
        this.searchInput = document.getElementById('searchInput');
        this.statusFilter = document.getElementById('statusFilter');
        this.regionFilter = document.getElementById('regionFilter');
        this.attributeFilter = document.getElementById('attributeFilter');
        this.difficultyFilter = document.getElementById('difficultyFilter');
        this.activeCount = document.getElementById('activeCount');
        this.emptyState = document.getElementById('emptyState');
        this.tableContainer = document.querySelector('.table-container');

        // Modal Elements
        this.modalOverlay = document.getElementById('modalOverlay');
        this.modalTitle = document.getElementById('modalTitle');
        this.sourceForm = document.getElementById('sourceForm');
        this.addSourceBtn = document.getElementById('addSourceBtn');
        this.modalClose = document.getElementById('modalClose');
        this.cancelBtn = document.getElementById('cancelBtn');

        // Delete Modal Elements
        this.deleteModalOverlay = document.getElementById('deleteModalOverlay');
        this.deleteSourceName = document.getElementById('deleteSourceName');
        this.deleteModalClose = document.getElementById('deleteModalClose');
        this.deleteCancelBtn = document.getElementById('deleteCancelBtn');
        this.deleteConfirmBtn = document.getElementById('deleteConfirmBtn');

        // Toast
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');

        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateActiveCount();
    }

    loadSources() {
        const saved = localStorage.getItem('resonance_sources');
        if (saved) {
            return JSON.parse(saved);
        }
        // Use default data from data.js
        return [...jobBoards];
    }

    saveSources() {
        localStorage.setItem('resonance_sources', JSON.stringify(this.sources));
    }

    bindEvents() {
        // Search
        this.searchInput.addEventListener('input', () => this.applyFilters());

        // Filters
        this.statusFilter.addEventListener('change', () => this.applyFilters());
        this.regionFilter.addEventListener('change', () => this.applyFilters());
        this.attributeFilter.addEventListener('change', () => this.applyFilters());
        this.difficultyFilter.addEventListener('change', () => this.applyFilters());

        // Add Source Button
        this.addSourceBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openAddModal();
        });

        // Modal Close
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) this.closeModal();
        });

        // Form Submit
        this.sourceForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Delete Modal
        this.deleteModalClose.addEventListener('click', () => this.closeDeleteModal());
        this.deleteCancelBtn.addEventListener('click', () => this.closeDeleteModal());
        this.deleteModalOverlay.addEventListener('click', (e) => {
            if (e.target === this.deleteModalOverlay) this.closeDeleteModal();
        });
        this.deleteConfirmBtn.addEventListener('click', () => this.confirmDelete());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeDeleteModal();
            }
        });
    }

    applyFilters() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        const statusValue = this.statusFilter.value;
        const regionValue = this.regionFilter.value;
        const attributeValue = this.attributeFilter.value;
        const difficultyValue = this.difficultyFilter.value;

        this.filteredSources = this.sources.filter(source => {
            // Search filter
            const matchesSearch = !searchTerm ||
                source.name.toLowerCase().includes(searchTerm) ||
                source.focus.toLowerCase().includes(searchTerm) ||
                source.url.toLowerCase().includes(searchTerm) ||
                (source.bestForRoles && source.bestForRoles.toLowerCase().includes(searchTerm));

            // Status filter
            const matchesStatus = statusValue === 'all' || source.status === statusValue;

            // Region filter
            const matchesRegion = regionValue === 'all' || source.region.includes(regionValue);

            // Attribute filter
            let matchesAttribute = attributeValue === 'all';
            if (attributeValue === 'remote') matchesAttribute = source.remote === true;
            if (attributeValue === 'freelance') matchesAttribute = source.freelance === true;

            // Difficulty filter
            const matchesDifficulty = difficultyValue === 'all' ||
                source.difficulty === parseInt(difficultyValue);

            return matchesSearch && matchesStatus && matchesRegion && matchesAttribute && matchesDifficulty;
        });

        this.render();
    }

    render() {
        if (this.filteredSources.length === 0) {
            this.tableContainer.style.display = 'none';
            this.emptyState.style.display = 'block';
            return;
        }

        this.tableContainer.style.display = 'block';
        this.emptyState.style.display = 'none';

        this.tableBody.innerHTML = this.filteredSources.map(source => this.renderRow(source)).join('');

        // Bind row action events
        this.bindRowEvents();
    }

    renderRow(source) {
        const attributeTags = [];
        if (source.remote) attributeTags.push('<span class="tag">Remote</span>');
        if (source.freelance) attributeTags.push('<span class="tag freelance">Freelance</span>');

        // Format salary range
        let salaryHtml = '<span class="salary-range">—</span>';
        if (source.salaryMin && source.salaryMax) {
            salaryHtml = `<span class="salary-range"><span class="amount">$${this.formatNumber(source.salaryMin)}</span> – <span class="amount">$${this.formatNumber(source.salaryMax)}</span></span>`;
        } else if (source.salaryMin) {
            salaryHtml = `<span class="salary-range"><span class="amount">$${this.formatNumber(source.salaryMin)}+</span></span>`;
        }

        // Format difficulty stars
        const difficultyHtml = this.renderDifficulty(source.difficulty || 3);

        // Extract domain from URL
        const domain = source.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

        return `
            <tr data-id="${source.id}">
                <td>
                    <div class="source-name">
                        <strong>${this.escapeHtml(source.name)}</strong>
                        <a href="${source.url}" target="_blank" rel="noopener noreferrer" class="source-url">
                            ${this.escapeHtml(domain)}
                            <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </div>
                </td>
                <td>${this.escapeHtml(source.region)}</td>
                <td class="focus-area">${this.escapeHtml(source.focus)}</td>
                <td>${salaryHtml}</td>
                <td>
                    <div class="difficulty">${difficultyHtml}</div>
                </td>
                <td class="best-for">${this.escapeHtml(source.bestForRoles || '—')}</td>
                <td>
                    <div class="attributes">
                        ${attributeTags.join('')}
                    </div>
                </td>
                <td>
                    <span class="status-badge ${source.status}">
                        <span class="status-dot"></span>
                        ${source.status}
                    </span>
                </td>
                <td>
                    <div class="actions">
                        <button class="action-btn edit" data-id="${source.id}">Edit</button>
                        <button class="action-btn delete" data-id="${source.id}">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }

    renderDifficulty(level) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= level) {
                stars += '<span class="difficulty-star">★</span>';
            } else {
                stars += '<span class="difficulty-star empty">★</span>';
            }
        }
        return stars;
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'k';
        }
        return num.toString();
    }

    bindRowEvents() {
        // Edit buttons
        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.openEditModal(id);
            });
        });

        // Delete buttons
        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.openDeleteModal(id);
            });
        });
    }

    openAddModal() {
        this.editingId = null;
        this.modalTitle.textContent = 'Add New Source';
        this.sourceForm.reset();
        document.getElementById('attrRemote').checked = true;
        document.getElementById('attrFreelance').checked = false;
        document.getElementById('sourceDifficulty').value = '3';
        this.modalOverlay.classList.add('active');
        document.getElementById('sourceName').focus();
    }

    openEditModal(id) {
        const source = this.sources.find(s => s.id === id);
        if (!source) return;

        this.editingId = id;
        this.modalTitle.textContent = 'Edit Source';

        // Populate form
        document.getElementById('sourceName').value = source.name;
        document.getElementById('sourceUrl').value = source.url;
        document.getElementById('sourceRegion').value = source.region;
        document.getElementById('sourceStatus').value = source.status;
        document.getElementById('sourceFocus').value = source.focus;
        document.getElementById('sourceBestFor').value = source.bestForRoles || '';
        document.getElementById('sourceSalaryMin').value = source.salaryMin || '';
        document.getElementById('sourceSalaryMax').value = source.salaryMax || '';
        document.getElementById('sourceDifficulty').value = source.difficulty || 3;
        document.getElementById('attrRemote').checked = source.remote;
        document.getElementById('attrFreelance').checked = source.freelance;
        document.getElementById('sourceNotes').value = source.notes || '';

        this.modalOverlay.classList.add('active');
        document.getElementById('sourceName').focus();
    }

    closeModal() {
        this.modalOverlay.classList.remove('active');
        this.editingId = null;
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('sourceName').value.trim(),
            url: document.getElementById('sourceUrl').value.trim(),
            region: document.getElementById('sourceRegion').value,
            status: document.getElementById('sourceStatus').value,
            focus: document.getElementById('sourceFocus').value.trim(),
            bestForRoles: document.getElementById('sourceBestFor').value.trim(),
            salaryMin: parseInt(document.getElementById('sourceSalaryMin').value) || null,
            salaryMax: parseInt(document.getElementById('sourceSalaryMax').value) || null,
            difficulty: parseInt(document.getElementById('sourceDifficulty').value),
            remote: document.getElementById('attrRemote').checked,
            freelance: document.getElementById('attrFreelance').checked,
            notes: document.getElementById('sourceNotes').value.trim() || null
        };

        if (this.editingId) {
            // Update existing
            const index = this.sources.findIndex(s => s.id === this.editingId);
            if (index !== -1) {
                this.sources[index] = { ...this.sources[index], ...formData };
                this.showToast(`"${formData.name}" updated successfully!`);
            }
        } else {
            // Add new
            const newId = Math.max(...this.sources.map(s => s.id), 0) + 1;
            this.sources.push({ id: newId, ...formData });
            this.showToast(`"${formData.name}" added successfully!`);
        }

        this.saveSources();
        this.applyFilters();
        this.updateActiveCount();
        this.closeModal();
    }

    openDeleteModal(id) {
        const source = this.sources.find(s => s.id === id);
        if (!source) return;

        this.deletingId = id;
        this.deleteSourceName.textContent = source.name;
        this.deleteModalOverlay.classList.add('active');
    }

    closeDeleteModal() {
        this.deleteModalOverlay.classList.remove('active');
        this.deletingId = null;
    }

    confirmDelete() {
        if (!this.deletingId) return;

        const source = this.sources.find(s => s.id === this.deletingId);
        const sourceName = source ? source.name : 'Source';

        this.sources = this.sources.filter(s => s.id !== this.deletingId);
        this.saveSources();
        this.applyFilters();
        this.updateActiveCount();
        this.closeDeleteModal();
        this.showToast(`"${sourceName}" deleted successfully!`);
    }

    updateActiveCount() {
        const activeCount = this.sources.filter(s => s.status === 'active').length;
        this.activeCount.textContent = activeCount;
    }

    showToast(message) {
        this.toastMessage.textContent = message;
        this.toast.classList.add('show');

        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ResonanceApp();
});

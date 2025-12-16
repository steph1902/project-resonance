// Resonance - Popup Script
// Handles profile management, history display, and settings

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    loadProfile();
    loadHistory();
    loadSettings();
    bindEvents();
});

// Tab Navigation
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active content
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
        });
    });
}

// Profile Management
let skills = [];

function loadProfile() {
    chrome.runtime.sendMessage({ type: 'GET_PROFILE' }, (response) => {
        if (response.success && response.data) {
            const profile = response.data;

            document.getElementById('profileSummary').value = profile.summary || '';
            skills = profile.skills || [];
            renderSkills();

            if (profile.preferences) {
                document.getElementById('minSalary').value = profile.preferences.minSalary || 60000;
                document.getElementById('workMode').value = profile.preferences.workMode || 'remote';
            }
        }
    });
}

function renderSkills() {
    const container = document.getElementById('skillsTags');
    container.innerHTML = skills.map((skill, index) => `
        <span class="skill-tag">
            ${escapeHtml(skill)}
            <button data-index="${index}">×</button>
        </span>
    `).join('');

    // Bind remove buttons
    container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            skills.splice(index, 1);
            renderSkills();
        });
    });
}

function saveProfile() {
    const profile = {
        summary: document.getElementById('profileSummary').value.trim(),
        skills: skills,
        preferences: {
            minSalary: parseInt(document.getElementById('minSalary').value) || 60000,
            workMode: document.getElementById('workMode').value
        }
    };

    chrome.runtime.sendMessage({ type: 'SAVE_PROFILE', payload: profile }, (response) => {
        if (response.success) {
            showNotification('Profile saved!');
        }
    });
}

// History
function loadHistory() {
    chrome.runtime.sendMessage({ type: 'GET_HISTORY' }, (response) => {
        if (response.success) {
            renderHistory(response.data || []);
        }
    });
}

function renderHistory(history) {
    const container = document.getElementById('historyList');

    if (history.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No jobs analyzed yet.</p>
                <p class="small">Visit a job posting page to start!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = history.map(item => {
        const scoreClass = item.score >= 70 ? 'high' : item.score >= 50 ? 'medium' : 'low';
        const date = new Date(item.timestamp).toLocaleDateString();
        const domain = new URL(item.url).hostname.replace('www.', '');

        return `
            <div class="history-item">
                <div class="history-header">
                    <div class="history-title">${escapeHtml(item.title || 'Untitled Position')}</div>
                    <span class="history-score ${scoreClass}">${item.score}%</span>
                </div>
                <div class="history-meta">
                    <span>${escapeHtml(item.company || domain)}</span>
                    <span>•</span>
                    <span>${date}</span>
                    <a href="${item.url}" target="_blank">View →</a>
                </div>
            </div>
        `;
    }).join('');
}

// Settings
function loadSettings() {
    chrome.storage.local.get(['settings'], (result) => {
        const settings = result.settings || { autoAnalyze: true };
        document.getElementById('autoAnalyze').checked = settings.autoAnalyze !== false;
    });
}

function saveSettings() {
    const settings = {
        autoAnalyze: document.getElementById('autoAnalyze').checked
    };

    chrome.storage.local.set({ settings }, () => {
        showNotification('Settings saved!');
    });
}

function clearHistory() {
    if (confirm('Clear all history? This cannot be undone.')) {
        chrome.storage.local.set({ history: [] }, () => {
            loadHistory();
            showNotification('History cleared');
        });
    }
}

function clearAllData() {
    if (confirm('Clear ALL data including your profile? This cannot be undone.')) {
        chrome.storage.local.clear(() => {
            loadProfile();
            loadHistory();
            showNotification('All data cleared');
        });
    }
}

// Event Bindings
function bindEvents() {
    // Skills input
    const skillsInput = document.getElementById('skillsInput');
    skillsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && skillsInput.value.trim()) {
            e.preventDefault();
            const skill = skillsInput.value.trim();
            if (!skills.includes(skill)) {
                skills.push(skill);
                renderSkills();
            }
            skillsInput.value = '';
        }
    });

    // Save profile
    document.getElementById('saveProfile').addEventListener('click', saveProfile);

    // Settings
    document.getElementById('autoAnalyze').addEventListener('change', saveSettings);
    document.getElementById('clearHistory').addEventListener('click', clearHistory);
    document.getElementById('clearData').addEventListener('click', clearAllData);
}

// Utilities
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    // Simple notification - could be enhanced
    const btn = document.getElementById('saveProfile');
    const originalText = btn.textContent;
    btn.textContent = message;
    btn.style.background = '#6b9b6b';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
}

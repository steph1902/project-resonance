// Resonance - Content Script
// Injects into job posting pages and extracts job descriptions

(function () {
    'use strict';

    // Prevent multiple injections
    if (window.resonanceInjected) return;
    window.resonanceInjected = true;

    // Site-specific selectors for job descriptions
    const SITE_SELECTORS = {
        'linkedin.com': {
            description: '.jobs-description__container, .job-details-jobs-unified-top-card__job-insight, .jobs-box__html-content',
            title: '.job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title',
            company: '.job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name'
        },
        'indeed.com': {
            description: '#jobDescriptionText, .jobsearch-JobComponent-description',
            title: '.jobsearch-JobInfoHeader-title, [data-testid="jobsearch-JobInfoHeader-title"]',
            company: '.jobsearch-InlineCompanyRating-companyHeader'
        },
        'weworkremotely.com': {
            description: '.listing-container, .job-post-content',
            title: '.listing-header-container h1',
            company: '.company-card h2'
        },
        'remoteok.com': {
            description: '.description, .markdown',
            title: 'h2[itemprop="title"]',
            company: 'h3[itemprop="name"]'
        }
    };

    // Determine which site we're on
    function getSiteConfig() {
        const hostname = window.location.hostname;
        for (const site in SITE_SELECTORS) {
            if (hostname.includes(site)) {
                return SITE_SELECTORS[site];
            }
        }
        return null;
    }

    // Extract job data from page
    function extractJobData() {
        const config = getSiteConfig();
        if (!config) return null;

        const descEl = document.querySelector(config.description);
        const titleEl = document.querySelector(config.title);
        const companyEl = document.querySelector(config.company);

        if (!descEl) return null;

        return {
            description: descEl.innerText || descEl.textContent,
            title: titleEl ? titleEl.innerText.trim() : '',
            company: companyEl ? companyEl.innerText.trim() : '',
            url: window.location.href,
            site: window.location.hostname
        };
    }

    // Create and inject the Resonance widget
    function createWidget() {
        // Remove existing widget
        const existing = document.getElementById('resonance-widget');
        if (existing) existing.remove();

        const widget = document.createElement('div');
        widget.id = 'resonance-widget';
        widget.innerHTML = `
            <div class="resonance-badge" id="resonance-badge">
                <span class="resonance-icon">🎯</span>
                <span class="resonance-text">Analyzing...</span>
            </div>
            <div class="resonance-panel" id="resonance-panel">
                <div class="resonance-panel-header">
                    <span>Resonance Score</span>
                    <button class="resonance-close" id="resonance-close">×</button>
                </div>
                <div class="resonance-panel-body" id="resonance-body">
                    <div class="resonance-loading">Analyzing job description...</div>
                </div>
            </div>
        `;

        document.body.appendChild(widget);

        // Add event listeners
        document.getElementById('resonance-badge').addEventListener('click', togglePanel);
        document.getElementById('resonance-close').addEventListener('click', togglePanel);

        return widget;
    }

    function togglePanel() {
        const panel = document.getElementById('resonance-panel');
        panel.classList.toggle('active');
    }

    // Update widget with analysis results
    function updateWidget(result) {
        const badge = document.getElementById('resonance-badge');
        const body = document.getElementById('resonance-body');

        if (!badge || !body) return;

        // Update badge
        const scoreClass = result.score >= 70 ? 'high' : result.score >= 50 ? 'medium' : 'low';
        badge.className = `resonance-badge ${scoreClass}`;
        badge.querySelector('.resonance-text').textContent = `${result.score}%`;

        // Update panel body
        body.innerHTML = `
            <div class="resonance-score-display ${scoreClass}">
                <div class="resonance-score-value">${result.score}%</div>
                <div class="resonance-score-label">${result.recommendation || 'Match Score'}</div>
            </div>
            
            ${result.strengths && result.strengths.length > 0 ? `
                <div class="resonance-section">
                    <div class="resonance-section-title">✓ Your Strengths</div>
                    <div class="resonance-tags green">
                        ${result.strengths.map(s => `<span class="resonance-tag">${s}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${result.gaps && result.gaps.length > 0 ? `
                <div class="resonance-section">
                    <div class="resonance-section-title">⚠ Skills to Highlight</div>
                    <div class="resonance-tags yellow">
                        ${result.gaps.map(s => `<span class="resonance-tag">${s}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${result.redFlags && result.redFlags.length > 0 ? `
                <div class="resonance-section">
                    <div class="resonance-section-title">🚩 Red Flags</div>
                    <div class="resonance-tags red">
                        ${result.redFlags.map(s => `<span class="resonance-tag">${s}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${result.preferenceMatch ? `
                <div class="resonance-section">
                    <div class="resonance-section-title">Preferences</div>
                    <div class="resonance-list">
                        ${result.preferenceMatch.map(p => `<div>${p}</div>`).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    }

    // Show error in widget
    function showError(message) {
        const badge = document.getElementById('resonance-badge');
        const body = document.getElementById('resonance-body');

        if (badge) {
            badge.className = 'resonance-badge low';
            badge.querySelector('.resonance-text').textContent = 'Setup';
        }

        if (body) {
            body.innerHTML = `
                <div class="resonance-error">
                    <p>${message}</p>
                    <p>Click the extension icon to complete your profile.</p>
                </div>
            `;
        }
    }

    // Main initialization
    async function init() {
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Small delay for dynamic content
        await new Promise(resolve => setTimeout(resolve, 1500));

        const jobData = extractJobData();
        if (!jobData) {
            console.log('Resonance: No job description found on this page');
            return;
        }

        // Create widget
        createWidget();

        // Send to background for analysis
        chrome.runtime.sendMessage(
            { type: 'ANALYZE_JOB', payload: jobData },
            (response) => {
                if (chrome.runtime.lastError) {
                    showError('Could not analyze job');
                    return;
                }

                if (response.success) {
                    updateWidget(response.data);

                    // Save to history
                    chrome.runtime.sendMessage({
                        type: 'ADD_TO_HISTORY',
                        payload: {
                            ...jobData,
                            score: response.data.score
                        }
                    });
                } else {
                    showError(response.error || 'Analysis failed');
                }
            }
        );
    }

    // Handle SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(init, 1000);
        }
    }).observe(document.body, { childList: true, subtree: true });

    // Start
    init();
})();

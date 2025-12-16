// Resonance - Background Service Worker
// Handles message passing and job description analysis

// Initialize storage with default profile
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['profile'], (result) => {
        if (!result.profile) {
            chrome.storage.local.set({
                profile: {
                    summary: '',
                    skills: [],
                    projects: [],
                    preferences: {
                        minSalary: 60000,
                        workMode: 'remote',
                        regions: ['Global', 'US']
                    }
                },
                history: [],
                settings: {
                    language: 'en',
                    autoAnalyze: true
                }
            });
        }
    });
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'ANALYZE_JOB':
            handleJobAnalysis(message.payload)
                .then(result => sendResponse({ success: true, data: result }))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true; // Keep channel open for async response

        case 'GET_PROFILE':
            chrome.storage.local.get(['profile'], (result) => {
                sendResponse({ success: true, data: result.profile });
            });
            return true;

        case 'SAVE_PROFILE':
            chrome.storage.local.set({ profile: message.payload }, () => {
                sendResponse({ success: true });
            });
            return true;

        case 'GET_HISTORY':
            chrome.storage.local.get(['history'], (result) => {
                sendResponse({ success: true, data: result.history || [] });
            });
            return true;

        case 'ADD_TO_HISTORY':
            chrome.storage.local.get(['history'], (result) => {
                const history = result.history || [];
                history.unshift({
                    ...message.payload,
                    timestamp: Date.now()
                });
                // Keep only last 100 entries
                const trimmedHistory = history.slice(0, 100);
                chrome.storage.local.set({ history: trimmedHistory }, () => {
                    sendResponse({ success: true });
                });
            });
            return true;
    }
});

// Analyze job description against user profile
async function handleJobAnalysis(jobData) {
    const { profile } = await chrome.storage.local.get(['profile']);

    if (!profile || !profile.skills || profile.skills.length === 0) {
        return {
            score: 0,
            message: 'Please complete your profile first',
            strengths: [],
            gaps: [],
            redFlags: []
        };
    }

    const analysis = analyzeMatch(profile, jobData);
    return analysis;
}

// Core matching algorithm
function analyzeMatch(profile, jobData) {
    const jobText = (jobData.description || '').toLowerCase();
    const jobTitle = (jobData.title || '').toLowerCase();

    // 1. Skill Match (40%)
    const skillScore = calculateSkillMatch(profile.skills, jobText);

    // 2. Preference Match (40%)
    const preferenceScore = calculatePreferenceMatch(profile.preferences, jobData);

    // 3. Red Flag Detection (20% penalty)
    const { penalty, redFlags } = detectRedFlags(jobText);

    // Calculate final score
    const rawScore = (skillScore.score * 0.4) + (preferenceScore.score * 0.4);
    const finalScore = Math.max(0, Math.min(100, Math.round(rawScore - penalty)));

    return {
        score: finalScore,
        strengths: skillScore.matched,
        gaps: skillScore.missing,
        redFlags: redFlags,
        preferenceMatch: preferenceScore.details,
        recommendation: getRecommendation(finalScore)
    };
}

function calculateSkillMatch(userSkills, jobText) {
    const matched = [];
    const missing = [];

    // Common tech keywords to look for
    const techKeywords = [
        'javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'nodejs',
        'python', 'java', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin',
        'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
        'graphql', 'rest', 'api', 'microservices',
        'machine learning', 'ml', 'ai', 'llm', 'nlp', 'deep learning',
        'agile', 'scrum', 'ci/cd', 'devops', 'git'
    ];

    // Check user skills against job
    userSkills.forEach(skill => {
        const skillLower = skill.toLowerCase();
        if (jobText.includes(skillLower)) {
            matched.push(skill);
        }
    });

    // Find required skills user doesn't have
    techKeywords.forEach(keyword => {
        if (jobText.includes(keyword)) {
            const hasSkill = userSkills.some(s =>
                s.toLowerCase().includes(keyword) || keyword.includes(s.toLowerCase())
            );
            if (!hasSkill && !missing.includes(keyword)) {
                missing.push(keyword);
            }
        }
    });

    const matchRatio = userSkills.length > 0
        ? (matched.length / Math.max(matched.length + missing.length, 1)) * 100
        : 0;

    return {
        score: matchRatio,
        matched: matched.slice(0, 5),
        missing: missing.slice(0, 5)
    };
}

function calculatePreferenceMatch(preferences, jobData) {
    let score = 0;
    const details = [];

    // Remote check
    const jobText = (jobData.description || '').toLowerCase();
    const isRemote = jobText.includes('remote') ||
        jobText.includes('work from home') ||
        jobText.includes('wfh');

    if (preferences.workMode === 'remote' && isRemote) {
        score += 40;
        details.push('✓ Remote friendly');
    } else if (preferences.workMode === 'remote' && !isRemote) {
        details.push('✗ May not be remote');
    } else {
        score += 20;
    }

    // Salary check (if mentioned)
    const salaryMatch = jobText.match(/\$[\d,]+k?/g);
    if (salaryMatch) {
        score += 30;
        details.push('✓ Salary mentioned');
    }

    // English environment check
    if (jobData.language === 'en' || /english/.test(jobText)) {
        score += 30;
        details.push('✓ English environment');
    }

    return { score, details };
}

function detectRedFlags(jobText) {
    const redFlagPatterns = [
        { pattern: /we are a family/i, flag: '"We are a family" mentality' },
        { pattern: /work hard.{0,10}play hard/i, flag: 'Work hard, play hard culture' },
        { pattern: /must be available 24\/7/i, flag: '24/7 availability expected' },
        { pattern: /wear many hats/i, flag: 'Undefined role boundaries' },
        { pattern: /rockstar|ninja|guru/i, flag: 'Unrealistic expectations' },
        { pattern: /no ai tools/i, flag: 'AI tools prohibited' },
        { pattern: /fast.{0,10}paced.{0,20}stress/i, flag: 'High-stress environment' },
        { pattern: /unpaid|volunteer/i, flag: 'Unpaid work mentioned' }
    ];

    const foundFlags = [];
    let penalty = 0;

    redFlagPatterns.forEach(({ pattern, flag }) => {
        if (pattern.test(jobText)) {
            foundFlags.push(flag);
            penalty += 10;
        }
    });

    return { penalty: Math.min(penalty, 30), redFlags: foundFlags };
}

function getRecommendation(score) {
    if (score >= 85) return 'Strong Match — Apply with confidence!';
    if (score >= 70) return 'Good Fit — Worth applying';
    if (score >= 50) return 'Consider — Review requirements carefully';
    return 'Low Match — May not be the best fit';
}

// ============================================
// FIREBASE CONFIGURATION
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyDemoKey123456789", // Replace with your Firebase key
    authDomain: "ideahub-demo.firebaseapp.com",
    projectId: "ideahub-demo",
    storageBucket: "ideahub-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456789"
};

// Initialize Firebase (Note: For production, use actual Firebase credentials)
let db, auth, currentUser = null;

// Try to initialize Firebase if credentials are valid
try {
    if (firebaseConfig.apiKey !== "AIzaSyDemoKey123456789") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
        auth = firebase.auth();
    }
} catch (error) {
    console.log("Using demo mode without Firebase", error);
}

// ============================================
// FAKE DATA FOR DEMO
// ============================================
const fakeIdeas = [
    {
        id: 1,
        title: "AI-Powered Personal Fitness Coach",
        description: "An intelligent fitness application that uses computer vision and ML to monitor form and provide real-time feedback during workouts.",
        category: "technology",
        image: "💪",
        author: "Alex Johnson",
        votes: 256,
        comments: 12,
        timestamp: Date.now() - 86400000 * 3,
        views: 1523
    },
    {
        id: 2,
        title: "Sustainable Fashion Marketplace",
        description: "A platform connecting eco-conscious consumers with sustainable fashion brands, featuring carbon footprint tracking.",
        category: "business",
        image: "👗",
        author: "Sarah Chen",
        votes: 189,
        comments: 8,
        timestamp: Date.now() - 86400000 * 2,
        views: 1123
    },
    {
        id: 3,
        title: "Interactive 3D Learning Environment",
        description: "A virtual classroom using AR/VR to make complex concepts in physics and biology more engaging and interactive.",
        category: "education",
        image: "🎓",
        author: "Marcus Williams",
        votes: 342,
        comments: 24,
        timestamp: Date.now() - 86400000 * 1,
        views: 2845
    },
    {
        id: 4,
        title: "Regenerative Urban Garden Network",
        description: "Smart IoT-enabled community gardens that optimize water usage and share resources across neighborhoods.",
        category: "sustainability",
        image: "🌱",
        author: "Emma Davis",
        votes: 198,
        comments: 15,
        timestamp: Date.now() - 86400000 * 4,
        views: 987
    },
    {
        id: 5,
        title: "Neural Style Transfer Video Editor",
        description: "A creative video editing tool using neural networks to apply artistic styles in real-time to video content.",
        category: "design",
        image: "🎨",
        author: "James Wilson",
        votes: 267,
        comments: 19,
        timestamp: Date.now() - 86400000 * 5,
        views: 2156
    },
    {
        id: 6,
        title: "Metaverse Gaming Guild Platform",
        description: "A social platform for gamers to form guilds, share strategies, and compete across multiple metaverse platforms.",
        category: "entertainment",
        image: "🎮",
        author: "Lisa Thompson",
        votes: 445,
        comments: 31,
        timestamp: Date.now() - 86400000 * 6,
        views: 3567
    },
    {
        id: 7,
        title: "Zero-Waste Delivery System",
        description: "Packaging-free delivery service using reusable containers and smart logistics to minimize environmental impact.",
        category: "sustainability",
        image: "📦",
        author: "David Brown",
        votes: 223,
        comments: 11,
        timestamp: Date.now() - 86400000 * 7,
        views: 1434
    },
    {
        id: 8,
        title: "Blockchain-Based Digital Art Gallery",
        description: "NFT marketplace with AR viewing capabilities allowing artists to showcase and sell digital art globally.",
        category: "design",
        image: "🖼️",
        author: "Nina Kumar",
        votes: 389,
        comments: 28,
        timestamp: Date.now() - 86400000 * 8,
        views: 2789
    },
    {
        id: 9,
        title: "Smart Content Recommendation Engine",
        description: "AI algorithm that learns user preferences to recommend highly personalized content across all media platforms.",
        category: "technology",
        image: "🤖",
        author: "Robert Taylor",
        votes: 312,
        comments: 22,
        timestamp: Date.now() - 86400000 * 9,
        views: 2234
    },
    {
        id: 10,
        title: "Community Health Monitoring System",
        description: "Wearable tech network that monitors public health metrics and alerts authorities of potential outbreaks early.",
        category: "education",
        image: "❤️",
        author: "Sophie Martin",
        votes: 267,
        comments: 18,
        timestamp: Date.now() - 86400000 * 10,
        views: 1878
    },
    {
        id: 11,
        title: "Micro-Credential Learning Path",
        description: "Personalized learning paths that combine micro-credentials with industry partnerships for faster skill development.",
        category: "education",
        image: "📚",
        author: "Tom Anderson",
        votes: 194,
        comments: 14,
        timestamp: Date.now() - 86400000 * 11,
        views: 1245
    },
    {
        id: 12,
        title: "Ethical AI Framework Platform",
        description: "Open-source platform for developers to build and validate AI systems with built-in ethical guardrails.",
        category: "technology",
        image: "⚡",
        author: "Grace Lee",
        votes: 421,
        comments: 35,
        timestamp: Date.now() - 86400000 * 12,
        views: 3145
    }
];

const fakeUsers = [
    { name: "Grace Lee", ideas: 12, votes: 421, followers: 856 },
    { name: "Lisa Thompson", ideas: 9, votes: 445, followers: 723 },
    { name: "Marcus Williams", ideas: 8, votes: 342, followers: 612 },
    { name: "Nina Kumar", ideas: 11, votes: 389, followers: 645 },
    { name: "James Wilson", ideas: 7, votes: 267, followers: 534 },
    { name: "David Brown", ideas: 6, votes: 223, followers: 456 },
    { name: "Alex Johnson", ideas: 10, votes: 256, followers: 567 },
    { name: "Sarah Chen", ideas: 8, votes: 189, followers: 423 },
    { name: "Emma Davis", ideas: 9, votes: 198, followers: 489 },
    { name: "Robert Taylor", ideas: 11, votes: 312, followers: 678 }
];

const brainstormIdeas = [
    "AI tutors that adapt to learning styles",
    "Community-powered renewable energy grid",
    "Augmented reality furniture preview",
    "Subscription platform for skill sharing",
    "Blockchain transparency for supply chains",
    "Mental health AI chatbot with real therapist backup",
    "Crowdsourced urban planning tool"
];

// ============================================
// STATE MANAGEMENT
// ============================================
let appState = {
    allIdeas: [...fakeIdeas],
    currentUser: null,
    isLoggedIn: false,
    userProfile: {},
    currentFilter: "",
    sortBy: "newest"
};

// ============================================
// DOM ELEMENTS
// ============================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const loginBtn = document.getElementById('loginBtn');
const authModal = document.getElementById('authModal');
const submitModal = document.getElementById('submitModal');
const detailModal = document.getElementById('detailModal');
const profileModal = document.getElementById('profileModal');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const submitIdeaBtn = document.getElementById('submitIdeaBtn');
const ideaForm = document.getElementById('ideaForm');
const categoryFilter = document.getElementById('categoryFilter');
const sortBtn = document.getElementById('sortBtn');
const closeModals = document.querySelectorAll('.close-modal');
const brainstormInput = document.getElementById('brainstormInput');
const brainstormSubmitBtn = document.getElementById('brainstormSubmitBtn');

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    renderFeaturedIdeas();
    renderLeaderboard();
    renderBrainstormBoard();
    loadBrainstormIdeas();
});

// ============================================
// EVENT LISTENERS
// ============================================
function initializeEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const category = card.dataset.category;
            categoryFilter.value = category;
            showSection('ideas');
            filterIdeas();
        });
    });

    // Auth
    loginBtn.addEventListener('click', () => {
        authModal.classList.remove('hidden');
        resetAuthForms();
    });

    authTabs.forEach(tab => {
        tab.addEventListener('click', handleAuthTab);
    });

    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);

    // Idea submission
    submitIdeaBtn.addEventListener('click', () => {
        if (!appState.isLoggedIn) {
            authModal.classList.remove('hidden');
            return;
        }
        submitModal.classList.remove('hidden');
    });

    ideaForm.addEventListener('submit', handleIdeaSubmit);

    // Filtering and sorting
    categoryFilter.addEventListener('change', filterIdeas);
    sortBtn.addEventListener('click', toggleSort);

    // Brainstorm
    brainstormSubmitBtn.addEventListener('click', handleBrainstormSubmit);
    brainstormInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleBrainstormSubmit();
    });

    // Close modals
    closeModals.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.add('hidden');
        });
    });

    // Close modal when clicking outside
    [authModal, submitModal, detailModal, profileModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    });
}

// ============================================
// NAVIGATION
// ============================================
function handleNavigation(e) {
    e.preventDefault();
    const section = e.target.dataset.section;
    showSection(section);
    
    // Update active nav link
    navLinks.forEach(link => link.classList.remove('active'));
    e.target.classList.add('active');
}

function showSection(sectionId) {
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    // Update nav
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === sectionId);
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

// ============================================
// AUTHENTICATION
// ============================================
function handleAuthTab(e) {
    const tabName = e.target.dataset.tab;
    
    authTabs.forEach(tab => tab.classList.remove('active'));
    authForms.forEach(form => form.classList.remove('active'));
    
    e.target.classList.add('active');
    document.getElementById(`${tabName}Form`).classList.add('active');
}

function resetAuthForms() {
    loginForm.reset();
    registerForm.reset();
    document.querySelector('[data-tab="login"]').classList.add('active');
    document.querySelector('[data-tab="register"]').classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate login
    const userName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    
    appState.isLoggedIn = true;
    appState.currentUser = { email, name: userName };
    
    updateLoginUI();
    authModal.classList.add('hidden');
    showNotification(`Welcome back, ${userName}!`);
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    appState.isLoggedIn = true;
    appState.currentUser = { email, name };
    
    updateLoginUI();
    authModal.classList.add('hidden');
    showNotification(`Welcome to IdeaHub, ${name}!`);
}

function updateLoginUI() {
    if (appState.isLoggedIn) {
        loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${appState.currentUser.name}`;
        loginBtn.style.cursor = 'pointer';
        loginBtn.addEventListener('click', showUserProfile);
    } else {
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
}

function showUserProfile() {
    if (!appState.isLoggedIn) return;
    
    const userStats = fakeUsers.find(u => u.name === appState.currentUser.name) || fakeUsers[0];
    
    const profileHTML = `
        <div class="profile-header">
            <div class="profile-avatar">${appState.currentUser.name.charAt(0)}</div>
            <h2 class="profile-name">${appState.currentUser.name}</h2>
            <p class="subtitle">${appState.currentUser.email}</p>
        </div>
        
        <div class="profile-stats">
            <div class="profile-stat">
                <div class="profile-stat-value">${userStats.ideas}</div>
                <div class="profile-stat-label">Ideas Shared</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-value">${userStats.votes}</div>
                <div class="profile-stat-label">Total Votes</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-value">${userStats.followers}</div>
                <div class="profile-stat-label">Followers</div>
            </div>
        </div>
        
        <button class="btn-secondary logout-btn" onclick="handleLogout()">Logout</button>
    `;
    
    document.getElementById('profileContent').innerHTML = profileHTML;
    profileModal.classList.remove('hidden');
}

function handleLogout() {
    appState.isLoggedIn = false;
    appState.currentUser = null;
    updateLoginUI();
    profileModal.classList.add('hidden');
    showNotification('You have been logged out');
}

// ============================================
// IDEA SUBMISSION
// ============================================
function handleIdeaSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('ideaTitle').value;
    const description = document.getElementById('ideaDescription').value;
    const category = document.getElementById('ideaCategory').value;
    const image = document.getElementById('ideaImage').value || '💡';
    
    const newIdea = {
        id: appState.allIdeas.length + 1,
        title,
        description,
        category,
        image,
        author: appState.currentUser.name,
        votes: 0,
        comments: 0,
        timestamp: Date.now(),
        views: 0
    };
    
    appState.allIdeas.unshift(newIdea);
    
    ideaForm.reset();
    submitModal.classList.add('hidden');
    showNotification('Idea submitted successfully! 🎉');
    
    renderFeaturedIdeas();
}

// ============================================
// IDEAS RENDERING
// ============================================
function renderFeaturedIdeas() {
    const featuredContainer = document.getElementById('featuredIdeas');
    const featured = appState.allIdeas.slice(0, 3);
    
    featuredContainer.innerHTML = featured.map(idea => createIdeaCard(idea)).join('');
    addIdeaCardListeners();
}

function renderAllIdeas() {
    const ideasContainer = document.getElementById('ideasContainer');
    let filtered = appState.allIdeas;
    
    if (appState.currentFilter) {
        filtered = filtered.filter(idea => idea.category === appState.currentFilter);
    }
    
    // Sort
    if (appState.sortBy === 'newest') {
        filtered.sort((a, b) => b.timestamp - a.timestamp);
    } else if (appState.sortBy === 'popular') {
        filtered.sort((a, b) => b.votes - a.votes);
    } else if (appState.sortBy === 'trending') {
        filtered.sort((a, b) => (b.views + b.votes) - (a.views + a.votes));
    }
    
    ideasContainer.innerHTML = filtered.map(idea => createIdeaCard(idea)).join('');
    addIdeaCardListeners();
}

function createIdeaCard(idea) {
    const timeAgo = getTimeAgo(idea.timestamp);
    
    return `
        <div class="idea-card ${idea.category}" data-id="${idea.id}">
            <div class="idea-image fade-in">${idea.image}</div>
            <div class="idea-content">
                <div class="idea-header">
                    <span class="idea-category ${idea.category}">${idea.category}</span>
                </div>
                <h3>${idea.title}</h3>
                <p class="idea-description">${idea.description.substring(0, 100)}...</p>
                <div class="idea-author">
                    <div class="idea-avatar">${idea.author.charAt(0)}</div>
                    <div class="idea-author-info">
                        <div class="idea-author-name">${idea.author}</div>
                        <div class="idea-author-time">${timeAgo}</div>
                    </div>
                </div>
                <div class="idea-stats">
                    <div class="stat upvote-btn">
                        <i class="fas fa-arrow-up"></i>
                        <span>${idea.votes}</span>
                    </div>
                    <div class="stat comment-btn">
                        <i class="fas fa-comment"></i>
                        <span>${idea.comments}</span>
                    </div>
                    <div class="stat view-btn">
                        <i class="fas fa-eye"></i>
                        <span>${idea.views}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function addIdeaCardListeners() {
    document.querySelectorAll('.idea-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.stat')) {
                showIdeaDetail(parseInt(card.dataset.id));
            }
        });
        
        card.querySelector('.upvote-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            handleVote(parseInt(card.dataset.id));
        });
        
        card.querySelector('.comment-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            showIdeaDetail(parseInt(card.dataset.id));
        });
    });
}

function filterIdeas() {
    appState.currentFilter = categoryFilter.value;
    renderAllIdeas();
}

function toggleSort() {
    const sortOptions = ['newest', 'popular', 'trending'];
    const currentIndex = sortOptions.indexOf(appState.sortBy);
    appState.sortBy = sortOptions[(currentIndex + 1) % sortOptions.length];
    
    const sortLabels = { newest: 'Newest', popular: 'Most Popular', trending: 'Trending' };
    sortBtn.innerHTML = `<i class="fas fa-sort-down"></i> ${sortLabels[appState.sortBy]}`;
    
    renderAllIdeas();
}

// ============================================
// IDEA DETAIL
// ============================================
function showIdeaDetail(ideaId) {
    const idea = appState.allIdeas.find(i => i.id === ideaId);
    if (!idea) return;
    
    const comments = [
        { author: 'John Doe', text: 'This is an amazing idea! Great execution.' },
        { author: 'Jane Smith', text: 'Would love to collaborate on this project.' },
        { author: 'Mike Johnson', text: 'Interesting concept. How would the business model work?' }
    ];
    
    const detailHTML = `
        <div class="idea-detail-image">${idea.image}</div>
        
        <div class="idea-detail-header">
            <h2 class="idea-detail-title">${idea.title}</h2>
            <div class="idea-detail-meta">
                <span class="idea-category ${idea.category}">${idea.category.toUpperCase()}</span>
                <span style="color: var(--text-light);">By ${idea.author}</span>
                <span style="color: var(--text-light);">${getTimeAgo(idea.timestamp)}</span>
            </div>
        </div>
        
        <p class="idea-detail-description">${idea.description}</p>
        
        <div class="idea-stats" style="gap: 2rem; margin: 2rem 0;">
            <div class="stat upvote-btn" style="font-size: 1.1rem;">
                <i class="fas fa-arrow-up"></i>
                <span>${idea.votes}</span> Votes
            </div>
            <div class="stat comment-btn" style="font-size: 1.1rem;">
                <i class="fas fa-comment"></i>
                <span>${idea.comments}</span> Comments
            </div>
            <div class="stat view-btn" style="font-size: 1.1rem;">
                <i class="fas fa-eye"></i>
                <span>${idea.views}</span> Views
            </div>
        </div>
        
        <div class="idea-comments-section">
            <h3>Comments</h3>
            ${comments.map((comment, i) => `
                <div class="comment-item">
                    <div class="comment-author">${comment.author}</div>
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-time">${Math.floor(Math.random() * 24) + 1}h ago</div>
                </div>
            `).join('')}
            
            <div class="comment-input">
                <input type="text" placeholder="Add a comment..." id="commentInput">
                <button class="btn-primary" onclick="addComment(${ideaId})">Post</button>
            </div>
        </div>
    `;
    
    document.getElementById('ideaDetail').innerHTML = detailHTML;
    
    // Add vote listener
    document.querySelector('.upvote-btn').addEventListener('click', () => {
        handleVote(ideaId);
    });
    
    detailModal.classList.remove('hidden');
}

function addComment(ideaId) {
    const input = document.getElementById('commentInput');
    if (input.value.trim()) {
        const idea = appState.allIdeas.find(i => i.id === ideaId);
        if (idea) {
            idea.comments++;
            input.value = '';
            showNotification('Comment added!');
            showIdeaDetail(ideaId); // Refresh
        }
    }
}

function handleVote(ideaId) {
    const idea = appState.allIdeas.find(i => i.id === ideaId);
    if (idea) {
        idea.votes++;
        renderFeaturedIdeas();
        renderAllIdeas();
        showNotification('Vote counted! ✨');
    }
}

// ============================================
// LEADERBOARD
// ============================================
function renderLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    const sorted = [...fakeUsers].sort((a, b) => b.votes - a.votes);
    
    leaderboardList.innerHTML = sorted.map((user, index) => {
        let rankClass = 'other';
        if (index === 0) rankClass = 'first';
        else if (index === 1) rankClass = 'second';
        else if (index === 2) rankClass = 'third';
        
        return `
            <div class="leaderboard-item">
                <div class="rank-badge ${rankClass}">${index + 1}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${user.name}</div>
                    <div class="leaderboard-stats">
                        <span><i class="fas fa-lightbulb"></i> ${user.ideas} Ideas</span>
                        <span><i class="fas fa-users"></i> ${user.followers} Followers</span>
                    </div>
                </div>
                <div class="leaderboard-score">${user.votes} pts</div>
            </div>
        `;
    }).join('');
}

// ============================================
// BRAINSTORM BOARD
// ============================================
function renderBrainstormBoard() {
    const board = document.getElementById('brainstormBoard');
    board.innerHTML = brainstormIdeas.map(idea => `
        <div class="brainstorm-item">
            <div class="brainstorm-text">"${idea}"</div>
            <div class="brainstorm-author">
                <span>${fakeUsers[Math.floor(Math.random() * fakeUsers.length)].name}</span>
                <span>${Math.floor(Math.random() * 48) + 1}h</span>
            </div>
        </div>
    `).join('');
}

function loadBrainstormIdeas() {
    // Could load from localStorage or API
    renderBrainstormBoard();
}

function handleBrainstormSubmit() {
    const input = brainstormInput.value.trim();
    if (!input) return;
    
    if (!appState.isLoggedIn) {
        authModal.classList.remove('hidden');
        return;
    }
    
    brainstormIdeas.unshift(input);
    if (brainstormIdeas.length > 20) brainstormIdeas.pop();
    
    brainstormInput.value = '';
    renderBrainstormBoard();
    showNotification('Idea shared! 🚀');
}

// ============================================
// UTILITIES
// ============================================
function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary), var(--pink));
        color: white;
        padding: 1.2rem 2rem;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// PAGE LOAD
// ============================================
window.addEventListener('load', () => {
    renderAllIdeas();
    updateLoginUI();
});

// GoldPump JavaScript - Complete Functionality

// Game State
const gameState = {
    user: {
        id: null,
        username: 'Guest',
        avatar: 'https://goldpump.com/default-avatar.png',
        balance: {
            coins: 0.00,
            gems: 0
        },
        inventory: [],
        stats: {
            totalWinnings: 0,
            battlesWon: 0,
            battlesLost: 0,
            casesOpened: 0
        }
    },
    cases: [
        {
            id: 1,
            name: 'Fragile Case',
            price: 2.50,
            image: 'https://goldpump.com/cases/fragile.png',
            description: 'Low risk, low reward case perfect for beginners',
            items: [
                { name: 'Glock-18 | Water Elemental', rarity: 'Mil-Spec', value: 0.15, color: '#4b69ff', image: 'https://goldpump.com/items/glock-water.png' },
                { name: 'P250 | Muertos', rarity: 'Mil-Spec', value: 0.25, color: '#4b69ff', image: 'https://goldpump.com/items/p250-muertos.png' },
                { name: 'MP7 | Bloodsport', rarity: 'Restricted', value: 0.85, color: '#8847ff', image: 'https://goldpump.com/items/mp7-bloodsport.png' },
                { name: 'M4A4 | Howl', rarity: 'Contraband', value: 3500.00, color: '#e4ae39', image: 'https://goldpump.com/items/m4a4-howl.png' }
            ]
        },
        {
            id: 2,
            name: 'Prisma 2 Case',
            price: 12.50,
            image: 'https://goldpump.com/cases/prisma2.png',
            description: 'Vibrant skins with prismatic finishes',
            items: [
                { name: 'USP-S | Kill Confirmed', rarity: 'Mil-Spec', value: 0.45, color: '#4b69ff', image: 'https://goldpump.com/items/usp-killconfirmed.png' },
                { name: 'GALIL AR | Chatterbox', rarity: 'Classified', value: 3.50, color: '#d32ce6', image: 'https://goldpump.com/items/galil-chatterbox.png' },
                { name: 'AWP | Medusa', rarity: 'Covert', value: 1850.00, color: '#eb4b4b', image: 'https://goldpump.com/items/awp-medusa.png' },
                { name: 'Karambit | Fade', rarity: 'Covert', value: 5200.00, color: '#eb4b4b', image: 'https://goldpump.com/items/karambit-fade.png' }
            ]
        },
        {
            id: 3,
            name: 'Horizon Case',
            price: 15.50,
            image: 'https://goldpump.com/cases/horizon.png',
            description: 'Asian-themed skins with intricate designs',
            items: [
                { name: 'M4A1-S | Golden Coil', rarity: 'Mil-Spec', value: 0.65, color: '#4b69ff', image: 'https://goldpump.com/items/m4a1-goldencoil.png' },
                { name: 'AK-47 | Point Disarray', rarity: 'Restricted', value: 1.25, color: '#8847ff', image: 'https://goldpump.com/items/ak-pointdisarray.png' },
                { name: 'M9 Bayonet | Doppler', rarity: 'Covert', value: 850.00, color: '#eb4b4b', image: 'https://goldpump.com/items/m9-doppler.png' },
                { name: 'Gloves | Pandora\'s Box', rarity: 'Extraordinary', value: 4200.00, color: '#f38630', image: 'https://goldpump.com/items/gloves-pandora.png' }
            ]
        },
        {
            id: 4,
            name: 'Fracture Case',
            price: 17.50,
            image: 'https://goldpump.com/cases/fracture.png',
            description: 'Industrial and military themed skins',
            items: [
                { name: 'P2000 | Acid Etched', rarity: 'Mil-Spec', value: 0.35, color: '#4b69ff', image: 'https://goldpump.com/items/p2000-acidetched.png' },
                { name: 'M249 | Nebula Crusader', rarity: 'Classified', value: 4.50, color: '#d32ce6', image: 'https://goldpump.com/items/m249-nebula.png' },
                { name: 'AK-47 | Redline', rarity: 'Covert', value: 45.00, color: '#eb4b4b', image: 'https://goldpump.com/items/ak-redline.png' },
                { name: 'Butterfly Knife | Marble Fade', rarity: 'Covert', value: 1250.00, color: '#eb4b4b', image: 'https://goldpump.com/items/butterfly-marble.png' }
            ]
        }
    ],
    battles: [],
    leaderboard: {
        daily: [],
        weekly: [],
        monthly: [],
        alltime: []
    },
    currentBattle: null,
    currentCaseOpening: null
};

// Sound Manager
class SoundManager {
    constructor() {
        this.sounds = {
            openCase: document.getElementById('openCaseSound'),
            win: document.getElementById('winSound'),
            click: document.getElementById('clickSound'),
            coinflip: document.getElementById('coinflipSound')
        };
        this.enabled = true;
    }

    play(soundName) {
        if (this.enabled && this.sounds[soundName]) {
            this.sounds[soundName].play().catch(e => console.log('Sound play failed:', e));
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

const soundManager = new SoundManager();

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadCases();
    loadBattles();
    loadLeaderboard();
    updateUI();
    startRealTimeUpdates();
});

function initializeApp() {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('goldpump_user');
    if (savedUser) {
        gameState.user = JSON.parse(savedUser);
    } else {
        // Set initial balance for new users
        gameState.user.balance.coins = 100.00;
        gameState.user.balance.gems = 5;
        saveUserData();
    }

    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const target = this.getAttribute('href').substring(1);
            scrollToSection(target);
        });
    });

    // Case filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterCases(this.dataset.filter);
        });
    });

    // Leaderboard tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadLeaderboard(this.dataset.tab);
        });
    });

    // Close modals on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

function loadCases() {
    const casesGrid = document.getElementById('casesGrid');
    casesGrid.innerHTML = '';

    gameState.cases.forEach(caseItem => {
        const caseCard = document.createElement('div');
        caseCard.className = 'case-card';
        caseCard.innerHTML = `
            <div class="case-image">
                <img src="${caseItem.image}" alt="${caseItem.name}">
                <div class="case-price">$${caseItem.price.toFixed(2)}</div>
            </div>
            <div class="case-info">
                <h3 class="case-name">${caseItem.name}</h3>
                <p class="case-description">${caseItem.description}</p>
                <button class="open-case-btn" onclick="openCase(${caseItem.id})">Open Case</button>
            </div>
        `;
        casesGrid.appendChild(caseCard);
    });
}

function loadBattles() {
    const battlesList = document.getElementById('battlesList');
    battlesList.innerHTML = '';

    // Generate sample battles
    if (gameState.battles.length === 0) {
        gameState.battles = [
            {
                id: 1,
                mode: '1v1',
                creator: 'ProPlayer123',
                entryFee: 10.00,
                pot: 20.00,
                maxPlayers: 2,
                currentPlayers: 1,
                players: ['ProPlayer123'],
                status: 'waiting'
            },
            {
                id: 2,
                mode: '2v2',
                creator: 'TeamAlpha',
                entryFee: 25.00,
                pot: 100.00,
                maxPlayers: 4,
                currentPlayers: 3,
                players: ['TeamAlpha', 'Player2', 'Player3'],
                status: 'waiting'
            },
            {
                id: 3,
                mode: '3v3',
                creator: 'SquadGoals',
                entryFee: 50.00,
                pot: 300.00,
                maxPlayers: 6,
                currentPlayers: 4,
                players: ['SquadGoals', 'Player5', 'Player6', 'Player7'],
                status: 'waiting'
            }
        ];
    }

    gameState.battles.forEach(battle => {
        const battleCard = document.createElement('div');
        battleCard.className = 'battle-card';
        
        const playerSlots = [];
        for (let i = 0; i < battle.maxPlayers; i++) {
            const isFilled = i < battle.currentPlayers;
            playerSlots.push(`
                <div class="player-slot ${isFilled ? 'filled' : ''}">
                    ${isFilled ? battle.players[i][0] : '?'}
                </div>
            `);
        }

        battleCard.innerHTML = `
            <div class="battle-header">
                <span class="battle-mode">${battle.mode} - ${battle.creator}'s Battle</span>
                <span class="battle-pot">$${battle.pot.toFixed(2)}</span>
            </div>
            <div class="battle-players">
                ${playerSlots.join('')}
            </div>
            <button class="join-battle-btn" onclick="joinBattle(${battle.id})" ${battle.currentPlayers >= battle.maxPlayers ? 'disabled' : ''}>
                ${battle.currentPlayers >= battle.maxPlayers ? 'Full' : `Join ($${battle.entryFee.toFixed(2)})`}
            </button>
        `;
        battlesList.appendChild(battleCard);
    });
}

function loadLeaderboard(period = 'daily') {
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';

    // Generate sample leaderboard data
    const leaderboardData = [
        { rank: 1, name: 'DragonSlayer', avatar: 'https://goldpump.com/avatars/dragon.png', winnings: 15420.50, winRate: 68.5, battles: 342 },
        { rank: 2, name: 'CaseKing', avatar: 'https://goldpump.com/avatars/king.png', winnings: 12350.25, winRate: 72.1, battles: 298 },
        { rank: 3, name: 'LuckyStrike', avatar: 'https://goldpump.com/avatars/lucky.png', winnings: 9870.75, winRate: 65.8, battles: 276 },
        { rank: 4, name: 'SniperElite', avatar: 'https://goldpump.com/avatars/sniper.png', winnings: 7650.00, winRate: 59.3, battles: 234 },
        { rank: 5, name: 'RichBuilder', avatar: 'https://goldpump.com/avatars/rich.png', winnings: 5430.25, winRate: 55.7, battles: 198 }
    ];

    leaderboardData.forEach(player => {
        const row = document.createElement('div');
        row.className = 'leaderboard-row';
        
        let rankClass = '';
        if (player.rank === 1) rankClass = 'gold';
        else if (player.rank === 2) rankClass = 'silver';
        else if (player.rank === 3) rankClass = 'bronze';

        row.innerHTML = `
            <div class="rank ${rankClass}">#${player.rank}</div>
            <div class="player-info">
                <img src="${player.avatar}" alt="${player.name}" class="player-avatar">
                <span class="player-name">${player.name}</span>
            </div>
            <div class="winnings">$${player.winnings.toFixed(2)}</div>
            <div class="win-rate">${player.winRate}%</div>
            <div class="battle-count">${player.battles}</div>
        `;
        leaderboardBody.appendChild(row);
    });
}

function updateUI() {
    // Update balance display
    document.getElementById('coinBalance').textContent = gameState.user.balance.coins.toFixed(2);
    document.getElementById('gemBalance').textContent = gameState.user.balance.gems;
    
    // Update user info
    document.getElementById('username').textContent = gameState.user.username;
    document.getElementById('userAvatar').src = gameState.user.avatar;
    
    // Update inventory count
    document.getElementById('inventoryCount').textContent = gameState.user.inventory.length;
    
    // Update stats
    updateStats();
}

function updateStats() {
    // Animate stats
    animateValue('totalUsers', 2847293, 2847293 + Math.floor(Math.random() * 100), 2000);
    animateValue('totalWinnings', 47.2, 47.2 + Math.random() * 0.1, 2000, true);
    animateValue('onlineUsers', 28473, 28473 + Math.floor(Math.random() * 50), 2000);
}

function animateValue(id, start, end, duration, isDecimal = false) {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        if (isDecimal) {
            element.textContent = current.toFixed(1) + 'M';
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Case Opening Functions
function openCase(caseId) {
    const caseItem = gameState.cases.find(c => c.id === caseId);
    if (!caseItem) return;

    if (gameState.user.balance.coins < caseItem.price) {
        showNotification('Insufficient balance!', 'error');
        return;
    }

    // Deduct cost
    gameState.user.balance.coins -= caseItem.price;
    gameState.user.stats.casesOpened++;
    updateUI();
    saveUserData();

    // Start case opening animation
    startCaseOpening(caseItem);
}

function startCaseOpening(caseItem) {
    const modal = document.getElementById('caseOpeningModal');
    const itemReel = document.getElementById('itemReel');
    const resultContainer = document.getElementById('resultContainer');
    
    // Create spinning reel
    const reelItems = [];
    for (let i = 0; i < 20; i++) {
        const randomItem = getRandomItem(caseItem);
        reelItems.push(`
            <div class="reel-item">
                <img src="${randomItem.image}" alt="${randomItem.name}" style="width: 80px; height: 80px; object-fit: contain;">
                <div style="font-weight: 600; font-size: 0.8rem;">${randomItem.name}</div>
                <div style="color: ${randomItem.color}; font-size: 0.7rem;">${randomItem.rarity}</div>
            </div>
        `);
    }

    // Set winning item (middle position)
    const winningItem = getRandomItem(caseItem);
    reelItems[10] = `
        <div class="reel-item" style="border-color: #ffd700;">
            <img src="${winningItem.image}" alt="${winningItem.name}" style="width: 80px; height: 80px; object-fit: contain;">
            <div style="font-weight: 600; font-size: 0.8rem;">${winningItem.name}</div>
            <div style="color: ${winningItem.color}; font-size: 0.7rem;">${winningItem.rarity}</div>
        </div>
    `;

    itemReel.innerHTML = reelItems.join('');
    resultContainer.style.display = 'none';
    modal.style.display = 'block';
    
    soundManager.play('openCase');

    // Show result after animation
    setTimeout(() => {
        showCaseResult(winningItem);
    }, 3000);
}

function showCaseResult(item) {
    const resultContainer = document.getElementById('resultContainer');
    const wonItem = document.getElementById('wonItem');
    const sellPrice = document.getElementById('sellPrice');
    
    resultContainer.style.display = 'block';
    wonItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 120px; height: 120px; object-fit: contain; margin-bottom: 1rem;">
        <h3 style="color: ${item.color}; margin-bottom: 0.5rem;">${item.name}</h3>
        <p style="color: ${item.color}; font-size: 1.1rem; margin-bottom: 0.5rem;">${item.rarity}</p>
        <p style="font-size: 1.3rem; font-weight: 700; color: #ffd700;">Value: $${item.value.toFixed(2)}</p>
    `;
    
    sellPrice.textContent = item.value.toFixed(2);
    gameState.currentCaseOpening = item;
    
    // Add to inventory
    gameState.user.inventory.push(item);
    gameState.user.balance.coins += item.value;
    gameState.user.stats.totalWinnings += item.value;
    updateUI();
    saveUserData();
    
    soundManager.play('win');
}

function getRandomItem(caseItem) {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    // Rarity chances
    const chances = {
        'Mil-Spec': 80,
        'Restricted': 15,
        'Classified': 4,
        'Covert': 0.9,
        'Contraband': 0.1
    };
    
    const itemsByRarity = {};
    caseItem.items.forEach(item => {
        if (!itemsByRarity[item.rarity]) {
            itemsByRarity[item.rarity] = [];
        }
        itemsByRarity[item.rarity].push(item);
    });
    
    if (random < chances['Mil-Spec']) {
        return itemsByRarity['Mil-Spec'][Math.floor(Math.random() * itemsByRarity['Mil-Spec'].length)];
    } else if (random < chances['Mil-Spec'] + chances['Restricted']) {
        return itemsByRarity['Restricted'][Math.floor(Math.random() * itemsByRarity['Restricted'].length)];
    } else if (random < chances['Mil-Spec'] + chances['Restricted'] + chances['Classified']) {
        return itemsByRarity['Classified'][Math.floor(Math.random() * itemsByRarity['Classified'].length)];
    } else if (random < chances['Mil-Spec'] + chances['Restricted'] + chances['Classified'] + chances['Covert']) {
        return itemsByRarity['Covert'][Math.floor(Math.random() * itemsByRarity['Covert'].length)];
    } else {
        return itemsByRarity['Contraband'][Math.floor(Math.random() * itemsByRarity['Contraband'].length)];
    }
}

function sellItem() {
    if (gameState.currentCaseOpening) {
        gameState.user.balance.coins += gameState.currentCaseOpening.value;
        updateUI();
        saveUserData();
        closeModal('caseOpeningModal');
        showNotification('Item sold!', 'success');
    }
}

function keepItem() {
    closeModal('caseOpeningModal');
    showNotification('Item added to inventory!', 'success');
}

// Battle Functions
function createBattle() {
    document.getElementById('battleCreation').style.display = 'block';
    loadBattleCaseSelection();
}

function loadBattleCaseSelection() {
    const selection = document.getElementById('battleCaseSelection');
    selection.innerHTML = '';
    
    gameState.cases.forEach(caseItem => {
        const caseOption = document.createElement('div');
        caseOption.className = 'case-option';
        caseOption.innerHTML = `
            <img src="${caseItem.image}" alt="${caseItem.name}" style="width: 40px; height: 40px; object-fit: contain;">
            <span style="font-size: 0.8rem;">${caseItem.name}</span>
        `;
        caseOption.onclick = function() {
            document.querySelectorAll('.case-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        };
        selection.appendChild(caseOption);
    });
}

function confirmBattleCreation() {
    const mode = document.getElementById('battleMode').value;
    const rounds = document.getElementById('roundCount').value;
    const entryFee = parseFloat(document.getElementById('entryFee').value);
    const selectedCases = document.querySelectorAll('.case-option.selected');
    
    if (selectedCases.length === 0) {
        showNotification('Please select at least one case!', 'error');
        return;
    }
    
    if (gameState.user.balance.coins < entryFee) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    // Create battle
    const newBattle = {
        id: gameState.battles.length + 1,
        mode: mode,
        creator: gameState.user.username,
        entryFee: entryFee,
        pot: entryFee * (mode === '1v1' ? 2 : mode === '2v2' ? 4 : mode === '3v3' ? 6 : 8),
        maxPlayers: mode === '1v1' ? 2 : mode === '2v2' ? 4 : mode === '3v3' ? 6 : 8,
        currentPlayers: 1,
        players: [gameState.user.username],
        status: 'waiting',
        rounds: rounds,
        cases: Array.from(selectedCases).map(opt => opt.textContent.trim())
    };
    
    gameState.battles.unshift(newBattle);
    gameState.user.balance.coins -= entryFee;
    updateUI();
    saveUserData();
    
    cancelBattleCreation();
    loadBattles();
    showNotification('Battle created successfully!', 'success');
}

function cancelBattleCreation() {
    document.getElementById('battleCreation').style.display = 'none';
}

function joinBattle(battleId) {
    const battle = gameState.battles.find(b => b.id === battleId);
    if (!battle) return;
    
    if (battle.currentPlayers >= battle.maxPlayers) {
        showNotification('Battle is full!', 'error');
        return;
    }
    
    if (gameState.user.balance.coins < battle.entryFee) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    gameState.user.balance.coins -= battle.entryFee;
    battle.currentPlayers++;
    battle.pot += battle.entryFee;
    battle.players.push(gameState.user.username);
    
    updateUI();
    saveUserData();
    loadBattles();
    
    if (battle.currentPlayers === battle.maxPlayers) {
        startBattle(battle);
    } else {
        showNotification(`Joined ${battle.mode} battle!`, 'success');
    }
}

function startBattle(battle) {
    // Simulate battle
    setTimeout(() => {
        const winner = Math.random() < 0.5; // 50% chance to win
        const winAmount = battle.pot * 0.9; // 10% house edge
        
        if (winner) {
            gameState.user.balance.coins += winAmount;
            gameState.user.stats.battlesWon++;
            gameState.user.stats.totalWinnings += winAmount;
            showNotification(`You won the battle! +$${winAmount.toFixed(2)}`, 'success');
            soundManager.play('win');
        } else {
            gameState.user.stats.battlesLost++;
            showNotification('You lost the battle. Better luck next time!', 'error');
        }
        
        updateUI();
        saveUserData();
        
        // Remove battle from list
        gameState.battles = gameState.battles.filter(b => b.id !== battle.id);
        loadBattles();
    }, 2000);
}

// Modal Functions
function openDeposit() {
    document.getElementById('depositModal').style.display = 'block';
}

function openWithdraw() {
    document.getElementById('withdrawModal').style.display = 'block';
}

function openInventory() {
    loadInventory();
    document.getElementById('inventoryModal').style.display = 'block';
}

function loadInventory() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    const totalItems = document.getElementById('totalItems');
    const totalValue = document.getElementById('totalValue');
    
    inventoryGrid.innerHTML = '';
    let total = 0;
    
    gameState.user.inventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: contain;">
            <div class="item-name">${item.name}</div>
            <div class="item-value">$${item.value.toFixed(2)}</div>
        `;
        inventoryGrid.appendChild(itemElement);
        total += item.value;
    });
    
    totalItems.textContent = gameState.user.inventory.length;
    totalValue.textContent = `$${total.toFixed(2)}`;
}

function selectDepositMethod(method) {
    document.getElementById('depositForm').style.display = 'block';
    soundManager.play('click');
}

function selectWithdrawMethod(method) {
    document.getElementById('withdrawForm').style.display = 'block';
    soundManager.play('click');
}

function confirmDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    if (amount < 5) {
        showNotification('Minimum deposit is $5', 'error');
        return;
    }
    
    // Add bonus
    const bonus = amount * 0.05;
    gameState.user.balance.coins += amount + bonus;
    updateUI();
    saveUserData();
    
    closeModal('depositModal');
    showNotification(`Deposited $${amount.toFixed(2)} + $${bonus.toFixed(2)} bonus!`, 'success');
}

function confirmWithdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const address = document.getElementById('withdrawAddress').value;
    
    if (amount < 10) {
        showNotification('Minimum withdrawal is $10', 'error');
        return;
    }
    
    if (gameState.user.balance.coins < amount) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    const fee = amount * 0.025;
    gameState.user.balance.coins -= amount;
    updateUI();
    saveUserData();
    
    closeModal('withdrawModal');
    showNotification(`Withdrew $${(amount - fee).toFixed(2)} (Fee: $${fee.toFixed(2)})`, 'success');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    soundManager.play('click');
}

// User Functions
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('goldpump_user');
        location.reload();
    }
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        soundManager.play('click');
    }
}

function filterCases(filter) {
    const cases = document.querySelectorAll('.case-card');
    cases.forEach(caseCard => {
        caseCard.style.display = 'block';
    });
    // Add actual filtering logic here
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: var(--success);' : 'background: var(--danger);'}
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function saveUserData() {
    localStorage.setItem('goldpump_user', JSON.stringify(gameState.user));
}

// Real-time Updates
function startRealTimeUpdates() {
    // Update battles every 5 seconds
    setInterval(() => {
        updateBattles();
    }, 5000);
    
    // Update leaderboard every 10 seconds
    setInterval(() => {
        updateLeaderboard();
    }, 10000);
    
    // Update stats every 3 seconds
    setInterval(() => {
        updateStats();
    }, 3000);
    
    // Simulate other players joining battles
    setInterval(() => {
        simulateBattleActivity();
    }, 8000);
}

function updateBattles() {
    // Add random players to battles
    gameState.battles.forEach(battle => {
        if (battle.status === 'waiting' && Math.random() < 0.3) {
            if (battle.currentPlayers < battle.maxPlayers) {
                battle.currentPlayers++;
                battle.pot += battle.entryFee;
                const randomNames = ['Player' + Math.floor(Math.random() * 1000), 'Guest' + Math.floor(Math.random() * 1000)];
                battle.players.push(randomNames[Math.floor(Math.random() * randomNames.length)]);
            }
        }
    });
    
    // Remove completed battles
    gameState.battles = gameState.battles.filter(battle => {
        if (battle.currentPlayers === battle.maxPlayers && Math.random() < 0.1) {
            return false;
        }
        return true;
    });
    
    loadBattles();
}

function updateLeaderboard() {
    // Simulate leaderboard changes
    // This would normally fetch from server
}

function simulateBattleActivity() {
    // Add new battles occasionally
    if (Math.random() < 0.2 && gameState.battles.length < 10) {
        const modes = ['1v1', '2v2', '3v3'];
        const mode = modes[Math.floor(Math.random() * modes.length)];
        const entryFee = Math.random() * 50 + 10;
        
        const newBattle = {
            id: gameState.battles.length + 1,
            mode: mode,
            creator: 'RandomPlayer' + Math.floor(Math.random() * 1000),
            entryFee: entryFee,
            pot: entryFee * (mode === '1v1' ? 2 : mode === '2v2' ? 4 : 6),
            maxPlayers: mode === '1v1' ? 2 : mode === '2v2' ? 4 : 6,
            currentPlayers: 1,
            players: ['RandomPlayer' + Math.floor(Math.random() * 1000)],
            status: 'waiting'
        };
        
        gameState.battles.push(newBattle);
        loadBattles();
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-menu')) {
        document.getElementById('userDropdown').classList.remove('show');
    }
});

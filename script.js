// Game Data
const gameData = {
    cases: [
        {
            id: 1,
            name: "Starter Case",
            price: 50,
            icon: "📦",
            items: [
                { name: "Common Knife", rarity: "common", value: 10, color: "#808080" },
                { name: "Rare Pistol", rarity: "rare", value: 25, color: "#4169e1" },
                { name: "Epic Rifle", rarity: "epic", value: 100, color: "#9370db" },
                { name: "Legendary Sniper", rarity: "legendary", value: 500, color: "#ff8c00" }
            ]
        },
        {
            id: 2,
            name: "Warrior Case",
            price: 100,
            icon: "⚔️",
            items: [
                { name: "Steel Sword", rarity: "common", value: 20, color: "#808080" },
                { name: "Golden Axe", rarity: "rare", value: 50, color: "#4169e1" },
                { name: "Dragon Blade", rarity: "epic", value: 200, color: "#9370db" },
                { name: "Excalibur", rarity: "legendary", value: 1000, color: "#ff8c00" }
            ]
        },
        {
            id: 3,
            name: "Mystery Case",
            price: 250,
            icon: "🎰",
            items: [
                { name: "Lucky Charm", rarity: "common", value: 30, color: "#808080" },
                { name: "Magic Wand", rarity: "rare", value: 75, color: "#4169e1" },
                { name: "Crystal Orb", rarity: "epic", value: 300, color: "#9370db" },
                { name: "Ancient Artifact", rarity: "legendary", value: 1500, color: "#ff8c00" }
            ]
        },
        {
            id: 4,
            name: "Elite Case",
            price: 500,
            icon: "👑",
            items: [
                { name: "Silver Crown", rarity: "rare", value: 100, color: "#4169e1" },
                { name: "Golden Crown", rarity: "epic", value: 400, color: "#9370db" },
                { name: "Diamond Crown", rarity: "legendary", value: 2000, color: "#ff8c00" },
                { name: "Imperial Scepter", rarity: "mythic", value: 5000, color: "#ff1493" }
            ]
        }
    ],
    battles: [],
    leaderboard: [
        { rank: 1, name: "ProGamer123", wins: 245, profit: 15420, avatar: "🎮" },
        { rank: 2, name: "CaseKing", wins: 198, profit: 12350, avatar: "👑" },
        { rank: 3, name: "LuckyStrike", wins: 167, profit: 9870, avatar: "🍀" },
        { rank: 4, name: "SniperElite", wins: 143, profit: 7650, avatar: "🎯" },
        { rank: 5, name: "RichKid99", wins: 121, profit: 5430, avatar: "💰" }
    ],
    userInventory: [],
    userBalance: 1250
};

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    loadCases();
    loadBattles();
    loadLeaderboard();
    updateBalance();
    
    // Simulate real-time updates
    setInterval(updateBattles, 5000);
    setInterval(updateLeaderboard, 10000);
});

// Load cases
function loadCases() {
    const caseGrid = document.getElementById('caseGrid');
    caseGrid.innerHTML = '';
    
    gameData.cases.forEach(caseItem => {
        const caseCard = document.createElement('div');
        caseCard.className = 'case-card';
        caseCard.innerHTML = `
            <div class="case-image">${caseItem.icon}</div>
            <h3 class="case-name">${caseItem.name}</h3>
            <div class="case-price">${caseItem.price} 💎</div>
            <button class="open-case-btn" onclick="openCase(${caseItem.id})">Open Case</button>
        `;
        caseGrid.appendChild(caseCard);
    });
}

// Load battles
function loadBattles() {
    const battleList = document.getElementById('battleList');
    battleList.innerHTML = '';
    
    // Generate some sample battles
    if (gameData.battles.length === 0) {
        gameData.battles = [
            {
                id: 1,
                type: '1v1',
                pot: 200,
                maxPlayers: 2,
                currentPlayers: 1,
                creator: 'Player1',
                entryFee: 100
            },
            {
                id: 2,
                type: '2v2',
                pot: 800,
                maxPlayers: 4,
                currentPlayers: 3,
                creator: 'TeamAlpha',
                entryFee: 200
            },
            {
                id: 3,
                type: '3v3',
                pot: 1800,
                maxPlayers: 6,
                currentPlayers: 4,
                creator: 'SquadGoals',
                entryFee: 300
            }
        ];
    }
    
    gameData.battles.forEach(battle => {
        const battleCard = document.createElement('div');
        battleCard.className = 'battle-card';
        
        const playerSlots = [];
        for (let i = 0; i < battle.maxPlayers; i++) {
            const isFilled = i < battle.currentPlayers;
            playerSlots.push(`<div class="player-slot ${isFilled ? 'filled' : ''}">${isFilled ? '👤' : '?'}</div>`);
        }
        
        battleCard.innerHTML = `
            <div class="battle-info">
                <div class="battle-type">${battle.type} - ${battle.creator}'s Battle</div>
                <div class="battle-pot">Pot: ${battle.pot} 💎</div>
            </div>
            <div class="battle-players">
                ${playerSlots.join('')}
            </div>
            <button class="join-battle-btn" onclick="joinBattle(${battle.id})" ${battle.currentPlayers >= battle.maxPlayers ? 'disabled' : ''}>
                ${battle.currentPlayers >= battle.maxPlayers ? 'Full' : `Join (${battle.entryFee} 💎)`}
            </button>
        `;
        battleList.appendChild(battleCard);
    });
}

// Load leaderboard
function loadLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';
    
    gameData.leaderboard.forEach(player => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        
        let rankClass = '';
        if (player.rank === 1) rankClass = 'gold';
        else if (player.rank === 2) rankClass = 'silver';
        else if (player.rank === 3) rankClass = 'bronze';
        
        item.innerHTML = `
            <div class="rank ${rankClass}">#${player.rank}</div>
            <div class="player-info">
                <div class="player-name">${player.avatar} ${player.name}</div>
                <div class="player-wins">${player.wins} wins</div>
            </div>
            <div class="player-profit">+${player.profit} 💎</div>
        `;
        leaderboardList.appendChild(item);
    });
}

// Update balance display
function updateBalance() {
    document.getElementById('userBalance').textContent = gameData.userBalance.toLocaleString();
}

// Open case
function openCase(caseId) {
    const caseItem = gameData.cases.find(c => c.id === caseId);
    if (!caseItem) return;
    
    if (gameData.userBalance < caseItem.price) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    // Deduct cost
    gameData.userBalance -= caseItem.price;
    updateBalance();
    
    // Show case opening modal
    showCaseOpening(caseItem);
}

// Show case opening animation
function showCaseOpening(caseItem) {
    const modal = document.getElementById('caseOpeningModal');
    const itemReel = document.getElementById('itemReel');
    const resultContainer = document.getElementById('resultContainer');
    const wonItem = document.getElementById('wonItem');
    
    // Create reel items (multiple items for spinning effect)
    const reelItems = [];
    for (let i = 0; i < 20; i++) {
        const randomItem = getRandomItem(caseItem);
        reelItems.push(`
            <div class="reel-item">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${randomItem.icon || '🎁'}</div>
                <div style="font-weight: 600; font-size: 0.9rem;">${randomItem.name}</div>
                <div style="color: ${randomItem.color}; font-size: 0.8rem;">${randomItem.rarity}</div>
            </div>
        `);
    }
    
    // Set the winning item (middle item)
    const winningItem = getRandomItem(caseItem);
    reelItems[10] = `
        <div class="reel-item" style="border-color: #ffd700;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${winningItem.icon || '🎁'}</div>
            <div style="font-weight: 600; font-size: 0.9rem;">${winningItem.name}</div>
            <div style="color: ${winningItem.color}; font-size: 0.8rem;">${winningItem.rarity}</div>
        </div>
    `;
    
    itemReel.innerHTML = reelItems.join('');
    resultContainer.style.display = 'none';
    modal.style.display = 'block';
    
    // Show result after animation
    setTimeout(() => {
        resultContainer.style.display = 'block';
        wonItem.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">${winningItem.icon || '🎁'}</div>
            <h3 style="color: ${winningItem.color}; margin-bottom: 0.5rem;">${winningItem.name}</h3>
            <p style="color: ${winningItem.color}; font-size: 1.2rem; margin-bottom: 0.5rem;">${winningItem.rarity}</p>
            <p style="font-size: 1.5rem; font-weight: 700; color: #ffd700;">Value: ${winningItem.value} 💎</p>
        `;
        
        // Add to inventory
        gameData.userInventory.push(winningItem);
        gameData.userBalance += winningItem.value;
        updateBalance();
    }, 3000);
}

// Get random item from case
function getRandomItem(caseItem) {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    // Rarity chances
    const chances = {
        common: 60,
        rare: 30,
        epic: 8,
        legendary: 2,
        mythic: caseItem.items.some(item => item.rarity === 'mythic') ? 0.5 : 0
    };
    
    if (random < chances.common) {
        return caseItem.items.filter(item => item.rarity === 'common')[Math.floor(Math.random() * caseItem.items.filter(item => item.rarity === 'common').length)];
    } else if (random < chances.common + chances.rare) {
        return caseItem.items.filter(item => item.rarity === 'rare')[Math.floor(Math.random() * caseItem.items.filter(item => item.rarity === 'rare').length)];
    } else if (random < chances.common + chances.rare + chances.epic) {
        return caseItem.items.filter(item => item.rarity === 'epic')[Math.floor(Math.random() * caseItem.items.filter(item => item.rarity === 'epic').length)];
    } else if (random < chances.common + chances.rare + chances.epic + chances.legendary) {
        return caseItem.items.filter(item => item.rarity === 'legendary')[Math.floor(Math.random() * caseItem.items.filter(item => item.rarity === 'legendary').length)];
    } else {
        return caseItem.items.filter(item => item.rarity === 'mythic')[Math.floor(Math.random() * caseItem.items.filter(item => item.rarity === 'mythic').length)];
    }
}

// Close case opening
function closeCaseOpening() {
    document.getElementById('caseOpeningModal').style.display = 'none';
}

// Create battle
function createBattle() {
    const modal = document.getElementById('battleModal');
    const caseSelection = document.getElementById('caseSelection');
    
    // Load case options
    caseSelection.innerHTML = '';
    gameData.cases.forEach(caseItem => {
        const caseOption = document.createElement('div');
        caseOption.className = 'case-option';
        caseOption.innerHTML = `
            <div style="font-size: 2rem;">${caseItem.icon}</div>
            <div style="font-size: 0.8rem; font-weight: 600;">${caseItem.name}</div>
        `;
        caseOption.onclick = function() {
            document.querySelectorAll('.case-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        };
        caseSelection.appendChild(caseOption);
    });
    
    modal.style.display = 'block';
}

// Confirm battle creation
function confirmBattle() {
    const battleType = document.getElementById('battleType').value;
    const entryFee = parseInt(document.getElementById('entryFee').value);
    const selectedCases = document.querySelectorAll('.case-option.selected');
    
    if (selectedCases.length === 0) {
        showNotification('Please select at least one case!', 'error');
        return;
    }
    
    if (gameData.userBalance < entryFee) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    // Create battle
    const newBattle = {
        id: gameData.battles.length + 1,
        type: battleType,
        pot: entryFee * (battleType === '1v1' ? 2 : battleType === '2v2' ? 4 : 6),
        maxPlayers: battleType === '1v1' ? 2 : battleType === '2v2' ? 4 : 6,
        currentPlayers: 1,
        creator: 'You',
        entryFee: entryFee
    };
    
    gameData.battles.unshift(newBattle);
    gameData.userBalance -= entryFee;
    updateBalance();
    
    closeModal('battleModal');
    loadBattles();
    showNotification('Battle created successfully!', 'success');
}

// Join battle
function joinBattle(battleId) {
    const battle = gameData.battles.find(b => b.id === battleId);
    if (!battle) return;
    
    if (battle.currentPlayers >= battle.maxPlayers) {
        showNotification('Battle is full!', 'error');
        return;
    }
    
    if (gameData.userBalance < battle.entryFee) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    gameData.userBalance -= battle.entryFee;
    battle.currentPlayers++;
    battle.pot += battle.entryFee;
    
    updateBalance();
    loadBattles();
    
    if (battle.currentPlayers === battle.maxPlayers) {
        // Start battle simulation
        setTimeout(() => startBattle(battleId), 1000);
    }
    
    showNotification(`Joined ${battle.type} battle!`, 'success');
}

// Start battle (simulation)
function startBattle(battleId) {
    const battle = gameData.battles.find(b => b.id === battleId);
    if (!battle) return;
    
    // Simulate battle results
    const winner = Math.random() < 0.3; // 30% chance to win
    const winAmount = battle.pot * 0.9; // 10% house edge
    
    if (winner) {
        gameData.userBalance += winAmount;
        showNotification(`You won the battle! +${winAmount} 💎`, 'success');
    } else {
        showNotification('You lost the battle. Better luck next time!', 'error');
    }
    
    // Remove battle from list
    gameData.battles = gameData.battles.filter(b => b.id !== battleId);
    loadBattles();
    updateBalance();
}

// Update battles (simulate other players)
function updateBattles() {
    gameData.battles.forEach(battle => {
        if (Math.random() < 0.1 && battle.currentPlayers < battle.maxPlayers) {
            battle.currentPlayers++;
            battle.pot += battle.entryFee;
        }
    });
    
    // Remove completed battles
    gameData.battles = gameData.battles.filter(battle => battle.currentPlayers < battle.maxPlayers || Math.random() > 0.05);
    
    loadBattles();
}

// Update leaderboard
function updateLeaderboard() {
    // Simulate leaderboard changes
    gameData.leaderboard.forEach(player => {
        if (Math.random() < 0.1) {
            player.wins += Math.floor(Math.random() * 3);
            player.profit += Math.floor(Math.random() * 100);
        }
    });
    
    // Sort by profit
    gameData.leaderboard.sort((a, b) => b.profit - a.profit);
    
    // Update ranks
    gameData.leaderboard.forEach((player, index) => {
        player.rank = index + 1;
    });
    
    loadLeaderboard();
}

// Show inventory
function showInventory() {
    const modal = document.getElementById('inventoryModal');
    const inventoryGrid = document.getElementById('inventoryGrid');
    const inventoryValue = document.getElementById('inventoryValue');
    
    inventoryGrid.innerHTML = '';
    let totalValue = 0;
    
    gameData.userInventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.innerHTML = `
            <div class="item-image">${item.icon || '🎁'}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-value">${item.value} 💎</div>
        `;
        inventoryGrid.appendChild(itemElement);
        totalValue += item.value;
    });
    
    inventoryValue.textContent = totalValue;
    modal.style.display = 'block';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Show notification
function showNotification(message, type) {
    // Create notification element
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
        ${type === 'success' ? 'background: #4caf50;' : 'background: #f44336;'}
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Scroll to section
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Handle navigation clicks
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Handle inventory button click (if exists)
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'Inventory') {
        showInventory();
    }
});

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});

// Simulate real-time balance updates
setInterval(() => {
    if (Math.random() < 0.05) { // 5% chance every 5 seconds
        const bonus = Math.floor(Math.random() * 50) + 10;
        gameData.userBalance += bonus;
        updateBalance();
        showNotification(`Daily bonus! +${bonus} 💎`, 'success');
    }
}, 5000);

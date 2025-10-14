// ========================================
// Data Management
// ========================================

class TournamentManager {
    constructor() {
        this.teams = this.loadData('teams') || [];
        this.matches = this.loadData('matches') || [];
        this.groups = this.loadData('groups') || {};
        this.currentTeamId = null;
        this.currentMatchId = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupTeamsSection();
        this.setupMatchesSection();
        this.setupGroupsSection();
        this.updateDashboard();
        this.updateAllViews();
    }

    // Local Storage Management
    loadData(key) {
        const data = localStorage.getItem(`tournament_${key}`);
        return data ? JSON.parse(data) : null;
    }

    saveData(key, data) {
        localStorage.setItem(`tournament_${key}`, JSON.stringify(data));
    }

    // ========================================
    // Navigation
    // ========================================

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.dataset.section;
                
                // Update active states
                navButtons.forEach(b => b.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(targetSection).classList.add('active');

                // Update views when switching sections
                if (targetSection === 'groups') this.renderGroups();
                if (targetSection === 'knockout') this.renderKnockoutStage();
                if (targetSection === 'stats') this.renderStatistics();
            });
        });
    }

    // ========================================
    // Teams Management
    // ========================================

    setupTeamsSection() {
        const addTeamBtn = document.getElementById('add-team-btn');
        const teamModal = document.getElementById('team-modal');
        const closeBtn = teamModal.querySelector('.close');
        const cancelBtn = document.getElementById('cancel-team');
        const teamForm = document.getElementById('team-form');

        addTeamBtn.addEventListener('click', () => {
            this.currentTeamId = null;
            document.getElementById('team-modal-title').textContent = 'Adaugă Echipă Nouă';
            teamForm.reset();
            teamModal.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            teamModal.classList.remove('active');
        });

        cancelBtn.addEventListener('click', () => {
            teamModal.classList.remove('active');
        });

        teamForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTeam();
        });

        this.renderTeams();
    }

    saveTeam() {
        const name = document.getElementById('team-name').value;
        const logo = document.getElementById('team-logo').value || '⚽';
        const city = document.getElementById('team-city').value;
        const coach = document.getElementById('team-coach').value;

        const team = {
            id: this.currentTeamId || Date.now(),
            name,
            logo,
            city,
            coach,
            stats: { played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }
        };

        if (this.currentTeamId) {
            const index = this.teams.findIndex(t => t.id === this.currentTeamId);
            this.teams[index] = { ...this.teams[index], ...team };
        } else {
            this.teams.push(team);
        }

        this.saveData('teams', this.teams);
        this.renderTeams();
        this.updateDashboard();
        document.getElementById('team-modal').classList.remove('active');
    }

    editTeam(id) {
        const team = this.teams.find(t => t.id === id);
        if (!team) return;

        this.currentTeamId = id;
        document.getElementById('team-modal-title').textContent = 'Editează Echipa';
        document.getElementById('team-name').value = team.name;
        document.getElementById('team-logo').value = team.logo;
        document.getElementById('team-city').value = team.city || '';
        document.getElementById('team-coach').value = team.coach || '';
        document.getElementById('team-modal').classList.add('active');
    }

    deleteTeam(id) {
        if (!confirm('Sigur doriți să ștergeți această echipă?')) return;
        
        this.teams = this.teams.filter(t => t.id !== id);
        this.saveData('teams', this.teams);
        this.renderTeams();
        this.updateDashboard();
    }

    renderTeams() {
        const container = document.getElementById('teams-grid');
        
        if (this.teams.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">👥</div>
                    <p>Nu există echipe înregistrate. Adaugă prima echipă!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.teams.map(team => `
            <div class="team-card">
                <div class="team-card-header">
                    <div class="team-logo">
                        ${team.logo.startsWith('http') ? `<img src="${team.logo}" alt="${team.name}">` : team.logo}
                    </div>
                    <div class="team-info">
                        <h3>${team.name}</h3>
                        <p>${team.city || 'N/A'}</p>
                    </div>
                </div>
                <div class="team-details">
                    <div class="team-detail-row">
                        <span>Antrenor:</span>
                        <span><strong>${team.coach || 'N/A'}</strong></span>
                    </div>
                    <div class="team-detail-row">
                        <span>Meciuri:</span>
                        <span><strong>${team.stats.played}</strong></span>
                    </div>
                    <div class="team-detail-row">
                        <span>Puncte:</span>
                        <span><strong>${team.stats.points}</strong></span>
                    </div>
                    <div class="team-detail-row">
                        <span>Golaveraj:</span>
                        <span><strong>${team.stats.goalsFor}-${team.stats.goalsAgainst}</strong></span>
                    </div>
                </div>
                <div class="team-actions">
                    <button class="btn btn-small btn-primary" onclick="tournament.editTeam(${team.id})">
                        ✏️ Editează
                    </button>
                    <button class="btn btn-small btn-danger" onclick="tournament.deleteTeam(${team.id})">
                        🗑️ Șterge
                    </button>
                </div>
            </div>
        `).join('');
    }

    // ========================================
    // Matches Management
    // ========================================

    setupMatchesSection() {
        const addMatchBtn = document.getElementById('add-match-btn');
        const matchModal = document.getElementById('match-modal');
        const closeBtn = matchModal.querySelector('.close');
        const cancelBtn = document.getElementById('cancel-match');
        const matchForm = document.getElementById('match-form');

        addMatchBtn.addEventListener('click', () => {
            this.currentMatchId = null;
            this.populateTeamSelects();
            matchForm.reset();
            matchModal.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            matchModal.classList.remove('active');
        });

        cancelBtn.addEventListener('click', () => {
            matchModal.classList.remove('active');
        });

        matchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMatch();
        });

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderMatches(btn.dataset.filter);
            });
        });

        this.renderMatches();
    }

    populateTeamSelects() {
        const team1Select = document.getElementById('match-team1');
        const team2Select = document.getElementById('match-team2');

        const options = this.teams.map(team => 
            `<option value="${team.id}">${team.name}</option>`
        ).join('');

        team1Select.innerHTML = options;
        team2Select.innerHTML = options;
    }

    saveMatch() {
        const team1Id = parseInt(document.getElementById('match-team1').value);
        const team2Id = parseInt(document.getElementById('match-team2').value);
        const date = document.getElementById('match-date').value;
        const stage = document.getElementById('match-stage').value;
        const location = document.getElementById('match-location').value;

        if (team1Id === team2Id) {
            alert('O echipă nu poate juca împotriva ei însăși!');
            return;
        }

        const match = {
            id: this.currentMatchId || Date.now(),
            team1Id,
            team2Id,
            date,
            stage,
            location,
            score1: null,
            score2: null,
            status: 'scheduled'
        };

        if (this.currentMatchId) {
            const index = this.matches.findIndex(m => m.id === this.currentMatchId);
            this.matches[index] = { ...this.matches[index], ...match };
        } else {
            this.matches.push(match);
        }

        this.saveData('matches', this.matches);
        this.renderMatches();
        this.updateDashboard();
        document.getElementById('match-modal').classList.remove('active');
    }

    updateMatchScore(matchId, score1, score2) {
        const match = this.matches.find(m => m.id === matchId);
        if (!match) return;

        match.score1 = parseInt(score1);
        match.score2 = parseInt(score2);
        match.status = 'finished';

        // Update team statistics
        this.updateTeamStats(match);

        this.saveData('matches', this.matches);
        this.saveData('teams', this.teams);
        this.renderMatches();
        this.updateDashboard();
    }

    updateTeamStats(match) {
        const team1 = this.teams.find(t => t.id === match.team1Id);
        const team2 = this.teams.find(t => t.id === match.team2Id);

        if (!team1 || !team2) return;

        // Update played matches
        team1.stats.played++;
        team2.stats.played++;

        // Update goals
        team1.stats.goalsFor += match.score1;
        team1.stats.goalsAgainst += match.score2;
        team2.stats.goalsFor += match.score2;
        team2.stats.goalsAgainst += match.score1;

        // Update wins/draws/losses and points
        if (match.score1 > match.score2) {
            team1.stats.wins++;
            team1.stats.points += 3;
            team2.stats.losses++;
        } else if (match.score1 < match.score2) {
            team2.stats.wins++;
            team2.stats.points += 3;
            team1.stats.losses++;
        } else {
            team1.stats.draws++;
            team2.stats.draws++;
            team1.stats.points += 1;
            team2.stats.points += 1;
        }
    }

    renderMatches(filter = 'all') {
        const container = document.getElementById('matches-list');
        
        let filteredMatches = this.matches;
        if (filter === 'scheduled') {
            filteredMatches = this.matches.filter(m => m.status === 'scheduled');
        } else if (filter === 'finished') {
            filteredMatches = this.matches.filter(m => m.status === 'finished');
        }

        if (filteredMatches.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚽</div>
                    <p>Nu există meciuri ${filter === 'all' ? '' : filter === 'scheduled' ? 'programate' : 'finalizate'}.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredMatches.map(match => {
            const team1 = this.teams.find(t => t.id === match.team1Id);
            const team2 = this.teams.find(t => t.id === match.team2Id);
            
            if (!team1 || !team2) return '';

            const stageNames = {
                group: 'Faza Grupelor',
                r16: 'Optimi',
                quarter: 'Sferturi',
                semi: 'Semifinale',
                final: 'Finala'
            };

            return `
                <div class="match-card">
                    <div class="match-header">
                        <span class="match-stage">${stageNames[match.stage]}</span>
                        <span class="match-date">${new Date(match.date).toLocaleString('ro-RO')}</span>
                    </div>
                    <div class="match-teams">
                        <div class="match-team">
                            <div class="match-team-logo">${team1.logo.startsWith('http') ? `<img src="${team1.logo}" alt="${team1.name}">` : team1.logo}</div>
                            <div class="match-team-name">${team1.name}</div>
                        </div>
                        <div class="match-score">
                            ${match.status === 'finished' 
                                ? `${match.score1} - ${match.score2}`
                                : match.status === 'scheduled'
                                ? `<input type="number" min="0" id="score1-${match.id}" placeholder="0" style="width:40px"> - <input type="number" min="0" id="score2-${match.id}" placeholder="0" style="width:40px">`
                                : 'VS'
                            }
                        </div>
                        <div class="match-team right">
                            <div class="match-team-logo">${team2.logo.startsWith('http') ? `<img src="${team2.logo}" alt="${team2.name}">` : team2.logo}</div>
                            <div class="match-team-name">${team2.name}</div>
                        </div>
                    </div>
                    <div class="match-info">
                        <span>📍 ${match.location || 'Locație de stabilit'}</span>
                        <span class="match-status ${match.status}">${match.status === 'finished' ? '✅ Finalizat' : '📅 Programat'}</span>
                    </div>
                    ${match.status === 'scheduled' ? `
                        <div class="match-actions">
                            <button class="btn btn-small btn-success" onclick="tournament.updateMatchScore(${match.id}, document.getElementById('score1-${match.id}').value, document.getElementById('score2-${match.id}').value)">
                                ✅ Salvează Scor
                            </button>
                            <button class="btn btn-small btn-danger" onclick="tournament.deleteMatch(${match.id})">
                                🗑️ Șterge
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    deleteMatch(id) {
        if (!confirm('Sigur doriți să ștergeți acest meci?')) return;
        
        this.matches = this.matches.filter(m => m.id !== id);
        this.saveData('matches', this.matches);
        this.renderMatches();
        this.updateDashboard();
    }

    // ========================================
    // Groups Management
    // ========================================

    setupGroupsSection() {
        const generateBtn = document.getElementById('generate-groups-btn');
        generateBtn.addEventListener('click', () => this.generateGroups());
        this.renderGroups();
    }

    generateGroups() {
        if (this.teams.length < 4) {
            alert('Trebuie să existe cel puțin 4 echipe pentru a genera grupe!');
            return;
        }

        const numGroups = Math.ceil(this.teams.length / 4);
        const shuffled = [...this.teams].sort(() => Math.random() - 0.5);
        
        this.groups = {};
        const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        for (let i = 0; i < numGroups; i++) {
            const groupName = groupNames[i];
            this.groups[groupName] = shuffled.slice(i * 4, (i + 1) * 4).map(t => t.id);
        }

        this.saveData('groups', this.groups);
        this.renderGroups();
        alert('Grupele au fost generate cu succes!');
    }

    renderGroups() {
        const container = document.getElementById('groups-container');

        if (Object.keys(this.groups).length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <p>Nu există grupe generate. Generează grupele pentru turneu!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = Object.entries(this.groups).map(([groupName, teamIds]) => {
            const groupTeams = teamIds.map(id => this.teams.find(t => t.id === id)).filter(t => t);
            
            // Sort by points, then goal difference
            groupTeams.sort((a, b) => {
                if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
                const gdA = a.stats.goalsFor - a.stats.goalsAgainst;
                const gdB = b.stats.goalsFor - b.stats.goalsAgainst;
                return gdB - gdA;
            });

            return `
                <div class="group-card">
                    <h3>Grupa ${groupName}</h3>
                    <table class="group-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Echipă</th>
                                <th>J</th>
                                <th>V</th>
                                <th>E</th>
                                <th>Î</th>
                                <th>G</th>
                                <th>P</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${groupTeams.map((team, index) => `
                                <tr class="${index < 2 ? 'qualified' : ''}">
                                    <td>${index + 1}</td>
                                    <td class="team-name">${team.logo} ${team.name}</td>
                                    <td>${team.stats.played}</td>
                                    <td>${team.stats.wins}</td>
                                    <td>${team.stats.draws}</td>
                                    <td>${team.stats.losses}</td>
                                    <td>${team.stats.goalsFor}-${team.stats.goalsAgainst}</td>
                                    <td><strong>${team.stats.points}</strong></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }).join('');
    }

    // ========================================
    // Knockout Stage
    // ========================================

    renderKnockoutStage() {
        const stages = {
            'r16': 'round-of-16',
            'quarter': 'quarter-finals',
            'semi': 'semi-finals',
            'final': 'final'
        };

        Object.entries(stages).forEach(([stage, containerId]) => {
            const stageMatches = this.matches.filter(m => m.stage === stage);
            const container = document.getElementById(containerId);

            if (stageMatches.length === 0) {
                container.innerHTML = `<div class="empty-state"><p>Niciun meci</p></div>`;
                return;
            }

            container.innerHTML = stageMatches.map(match => {
                const team1 = this.teams.find(t => t.id === match.team1Id);
                const team2 = this.teams.find(t => t.id === match.team2Id);

                if (!team1 || !team2) return '';

                const winner = match.status === 'finished' 
                    ? (match.score1 > match.score2 ? team1.id : match.score2 > match.score1 ? team2.id : null)
                    : null;

                return `
                    <div class="bracket-match">
                        <div class="bracket-team ${winner === team1.id ? 'winner' : ''}">
                            <span class="bracket-team-name">${team1.logo} ${team1.name}</span>
                            <span class="bracket-team-score">${match.score1 !== null ? match.score1 : '-'}</span>
                        </div>
                        <div class="bracket-team ${winner === team2.id ? 'winner' : ''}">
                            <span class="bracket-team-name">${team2.logo} ${team2.name}</span>
                            <span class="bracket-team-score">${match.score2 !== null ? match.score2 : '-'}</span>
                        </div>
                    </div>
                `;
            }).join('');
        });
    }

    // ========================================
    // Statistics
    // ========================================

    renderStatistics() {
        this.renderTopScorers();
        this.renderTeamsRanking();
        this.renderGeneralStats();
    }

    renderTopScorers() {
        const container = document.getElementById('top-scorers');
        
        // For now, show teams with most goals
        const topScorers = [...this.teams]
            .sort((a, b) => b.stats.goalsFor - a.stats.goalsFor)
            .slice(0, 5);

        if (topScorers.length === 0) {
            container.innerHTML = '<p class="text-secondary">Nicio statistică disponibilă</p>';
            return;
        }

        container.innerHTML = topScorers.map((team, index) => `
            <div class="stats-item">
                <div class="stats-item-rank">${index + 1}</div>
                <div class="stats-item-info">
                    <div class="stats-item-name">${team.logo} ${team.name}</div>
                    <div class="stats-item-detail">Goluri marcate</div>
                </div>
                <div class="stats-item-value">${team.stats.goalsFor}</div>
            </div>
        `).join('');
    }

    renderTeamsRanking() {
        const container = document.getElementById('teams-ranking');
        
        const ranking = [...this.teams].sort((a, b) => {
            if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
            const gdA = a.stats.goalsFor - a.stats.goalsAgainst;
            const gdB = b.stats.goalsFor - b.stats.goalsAgainst;
            return gdB - gdA;
        }).slice(0, 10);

        if (ranking.length === 0) {
            container.innerHTML = '<p class="text-secondary">Nicio echipă disponibilă</p>';
            return;
        }

        container.innerHTML = ranking.map((team, index) => `
            <div class="stats-item">
                <div class="stats-item-rank">${index + 1}</div>
                <div class="stats-item-info">
                    <div class="stats-item-name">${team.logo} ${team.name}</div>
                    <div class="stats-item-detail">V:${team.stats.wins} E:${team.stats.draws} Î:${team.stats.losses}</div>
                </div>
                <div class="stats-item-value">${team.stats.points} pct</div>
            </div>
        `).join('');
    }

    renderGeneralStats() {
        const container = document.getElementById('general-stats');
        
        const totalGoals = this.teams.reduce((sum, team) => sum + team.stats.goalsFor, 0);
        const totalMatches = this.matches.filter(m => m.status === 'finished').length;
        const avgGoalsPerMatch = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(2) : 0;

        const stats = [
            { label: 'Total Meciuri', value: this.matches.length },
            { label: 'Meciuri Finalizate', value: totalMatches },
            { label: 'Total Goluri', value: totalGoals },
            { label: 'Media Goluri/Meci', value: avgGoalsPerMatch },
            { label: 'Total Echipe', value: this.teams.length }
        ];

        container.innerHTML = stats.map(stat => `
            <div class="stats-item">
                <div class="stats-item-info">
                    <div class="stats-item-name">${stat.label}</div>
                </div>
                <div class="stats-item-value">${stat.value}</div>
            </div>
        `).join('');
    }

    // ========================================
    // Dashboard
    // ========================================

    updateDashboard() {
        document.getElementById('total-teams').textContent = this.teams.length;
        document.getElementById('total-matches').textContent = this.matches.filter(m => m.status === 'finished').length;
        document.getElementById('total-goals').textContent = this.teams.reduce((sum, team) => sum + team.stats.goalsFor, 0);

        this.renderRecentMatches();
    }

    renderRecentMatches() {
        const container = document.getElementById('recent-matches-list');
        const recentMatches = [...this.matches]
            .filter(m => m.status === 'finished')
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        if (recentMatches.length === 0) {
            container.innerHTML = '<p class="text-secondary">Niciun meci finalizat încă</p>';
            return;
        }

        container.innerHTML = recentMatches.map(match => {
            const team1 = this.teams.find(t => t.id === match.team1Id);
            const team2 = this.teams.find(t => t.id === match.team2Id);
            
            if (!team1 || !team2) return '';

            return `
                <div class="match-card" style="margin-bottom: 1rem;">
                    <div class="match-teams">
                        <div class="match-team">
                            <div class="match-team-logo">${team1.logo}</div>
                            <div class="match-team-name">${team1.name}</div>
                        </div>
                        <div class="match-score">${match.score1} - ${match.score2}</div>
                        <div class="match-team right">
                            <div class="match-team-logo">${team2.logo}</div>
                            <div class="match-team-name">${team2.name}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateAllViews() {
        this.renderTeams();
        this.renderMatches();
        this.renderGroups();
        this.updateDashboard();
    }
}

// Initialize the tournament manager
const tournament = new TournamentManager();

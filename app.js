// ========================================
// Multi-Sport Tournament Management System
// ========================================

class TournamentManager {
    constructor() {
        this.currentSport = localStorage.getItem('current_sport') || 'football';
        this.teams = this.loadData('teams') || [];
        this.matches = this.loadData('matches') || [];
        this.groups = this.loadData('groups') || {};
        this.currentTeamId = null;
        this.currentMatchId = null;
        this.init();
    }

    init() {
        this.setupSportSelector();
        this.setupNavigation();
        this.setupTeamsSection();
        this.setupMatchesSection();
        this.setupGroupsSection();
        this.updateSportUI();
        this.updateDashboard();
        this.updateAllViews();
    }

    // Sport Configuration
    getSportConfig() {
        const configs = {
            football: {
                name: 'Fotbal',
                icon: '⚽',
                scoreLabel: 'Goluri',
                scoreShort: 'G',
                defaultLogo: '⚽',
                statLabels: {
                    goals: 'Goluri Marcate',
                    goalDiff: 'Golaveraj',
                    topScorers: 'Top Marcatori'
                },
                matchFormat: 'score', // simple score
                pointsForWin: 3,
                pointsForDraw: 1
            },
            volleyball: {
                name: 'Volei',
                icon: '🏐',
                scoreLabel: 'Seturi',
                scoreShort: 'S',
                defaultLogo: '🏐',
                statLabels: {
                    goals: 'Puncte Totale',
                    goalDiff: 'Puncte',
                    topScorers: 'Cele mai multe puncte'
                },
                matchFormat: 'sets', // best of 3 or 5 sets
                pointsForWin: 2,
                pointsForDraw: 0 // no draws in volleyball
            }
        };
        return configs[this.currentSport];
    }

    // Local Storage Management
    loadData(key) {
        const sportKey = `tournament_${this.currentSport}_${key}`;
        const data = localStorage.getItem(sportKey);
        return data ? JSON.parse(data) : null;
    }

    saveData(key, data) {
        const sportKey = `tournament_${this.currentSport}_${key}`;
        localStorage.setItem(sportKey, JSON.stringify(data));
    }

    // ========================================
    // Sport Selector
    // ========================================

    setupSportSelector() {
        const sportButtons = document.querySelectorAll('.sport-btn');
        
        sportButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedSport = btn.dataset.sport;
                if (selectedSport === this.currentSport) return;

                // Update active state
                sportButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Switch sport
                this.currentSport = selectedSport;
                localStorage.setItem('current_sport', selectedSport);

                // Reload data for new sport
                this.teams = this.loadData('teams') || [];
                this.matches = this.loadData('matches') || [];
                this.groups = this.loadData('groups') || {};

                // Update UI
                this.updateSportUI();
                this.updateAllViews();
                this.updateDashboard();
            });
        });

        // Set initial active state
        sportButtons.forEach(btn => {
            if (btn.dataset.sport === this.currentSport) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    updateSportUI() {
        const config = this.getSportConfig();
        
        // Update header
        document.getElementById('header-title').textContent = `${config.icon} Turneu de ${config.name}`;
        
        // Update nav icon
        document.getElementById('nav-match-icon').textContent = config.icon;
        
        // Update dashboard labels
        document.getElementById('stat-label-points').textContent = config.statLabels.goals;
        document.getElementById('stat-icon-points').textContent = config.icon;
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
        const config = this.getSportConfig();
        const name = document.getElementById('team-name').value;
        const logo = document.getElementById('team-logo').value || config.defaultLogo;
        const city = document.getElementById('team-city').value;
        const coach = document.getElementById('team-coach').value;

        const team = {
            id: this.currentTeamId || Date.now(),
            name,
            logo,
            city,
            coach,
            stats: { 
                played: 0, 
                wins: 0, 
                draws: 0, 
                losses: 0, 
                goalsFor: 0, 
                goalsAgainst: 0, 
                points: 0,
                setsWon: 0, // for volleyball
                setsLost: 0  // for volleyball
            }
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
        const config = this.getSportConfig();
        
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
                        <span>${config.statLabels.goalDiff}:</span>
                        <span><strong>${this.currentSport === 'volleyball' 
                            ? `${team.stats.setsWon || 0}-${team.stats.setsLost || 0}` 
                            : `${team.stats.goalsFor}-${team.stats.goalsAgainst}`}</strong></span>
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
            sets: null, // For volleyball: array of sets [{team1: 25, team2: 23}, ...]
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

        if (this.currentSport === 'volleyball') {
            // For volleyball, scores represent sets won
            match.score1 = parseInt(score1) || 0;
            match.score2 = parseInt(score2) || 0;
            
            // Validate volleyball scoring (best of 3: first to 2, or best of 5: first to 3)
            const totalSets = match.score1 + match.score2;
            if (totalSets < 2 || totalSets > 5) {
                alert('Scor invalid pentru volei! Meciurile sunt best of 3 (2-0, 2-1) sau best of 5 (3-0, 3-1, 3-2).');
                return;
            }
            
            if (match.score1 === match.score2) {
                alert('Nu pot fi egaluri la volei!');
                return;
            }
        } else {
            // Football - simple goals
            match.score1 = parseInt(score1) || 0;
            match.score2 = parseInt(score2) || 0;
        }

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

        const config = this.getSportConfig();

        // Update played matches
        team1.stats.played++;
        team2.stats.played++;

        if (this.currentSport === 'volleyball') {
            // Volleyball stats
            team1.stats.setsWon = (team1.stats.setsWon || 0) + match.score1;
            team1.stats.setsLost = (team1.stats.setsLost || 0) + match.score2;
            team2.stats.setsWon = (team2.stats.setsWon || 0) + match.score2;
            team2.stats.setsLost = (team2.stats.setsLost || 0) + match.score1;

            // Winner gets 2 points in volleyball
            if (match.score1 > match.score2) {
                team1.stats.wins++;
                team1.stats.points += config.pointsForWin;
                team2.stats.losses++;
            } else {
                team2.stats.wins++;
                team2.stats.points += config.pointsForWin;
                team1.stats.losses++;
            }
        } else {
            // Football stats
            team1.stats.goalsFor += match.score1;
            team1.stats.goalsAgainst += match.score2;
            team2.stats.goalsFor += match.score2;
            team2.stats.goalsAgainst += match.score1;

            // Update wins/draws/losses and points
            if (match.score1 > match.score2) {
                team1.stats.wins++;
                team1.stats.points += config.pointsForWin;
                team2.stats.losses++;
            } else if (match.score1 < match.score2) {
                team2.stats.wins++;
                team2.stats.points += config.pointsForWin;
                team1.stats.losses++;
            } else {
                team1.stats.draws++;
                team2.stats.draws++;
                team1.stats.points += config.pointsForDraw;
                team2.stats.points += config.pointsForDraw;
            }
        }
    }

    renderMatches(filter = 'all') {
        const container = document.getElementById('matches-list');
        const config = this.getSportConfig();
        
        let filteredMatches = this.matches;
        if (filter === 'scheduled') {
            filteredMatches = this.matches.filter(m => m.status === 'scheduled');
        } else if (filter === 'finished') {
            filteredMatches = this.matches.filter(m => m.status === 'finished');
        }

        if (filteredMatches.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">${config.icon}</div>
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

            const scoreLabel = this.currentSport === 'volleyball' 
                ? `(Seturi: ${match.score1 || 0}-${match.score2 || 0})`
                : '';

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
                                ? `${match.score1} - ${match.score2} ${this.currentSport === 'volleyball' ? '<br><small>seturi</small>' : ''}`
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
                            ${this.currentSport === 'volleyball' ? '<small style="color: #6b7280; margin-right: 10px;">Scor = seturi câștigate (ex: 2-0, 2-1, 3-2)</small>' : ''}
                            <button class="btn btn-small btn-success" onclick="tournament.updateMatchScore(${match.id}, document.getElementById('score1-${match.id}').value, document.getElementById('score2-${match.id}').value)">
                                ✅ Salvează Scor
                            </button>
                            <button class="btn btn-small btn-primary" onclick="tournament.editMatch(${match.id})">
                                ✏️ Editează
                            </button>
                            <button class="btn btn-small btn-danger" onclick="tournament.deleteMatch(${match.id})">
                                🗑️ Șterge
                            </button>
                        </div>
                    ` : `
                        <div class="match-actions">
                            <button class="btn btn-small btn-primary" onclick="tournament.editMatchScore(${match.id})">
                                ✏️ Editează Scor
                            </button>
                            <button class="btn btn-small btn-secondary" onclick="tournament.editMatch(${match.id})">
                                📝 Editează Detalii
                            </button>
                            <button class="btn btn-small btn-danger" onclick="tournament.deleteMatch(${match.id})">
                                🗑️ Șterge
                            </button>
                        </div>
                    `}
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
        const config = this.getSportConfig();

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
            
            // Sort by points, then goal/set difference
            groupTeams.sort((a, b) => {
                if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
                if (this.currentSport === 'volleyball') {
                    const sdA = (a.stats.setsWon || 0) - (a.stats.setsLost || 0);
                    const sdB = (b.stats.setsWon || 0) - (b.stats.setsLost || 0);
                    return sdB - sdA;
                } else {
                    const gdA = a.stats.goalsFor - a.stats.goalsAgainst;
                    const gdB = b.stats.goalsFor - b.stats.goalsAgainst;
                    return gdB - gdA;
                }
            });

            const scoreHeader = this.currentSport === 'volleyball' ? 'S' : 'G';
            const scoreDisplay = (team) => this.currentSport === 'volleyball' 
                ? `${team.stats.setsWon || 0}-${team.stats.setsLost || 0}`
                : `${team.stats.goalsFor}-${team.stats.goalsAgainst}`;

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
                                ${this.currentSport === 'football' ? '<th>E</th>' : ''}
                                <th>Î</th>
                                <th>${scoreHeader}</th>
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
                                    ${this.currentSport === 'football' ? `<td>${team.stats.draws}</td>` : ''}
                                    <td>${team.stats.losses}</td>
                                    <td>${scoreDisplay(team)}</td>
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
        const config = this.getSportConfig();
        
        // Sort teams by goals/sets won
        const topScorers = [...this.teams]
            .sort((a, b) => {
                if (this.currentSport === 'volleyball') {
                    return (b.stats.setsWon || 0) - (a.stats.setsWon || 0);
                } else {
                    return b.stats.goalsFor - a.stats.goalsFor;
                }
            })
            .slice(0, 5);

        if (topScorers.length === 0) {
            container.innerHTML = '<p class="text-secondary">Nicio statistică disponibilă</p>';
            return;
        }

        container.innerHTML = topScorers.map((team, index) => {
            const scoreValue = this.currentSport === 'volleyball' 
                ? (team.stats.setsWon || 0)
                : team.stats.goalsFor;
            const scoreLabel = this.currentSport === 'volleyball' ? 'Seturi câștigate' : 'Goluri marcate';

            return `
                <div class="stats-item">
                    <div class="stats-item-rank">${index + 1}</div>
                    <div class="stats-item-info">
                        <div class="stats-item-name">${team.logo} ${team.name}</div>
                        <div class="stats-item-detail">${scoreLabel}</div>
                    </div>
                    <div class="stats-item-value">${scoreValue}</div>
                </div>
            `;
        }).join('');
    }

    renderTeamsRanking() {
        const container = document.getElementById('teams-ranking');
        
        const ranking = [...this.teams].sort((a, b) => {
            if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
            if (this.currentSport === 'volleyball') {
                const sdA = (a.stats.setsWon || 0) - (a.stats.setsLost || 0);
                const sdB = (b.stats.setsWon || 0) - (b.stats.setsLost || 0);
                return sdB - sdA;
            } else {
                const gdA = a.stats.goalsFor - a.stats.goalsAgainst;
                const gdB = b.stats.goalsFor - b.stats.goalsAgainst;
                return gdB - gdA;
            }
        }).slice(0, 10);

        if (ranking.length === 0) {
            container.innerHTML = '<p class="text-secondary">Nicio echipă disponibilă</p>';
            return;
        }

        container.innerHTML = ranking.map((team, index) => {
            const detailText = this.currentSport === 'volleyball'
                ? `V:${team.stats.wins} Î:${team.stats.losses}`
                : `V:${team.stats.wins} E:${team.stats.draws} Î:${team.stats.losses}`;

            return `
                <div class="stats-item">
                    <div class="stats-item-rank">${index + 1}</div>
                    <div class="stats-item-info">
                        <div class="stats-item-name">${team.logo} ${team.name}</div>
                        <div class="stats-item-detail">${detailText}</div>
                    </div>
                    <div class="stats-item-value">${team.stats.points} pct</div>
                </div>
            `;
        }).join('');
    }

    renderGeneralStats() {
        const container = document.getElementById('general-stats');
        const config = this.getSportConfig();
        
        const totalScore = this.teams.reduce((sum, team) => {
            return sum + (this.currentSport === 'volleyball' ? (team.stats.setsWon || 0) : team.stats.goalsFor);
        }, 0);
        const totalMatches = this.matches.filter(m => m.status === 'finished').length;
        const avgScorePerMatch = totalMatches > 0 ? (totalScore / totalMatches).toFixed(2) : 0;

        const scoreLabel = this.currentSport === 'volleyball' ? 'Total Seturi' : 'Total Goluri';
        const avgLabel = this.currentSport === 'volleyball' ? 'Media Seturi/Meci' : 'Media Goluri/Meci';

        const stats = [
            { label: 'Total Meciuri', value: this.matches.length },
            { label: 'Meciuri Finalizate', value: totalMatches },
            { label: scoreLabel, value: totalScore },
            { label: avgLabel, value: avgScorePerMatch },
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
        const config = this.getSportConfig();
        
        document.getElementById('total-teams').textContent = this.teams.length;
        document.getElementById('total-matches').textContent = this.matches.filter(m => m.status === 'finished').length;
        
        const totalScore = this.teams.reduce((sum, team) => {
            return sum + (this.currentSport === 'volleyball' ? (team.stats.setsWon || 0) : team.stats.goalsFor);
        }, 0);
        document.getElementById('total-goals').textContent = totalScore;

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

            const scoreDisplay = this.currentSport === 'volleyball' 
                ? `${match.score1}-${match.score2} <small>(seturi)</small>`
                : `${match.score1} - ${match.score2}`;

            return `
                <div class="match-card" style="margin-bottom: 1rem;">
                    <div class="match-teams">
                        <div class="match-team">
                            <div class="match-team-logo">${team1.logo}</div>
                            <div class="match-team-name">${team1.name}</div>
                        </div>
                        <div class="match-score">${scoreDisplay}</div>
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
        this.renderPlayers();
        this.renderTournamentInfo();
    }

    // ========================================
    // Players Management (CRUD)
    // ========================================

    setupPlayersSection() {
        this.players = this.loadData('players') || [];
        
        const addPlayerBtn = document.getElementById('add-player-btn');
        const managePlayersBtn = document.getElementById('manage-players-btn');
        const playerModal = document.getElementById('player-modal');
        const closeBtn = playerModal.querySelector('.close');
        const cancelBtn = document.getElementById('cancel-player');
        const playerForm = document.getElementById('player-form');

        // Navigate to players section
        if (managePlayersBtn) {
            managePlayersBtn.addEventListener('click', () => {
                // Switch to players section
                document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
                
                const playersNavBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn => btn.dataset.section === 'players');
                if (playersNavBtn) playersNavBtn.classList.add('active');
                
                const playersSection = document.getElementById('players');
                if (playersSection) playersSection.classList.add('active');
            });
        }

        addPlayerBtn.addEventListener('click', () => {
            this.currentPlayerId = null;
            document.getElementById('player-modal-title').textContent = 'Adaugă Jucător Nou';
            this.populatePlayerTeamSelect();
            playerForm.reset();
            playerModal.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            playerModal.classList.remove('active');
        });

        cancelBtn.addEventListener('click', () => {
            playerModal.classList.remove('active');
        });

        playerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePlayer();
        });

        this.renderPlayers();
    }

    populatePlayerTeamSelect() {
        const select = document.getElementById('player-team');
        select.innerHTML = this.teams.map(team => 
            `<option value="${team.id}">${team.name}</option>`
        ).join('');
    }

    savePlayer() {
        const name = document.getElementById('player-name').value;
        const teamId = parseInt(document.getElementById('player-team').value);
        const number = parseInt(document.getElementById('player-number').value) || null;
        const position = document.getElementById('player-position').value;

        const player = {
            id: this.currentPlayerId || Date.now(),
            name,
            teamId,
            number,
            position,
            stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 }
        };

        if (this.currentPlayerId) {
            const index = this.players.findIndex(p => p.id === this.currentPlayerId);
            this.players[index] = { ...this.players[index], ...player };
        } else {
            this.players.push(player);
        }

        this.saveData('players', this.players);
        this.renderPlayers();
        document.getElementById('player-modal').classList.remove('active');
    }

    editPlayer(id) {
        const player = this.players.find(p => p.id === id);
        if (!player) return;

        this.currentPlayerId = id;
        document.getElementById('player-modal-title').textContent = 'Editează Jucător';
        this.populatePlayerTeamSelect();
        document.getElementById('player-name').value = player.name;
        document.getElementById('player-team').value = player.teamId;
        document.getElementById('player-number').value = player.number || '';
        document.getElementById('player-position').value = player.position;
        document.getElementById('player-modal').classList.add('active');
    }

    deletePlayer(id) {
        if (!confirm('Sigur doriți să ștergeți acest jucător?')) return;
        
        this.players = this.players.filter(p => p.id !== id);
        this.saveData('players', this.players);
        this.renderPlayers();
    }

    renderPlayers(filterTeamId = null) {
        const container = document.getElementById('players-grid');
        
        let filteredPlayers = this.players;
        if (filterTeamId) {
            filteredPlayers = this.players.filter(p => p.teamId === filterTeamId);
        }

        if (filteredPlayers.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">👤</div>
                    <p>Nu există jucători înregistrați. Adaugă primul jucător!</p>
                </div>
            `;
            return;
        }

        const positionNames = {
            goalkeeper: 'Portar',
            defender: 'Fundaș',
            midfielder: 'Mijlocaș',
            forward: 'Atacant'
        };

        container.innerHTML = filteredPlayers.map(player => {
            const team = this.teams.find(t => t.id === player.teamId);
            if (!team) return '';

            return `
                <div class="player-card">
                    <div class="player-header">
                        <div class="player-number">${player.number || '?'}</div>
                        <div class="player-info">
                            <h4>${player.name}</h4>
                            <p>${team.logo} ${team.name}</p>
                        </div>
                    </div>
                    <div class="player-position">${positionNames[player.position]}</div>
                    <div class="player-actions">
                        <button class="btn btn-small btn-primary" onclick="tournament.editPlayer(${player.id})">
                            ✏️ Editează
                        </button>
                        <button class="btn btn-small btn-danger" onclick="tournament.deletePlayer(${player.id})">
                            🗑️ Șterge
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ========================================
    // Groups Editing (CRUD)
    // ========================================

    setupGroupsEditing() {
        const editGroupsBtn = document.getElementById('edit-groups-btn');
        const clearGroupsBtn = document.getElementById('clear-groups-btn');
        const editGroupsModal = document.getElementById('edit-groups-modal');
        const closeBtn = editGroupsModal.querySelector('.close');
        const saveBtn = document.getElementById('save-groups-edit');
        const cancelBtn = document.getElementById('cancel-groups-edit');

        editGroupsBtn.addEventListener('click', () => {
            if (Object.keys(this.groups).length === 0) {
                alert('Nu există grupe generate! Generează mai întâi grupele.');
                return;
            }
            this.renderGroupsEditor();
            editGroupsModal.classList.add('active');
        });

        clearGroupsBtn.addEventListener('click', () => {
            if (!confirm('Sigur doriți să ștergeți toate grupele?')) return;
            this.groups = {};
            this.saveData('groups', this.groups);
            this.renderGroups();
        });

        closeBtn.addEventListener('click', () => {
            editGroupsModal.classList.remove('active');
        });

        cancelBtn.addEventListener('click', () => {
            editGroupsModal.classList.remove('active');
        });

        saveBtn.addEventListener('click', () => {
            this.saveGroupsFromEditor();
            editGroupsModal.classList.remove('active');
        });
    }

    renderGroupsEditor() {
        const container = document.getElementById('edit-groups-container');
        const groupEntries = Object.entries(this.groups);

        container.innerHTML = groupEntries.map(([groupName, teamIds]) => {
            const groupTeams = teamIds.map(id => this.teams.find(t => t.id === id)).filter(t => t);

            return `
                <div class="edit-group-card" data-group="${groupName}">
                    <h4>Grupa ${groupName}</h4>
                    <div class="edit-group-teams" data-group="${groupName}">
                        ${groupTeams.map(team => `
                            <div class="editable-team-item" draggable="true" data-team-id="${team.id}">
                                <span class="team-drag-handle">☰</span>
                                <span>${team.logo} ${team.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // Setup drag and drop
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const draggableItems = document.querySelectorAll('.editable-team-item');
        const dropZones = document.querySelectorAll('.edit-group-teams');

        draggableItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.target.innerHTML);
                e.dataTransfer.setData('teamId', e.target.dataset.teamId);
                e.target.classList.add('dragging');
            });

            item.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                const teamId = e.dataTransfer.getData('teamId');
                const draggingElement = document.querySelector('.dragging');
                
                if (draggingElement && teamId) {
                    zone.appendChild(draggingElement);
                }
            });
        });
    }

    saveGroupsFromEditor() {
        const newGroups = {};
        const groupCards = document.querySelectorAll('.edit-group-card');

        groupCards.forEach(card => {
            const groupName = card.dataset.group;
            const teamElements = card.querySelectorAll('.editable-team-item');
            newGroups[groupName] = Array.from(teamElements).map(el => parseInt(el.dataset.teamId));
        });

        this.groups = newGroups;
        this.saveData('groups', this.groups);
        this.renderGroups();
        alert('Grupele au fost actualizate cu succes!');
    }

    // ========================================
    // Match Editing
    // ========================================

    editMatch(id) {
        const match = this.matches.find(m => m.id === id);
        if (!match) return;

        this.currentMatchId = id;
        this.populateTeamSelects();
        
        document.getElementById('match-team1').value = match.team1Id;
        document.getElementById('match-team2').value = match.team2Id;
        document.getElementById('match-date').value = match.date;
        document.getElementById('match-stage').value = match.stage;
        document.getElementById('match-location').value = match.location || '';
        
        document.getElementById('match-modal').classList.add('active');
    }

    editMatchScore(id) {
        const match = this.matches.find(m => m.id === id);
        if (!match || match.status !== 'finished') return;

        const newScore1 = prompt(`Scor echipa 1 (${this.teams.find(t => t.id === match.team1Id).name}):`, match.score1);
        const newScore2 = prompt(`Scor echipa 2 (${this.teams.find(t => t.id === match.team2Id).name}):`, match.score2);

        if (newScore1 !== null && newScore2 !== null) {
            // Reverse old stats
            this.reverseTeamStats(match);
            
            // Update match
            match.score1 = parseInt(newScore1) || 0;
            match.score2 = parseInt(newScore2) || 0;
            
            // Apply new stats
            this.updateTeamStats(match);
            
            this.saveData('matches', this.matches);
            this.saveData('teams', this.teams);
            this.renderMatches();
            this.updateDashboard();
        }
    }

    reverseTeamStats(match) {
        const team1 = this.teams.find(t => t.id === match.team1Id);
        const team2 = this.teams.find(t => t.id === match.team2Id);

        if (!team1 || !team2 || match.score1 === null) return;

        const config = this.getSportConfig();

        // Reverse played matches
        team1.stats.played--;
        team2.stats.played--;

        if (this.currentSport === 'volleyball') {
            team1.stats.setsWon -= match.score1;
            team1.stats.setsLost -= match.score2;
            team2.stats.setsWon -= match.score2;
            team2.stats.setsLost -= match.score1;

            if (match.score1 > match.score2) {
                team1.stats.wins--;
                team1.stats.points -= config.pointsForWin;
                team2.stats.losses--;
            } else {
                team2.stats.wins--;
                team2.stats.points -= config.pointsForWin;
                team1.stats.losses--;
            }
        } else {
            team1.stats.goalsFor -= match.score1;
            team1.stats.goalsAgainst -= match.score2;
            team2.stats.goalsFor -= match.score2;
            team2.stats.goalsAgainst -= match.score1;

            if (match.score1 > match.score2) {
                team1.stats.wins--;
                team1.stats.points -= config.pointsForWin;
                team2.stats.losses--;
            } else if (match.score1 < match.score2) {
                team2.stats.wins--;
                team2.stats.points -= config.pointsForWin;
                team1.stats.losses--;
            } else {
                team1.stats.draws--;
                team2.stats.draws--;
                team1.stats.points -= config.pointsForDraw;
                team2.stats.points -= config.pointsForDraw;
            }
        }
    }

    // ========================================
    // Settings & Data Management
    // ========================================

    setupSettings() {
        const resetAllBtn = document.getElementById('reset-all-data');
        const resetMatchesBtn = document.getElementById('reset-matches-only');
        const resetStatsBtn = document.getElementById('reset-stats-only');
        const resetTournamentBtn = document.getElementById('reset-tournament-btn');
        const exportBtn = document.getElementById('export-data');
        const importBtn = document.getElementById('import-data');
        const importFile = document.getElementById('import-file');

        resetAllBtn.addEventListener('click', () => this.resetAllData());
        resetMatchesBtn.addEventListener('click', () => this.resetMatches());
        resetStatsBtn.addEventListener('click', () => this.resetStats());
        resetTournamentBtn.addEventListener('click', () => this.resetAllData());
        exportBtn.addEventListener('click', () => this.exportData());
        importBtn.addEventListener('click', () => importFile.click());
        importFile.addEventListener('change', (e) => this.importData(e));

        this.renderTournamentInfo();
    }

    resetAllData() {
        if (!confirm('ATENȚIE! Aceasta va șterge TOATE datele pentru ' + this.getSportConfig().name + '! Continui?')) return;
        
        this.teams = [];
        this.matches = [];
        this.groups = {};
        this.players = [];
        
        this.saveData('teams', this.teams);
        this.saveData('matches', this.matches);
        this.saveData('groups', this.groups);
        this.saveData('players', this.players);
        
        this.updateAllViews();
        alert('Toate datele au fost șterse!');
    }

    resetMatches() {
        if (!confirm('Sigur doriți să ștergeți toate meciurile?')) return;
        
        this.matches = [];
        this.saveData('matches', this.matches);
        this.resetStats();
        this.renderMatches();
        alert('Meciurile au fost șterse!');
    }

    resetStats() {
        if (!confirm('Sigur doriți să resetați statisticile echipelor?')) return;
        
        this.teams.forEach(team => {
            team.stats = { 
                played: 0, wins: 0, draws: 0, losses: 0, 
                goalsFor: 0, goalsAgainst: 0, points: 0,
                setsWon: 0, setsLost: 0 
            };
        });
        
        this.saveData('teams', this.teams);
        this.updateAllViews();
        alert('Statisticile au fost resetate!');
    }

    exportData() {
        const data = {
            sport: this.currentSport,
            teams: this.teams,
            matches: this.matches,
            groups: this.groups,
            players: this.players,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `turneu-${this.currentSport}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        alert('Datele au fost exportate cu succes!');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.sport !== this.currentSport) {
                    if (!confirm(`Acest fișier este pentru ${data.sport}. Vrei să îl imporți în ${this.currentSport}?`)) {
                        return;
                    }
                }

                this.teams = data.teams || [];
                this.matches = data.matches || [];
                this.groups = data.groups || {};
                this.players = data.players || [];

                this.saveData('teams', this.teams);
                this.saveData('matches', this.matches);
                this.saveData('groups', this.groups);
                this.saveData('players', this.players);

                this.updateAllViews();
                alert('Datele au fost importate cu succes!');
            } catch (error) {
                alert('Eroare la importarea datelor: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    renderTournamentInfo() {
        const container = document.getElementById('tournament-info');
        if (!container) return;

        const config = this.getSportConfig();
        const finishedMatches = this.matches.filter(m => m.status === 'finished').length;

        container.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <div><strong>Sport:</strong> ${config.icon} ${config.name}</div>
                <div><strong>Echipe:</strong> ${this.teams.length}</div>
                <div><strong>Jucători:</strong> ${this.players?.length || 0}</div>
                <div><strong>Meciuri:</strong> ${this.matches.length} (${finishedMatches} finalizate)</div>
                <div><strong>Grupe:</strong> ${Object.keys(this.groups).length}</div>
            </div>
        `;
    }
}

// Initialize the tournament manager
const tournament = new TournamentManager();

// Setup additional sections after initialization
setTimeout(() => {
    tournament.setupPlayersSection();
    tournament.setupGroupsEditing();
    tournament.setupSettings();
}, 100);

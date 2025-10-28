// ========================================
// Multi-Sport Tournament Management System
// ========================================

class TournamentManager {
    constructor() {
        this.currentSport = localStorage.getItem('current_sport') || 'football';
        this.teams = this.loadData('teams') || [];
        this.matches = this.loadData('matches') || [];
        this.groups = this.loadData('groups') || {};
        this.config = this.loadData('config') || this.getDefaultConfig();
        this.currentTeamId = null;
        this.currentMatchId = null;
        this.init();
    }

    getDefaultConfig() {
        return {
            tournamentName: '',
            tournamentLocation: '',
            tournamentStart: '',
            tournamentEnd: '',
            maxPlayersPerTeam: 25,
            minPlayersPerTeam: 11,
            requireTeamLogo: false,
            allowDuplicateNumbers: true,
            requirePlayerNumber: false,
            defaultPosition: 'midfielder',
            matchDuration: 90,
            allowOvertime: false,
            allowPenalties: false,
            defaultMatchLocation: '',
            autoSave: true,
            showConfirmations: true,
            teamsPerGroup: 4
        };
    }

    init() {
        this.setupSportSelector();
        this.setupNavigation();
        this.setupTeamsSection();
        this.setupMatchesSection();
        this.setupGroupsSection();
        this.setupPlayersSection();
        this.setupGroupsEditing();
        this.setupSettings();
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

        if (!name.trim()) {
            alert('Numele echipei este obligatoriu!');
            return;
        }

        // Check if logo is required
        if (this.config.requireTeamLogo && !logo) {
            alert('Logo-ul echipei este obligatoriu conform setărilor turneului!');
            return;
        }

        // Check for duplicate team name (only when adding new team)
        if (!this.currentTeamId) {
            const duplicate = this.teams.find(t => 
                t.name.toLowerCase().trim() === name.toLowerCase().trim()
            );
            if (duplicate) {
                alert(`Echipa "${name}" există deja! Alege un alt nume.`);
                return;
            }
        } else {
            // When editing, check if name conflicts with other teams
            const duplicate = this.teams.find(t => 
                t.id !== this.currentTeamId && 
                t.name.toLowerCase().trim() === name.toLowerCase().trim()
            );
            if (duplicate) {
                alert(`Echipa "${name}" există deja! Alege un alt nume.`);
                return;
            }
        }

        const team = {
            id: this.currentTeamId || Date.now(),
            name: name.trim(),
            logo,
            city,
            coach
        };

        if (this.currentTeamId) {
            const index = this.teams.findIndex(t => t.id === this.currentTeamId);
            // Keep existing stats when editing
            this.teams[index] = { ...this.teams[index], ...team };
        } else {
            // Initialize stats for new team
            team.stats = { 
                played: 0, 
                wins: 0, 
                draws: 0, 
                losses: 0, 
                goalsFor: 0, 
                goalsAgainst: 0, 
                points: 0,
                setsWon: 0,
                setsLost: 0
            };
            this.teams.push(team);
        }

        this.saveData('teams', this.teams);
        this.updateAllViews();
        document.getElementById('team-modal').classList.remove('active');
        
        alert(this.currentTeamId ? 'Echipa a fost actualizată!' : 'Echipa a fost adăugată cu succes!');
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
        
        // Remove team from groups
        Object.keys(this.groups).forEach(groupName => {
            this.groups[groupName] = this.groups[groupName].filter(teamId => teamId !== id);
        });
        
        // Remove team's matches
        this.matches = this.matches.filter(m => m.team1Id !== id && m.team2Id !== id);
        
        // Remove team's players
        if (this.players) {
            this.players = this.players.filter(p => p.teamId !== id);
            this.saveData('players', this.players);
        }
        
        this.teams = this.teams.filter(t => t.id !== id);
        this.saveData('teams', this.teams);
        this.saveData('groups', this.groups);
        this.saveData('matches', this.matches);
        
        this.updateAllViews();
        
        alert('Echipa și toate datele asociate au fost șterse!');
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

        // Sort teams alphabetically by name
        const sortedTeams = [...this.teams].sort((a, b) => 
            a.name.localeCompare(b.name, 'ro', { sensitivity: 'base' })
        );

        container.innerHTML = sortedTeams.map(team => `
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

        if (!team1Select || !team2Select) return;

        // Sort teams alphabetically
        const sortedTeams = [...this.teams].sort((a, b) => 
            a.name.localeCompare(b.name, 'ro', { sensitivity: 'base' })
        );

        const options = sortedTeams.map(team => 
            `<option value="${team.id}">${team.name}</option>`
        ).join('');

        team1Select.innerHTML = options;
        team2Select.innerHTML = options;

        // Add event listener to team1 to update team2 options
        team1Select.addEventListener('change', () => {
            this.updateTeam2Options();
        });

        // Initial update of team2 options
        this.updateTeam2Options();
    }

    updateTeam2Options() {
        const team1Select = document.getElementById('match-team1');
        const team2Select = document.getElementById('match-team2');
        
        if (!team1Select || !team2Select) return;

        const selectedTeam1Id = parseInt(team1Select.value);
        const currentTeam2Value = team2Select.value;

        // Sort teams alphabetically
        const sortedTeams = [...this.teams].sort((a, b) => 
            a.name.localeCompare(b.name, 'ro', { sensitivity: 'base' })
        );

        // Filter out the selected team1 from team2 options
        const filteredTeams = sortedTeams.filter(team => team.id !== selectedTeam1Id);

        team2Select.innerHTML = filteredTeams.map(team => 
            `<option value="${team.id}">${team.name}</option>`
        ).join('');

        // Try to restore previous selection if still valid
        if (currentTeam2Value && parseInt(currentTeam2Value) !== selectedTeam1Id) {
            team2Select.value = currentTeam2Value;
        }
    }

    saveMatch() {
        const team1Id = parseInt(document.getElementById('match-team1').value);
        const team2Id = parseInt(document.getElementById('match-team2').value);
        const date = document.getElementById('match-date').value;
        const stage = document.getElementById('match-stage').value;
        const locationInput = document.getElementById('match-location');
        const location = locationInput.value || this.config.defaultMatchLocation || '';

        if (team1Id === team2Id) {
            alert('O echipă nu poate juca împotriva ei însăși!');
            return;
        }

        // Set default location if configured
        if (!locationInput.value && this.config.defaultMatchLocation) {
            locationInput.value = this.config.defaultMatchLocation;
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

        // Validate input
        if (score1 === '' || score2 === '') {
            alert('Te rog introdu scorurile pentru ambele echipe!');
            return;
        }

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
        
        // Update all views to show new stats
        this.updateAllViews();
        
        alert('Scorul a fost salvat cu succes!');
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
        
        const match = this.matches.find(m => m.id === id);
        
        // If match was finished, reverse stats
        if (match && match.status === 'finished') {
            this.reverseTeamStats(match);
            this.saveData('teams', this.teams);
        }
        
        this.matches = this.matches.filter(m => m.id !== id);
        this.saveData('matches', this.matches);
        this.updateAllViews();
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
        const teamsPerGroup = this.config.teamsPerGroup || 4;
        const minTeams = teamsPerGroup;

        if (this.teams.length < minTeams) {
            alert(`Trebuie să existe cel puțin ${minTeams} echipe pentru a genera grupe!`);
            return;
        }

        if (Object.keys(this.groups).length > 0) {
            if (!confirm('Grupele existente vor fi suprascrise! Continui?')) {
                return;
            }
        }

        const numGroups = Math.ceil(this.teams.length / teamsPerGroup);
        
        // Maximum 8 groups (A-H)
        if (numGroups > 8) {
            alert(`Maximum 8 grupe (A-H) sunt permise!\n\nAi ${this.teams.length} echipe, ceea ce ar necesita ${numGroups} grupe.\n\nMaximum ${8 * teamsPerGroup} echipe (8 grupe × ${teamsPerGroup} echipe) sunt permise.`);
            return;
        }

        const shuffled = [...this.teams].sort(() => Math.random() - 0.5);
        
        this.groups = {};
        const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        for (let i = 0; i < numGroups && i < 8; i++) {
            const groupName = groupNames[i];
            this.groups[groupName] = shuffled.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup).map(t => t.id);
        }

        this.saveData('groups', this.groups);
        this.updateAllViews();
        alert(`Grupele au fost generate cu succes!\n\n${numGroups} grupe (${groupNames.slice(0, numGroups).join(', ')}) create cu ${this.teams.length} echipe (${teamsPerGroup} echipe/grupă).`);
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
        this.renderKnockoutStage();
        this.renderStatistics();
        this.updateDashboard();
        this.renderTeamFilterButtons();
        this.renderPlayers(this.currentPlayerFilter);
        this.renderTournamentInfo();
    }

    // ========================================
    // Players Management (CRUD)
    // ========================================

    setupPlayersSection() {
        this.players = this.loadData('players') || [];
        this.currentPlayerFilter = null; // Track current filter
        
        const addPlayerBtn = document.getElementById('add-player-btn');
        const managePlayersBtn = document.getElementById('manage-players-btn');
        const playerModal = document.getElementById('player-modal');
        const cancelBtn = document.getElementById('cancel-player');
        const playerForm = document.getElementById('player-form');

        if (!addPlayerBtn || !playerModal || !playerForm) {
            console.warn('Players section elements not found, skipping setup');
            return;
        }

        const closeBtn = playerModal.querySelector('.close');

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

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                playerModal.classList.remove('active');
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                playerModal.classList.remove('active');
            });
        }

        playerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePlayer();
        });

        // Setup team filter buttons
        this.setupPlayerFilters();

        this.renderPlayers();
    }

    setupPlayerFilters() {
        // Setup "Toate Echipele" button
        const allTeamsBtn = document.querySelector('[data-filter-team="all"]');
        if (allTeamsBtn) {
            allTeamsBtn.addEventListener('click', () => {
                this.currentPlayerFilter = null;
                this.updatePlayerFilterButtons();
                this.renderPlayers();
            });
        }

        // Render team filter buttons
        this.renderTeamFilterButtons();
    }

    renderTeamFilterButtons() {
        const container = document.getElementById('team-filter-buttons');
        if (!container) return;

        if (this.teams.length === 0) {
            container.innerHTML = '';
            return;
        }

        // Sort teams alphabetically
        const sortedTeams = [...this.teams].sort((a, b) => 
            a.name.localeCompare(b.name, 'ro', { sensitivity: 'base' })
        );

        container.innerHTML = sortedTeams.map(team => {
            const playerCount = this.players.filter(p => p.teamId === team.id).length;
            return `
                <button class="filter-btn" data-filter-team="${team.id}">
                    ${team.logo} ${team.name} (${playerCount})
                </button>
            `;
        }).join('');

        // Add event listeners to team filter buttons
        container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const teamId = parseInt(btn.dataset.filterTeam);
                this.currentPlayerFilter = teamId;
                this.updatePlayerFilterButtons();
                this.renderPlayers(teamId);
            });
        });
    }

    updatePlayerFilterButtons() {
        // Update active state on filter buttons
        document.querySelectorAll('[data-filter-team]').forEach(btn => {
            const filterValue = btn.dataset.filterTeam;
            if (filterValue === 'all' && this.currentPlayerFilter === null) {
                btn.classList.add('active');
            } else if (filterValue !== 'all' && parseInt(filterValue) === this.currentPlayerFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    populatePlayerTeamSelect() {
        const select = document.getElementById('player-team');
        if (!select) return;
        
        if (this.teams.length === 0) {
            select.innerHTML = '<option value="">Adaugă mai întâi echipe!</option>';
            return;
        }
        
        // Sort teams alphabetically
        const sortedTeams = [...this.teams].sort((a, b) => 
            a.name.localeCompare(b.name, 'ro', { sensitivity: 'base' })
        );
        
        select.innerHTML = sortedTeams.map(team => 
            `<option value="${team.id}">${team.name}</option>`
        ).join('');
    }

    savePlayer() {
        const name = document.getElementById('player-name').value;
        const teamId = parseInt(document.getElementById('player-team').value);
        const number = parseInt(document.getElementById('player-number').value) || null;
        const position = document.getElementById('player-position').value;

        if (!name.trim()) {
            alert('Numele jucătorului este obligatoriu!');
            return;
        }

        if (!teamId) {
            alert('Selectează o echipă!');
            return;
        }

        // Check for duplicate player name in the same team
        if (!this.currentPlayerId) {
            const duplicate = this.players.find(p => 
                p.teamId === teamId && 
                p.name.toLowerCase().trim() === name.toLowerCase().trim()
            );
            if (duplicate) {
                const teamName = this.teams.find(t => t.id === teamId)?.name;
                alert(`Jucătorul "${name}" există deja în echipa ${teamName}!`);
                return;
            }
        } else {
            // When editing, check if name conflicts with other players in same team
            const duplicate = this.players.find(p => 
                p.id !== this.currentPlayerId &&
                p.teamId === teamId && 
                p.name.toLowerCase().trim() === name.toLowerCase().trim()
            );
            if (duplicate) {
                const teamName = this.teams.find(t => t.id === teamId)?.name;
                alert(`Jucătorul "${name}" există deja în echipa ${teamName}!`);
                return;
            }
        }

        // Check for duplicate jersey number in the same team (only if duplicates not allowed)
        if (number && !this.config.allowDuplicateNumbers) {
            const duplicateNumber = this.players.find(p => 
                p.id !== this.currentPlayerId &&
                p.teamId === teamId && 
                p.number === number
            );
            if (duplicateNumber) {
                const teamName = this.teams.find(t => t.id === teamId)?.name;
                alert(`Numărul ${number} este deja folosit de ${duplicateNumber.name} în echipa ${teamName}!`);
                return;
            }
        }

        // Check if player number is required
        if (this.config.requirePlayerNumber && !number) {
            alert('Numărul tricou este obligatoriu conform setărilor turneului!');
            return;
        }

        // Check max players per team
        if (!this.currentPlayerId) {
            const teamPlayerCount = this.players.filter(p => p.teamId === teamId).length;
            if (teamPlayerCount >= this.config.maxPlayersPerTeam) {
                alert(`Echipa a atins numărul maxim de jucători (${this.config.maxPlayersPerTeam})!`);
                return;
            }
        }

        const player = {
            id: this.currentPlayerId || Date.now(),
            name: name.trim(),
            teamId,
            number,
            position
        };

        if (this.currentPlayerId) {
            const index = this.players.findIndex(p => p.id === this.currentPlayerId);
            // Keep existing stats when editing
            this.players[index] = { ...this.players[index], ...player };
        } else {
            // Initialize stats for new player
            player.stats = { goals: 0, assists: 0, yellowCards: 0, redCards: 0 };
            this.players.push(player);
        }

        this.saveData('players', this.players);
        
        // Update filter buttons to show new counts
        this.renderTeamFilterButtons();
        
        // Render players with current filter
        this.renderPlayers(this.currentPlayerFilter);
        
        document.getElementById('player-modal').classList.remove('active');
        
        alert(this.currentPlayerId ? 'Jucătorul a fost actualizat!' : 'Jucătorul a fost adăugat cu succes!');
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
        
        // Update filter buttons to show new counts
        this.renderTeamFilterButtons();
        
        // Render players with current filter
        this.renderPlayers(this.currentPlayerFilter);
    }

    renderPlayers(filterTeamId = null) {
        const container = document.getElementById('players-grid');
        if (!container) return;
        
        let filteredPlayers = this.players || [];
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
        const saveBtn = document.getElementById('save-groups-edit');
        const cancelBtn = document.getElementById('cancel-groups-edit');

        if (!editGroupsBtn || !editGroupsModal) {
            console.warn('Groups editing elements not found, skipping setup');
            return;
        }
        
        const closeBtn = editGroupsModal.querySelector('.close');

        editGroupsBtn.addEventListener('click', () => {
            if (Object.keys(this.groups).length === 0) {
                alert('Nu există grupe generate! Generează mai întâi grupele.');
                return;
            }
            this.renderGroupsEditor();
            editGroupsModal.classList.add('active');
        });

        if (clearGroupsBtn) {
            clearGroupsBtn.addEventListener('click', () => {
                if (!confirm('Sigur doriți să ștergeți toate grupele?')) return;
                this.groups = {};
                this.saveData('groups', this.groups);
                this.renderGroups();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                editGroupsModal.classList.remove('active');
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                editGroupsModal.classList.remove('active');
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveGroupsFromEditor();
                editGroupsModal.classList.remove('active');
            });
        }
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

        const team1 = this.teams.find(t => t.id === match.team1Id);
        const team2 = this.teams.find(t => t.id === match.team2Id);
        
        if (!team1 || !team2) return;

        const newScore1 = prompt(`Scor echipa 1 (${team1.name}):`, match.score1);
        const newScore2 = prompt(`Scor echipa 2 (${team2.name}):`, match.score2);

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
            
            // Update all views
            this.updateAllViews();
            
            alert('Scorul a fost actualizat! Statisticile au fost recalculate.');
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
        // Load config values into form
        this.loadConfigToForm();

        // Tournament config
        const saveTournamentConfig = document.getElementById('save-tournament-config');
        if (saveTournamentConfig) {
            saveTournamentConfig.addEventListener('click', () => this.saveTournamentConfig());
        }

        // Team settings
        const saveTeamSettings = document.getElementById('save-team-settings');
        const bulkDeleteTeams = document.getElementById('bulk-delete-teams');
        if (saveTeamSettings) {
            saveTeamSettings.addEventListener('click', () => this.saveTeamSettings());
        }
        if (bulkDeleteTeams) {
            bulkDeleteTeams.addEventListener('click', () => this.bulkDeleteTeams());
        }

        // Player settings
        const savePlayerSettings = document.getElementById('save-player-settings');
        const bulkDeletePlayers = document.getElementById('bulk-delete-players');
        if (savePlayerSettings) {
            savePlayerSettings.addEventListener('click', () => this.savePlayerSettings());
        }
        if (bulkDeletePlayers) {
            bulkDeletePlayers.addEventListener('click', () => this.bulkDeletePlayers());
        }

        // Match settings
        const saveMatchSettings = document.getElementById('save-match-settings');
        const bulkDeleteMatches = document.getElementById('bulk-delete-matches');
        if (saveMatchSettings) {
            saveMatchSettings.addEventListener('click', () => this.saveMatchSettings());
        }
        if (bulkDeleteMatches) {
            bulkDeleteMatches.addEventListener('click', () => this.bulkDeleteMatches());
        }

        // Advanced settings
        const saveAdvancedSettings = document.getElementById('save-advanced-settings');
        if (saveAdvancedSettings) {
            saveAdvancedSettings.addEventListener('click', () => this.saveAdvancedSettings());
        }

        // Reset buttons
        const resetAllBtn = document.getElementById('reset-all-data');
        const resetMatchesBtn = document.getElementById('reset-matches-only');
        const resetStatsBtn = document.getElementById('reset-stats-only');
        const resetGroupsBtn = document.getElementById('reset-groups-only');
        const resetPlayersBtn = document.getElementById('reset-players-only');
        const resetTournamentBtn = document.getElementById('reset-tournament-btn');

        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', () => this.resetAllData());
        }
        if (resetMatchesBtn) {
            resetMatchesBtn.addEventListener('click', () => this.resetMatches());
        }
        if (resetStatsBtn) {
            resetStatsBtn.addEventListener('click', () => this.resetStats());
        }
        if (resetGroupsBtn) {
            resetGroupsBtn.addEventListener('click', () => this.resetGroupsOnly());
        }
        if (resetPlayersBtn) {
            resetPlayersBtn.addEventListener('click', () => this.resetPlayersOnly());
        }
        if (resetTournamentBtn) {
            resetTournamentBtn.addEventListener('click', () => this.resetAllData());
        }

        // Export buttons
        const exportBtn = document.getElementById('export-data');
        const exportTeamsBtn = document.getElementById('export-teams-only');
        const exportPlayersBtn = document.getElementById('export-players-only');
        const importBtn = document.getElementById('import-data');
        const importFile = document.getElementById('import-file');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
        if (exportTeamsBtn) {
            exportTeamsBtn.addEventListener('click', () => this.exportTeamsOnly());
        }
        if (exportPlayersBtn) {
            exportPlayersBtn.addEventListener('click', () => this.exportPlayersOnly());
        }
        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => importFile.click());
            importFile.addEventListener('change', (e) => this.importData(e));
        }

        // Sample data generation
        const genTeamsBtn = document.getElementById('generate-sample-teams');
        const genPlayersBtn = document.getElementById('generate-sample-players');
        const genMatchesBtn = document.getElementById('generate-sample-matches');
        const genFullBtn = document.getElementById('generate-full-tournament');

        if (genTeamsBtn) {
            genTeamsBtn.addEventListener('click', () => this.generateSampleTeams());
        }
        if (genPlayersBtn) {
            genPlayersBtn.addEventListener('click', () => this.generateSamplePlayers());
        }
        if (genMatchesBtn) {
            genMatchesBtn.addEventListener('click', () => this.generateSampleMatches());
        }
        if (genFullBtn) {
            genFullBtn.addEventListener('click', () => this.generateFullTournament());
        }

        this.renderTournamentInfo();
    }

    loadConfigToForm() {
        // Load tournament config
        const tournamentName = document.getElementById('tournament-name');
        const tournamentLocation = document.getElementById('tournament-location');
        const tournamentStart = document.getElementById('tournament-start');
        const tournamentEnd = document.getElementById('tournament-end');

        if (tournamentName) tournamentName.value = this.config.tournamentName || '';
        if (tournamentLocation) tournamentLocation.value = this.config.tournamentLocation || '';
        if (tournamentStart) tournamentStart.value = this.config.tournamentStart || '';
        if (tournamentEnd) tournamentEnd.value = this.config.tournamentEnd || '';

        // Load team settings
        const maxPlayers = document.getElementById('max-players-per-team');
        const minPlayers = document.getElementById('min-players-per-team');
        const requireLogo = document.getElementById('require-team-logo');

        if (maxPlayers) maxPlayers.value = this.config.maxPlayersPerTeam || 25;
        if (minPlayers) minPlayers.value = this.config.minPlayersPerTeam || 11;
        if (requireLogo) requireLogo.checked = this.config.requireTeamLogo || false;

        // Load player settings
        const allowDupNumbers = document.getElementById('allow-duplicate-numbers');
        const requireNumber = document.getElementById('require-player-number');
        const defaultPos = document.getElementById('default-position');

        if (allowDupNumbers) allowDupNumbers.checked = this.config.allowDuplicateNumbers !== false;
        if (requireNumber) requireNumber.checked = this.config.requirePlayerNumber || false;
        if (defaultPos) defaultPos.value = this.config.defaultPosition || 'midfielder';

        // Load match settings
        const matchDuration = document.getElementById('match-duration');
        const allowOvertime = document.getElementById('allow-overtime');
        const allowPenalties = document.getElementById('allow-penalties');
        const defaultLocation = document.getElementById('default-match-location');

        if (matchDuration) matchDuration.value = this.config.matchDuration || 90;
        if (allowOvertime) allowOvertime.checked = this.config.allowOvertime || false;
        if (allowPenalties) allowPenalties.checked = this.config.allowPenalties || false;
        if (defaultLocation) defaultLocation.value = this.config.defaultMatchLocation || '';

        // Load advanced settings
        const autoSave = document.getElementById('auto-save');
        const showConfirmations = document.getElementById('show-confirmations');
        const teamsPerGroup = document.getElementById('teams-per-group');

        if (autoSave) autoSave.checked = this.config.autoSave !== false;
        if (showConfirmations) showConfirmations.checked = this.config.showConfirmations !== false;
        if (teamsPerGroup) teamsPerGroup.value = this.config.teamsPerGroup || 4;
    }

    saveTournamentConfig() {
        this.config.tournamentName = document.getElementById('tournament-name').value;
        this.config.tournamentLocation = document.getElementById('tournament-location').value;
        this.config.tournamentStart = document.getElementById('tournament-start').value;
        this.config.tournamentEnd = document.getElementById('tournament-end').value;

        this.saveData('config', this.config);
        alert('✅ Configurarea turneului a fost salvată!');
        this.renderTournamentInfo();
    }

    saveTeamSettings() {
        this.config.maxPlayersPerTeam = parseInt(document.getElementById('max-players-per-team').value);
        this.config.minPlayersPerTeam = parseInt(document.getElementById('min-players-per-team').value);
        this.config.requireTeamLogo = document.getElementById('require-team-logo').checked;

        this.saveData('config', this.config);
        alert('✅ Setările pentru echipe au fost salvate!');
    }

    savePlayerSettings() {
        this.config.allowDuplicateNumbers = document.getElementById('allow-duplicate-numbers').checked;
        this.config.requirePlayerNumber = document.getElementById('require-player-number').checked;
        this.config.defaultPosition = document.getElementById('default-position').value;

        this.saveData('config', this.config);
        alert('✅ Setările pentru jucători au fost salvate!');
    }

    saveMatchSettings() {
        this.config.matchDuration = parseInt(document.getElementById('match-duration').value);
        this.config.allowOvertime = document.getElementById('allow-overtime').checked;
        this.config.allowPenalties = document.getElementById('allow-penalties').checked;
        this.config.defaultMatchLocation = document.getElementById('default-match-location').value;

        this.saveData('config', this.config);
        alert('✅ Setările pentru meciuri au fost salvate!');
    }

    saveAdvancedSettings() {
        this.config.autoSave = document.getElementById('auto-save').checked;
        this.config.showConfirmations = document.getElementById('show-confirmations').checked;
        this.config.teamsPerGroup = parseInt(document.getElementById('teams-per-group').value);

        this.saveData('config', this.config);
        alert('✅ Setările avansate au fost salvate!');
    }

    bulkDeleteTeams() {
        if (!confirm('⚠️ ATENȚIE! Aceasta va șterge TOATE echipele și:\n\n- Toți jucătorii\n- Toate meciurile\n- Toate grupele\n\nContinui?')) return;

        this.teams = [];
        this.players = [];
        this.matches = [];
        this.groups = {};

        this.saveData('teams', this.teams);
        this.saveData('players', this.players);
        this.saveData('matches', this.matches);
        this.saveData('groups', this.groups);

        this.updateAllViews();
        alert('✅ Toate echipele și datele asociate au fost șterse!');
    }

    bulkDeletePlayers() {
        if (!confirm('Sigur doriți să ștergeți TOȚI jucătorii din toate echipele?')) return;

        this.players = [];
        this.saveData('players', this.players);
        this.updateAllViews();
        alert('✅ Toți jucătorii au fost șterși!');
    }

    bulkDeleteMatches() {
        if (!confirm('Sigur doriți să ștergeți TOATE meciurile?\n\nStatisticile echipelor vor fi resetate!')) return;

        this.matches = [];
        // Reset all team statistics
        this.teams.forEach(team => {
            team.stats = { 
                played: 0, wins: 0, draws: 0, losses: 0, 
                goalsFor: 0, goalsAgainst: 0, points: 0,
                setsWon: 0, setsLost: 0 
            };
        });

        this.saveData('matches', this.matches);
        this.saveData('teams', this.teams);
        this.updateAllViews();
        alert('✅ Toate meciurile au fost șterse și statisticile resetate!');
    }

    resetGroupsOnly() {
        if (!confirm('Sigur doriți să ștergeți toate grupele?')) return;

        this.groups = {};
        this.saveData('groups', this.groups);
        this.updateAllViews();
        alert('✅ Grupele au fost șterse!');
    }

    resetPlayersOnly() {
        if (!confirm('Sigur doriți să ștergeți toți jucătorii?')) return;

        this.players = [];
        this.saveData('players', this.players);
        this.updateAllViews();
        alert('✅ Toți jucătorii au fost șterși!');
    }

    exportTeamsOnly() {
        const data = {
            sport: this.currentSport,
            teams: this.teams,
            exportDate: new Date().toISOString(),
            exportType: 'teams-only'
        };

        this.downloadJSON(data, `echipe-${this.currentSport}-${new Date().toISOString().split('T')[0]}.json`);
        alert('✅ Echipele au fost exportate cu succes!');
    }

    exportPlayersOnly() {
        const data = {
            sport: this.currentSport,
            players: this.players,
            teams: this.teams, // Include teams for reference
            exportDate: new Date().toISOString(),
            exportType: 'players-only'
        };

        this.downloadJSON(data, `jucatori-${this.currentSport}-${new Date().toISOString().split('T')[0]}.json`);
        alert('✅ Jucătorii au fost exportați cu succes!');
    }

    downloadJSON(data, filename) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    // ========================================
    // Sample Data Generation
    // ========================================

    generateSampleTeams() {
        if (this.teams.length > 0) {
            if (!confirm('Există deja echipe! Continui să adaugi echipe demo?')) return;
        }

        const sampleTeams = this.currentSport === 'football' 
            ? [
                { name: 'Arsenal', logo: '🔴', city: 'Londra', coach: 'Mikel Arteta' },
                { name: 'Barcelona', logo: '🔵', city: 'Barcelona', coach: 'Xavi Hernández' },
                { name: 'Bayern München', logo: '🔴', city: 'München', coach: 'Thomas Tuchel' },
                { name: 'Chelsea', logo: '🔵', city: 'Londra', coach: 'Mauricio Pochettino' },
                { name: 'Juventus', logo: '⚫', city: 'Torino', coach: 'Massimiliano Allegri' },
                { name: 'Manchester United', logo: '🔴', city: 'Manchester', coach: 'Erik ten Hag' },
                { name: 'Paris Saint-Germain', logo: '🔵', city: 'Paris', coach: 'Luis Enrique' },
                { name: 'Real Madrid', logo: '⚪', city: 'Madrid', coach: 'Carlo Ancelotti' }
            ]
            : [
                { name: 'CSM București', logo: '🏐', city: 'București', coach: 'Adrian Vasile' },
                { name: 'Dinamo București', logo: '🔴', city: 'București', coach: 'Costel Enache' },
                { name: 'Știința Bacău', logo: '🔵', city: 'Bacău', coach: 'Gheorghe Crețu' },
                { name: 'Volei Municipal Zalău', logo: '🟡', city: 'Zalău', coach: 'Mihai Gavril' },
                { name: 'CSM Târgoviște', logo: '⚫', city: 'Târgoviște', coach: 'Dan Pascu' },
                { name: 'Rapid București', logo: '⚪', city: 'București', coach: 'Marian Muntean' },
                { name: 'Arcada Galați', logo: '🟢', city: 'Galați', coach: 'Constantin Matei' },
                { name: 'Steaua București', logo: '🔴', city: 'București', coach: 'Giani Kiriță' }
            ];

        sampleTeams.forEach(teamData => {
            const team = {
                id: Date.now() + Math.random(),
                ...teamData,
                stats: { 
                    played: 0, wins: 0, draws: 0, losses: 0, 
                    goalsFor: 0, goalsAgainst: 0, points: 0,
                    setsWon: 0, setsLost: 0
                }
            };
            this.teams.push(team);
        });

        this.saveData('teams', this.teams);
        this.updateAllViews();
        alert(`✅ ${sampleTeams.length} echipe demo au fost generate!`);
    }

    generateSamplePlayers() {
        if (this.teams.length === 0) {
            alert('Adaugă mai întâi echipe!');
            return;
        }

        if (this.players.length > 0) {
            if (!confirm('Există deja jucători! Continui să adaugi jucători demo?')) return;
        }

        const firstNames = ['Alex', 'Andrei', 'Cristian', 'Dan', 'Emil', 'Florin', 'George', 'Ion', 'Mihai', 'Radu', 'Stefan', 'Victor'];
        const lastNames = ['Popescu', 'Ionescu', 'Popa', 'Stan', 'Dumitrescu', 'Marin', 'Gheorghe', 'Stoica', 'Diaconu', 'Constantin'];
        const positions = ['goalkeeper', 'defender', 'defender', 'defender', 'midfielder', 'midfielder', 'midfielder', 'forward', 'forward'];

        let playersAdded = 0;

        this.teams.forEach(team => {
            // Add 11 players per team
            for (let i = 0; i < 11; i++) {
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const player = {
                    id: Date.now() + Math.random(),
                    name: `${firstName} ${lastName}`,
                    teamId: team.id,
                    number: i + 1,
                    position: positions[i] || 'midfielder',
                    stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 }
                };
                this.players.push(player);
                playersAdded++;
            }
        });

        this.saveData('players', this.players);
        this.updateAllViews();
        alert(`✅ ${playersAdded} jucători demo au fost generați!`);
    }

    generateSampleMatches() {
        if (this.teams.length < 4) {
            alert('Trebuie să ai cel puțin 4 echipe pentru a genera meciuri!');
            return;
        }

        if (Object.keys(this.groups).length === 0) {
            if (!confirm('Nu există grupe generate!\n\nGenerez grupele automat și apoi meciurile?')) return;
            this.generateGroups();
        }

        // Generate group stage matches
        let matchesAdded = 0;
        const today = new Date();

        Object.entries(this.groups).forEach(([groupName, teamIds]) => {
            // Generate round-robin matches for the group
            for (let i = 0; i < teamIds.length; i++) {
                for (let j = i + 1; j < teamIds.length; j++) {
                    const matchDate = new Date(today);
                    matchDate.setDate(today.getDate() + matchesAdded);
                    matchDate.setHours(18, 0, 0);

                    const match = {
                        id: Date.now() + Math.random(),
                        team1Id: teamIds[i],
                        team2Id: teamIds[j],
                        date: matchDate.toISOString().slice(0, 16),
                        stage: 'group',
                        location: this.config.defaultMatchLocation || `Teren ${matchesAdded + 1}`,
                        score1: null,
                        score2: null,
                        status: 'scheduled'
                    };
                    this.matches.push(match);
                    matchesAdded++;
                }
            }
        });

        this.saveData('matches', this.matches);
        this.updateAllViews();
        alert(`✅ ${matchesAdded} meciuri demo au fost generate pentru faza grupelor!`);
    }

    generateFullTournament() {
        if (!confirm('Aceasta va genera un turneu complet demo cu:\n\n- 8 echipe\n- ~88 jucători\n- Grupe\n- Meciuri\n\nContinui?')) return;

        // Clear existing data
        this.teams = [];
        this.players = [];
        this.matches = [];
        this.groups = {};

        // Generate sample data
        this.generateSampleTeams();
        setTimeout(() => {
            this.generateSamplePlayers();
            setTimeout(() => {
                this.generateSampleMatches();
                alert('🎉 Turneu complet generat cu succes!\n\nExplorează secțiunile pentru a vedea toate datele!');
            }, 100);
        }, 100);
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
        if (!confirm('Sigur doriți să ștergeți toate meciurile?\n\nAcest lucru va reseta și toate statisticile echipelor!')) return;
        
        this.matches = [];
        
        // Reset all team statistics
        this.teams.forEach(team => {
            team.stats = { 
                played: 0, wins: 0, draws: 0, losses: 0, 
                goalsFor: 0, goalsAgainst: 0, points: 0,
                setsWon: 0, setsLost: 0 
            };
        });
        
        this.saveData('matches', this.matches);
        this.saveData('teams', this.teams);
        this.updateAllViews();
        alert('Meciurile și statisticile au fost resetate!');
    }

    resetStats() {
        if (!confirm('Sigur doriți să resetați statisticile echipelor?\n\nAcest lucru nu va șterge meciurile, doar statisticile!')) return;
        
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
            config: this.config,
            teams: this.teams,
            matches: this.matches,
            groups: this.groups,
            players: this.players,
            exportDate: new Date().toISOString()
        };

        this.downloadJSON(data, `turneu-${this.currentSport}-${new Date().toISOString().split('T')[0]}.json`);
        alert('✅ Toate datele au fost exportate cu succes!');
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
                this.config = data.config || this.config;

                this.saveData('teams', this.teams);
                this.saveData('matches', this.matches);
                this.saveData('groups', this.groups);
                this.saveData('players', this.players);
                this.saveData('config', this.config);

                this.loadConfigToForm();
                this.updateAllViews();
                alert('✅ Datele au fost importate cu succes!');
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
        const scheduledMatches = this.matches.filter(m => m.status === 'scheduled').length;

        const tournamentName = this.config.tournamentName || 'Nesetat';
        const tournamentDates = this.config.tournamentStart && this.config.tournamentEnd
            ? `${this.config.tournamentStart} → ${this.config.tournamentEnd}`
            : 'Nesetate';

        container.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.95rem;">
                ${this.config.tournamentName ? `<div><strong>📛 Nume:</strong> ${this.config.tournamentName}</div>` : ''}
                ${this.config.tournamentLocation ? `<div><strong>📍 Locație:</strong> ${this.config.tournamentLocation}</div>` : ''}
                ${this.config.tournamentStart || this.config.tournamentEnd ? `<div><strong>📅 Perioada:</strong> ${tournamentDates}</div>` : ''}
                <div style="border-top: 1px solid #e5e7eb; padding-top: 0.5rem; margin-top: 0.5rem;"></div>
                <div><strong>Sport:</strong> ${config.icon} ${config.name}</div>
                <div><strong>Echipe:</strong> ${this.teams.length} echipe</div>
                <div><strong>Jucători:</strong> ${this.players?.length || 0} jucători</div>
                <div><strong>Meciuri:</strong> ${this.matches.length} total</div>
                <div style="margin-left: 1rem;">
                    <small>✅ Finalizate: ${finishedMatches}</small><br>
                    <small>📅 Programate: ${scheduledMatches}</small>
                </div>
                <div><strong>Grupe:</strong> ${Object.keys(this.groups).length} grupe</div>
            </div>
        `;
    }
}

// Initialize the tournament manager after DOM is loaded
let tournament;

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        tournament = new TournamentManager();
    });
} else {
    // DOM already loaded
    tournament = new TournamentManager();
}

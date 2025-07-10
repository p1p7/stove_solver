//Precompute power6
        const powers6 = new Uint32Array(9);
        for (let i = 0; i < 9; i++) powers6[i] = 6 ** i;

        //Base6 encoder/decoder
        function stateToInt(lights) {
            let key = 0;
            for (let i = 0; i < 9; i++) key += lights[i] * powers6[i];
            return key >>> 0;
        }
        function intToState(key) {
            const lights = new Array(9);
            for (let i = 0; i < 9; i++) {
            lights[i] = Math.floor(key / powers6[i]) % 6;
            }
            return lights;
        }
        
        const lookupTables = {
            1: {
                2: {1:0, 0:5, 5:3, 3:2, 2:4, 4:1},
                3: {2:3, 3:5, 5:0, 0:1, 1:4, 4:2},
                5: {2:0, 0:2, 1:3, 3:1, 4:5, 5:4},
                6: {3:5, 5:0, 0:1, 1:4, 4:2, 2:3},
                7: {1:2, 2:5, 5:1, 3:0, 0:4, 4:3}
            },
            2: {
                1: {1:3, 3:1, 4:5, 5:4, 0:2, 2:0},
                2: {1:0, 0:5, 5:3, 3:2, 2:4, 4:1},
                4: {5:4, 4:5, 1:3, 3:1, 0:2, 2:0},
                5: {2:5, 5:1, 1:2, 0:4, 4:3, 3:0},
                6: {3:4, 4:0, 0:3, 1:5, 5:2, 2:1},
                9: {2:3, 3:5, 5:0, 0:1, 1:4, 4:2}
            },
            3: {
                1: {3:0, 0:4, 4:3, 1:2, 2:5, 5:1},
                2: {1:2, 2:5, 5:1, 3:0, 0:4, 4:3},
                3: {2:1, 1:5, 5:2, 3:4, 4:0, 0:3},
                6: {3:2, 2:4, 4:1, 1:0, 0:5, 5:3},
                7: {1:5, 5:2, 2:1, 4:0, 0:3, 3:4},
                8: {2:5, 5:1, 1:2, 0:4, 4:3, 3:0}
            },
            4: {
                1: {3:2, 2:4, 4:1, 1:0, 0:5, 5:3},
                2: {1:4, 4:2, 2:3, 3:5, 5:0, 0:1},
                3: {2:5, 5:1, 1:2, 4:3, 3:0, 0:4},
                4: {4:3, 3:0, 0:4, 1:2, 2:5, 5:1},
                6: {3:0, 0:4, 4:3, 1:2, 2:5, 5:1},
                8: {2:1, 1:5, 5:2, 3:4, 4:0, 0:3},
                9: {2:1, 1:5, 5:2, 3:4, 4:0, 0:3}
            },
            5: {
                2: {1:2, 2:5, 5:1, 0:4, 4:3, 3:0},
                3: {2:3, 3:5, 5:0, 0:1, 1:4, 4:2},
                4: {4:1, 1:0, 0:5, 5:3, 3:2, 2:4},
                5: {2:0, 0:2, 4:5, 5:4, 1:3, 3:1},
                6: {3:2, 2:4, 4:1, 1:0, 0:5, 5:3},
                7: {1:2, 2:5, 5:1, 0:4, 4:3, 3:0}
            },
            6: {
                3: {2:1, 1:5, 5:2, 4:0, 0:3, 3:4},
                4: {4:2, 2:3, 3:5, 5:0, 0:1, 1:4},
                5: {2:4, 4:1, 1:0, 0:5, 5:3, 3:2},
                7: {3:1, 1:3, 2:0, 0:2, 4:5, 5:4},
                8: {2:3, 3:5, 5:0, 0:1, 1:4, 4:2},
                9: {2:5, 5:1, 1:2, 0:4, 4:3, 3:0}
            },
            7: {
                1: {5:2, 2:1, 1:5, 4:0, 0:3, 3:4},
                2: {3:1, 1:3, 2:0, 0:2, 4:5, 5:4},
                3: {3:4, 4:0, 0:3, 1:5, 5:2, 2:1},
                5: {3:2, 2:4, 4:1, 1:0, 0:5, 5:3},
                6: {5:0, 0:1, 1:4, 4:2, 2:3, 3:5},
                7: {2:5, 5:1, 1:2, 4:3, 3:0, 0:4},
                8: {5:2, 2:1, 1:5, 0:3, 3:4, 4:0},
                9: {1:3, 3:1, 0:2, 2:0, 4:5, 5:4}
            },
            8: {
                1: {0:1, 1:4, 4:2, 2:3, 3:5, 5:0},
                2: {1:0, 0:5, 5:3, 3:2, 2:4, 4:1},
                3: {5:4, 4:5, 2:0, 0:2, 1:3, 3:1},
                4: {2:1, 1:5, 5:2, 0:3, 3:4, 4:0},
                5: {0:3, 3:4, 4:0, 1:5, 5:2, 2:1},
                7: {4:3, 3:0, 0:4, 1:2, 2:5, 5:1},
                8: {1:0, 0:5, 5:3, 3:2, 2:4, 4:1},
                9: {5:3, 3:2, 2:4, 4:1, 1:0, 0:5}
            },
            9: {
                1: {3:4, 4:0, 0:3, 1:5, 5:2, 2:1},
                2: {4:5, 5:4, 1:3, 3:1, 2:0, 0:2},
                3: {4:1, 1:0, 0:5, 5:3, 3:2, 2:4},
                6: {0:1, 1:4, 4:2, 2:3, 3:5, 5:0},
                7: {2:1, 1:5, 5:2, 3:4, 4:0, 0:3},
                9: {5:1, 1:2, 2:5, 3:0, 0:4, 4:3}
            }
        };

        const buttonAffects = {
            1: [2, 3, 5, 6, 7],
            2: [1, 2, 4, 5, 6, 9],
            3: [1, 2, 3, 6, 7, 8],
            4: [1, 2, 3, 4, 6, 8, 9],
            5: [2, 3, 4, 5, 6, 7],
            6: [3, 4, 5, 7, 8, 9],
            7: [1, 2, 3, 5, 6, 7, 8, 9],
            8: [1, 2, 3, 4, 5, 7, 8, 9],
            9: [1, 2, 3, 6, 7, 9]
        };


        /**
         * Applies the effect of a button press to a given light state.
         * @param {number[]} currentLights - The current state of the 9 lights.
         * @param {number} buttonNum - The number of the button pressed (1-9).
         * @returns {number[]} The new state of the lights after the button press.
         */
        function applyButtonInt(stateInt, buttonNum) {
            let newKey = stateInt;
            for (let pos of buttonAffects[buttonNum]) {
            const idx = pos - 1;
            const pow = powers6[idx];
            const oldDigit = Math.floor(stateInt / pow) % 6;
            const mapped = lookupTables[buttonNum][pos][oldDigit];
            if (mapped !== undefined && mapped !== oldDigit) {
                newKey += (mapped - oldDigit) * pow;
            }
            }
            return newKey;
        }

        const reverseLookup = {};
        for (let btn = 1; btn <= 9; btn++) {
            reverseLookup[btn] = {};
            for (const posStr in lookupTables[btn]) {
                const pos = Number(posStr);
                reverseLookup[btn][pos] = {};
                const fwd = lookupTables[btn][pos];
                for (const before in fwd) {
                    const after = fwd[before];
                    reverseLookup[btn][pos][after] = Number(before);
                }
            }
        }

        function applyFwd(k, btn) {
            let x = k;
            for (const pos of buttonAffects[btn]) {
                const i = pos-1, pow = powers6[i];
                const d = Math.floor(x/pow)%6;
                const m = lookupTables[btn][pos][d];
                if (m!==undefined && m!==d) x += (m-d)*pow;
            }
            return x>>>0;
        }
        function applyBack(k, btn) {
            let x = k;
            for (const pos of buttonAffects[btn]) {
                const i = pos-1, pow = powers6[i];
                const d = Math.floor(x/pow)%6;
                const m = reverseLookup[btn][pos][d];
                if (m!==undefined && m!==d) x += (m-d)*pow;
            }
            return x>>>0;
        }

        // Bidirectional ring-buffer BFS setup
        const TOTAL_STATES = 6**9;      // 10,077,696
        const MAX_QUEUE    = 2_000_000; // per side

        // forward search
        const visitedF = new Uint8Array(TOTAL_STATES);
        const qFKeys   = new Uint32Array(MAX_QUEUE);
        const qFPar    = new Int32Array(MAX_QUEUE);
        const qFMove   = new Uint8Array(MAX_QUEUE);
        const qFDep    = new Uint8Array(MAX_QUEUE);

        // backward search
        const visitedB = new Uint8Array(TOTAL_STATES);
        const qBKeys   = new Uint32Array(MAX_QUEUE);
        const qBPar    = new Int32Array(MAX_QUEUE);
        const qBMove   = new Uint8Array(MAX_QUEUE);
        const qBDep    = new Uint8Array(MAX_QUEUE);

        function buildPath(keys, parents, moves, meetIdx) {
            const p = [];
            for (let i = meetIdx; i !== -1; i = parents[i]) {
            if (moves[i]) p.push(moves[i]);
            }
            return p.reverse();
        }


        let stateInt      = 0;    // all-zero state
        let moveHistory   = [];
        let solving       = false;
        let solution      = null;
        let editMode      = false;

        const gameGridEl            = document.querySelector('.stove-top');
        const buttonGridEl          = document.getElementById('buttonGrid');
        const moveHistoryDisplayEl  = document.getElementById('moveHistoryDisplay');
        const solutionDisplayEl     = document.getElementById('solutionDisplay');
        const solutionTextEl        = document.getElementById('solutionText');
        const solutionMovesEl       = document.getElementById('solutionMoves');
        const applySolutionBtn      = document.getElementById('applySolutionBtn');
        const victoryMessageEl      = document.getElementById('victoryMessage');
        const editModeMessageEl     = document.getElementById('editModeMessage');
        const buttonDisabledMessageEl = document.getElementById('buttonDisabledMessage');

        const resetBtn         = document.getElementById('resetBtn');
        const toggleEditModeBtn= document.getElementById('toggleEditModeBtn');
        const solveBtn         = document.getElementById('solveBtn');
        const closeSolutionBtn = document.getElementById('closeSolutionBtn');
        let knobButtons        = [];


        //Rendering helpers
        function renderLights() {
            const lights = intToState(stateInt);
            gameGridEl.innerHTML = '';
            lights.forEach((lvl, i) => {
            const div = document.createElement('div');
            div.classList.add('burner');
            div.setAttribute('data-state', lvl);
            div.textContent = lvl;
            div.title = editMode
                ? `Click to change heat level (currently ${lvl})`
                : `Burner ${i+1}: Heat Level ${lvl}`;
            div.addEventListener('click', () => clickLight(i));
            if (editMode) div.classList.add('edit-mode');
            gameGridEl.appendChild(div);
            });

            if (lights.every(x => x === 0)) {
            victoryMessageEl.classList.remove('hidden');
            } else {
            victoryMessageEl.classList.add('hidden');
            }
        }

        function renderButtons() {
            buttonGridEl.innerHTML = '';
            function makeRow(start, end) {
            const row = document.createElement('div');
            row.classList.add('knob-row');
            for (let i = start; i <= end; i++) {
                const btn = document.createElement('button');
                btn.classList.add('control-knob');
                btn.textContent = i;
                btn.disabled = editMode;
                btn.addEventListener('click', () => pressButton(i));
                row.appendChild(btn);
            }
            return row;
            }
            buttonGridEl.appendChild(makeRow(1,5));
            buttonGridEl.appendChild(makeRow(6,9));
            knobButtons = [...buttonGridEl.querySelectorAll('.control-knob')];

            buttonDisabledMessageEl.classList.toggle('hidden', !editMode);
        }

        function renderMoveHistory() {
            if (moveHistory.length === 0) {
            moveHistoryDisplayEl.innerHTML = '<p class="italic">No steps taken yet</p>';
            } else {
            moveHistoryDisplayEl.innerHTML =
                moveHistory.map(m => `<span class="move-tag">${m}</span>`).join('');
            }
        }

        function updateUI() {
            renderLights();
            renderButtons();
            renderMoveHistory();

            editModeMessageEl.classList.toggle('hidden', !editMode);
            toggleEditModeBtn.classList.toggle('active', editMode);
            toggleEditModeBtn.textContent = editMode ? 'Exit Edit Mode' : 'Enter Edit Mode';

            const allZero = (stateInt === 0);
            solveBtn.disabled = solving || allZero || editMode;
            solveBtn.textContent = solving ? 'Finding Solution…' : 'Find Solution';

            if (solution !== null) {
            solutionDisplayEl.classList.remove('hidden');
            if (typeof solution === 'string') {
                solutionTextEl.textContent = solution;
                solutionMovesEl.innerHTML = '';
                applySolutionBtn.classList.add('hidden');
            } else {
                solutionTextEl.textContent = '';
                solutionMovesEl.innerHTML = solution
                .map(m => `<span class="solution-tag">${m}</span>`)
                .join('');
                applySolutionBtn.classList.remove('hidden');
                applySolutionBtn.disabled = solving;
            }
            } else {
            solutionDisplayEl.classList.add('hidden');
            }
        }


        //User interactions
        function pressButton(n) {
            if (editMode) return;
            stateInt = applyButtonInt(stateInt, n);
            moveHistory.push(n);
            updateUI();
        }

        function clickLight(idx) {
            if (!editMode) return;
            // flip through 0–5
            const lights = intToState(stateInt);
            lights[idx] = (lights[idx] + 1) % 6;
            stateInt = stateToInt(lights);
            moveHistory = [];
            solution = null;
            updateUI();
        }

        function reset() {
            stateInt = 0;
            moveHistory = [];
            solution = null;
            editMode = false;
            updateUI();
        }

        function randomize() {
            const lights = Array.from({ length: 9 }, () => Math.floor(Math.random() * 6));
            stateInt = stateToInt(lights);
            moveHistory = [];
            solution = null;
            editMode = false;
            updateUI();
        }

        function toggleEditMode() {
            editMode = !editMode;
            solution = null;
            updateUI();
        }

        function closeSolutionDisplay() {
            solution = null;
            updateUI();
        }


        //BFS solver using integers
        function solvePuzzle() {
        if (solving) return;
        solving = true; solution = null; updateUI();

        setTimeout(() => {
        visitedF.fill(0);
        visitedB.fill(0);
        let hF=0,tF=0,hB=0,tB=0;
        const start = stateInt, goal = 0;
        if (start===goal) {
            solution=[]; solving=false; return updateUI();
        }

        visitedF[start]=1;
        qFKeys[tF]=start; qFPar[tF]=-1; qFMove[tF]=0; qFDep[tF]=0; tF++;
        visitedB[goal]=1;
        qBKeys[tB]=goal; qBPar[tB]=-1; qBMove[tB]=0; qBDep[tB]=0; tB++;

        let meetF=-1, meetB=-1;
        const MAXD=12;

        while ((hF<tF || hB<tB) && meetF<0 && meetB<0) {
            // forward
            if (hF<tF) {
            const sz = tF-hF;
            for (let i=0;i<sz;i++,hF++) {
                const key=qFKeys[hF], d=qFDep[hF];
                if (d<MAXD) {
                for (let btn=1;btn<=9;btn++){
                    const nxt=applyFwd(key,btn);
                    if (!visitedF[nxt]) {
                    visitedF[nxt]=1;
                    qFKeys[tF]=nxt; qFPar[tF]=hF; qFMove[tF]=btn; qFDep[tF]=d+1;
                    if (visitedB[nxt]) { meetF=tF; break; }
                    tF=(tF+1)%MAX_QUEUE;
                    }
                }
                if (meetF>=0) break;
                }
            }
            }
            // backward
            if (meetF<0 && hB<tB) {
            const szB = tB-hB;
            for (let i=0;i<szB;i++,hB++) {
                const key=qBKeys[hB], d=qBDep[hB];
                if (d<MAXD) {
                for (let btn=1;btn<=9;btn++){
                    const rev=applyBack(key,btn);
                    if (!visitedB[rev]) {
                    visitedB[rev]=1;
                    qBKeys[tB]=rev; qBPar[tB]=hB; qBMove[tB]=btn; qBDep[tB]=d+1;
                    if (visitedF[rev]) { meetB=tB; break; }
                    tB=(tB+1)%MAX_QUEUE;
                    }
                }
                if (meetB>=0) break;
                }
            }
            }
        }

        if (meetF>=0 || meetB>=0) {
            const idxF = meetF>=0 ? meetF : qFKeys.indexOf(qBKeys[meetB]);
            const idxB = meetB>=0 ? meetB : qBKeys.indexOf(qFKeys[meetF]);
            const pF = buildPath(qFKeys,qFPar,qFMove,idxF);
            const pB = buildPath(qBKeys,qBPar,qBMove,idxB).reverse();
            solution = pF.concat(pB);
        } else {
            solution = `No solution within ${MAXD*2} moves.`;
        }

        solving = false;
        updateUI();
        }, 10);
    }

        async function applySolution() {
            if (!Array.isArray(solution) || solving) return;
            moveHistory = [];
            updateUI();
            applySolutionBtn.disabled = true;
            solveBtn.disabled = true;
            knobButtons.forEach(b => b.disabled = true);
            resetBtn.disabled = true;
            toggleEditModeBtn.disabled = true;

            for (let btn of solution) {
            stateInt = applyButtonInt(stateInt, btn);
            moveHistory.push(btn);
            updateUI();
            await new Promise(r => setTimeout(r, 500));
            }

            applySolutionBtn.disabled = false;
            solveBtn.disabled = false;
            knobButtons.forEach(b => b.disabled = false);
            resetBtn.disabled = false;
            toggleEditModeBtn.disabled = false;
            updateUI();
        }

        //Init
        document.addEventListener('DOMContentLoaded', () => {
            updateUI();
            resetBtn.addEventListener('click', reset);
            toggleEditModeBtn.addEventListener('click', toggleEditMode);
            solveBtn.addEventListener('click', solvePuzzle);
            applySolutionBtn.addEventListener('click', applySolution);
            closeSolutionBtn.addEventListener('click', closeSolutionDisplay);
        });
// Global State
let lights = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let moveHistory = [];
let solving = false;
let solution = null;
let editMode = false;

// DOM Elements
const gameGridEl = document.querySelector('.stove-top');
const buttonGridEl = document.getElementById('buttonGrid');
const moveHistoryDisplayEl = document.getElementById('moveHistoryDisplay');
const solutionDisplayEl = document.getElementById('solutionDisplay');
const solutionTextEl = document.getElementById('solutionText');
const solutionMovesEl = document.getElementById('solutionMoves');
const applySolutionBtn = document.getElementById('applySolutionBtn');
const victoryMessageEl = document.getElementById('victoryMessage');
const editModeMessageEl = document.getElementById('editModeMessage');
const buttonDisabledMessageEl = document.getElementById('buttonDisabledMessage');

const resetBtn = document.getElementById('resetBtn');
const randomizeBtn = document.getElementById('randomizeBtn');
const toggleEditModeBtn = document.getElementById('toggleEditModeBtn');
const solveBtn = document.getElementById('solveBtn');

// Lookup tables for each button (Copied directly from your React code)
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

// Button affects mapping (Copied directly from your React code)
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

// --- Helper Functions ---

/**
 * Applies the effect of a button press to a given light state.
 * @param {number[]} currentLights - The current state of the 9 lights.
 * @param {number} buttonNum - The number of the button pressed (1-9).
 * @returns {number[]} The new state of the lights after the button press.
 */
const applyButton = (currentLights, buttonNum) => {
    const newLights = [...currentLights];
    const affectedLights = buttonAffects[buttonNum];

    affectedLights.forEach(lightPos => {
        const currentState = currentLights[lightPos - 1]; // Convert to 0-indexed
        const lookupTable = lookupTables[buttonNum][lightPos];
        if (lookupTable && lookupTable.hasOwnProperty(currentState)) { // Check if lookup exists for current state
             newLights[lightPos - 1] = lookupTable[currentState];
        } else {
            console.warn(`No lookup for button ${buttonNum}, light ${lightPos}, state ${currentState}`);
        }
    });
    return newLights;
};

/**
 * Converts a light state array to a comma-separated string for hashing.
 * @param {number[]} state - The array of light states.
 * @returns {string} The string representation of the state.
 */
const stateToString = (state) => state.join(',');

/**
 * Renders the current state of the burners onto the stove-top grid.
 */
const renderLights = () => {
    gameGridEl.innerHTML = ''; // Clear existing lights
    lights.forEach((state, index) => {
        const lightDiv = document.createElement('div');
        lightDiv.classList.add('burner');
        lightDiv.setAttribute('data-state', state); // Use data-state for CSS
        lightDiv.textContent = state;
        lightDiv.addEventListener('click', () => clickLight(index));

        if (editMode) {
            lightDiv.classList.add('edit-mode');
            lightDiv.title = `Click to change heat level (currently ${state})`;
        } else {
            lightDiv.classList.remove('edit-mode');
            lightDiv.title = `Burner ${index + 1}: Heat Level ${state}`;
        }
        gameGridEl.appendChild(lightDiv);
    });

    const allZeros = lights.every(light => light === 0);
    if (allZeros) {
        victoryMessageEl.classList.remove('hidden');
    } else {
        victoryMessageEl.classList.add('hidden');
    }
};

/**
 * Renders the control knobs with the new layout (1-5 in first row, 6-9 in second).
 */
const renderButtons = () => {
    buttonGridEl.innerHTML = '';

    const createButtonRow = (start, end) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('knob-row');
        for (let i = start; i <= end; i++) {
            const button = document.createElement('button');
            button.classList.add('control-knob');
            button.textContent = i;
            button.addEventListener('click', () => pressButton(i));
            button.disabled = editMode; // Disable if in edit mode
            rowDiv.appendChild(button);
        }
        return rowDiv;
    };

    buttonGridEl.appendChild(createButtonRow(1, 5)); // First row: knobs 1-5
    buttonGridEl.appendChild(createButtonRow(6, 9)); // Second row: knobs 6-9

    if (editMode) {
        buttonDisabledMessageEl.classList.remove('hidden');
    } else {
        buttonDisabledMessageEl.classList.add('hidden');
    }
};

/**
 * Renders the move history.
 */
const renderMoveHistory = () => {
    moveHistoryDisplayEl.innerHTML = ''; // Clear
    if (moveHistory.length > 0) {
        const moveTagsContainer = document.createElement('div');
        moveTagsContainer.classList.add('move-tags');
        moveHistory.forEach((move, index) => {
            const span = document.createElement('span');
            span.classList.add('move-tag');
            span.textContent = move;
            moveTagsContainer.appendChild(span);
        });
        moveHistoryDisplayEl.appendChild(moveTagsContainer);
    } else {
        const p = document.createElement('p');
        p.classList.add('italic');
        p.textContent = 'No steps taken yet';
        moveHistoryDisplayEl.appendChild(p);
    }
};

/**
 * Updates the UI based on the current game state.
 */
const updateUI = () => {
    renderLights();
    renderButtons();
    renderMoveHistory();

    // Update edit mode message visibility
    if (editMode) {
        editModeMessageEl.classList.remove('hidden');
        toggleEditModeBtn.classList.add('active');
        toggleEditModeBtn.textContent = 'Exit Edit Mode';
    } else {
        editModeMessageEl.classList.add('hidden');
        toggleEditModeBtn.classList.remove('active');
        toggleEditModeBtn.textContent = 'Enter Edit Mode';
    }

    // Update solve button state
    const allZeros = lights.every(light => light === 0);
    solveBtn.disabled = solving || allZeros || editMode;
    solveBtn.textContent = solving ? 'Finding Solution...' : 'Find Solution';

    // Update solution display
    if (solution !== null) {
        solutionDisplayEl.classList.remove('hidden');
        if (typeof solution === 'string') {
            solutionTextEl.textContent = solution;
            solutionMovesEl.innerHTML = ''; // Clear moves
            applySolutionBtn.classList.add('hidden');
        } else {
            solutionTextEl.textContent = '';
            solutionMovesEl.innerHTML = '';
            solution.forEach(move => {
                const span = document.createElement('span');
                span.classList.add('solution-tag');
                span.textContent = move;
                solutionMovesEl.appendChild(span);
            });
            applySolutionBtn.classList.remove('hidden');
            applySolutionBtn.disabled = solving;
        }
    } else {
        solutionDisplayEl.classList.add('hidden');
    }
};

// --- Game Logic Functions ---

const pressButton = (buttonNum) => {
    if (editMode) return;

    lights = applyButton(lights, buttonNum);
    moveHistory.push(buttonNum);
    solution = null; // Clear solution if manual move is made
    updateUI();
};

const clickLight = (index) => {
    if (editMode) {
        lights[index] = (lights[index] + 1) % 6;
        moveHistory = []; // Reset history in edit mode
        solution = null;
        updateUI();
    }
};

const reset = () => {
    lights = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    moveHistory = [];
    solution = null;
    editMode = false;
    updateUI();
};

const randomize = () => {
    lights = Array(9).fill(0).map(() => Math.floor(Math.random() * 6));
    moveHistory = [];
    solution = null;
    editMode = false;
    updateUI();
};

const toggleEditMode = () => {
    editMode = !editMode;
    solution = null; // Clear solution when toggling mode
    updateUI();
};

// Removed setPresetPattern function

const solvePuzzle = () => {
    solving = true;
    solution = null;
    updateUI(); // Update UI to show 'Solving...' and disable button

    // Use setTimeout to allow UI to update before starting heavy computation
    setTimeout(() => {
        const targetState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        const targetString = stateToString(targetState);
        const startString = stateToString(lights);

        if (startString === targetString) {
            solution = [];
            solving = false;
            updateUI();
            return;
        }

        const queue = [{state: lights, moves: []}];
        const visited = new Set([startString]);
        const maxStates = 5000000; // 5 million states limit
        const maxDepth = 25; // Limit search depth
        let statesExplored = 0;

        let foundSolution = null;

        while (queue.length > 0 && statesExplored < maxStates && !foundSolution) {
            const {state, moves} = queue.shift();
            statesExplored++;

            // Try each button
            for (let button = 1; button <= 9; button++) {
                const newState = applyButton(state, button);
                const newStateString = stateToString(newState);

                if (newStateString === targetString) {
                    foundSolution = [...moves, button];
                    break; // Found solution, exit button loop
                }

                if (!visited.has(newStateString) && moves.length < maxDepth) {
                    visited.add(newStateString);
                    queue.push({state: newState, moves: [...moves, button]});
                }
            }
        }

        // Set solution based on findings
        if (foundSolution) {
            solution = foundSolution;
        } else if (statesExplored >= maxStates) {
            solution = `Solution search limit reached (${maxStates} states explored) - try a different meal or it may require >${maxDepth} steps`;
        } else {
            solution = `No solution found within ${maxDepth} steps.`;
        }

        solving = false;
        updateUI(); // Update UI with solution or message
    }, 10); // Small delay to allow UI refresh
};


const applySolution = async () => {
    if (!solution || typeof solution === 'string' || solving) return;

    moveHistory = []; // Clear current history
    lights = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // Reset board visually before applying solution
    updateUI();

    // Disable buttons during animation
    applySolutionBtn.disabled = true;
    solveBtn.disabled = true;
    document.querySelectorAll('.control-knob').forEach(btn => btn.disabled = true);
    // Removed disabling preset buttons as they are no longer in HTML
    randomizeBtn.disabled = true;
    resetBtn.disabled = true;
    toggleEditModeBtn.disabled = true;


    for (let i = 0; i < solution.length; i++) {
        const buttonNum = solution[i];
        lights = applyButton(lights, buttonNum);
        moveHistory.push(buttonNum);
        updateUI();
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
    }

    // Re-enable buttons after animation
    applySolutionBtn.disabled = false;
    solveBtn.disabled = false;
    document.querySelectorAll('.control-knob').forEach(btn => btn.disabled = false);
    // Removed re-enabling preset buttons
    randomizeBtn.disabled = false;
    resetBtn.disabled = false;
    toggleEditModeBtn.disabled = false;

    updateUI(); // Final UI update
};


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    updateUI();

    // Action buttons
    resetBtn.addEventListener('click', reset);
    randomizeBtn.addEventListener('click', randomize);
    toggleEditModeBtn.addEventListener('click', toggleEditMode);
    solveBtn.addEventListener('click', solvePuzzle);
    applySolutionBtn.addEventListener('click', applySolution);

    // Removed preset pattern event listeners
});
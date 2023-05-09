let ConwayGame = function (playingFieldElement, generationElement, livingCellsElement) {

    this.playinFieldElement = playingFieldElement;
    this.generationElement = generationElement;
    this.livingCellsElement = livingCellsElement

    this.playingFieldWidth = 680;
    this.playingFieldHeight = 680;
    this.cellWidth = 8;
    this.cellHeight = 8;

    this.cellColumns = null;
    this.cellRows = null;

    this.stateLiveClass = "cell_live";
    this.stateDeadClass = "cell_dead";
    this.CellRowClassName = "cell_row";

    this.loopSpeed = 20;

    this.curModeIdx = 0;

    this.cells = [];

    this.generation = 0;
    this.livingCells = 0;

    this.modes = {
        "random": {name: "random", state: []},
        "clear": {name: "clear", state: []}
    };

    this.modesList = ["random", "clear"]

    this.curCellsState = null;

    this.Active = false;

    this.Init();

}

ConwayGame.prototype.Init = function () {

    let _this = this;

    _this.cellColumns = Math.floor(_this.playingFieldWidth / _this.cellWidth);
    _this.cellRows = Math.floor(_this.playingFieldHeight / _this.cellHeight);

    _this.modes["random"].state = _this.GetRandomState();
    _this.modes["clear"].state = _this.GetClearState();

    _this.curCellsState = _this.modes[_this.modesList[_this.curModeIdx]].state

    _this.RefreshCellsEl();

    _this.Render();
}

ConwayGame.prototype.RefreshCellsEl = function () {

    let _this = this;

    for (let y = 0; y < _this.cellRows; y++) {
        let cellRow = document.createElement("div");
        cellRow.className = _this.CellRowClassName;
        _this.playinFieldElement.appendChild(cellRow);
        cellRow.style.display = "flex";
        let row = [];
        for (let x = 0; x < _this.cellColumns; x++) {
            let cell = document.createElement("div");
            cell.className = _this.stateDeadClass;
            cellRow.appendChild(cell);
            cell.style.width = _this.cellWidth + "px";
            cell.style.height = _this.cellHeight + "px";
            cell.addEventListener("mouseenter", (event) => {
                if (event.buttons === 1) {
                    _this.Active = false;
                    if (cell.className === _this.stateDeadClass) {
                        cell.className = _this.stateLiveClass;
                        _this.curCellsState[y][x] = _this.stateLiveClass;
                    } else {
                        cell.className = _this.stateDeadClass;
                        _this.curCellsState[y][x] = _this.stateDeadClass;
                    }
                }
            })
            cell.addEventListener("click", () => {
                _this.Active = false;
                if (cell.className === _this.stateDeadClass) {
                    cell.className = _this.stateLiveClass;
                    _this.curCellsState[y][x] = _this.stateLiveClass;
                } else {
                    cell.className = _this.stateDeadClass;
                    _this.curCellsState[y][x] = _this.stateDeadClass;
                }
            })
            row.push(cell);
        }
        _this.cells.push(row);
    }
}

ConwayGame.prototype.Render = function () {

    let _this = this;

    for (let y = 0; y < _this.cellRows; y++) {
        for (let x = 0; x < _this.cellColumns; x++) {
            _this.cells[y][x].className = _this.curCellsState[y][x];
        }
    }

    _this.CountLivingCells();

    _this.generationElement.textContent = _this.generation;
    _this.livingCellsElement.textContent = _this.livingCells;
}

ConwayGame.prototype.Play = async function () {

    let _this = this;

    _this.Active = true;

    while (_this.Active) {
        _this.Render()
        _this.GetNextState();
        _this.generation += 1;
        await new Promise(resolve => setTimeout(resolve, _this.loopSpeed));
    }
}

ConwayGame.prototype.Stop = function () {

    let _this = this;

    _this.Active = false;
}

ConwayGame.prototype.Reset = function () {

    let _this = this;

    _this.generation = 0;

    if (!_this.Active) {
        if (_this.modes[_this.modesList[_this.curModeIdx]].name === "random") {
            _this.modes[_this.modesList[_this.curModeIdx]].state = _this.GetRandomState();
        }
        if (_this.modes[_this.modesList[_this.curModeIdx]].name === "clear") {
            _this.modes[_this.modesList[_this.curModeIdx]].state = _this.GetClearState();
        }
    }
    if (_this.Active) {
        _this.Active = false;
    }

    _this.curCellsState = _this.modes[_this.modesList[_this.curModeIdx]].state
    _this.Render();
}

ConwayGame.prototype.GetClearState = function () {

    let _this = this;
    let resultCellsState = [];
    for (let y = 0; y < _this.cellRows; y++) {
        let rowStateCells = []
        for (let x = 0; x < _this.cellColumns; x++) {
            rowStateCells.push(_this.stateDeadClass);
        }
        resultCellsState.push(rowStateCells);
    }
    return resultCellsState;
}

ConwayGame.prototype.GetRandomState = function () {

    let _this = this;

    let resultCellsState = [];

    for (let y = 0; y < _this.cellRows; y++) {
        let rowStateCells = []
        for (let x = 0; x < _this.cellColumns; x++) {
            let state = Math.random() < 0.5 ? _this.stateLiveClass : _this.stateDeadClass;
            rowStateCells.push(state);
        }
        resultCellsState.push(rowStateCells);
    }
    return resultCellsState;
}

ConwayGame.prototype.GetNextState = function () {

    let _this = this;

    let nextStateCells = [];

    for (let y = 0; y < _this.cellRows; y++) {
        let row = []
        for (let x = 0; x < _this.cellColumns; x++) {
            let neighbors = _this.countNeighbors(x, y);
            if (_this.curCellsState[y][x] === _this.stateLiveClass && (neighbors < 2 || neighbors > 3)) {
                row.push(_this.stateDeadClass);
            } else if ((_this.curCellsState[y][x] === _this.stateDeadClass) && (neighbors === 3)) {
                row.push(_this.stateLiveClass);
            } else {
                row.push(_this.curCellsState[y][x]);
            }
        }
        nextStateCells.push(row);
    }
    _this.curCellsState = nextStateCells;
}

ConwayGame.prototype.countNeighbors = function(x, y) {

    let _this = this;

    let neighbors = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) {
                continue;
            }
            const nx = x + dx;
            const ny = y + dy;

            if (_this.IsCoordCorrect(nx, ny)) {
                if (_this.curCellsState[ny][nx] === _this.stateLiveClass) {
                    neighbors += 1;
                }
            }
        }
    }
    return neighbors;
}

ConwayGame.prototype.IsCoordCorrect = function(x, y) {
    let _this = this;
    return ((x >= 0 && y < _this.cellColumns) && (y >= 0 && y < _this.cellRows));
}

ConwayGame.prototype.ChangeMode = function (button_mode) {

    let _this = this;

    _this.Active = false;

    if (button_mode === "next") {
        _this.curModeIdx += 1;
        if (_this.curModeIdx >= _this.modesList.length) {
            _this.curModeIdx = 0;
        }
    } else {
        _this.curModeIdx -= 1;
        if (_this.curModeIdx < 0) {
            _this.curModeIdx = _this.modesList.length - 1;
        }
    }

    _this.curCellsState = _this.modes[_this.modesList[_this.curModeIdx]].state;

    _this.Render();

}

ConwayGame.prototype.CountLivingCells = function () {

    let _this = this;
    _this.livingCells = 0;
    for (let y = 0; y < _this.cellRows; y++) {
        for (let x = 0; x < _this.cellColumns; x++) {
            if (_this.cells[y][x].className === _this.stateLiveClass) {
                _this.livingCells += 1;
            }
        }
    }
}

ConwayGame.prototype.SetResolution = function(value) {

    let _this = this;

    _this.Active = false;

    _this.cellWidth = _this.cellHeight = value;

    _this.FullReset();
}

ConwayGame.prototype.SetSpeed = function (value) {

    let _this = this;

    _this.loopSpeed = value;
    console.log(_this.loopSpeed);
}

ConwayGame.prototype.FullReset = function () {

    let _this = this;
    console.log(_this.cell);
    let cellRows = document.querySelectorAll("." + _this.CellRowClassName)

    cellRows.forEach(el => el.remove());

    _this.generation = 0;

    _this.cells = [];

    _this.curCellsState = [];

    _this.Init();
}

document.addEventListener("DOMContentLoaded", function () {

    let wWidth = window.innerWidth;
    let wHeight = window.innerHeight;
    let pageBody = document.getElementsByTagName("body")[0];
    pageBody.style.height = wHeight + "px";
    pageBody.style.width = wWidth + "px";

    let conwayGame = new ConwayGame(
        document.getElementById("playing_field"),
        document.getElementById("generation"),
        document.getElementById("living_cells")
    );

    let playButton = document.getElementById("play");
    let stopButton = document.getElementById("stop")
    let resetButton = document.getElementById("reset")

    playButton.addEventListener("click", () => {
        conwayGame.Play();
    });

    stopButton.addEventListener("click", () => {
        conwayGame.Stop();
    })

    resetButton.addEventListener("click", () => {
        conwayGame.Reset();
    });

    let buttonNextMode = document.getElementById("mode_next")
    let buttonPreviousMode = document.getElementById("mode_previous")
    let showMode = document.getElementById("mode")

    showMode.textContent = conwayGame.modes[conwayGame.modesList[conwayGame.curModeIdx]].name;

    buttonNextMode.addEventListener("click", () => {
        conwayGame.ChangeMode("next");
        showMode.textContent = conwayGame.modes[conwayGame.modesList[conwayGame.curModeIdx]].name;
    })
    buttonPreviousMode.addEventListener("click", () => {
        conwayGame.ChangeMode("previous");
        showMode.textContent = conwayGame.modes[conwayGame.modesList[conwayGame.curModeIdx]].name;
    })

    let resolutionInput = document.getElementById("resolution");
    resolutionInput.addEventListener("input", () => {
        let resolutionValue = resolutionInput.value;
        conwayGame.SetResolution(resolutionValue);
    })

    let speedInput = document.getElementById("speed");
    speedInput.addEventListener("input", () => {
        let speedValue = speedInput.value;
        conwayGame.SetSpeed(speedValue );
    })
})




let ConwayGame = function (playingFieldElement) {

    let _this = this;

    this.playinFieldEllement = playingFieldElement;

    this.playingFieldWidth = 200;
    this.playingFieldHeight = 200;
    this.cellWidth = 3;
    this.cellHeight = 3;

    this.cellColumns = _this.playingFieldWidth / _this.cellWidth;
    this.cellRows = _this.playingFieldHeight / _this.cellHeight;

    this.stateLive = "grey";
    this.stateDead = "white";

    this.cells = [];

    this.maxSaveStates = 5;
    this.loopSpeed = 50;
    this.loopFlag = false;

    this.score = 0;

    this.modes = {
        random: _this.GetRandomState()
    };

    this.curCellsState = _this.modes.random;

    this.cellStates = [];

    this.Active = false;

    this.Init();

}

ConwayGame.prototype.Init = function () {

    let _this = this;

    _this.playinFieldEllement.style.width = _this.playingFieldWidth + "px";
    _this.playinFieldEllement.style.height = _this.playingFieldHeight + "px";

    for (let y = 0; y < _this.cellRows; y++) {
        let cellRow = document.createElement("div");
        _this.playinFieldEllement.appendChild(cellRow);
        cellRow.style.display = "flex";
        let row = [];
        for (let x = 0; x < _this.cellColumns; x++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cellRow.appendChild(cell);
            cell.style.width = _this.cellWidth + "px";
            cell.style.height = _this.cellHeight + "px";
            row.push(cell);
        }
        _this.cells.push(row);
    }
    _this.Render();

}

ConwayGame.prototype.GetRandomState = function () {

    let _this = this;
    let resultCellsState = [];

    for (let y = 0; y < _this.cellRows; y++) {
        let rowStateCells = []
        for (let x = 0; x < _this.cellColumns; x++) {
            let state = Math.random() < 0.5 ? _this.stateLive : _this.stateDead;
            rowStateCells.push(state);
        }
        resultCellsState.push(rowStateCells);
    }
    return resultCellsState;
}

ConwayGame.prototype.Render = function () {

    let _this = this;
    for (let y = 0; y < _this.cellRows; y++) {
        for (let x = 0; x < _this.cellColumns; x++) {
            _this.cells[y][x].style.backgroundColor = _this.curCellsState[y][x];
        }
    }
}

ConwayGame.prototype.Reset = function () {

    let _this = this;

    // if (_this.Active) {
    //
    // }
    _this.score = 0;
    _this.curCellsState = _this.GetRandomState();
    _this.Render();
}

ConwayGame.prototype.Start = async function () {

    let _this = this;

    _this.Active = true;

    while (_this.Active) {
        _this.Render()
        _this.cellStates.push(_this.curCellsState);
        _this.GetNextState();
        _this.score += 1;
        console.log(_this.score);
        await new Promise(resolve => setTimeout(resolve, _this.loopSpeed));
    }
}

ConwayGame.prototype.GetNextState = function () {

    let _this = this;

    let nextStateCells = [];

    for (let y = 0; y < _this.cellRows; y++) {
        let row = []
        for (let x = 0; x < _this.cellColumns; x++) {
            let neighbors = _this.countNeighbors(x, y);
            if (_this.curCellsState[y][x] === _this.stateLive && (neighbors < 2 || neighbors > 3)) {
                row.push(_this.stateDead);
            } else if ((_this.curCellsState[y][x] === _this.stateDead) && (neighbors === 3)) {
                row.push(_this.stateLive);
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

            if (_this.isCoordCorrect(nx, ny)) {
                if (_this.curCellsState[ny][nx] === _this.stateLive) {
                    neighbors += 1;
                }
            }
        }
    }
    return neighbors;
}

ConwayGame.prototype.isCoordCorrect = function(x, y) {
    let _this = this;
    return ((x >= 0 && y < _this.cellColumns) && (y >= 0 && y < _this.cellRows));
}


document.addEventListener("DOMContentLoaded", function () {

    let wWidth = window.innerWidth;
    let wHeight = window.innerHeight;
    let pageBody = document.getElementsByTagName("body")[0];
    pageBody.style.height = wHeight + "px";
    pageBody.style.width = wWidth + "px";

    let conwayGame = new ConwayGame(document.getElementById("playing_field"));

    let startButtom = document.getElementById("start");
    let stopButtom = document.getElementById("stop")
    let resetButtom = document.getElementById("reset")

    startButtom.addEventListener("click", () => {
        console.log("start");
        conwayGame.Start();
    });

    resetButtom.addEventListener("click", () => {
        console.log("reset");
        conwayGame.Reset();
    });
})







function isStateLoop (arr) {
    if (arr.length > maxSaveStates) {
        arr.splice(0, 1);
    }
    if (arr.length < maxSaveStates) {
        return false;
    }
    let firstString = arr[0];
    console.log(arr.length)
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] === firstString) {
            // console.log(arr[i])
            return true;
        }
    }
    return false;
}



    // playingField.style.width = playingFieldWidth + "px";
    // playingField.style.height = playingFieldHeight + "px";
    // playingField.style.backgroundColor = "grey";

    // let startButtom = document.getElementById("start");
    // let stopButtom = document.getElementById("stop")
    // let resetButtom = document.getElementById("reset")

    // let cells = [];
    //
    // for (let y = 0; y < cellRows; y++) {
    //     let cellRow = document.createElement("div");
    //     playingField.appendChild(cellRow);
    //     cellRow.style.display = "flex";
    //     let row = [];
    //     for (let x = 0; x < cellColumns; x++) {
    //         let cell = document.createElement("div");
    //         cell.className = "cell";
    //         cellRow.appendChild(cell);
    //         cell.style.width = cellWidth + "px";
    //         cell.style.height = cellHeight + "px";
    //         row.push(cell);
    //     }
    //     cells.push(row);
    // }
    //
    // var curStateCells = getRandomCellsState();
    //
    // renderCells(cells, curStateCells);
    //
    // startButtom.addEventListener("click", async function() {
    //     console.log("start");
    //     // console.log(cells);
    //     // console.log(curStateCells);
    //     // let loopFlag = true;
    //     while (loopFlag) {
    //     renderCells(cells, curStateCells);
    //     curStateCells = getNextStateCells(curStateCells);
    //     await new Promise(resolve => setTimeout(resolve, loopSpeed));
    //     }
    // })
// })




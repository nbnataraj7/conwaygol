(function () {

    //Global variables
    var rows = 50;
    var cols = 50;
    var size = 10;
    var grid = null;
    //Cell numbers starting from 0 - top left (0 - rows*cols)
    //Beehive
    var seed = [53, 54, 102, 105, 153, 154];
    //Oscillator
    seed = [222, 223, 224];
    //R-pentonimo
    var seed = [53, 54, 102, 103, 153];
    //die hard
    seed = [102, 103, 153, 157, 158, 159, 58];
    var generation = 0;

    //Classes
    //Cell
    var Cell = function (row, col, status) {
        this.row = row;
        this.col = col;
        this.status = status;
    };
    Cell.prototype.getStatus = function () {
        return this.status;
    }
    Cell.prototype.setStatus = function (status) {
        this.status = status;
    }
    /**
     * @description returns alive neighbour count
     */
    Cell.prototype.getLiveNeighbours = function (status) {
        let count = 0;
        for (let i = this.row - 1; i <= this.row + 1; i++) {
            for (let j = this.col - 1; j <= this.col + 1; j++) {
                if (i == this.row && j == this.col) continue;
                if (i < 0 || i >= rows || j < 0 || j >= cols) continue;
                try {
                    if (grid.cells[i][j].getStatus()) {
                        count++;
                    }
                }
                catch (e) {
                    console.log("i " + i + "j " + j);
                }
            }
        }
        return count;
    }

    /**
     * 
     * @param {number} rows 
     * @param {number} cols 
     * @param {Cell[]} cells 
     */
    var Grid = function (rows, cols, cells) {
        this.rows = rows;
        this.cols = cols;
        this.cells = cells;
    };


    /**
     * @description clears canvas and repaints it with current status
     */
    function renderFrame() {
        let canvasHTML = clearCanvas();
        let context = canvasHTML.getContext('2d');
        for (let i = 0; i < grid.cells.length; i++) {
            for (let j = 0; j < grid.cells[i].length; j++) {
                if (grid.cells[i][j].getStatus()) {
                    context.fillRect(j * size, i * size, size, size);
                }
            }
        }
        document.getElementById("generationNumber").textContent = "Generation : " + generation;
    }

    /**
     * @description starts an iteration - apply Conway's Game of Life rules
     * 1. Any living cell with fewer than two live neighbours die (Underpopulation)
     * 2. Any living cell with two or three live neighbours live for the next generation
     * 3. Any living cell with more than three live neighbours dies. (Overpopulation)
     * 4. Any dead cell with exactly three live neighbours becomes a live cell (Reproduction)
     */
    function runGeneration() {
        let _tempGrid = new Grid(grid.rows, grid.cols, deepCopyArray(grid.cells.slice()));
        for (let i = 0; i < grid.cells.length; i++) {
            for (let j = 0; j < grid.cells[i].length; j++) {
                if (grid.cells[i][j].getStatus()) {
                    if (grid.cells[i][j].getLiveNeighbours() < 2) {
                        _tempGrid.cells[i][j].setStatus(false); //Underpopulation
                    }
                    if (grid.cells[i][j].getLiveNeighbours() > 3) {
                        _tempGrid.cells[i][j].setStatus(false); //Overpopulation
                    }
                }
                else if (!grid.cells[i][j].getStatus() && grid.cells[i][j].getLiveNeighbours() == 3) {
                    _tempGrid.cells[i][j].setStatus(true); //Reproduction
                }
            }
        }
        grid = _tempGrid;
        generation++;
    }

    /**
     * @description creates an initial configuration
     */
    function generateSeed() {
        //create a 2-D Array
        let cells = (new Array(cols)).fill([]); //Initialize each row head with an array
        for (let i = 0; i < rows; i++) {
            cells[i] = new Array(cols);
            for (j = 0; j < cols; j++) {
                cells[i][j] = new Cell(i, j, false);
            }
        }
        cells.forEach((cell, index) => {
            for (let j = 0; j < cols; j++) {
                cell[j] = new Cell(index, j, false);
            }
        });
        // seed = new Array(20);
        // for (let i = 0; i < seed.length; i++) {
        //     seed[i] = Math.floor(Math.random() * 10000 % 2500)
        // }
        seed.forEach(s => {
            let col = (s % cols);
            let row = Math.floor(s / rows);
            cells[row][col].setStatus(true);
            console.log("row - " + row + " col - " + col);
        });
        grid = new Grid(rows, cols, cells);
        generation++;
    }

    /**
     * @description clears canvas and returns the canvas element
     */
    function clearCanvas() {
        let canvasHTML = document.getElementById("board");
        canvasHTML.width = canvasHTML.width;
        return canvasHTML
    }

    /**
     * @description drawas horizontal and vertical grid lines
     */
    function drawGridLines() {
        let canvasHTML = clearCanvas();
        let context = canvasHTML.getContext("2d");
        //draw vertical lines
        for (let x = 0.5; x < cols; x += 10) {
            context.moveTo(x, 0);
            context.lineTo(x, 500);
        }
        //draw horizontal lines
        for (let y = 0.5; y < rows; y += 10) {
            context.moveTo(0, y);
            context.lineTo(500, y);
        }
        context.strokeStyle = "#eee";
        context.stroke();
    }

    /**
     * @description starts the chain of animations
     */
    function startAnimation() {
        generateSeed();
        renderFrame();
        setInterval(() => {
            console.log("Generation -> " + generation);
            runGeneration();
            renderFrame();
        }, 1000);
    }


    /** Utils **/

    /**
     * 
     * @param {Array} arr
     * @description deserializes input array, serializes it and returns
     */
    function deepCopyArray(arr) {
        let clone = new Array(arr.length);
        try {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] instanceof Array) {
                    clone[i] = deepCopyArray(arr[i]);
                }
                else if (arr[i] instanceof Cell) {
                    clone[i] = new Cell(arr[i].row, arr[i].col, arr[i].status);
                }
                else {
                    clone[i] = JSON.parse(JSON.stringify(arr[i]));
                }
            }
            return clone;
        }
        catch (e) {
            return {};
        }
    }


    startAnimation();

})();
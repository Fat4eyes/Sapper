Qt.include("helpers.js");
Qt.include("constants.js");

function Manager(root) {
    var settings = JSON .parse(gameManager.get_settings());

    this.Root = root;
    this.Width = settings.Width;
    this.Height = settings.Height;
    this.MinesCount = settings.MinesCount;
    this.Cells = [];
    this.VisitCellCoutn = 0;

    var self = this;


    function startGame(cell) {
        var result = JSON.parse(gameManager.get_matrix(JSON.stringify([cell.i, cell.j])));
        for (var i = 0; i < self.Width; i++) {
            for (var j = 0; j < self.Height; j++) {
                var newCell = self.Cells[i][j];
                newCell.value = result.Matrix[i][j];
                newCell.isOpen = !!result.VisitMatrix[i][j];
            }
        }
        self.VisitCellCoutn = 0;
        root.start();
    }

    function handleEndGame(cell) {
        var opacity = false;
        var timer = setInterval(function () {
            opacity = !opacity;
            cell.opacity = opacity
        }, 300);

        setTimeout(function() {
            timer.stop();
            cell.opacity = false
        }, 5000)
    }

    function lostGame(){
        root.lost();
        for (var i = 0; i < self.Width; i++) {
            for (var j = 0; j < self.Height; j++) {
                var cell = self.Cells[i][j];
                cell.isOpen = true;
                if (cell.type !== CellTypes.Mine) {
                    handleEndGame(cell);
                }
            }
        }
    }

    function winGame() {
        root.win();
        for (var i = 0; i < self.Width; i++) {
            for (var j = 0; j < self.Height; j++) {
                var cell = self.Cells[i][j];
                cell.isOpen = true;
                if (cell.type === CellTypes.Mine) {
                    handleEndGame(cell);
                }
            }
        }
    }

    function internalOpen(i, j){
        var cell = self.Cells[i][j];

        if (cell.type !== CellTypes.None || cell.isOpen) {
            if (cell.type === CellTypes.Mine) {
                lostGame();
            } else {
                cell.isOpen = true;
            }
            return;
        }

        cell.isOpen = true;

        if (i - 1 >= 0 && j - 1 >= 0) internalOpen(i - 1, j - 1);
        if (i - 1 >= 0) internalOpen(i - 1, j);
        if (i - 1 >= 0 && j + 1 < self.Width) internalOpen(i - 1, j + 1);
        if (j + 1 < self.Width) internalOpen(i, j + 1);
        if (i + 1 < self.Height && j + 1 < self.Width) internalOpen(i + 1, j + 1);
        if (i + 1 < self.Height) internalOpen(i + 1, j);
        if (i + 1 < self.Height && j - 1 >= 0) internalOpen(i + 1, j - 1);
        if (j - 1 >= 0) internalOpen(i, j - 1);
    }

    function open(it) {
        if (unStarted.active || started.active) {
            unStarted.active && startGame(it);
            internalOpen(it.i, it.j);
        }
    }

    function visitedCallback() {
        if (!started.active)
            return;

        if ((++self.VisitCellCoutn) >= self.Height * self.Width - self.MinesCount) {
            winGame();
        }
    }

    this.clearCells = function () {
        for (var i = 0; i < this.Cells.length; i++) {
            for (var j = 0; j < this.Cells[i].length; j++) {
                this.Cells[i][j].destroy();
            }
        }
    };

    this.loadCells = function() {
        this.clearCells();
        var cellComponent = loadComponent('../Components/Cell.qml');
        for (var y = 100, i = 0; i < self.Width; y += 50, i++) {
            this.Cells[i] = [];
            for (var x = 50, j = 0; j < self.Height; x += 50, j++) {
                var cell = cellComponent.create(this.Root, {
                    x:x,
                    y:y,
                    i:i,
                    j:j,
                    leftClickHandler: open,
                    visitedCallback: visitedCallback
                });
                this.Cells[i][j] = cell;
            }
        }
    };

    this.loadGame = function() {
        this.loadCells();
        var result = gameManager.load();
        if (!result) {
            return;
        }
        result = JSON.parse(result);
        this.VisitCellCoutn = 0;
        for (var i = 0; i < this.Width; i++) {
            for (var j = 0; j < this.Height; j++) {
                var cell = this.Cells[i][j];
                cell.value = result.Matrix[i][j];
                cell.isOpen = !!result.VisitMatrix[i][j];
                this.VisitCellCoutn += result.VisitMatrix[i][j]
            }
        }
        root.start();
    };

    this.saveGame = function() {
        var Matrix = [[]];
        var VisitMatrix = [[]];
        for (var i = 0; i < this.Width; i++) {
            Matrix[i] = [];
            VisitMatrix[i] = [];
            for (var j = 0; j < this.Height; j++) {
                var cell = this.Cells[i][j];
                Matrix[i][j] = cell.value;
                VisitMatrix[i][j] = cell.isOpen;
            }
        }
        gameManager.save(JSON.stringify({Matrix: Matrix, VisitMatrix: VisitMatrix}))
    };
}
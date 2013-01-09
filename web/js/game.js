var GameOfLife = angular.module('GameOfLife', []);

GameOfLife.controller("MainCtrl", MainCtrl);

GameOfLife.service('WindowSize', function () {
    var CELL_SIZE = 20;
    return {
        calcMaxCount: function calcMaxCount(available) {
            var mod = available % CELL_SIZE;
            if (mod === 1) {
                available = available - 2;
                mod = available % CELL_SIZE;
            }
            return (available - mod) / CELL_SIZE;
        },
        x: function () {
            return $('#board').css('width').replace("px", "");
        },
        y: function () {
            return $(window).height() - 50;
        }

    }
});

function MainCtrl($scope, $timeout, $log, WindowSize) {

    // public vars
    $scope.cells = {};
    $scope.count = 0;
    $scope.running = false;

    var even = true;

    // private functions
    function key(x, y) {
        return x + "," + y;
    }

    function buildRepeater(start, end) {
        var list = [];
        for (var i = start; i < end; i++) {
            list.push({ i: i });
        }
        return list;
    }

    function recount() {
        $scope.count = Object.keys($scope.cells).length;
    }


    $scope.cellStyle = function (x, y, last) {
        var v = $scope.isAlive(x, y) ? 'alive' : '';
        v += last ? " cell-last" : '';
        return v;
    }
    $scope.isAlive = function (x, y) {
        return $scope.cells[key(x, y)] ? true : false;
    }

    $scope.click = function (x, y) {
        var k = key(x, y);
        if ($scope.cells[k]) {
            delete $scope.cells[k];
        } else {
            $scope.cells[k] = { x: x, y: y};
        }
        recount();

    }


    $scope.buildBoard = function () {
        var maxX = WindowSize.calcMaxCount(WindowSize.x());
        var maxY = WindowSize.calcMaxCount(WindowSize.y());

        $scope.rows = buildRepeater(0, maxY);
        $scope.cols = buildRepeater(0, maxX);
    }

    $scope.tick = function (x, y) {
        $log.info(even ? "tick" : "tock");
        even = !even;
        ;
        var board = {};

        function add(cell) {
            var k = key(cell.x, cell.y);
            board[k] = cell;
        }

        for (var coord in $scope.cells) {
            var cell = $scope.cells[coord];
            var neighbours = $scope.neighbours(cell.x, cell.y);
            var count = $scope.aliveCount(neighbours);
            if (count < 2 || count > 3) {
                // should die, so don't add it to the new board
            } else {
                // count === 2 | 3, should survive
                add(cell);
            }
            neighbours.forEach(function (neighbour) {
                if (!$scope.isAlive(neighbour.x, neighbour.y)) {
                    // don't look at alive cells, they'll be handled above
                    var neighbourList = $scope.neighbours(neighbour.x, neighbour.y);
                    var neighbourCount = $scope.aliveCount(neighbourList);
                    if (neighbourCount === 3) {
                        add(neighbour);
                    }
                }
            });
        }
        $scope.cells = board;
    };

    $scope.aliveCount = function (neighbours) {
        var c = 0;
        neighbours.forEach(function (neighbour) {
            if ($scope.isAlive(neighbour.x, neighbour.y)) {
                c++;
            }
        });
        return c;
    };

    $scope.neighbours = function (x, y) {
        var list = [];
        for (var a = x - 1; a <= x + 1; a++) {
            for (var b = y - 1; b <= y + 1; b++) {
                if (!(a === x && b === y)) {
                    list.push({x: a, y: b});
                }
            }
        }
        return list;
    };

    $scope.start = function () {
        $scope.running = true;
        function run() {
            if ($scope.running) {
                $scope.tick();
                $timeout(run, 1000);
                recount();
            }
        }

        run();
    }
    $scope.stop = function () {
        $scope.running = false;
    }

    $scope.buildBoard();
}
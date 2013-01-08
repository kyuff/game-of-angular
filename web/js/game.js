var GameOfLife = angular.module('GameOfLife', []);

GameOfLife.controller("MainCtrl", MainCtrl);

function MainCtrl($scope, $timeout, $log) {

    // public vars
    $scope.minX = 0;
    $scope.maxX = 15;
    $scope.minY = 0;
    $scope.maxY = 15;
    $scope.cells = {};
    $scope.count = 0;

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


    $scope.alive = function (x, y) {
         return $scope.isAlive(x,y) ? 'alive' : '';
    }
    $scope.isAlive = function(x,y) {
        return $scope.cells[key(x, y)] ? true : false;
    }

    $scope.click = function (x, y) {
        var k = key(x, y);
        if ($scope.cells[k]) {
            delete $scope.cells[k];
        } else {
            $scope.cells[k] = { x: x, y: y};
        }

    }

    $scope.buildBoard = function () {
        $scope.rows = buildRepeater($scope.minX, $scope.maxX);
        $scope.cols = buildRepeater($scope.minY, $scope.maxY);
        $scope.count = 0;
        for( var c in $scope.cells ) {
            $scope.count++;
        }
    }

    $scope.tick = function (x, y) {
        $log.info(even ? "tick" : "tock");
        even = !even;;
        var board = {};
        function add(cell) {
            var k = key(cell.x,cell.y);
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
                if( !$scope.isAlive( neighbour.x, neighbour.y ) ) {
                    // don't look at alive cells, they'll be handled above
                    var neighbourList = $scope.neighbours(neighbour.x, neighbour.y);
                    var neighbourCount = $scope.aliveCount(neighbourList);
                    if( neighbourCount === 3 ) {
                        add(neighbour);
                    }
                }
            });
        }
        $scope.cells = board;
        $scope.buildBoard();
    };

    $scope.aliveCount = function (neighbours) {
        var c = 0;
        neighbours.forEach(function (neighbour) {
            if( $scope.isAlive( neighbour.x, neighbour.y ) ) {
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

    $scope.start = function() {
        $scope.tick();
        $timeout(function() {
                $scope.start();
            }, 1000
        )
    }
    $scope.buildBoard();
}
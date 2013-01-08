
describe('Game of Life Main Ctrl', function() {
    var scope;
    beforeEach(module('GameOfLife'));
    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new;
        $controller('MainCtrl', {$scope: scope});
    }));

    it('should do a correct tick with a row', function() {
        scope.click(-1,0);
        scope.click(0,0);
        scope.click(1,0);

        scope.tick();

        expect(scope.isAlive(0, -1)).toBeTruthy();
        expect(scope.isAlive(0, 0)).toBeTruthy();
        expect(scope.isAlive(0, 1)).toBeTruthy();

    });

    it('should do a correct tick with a box', function() {
        scope.click(3,3);
        scope.click(3,4);
        scope.click(4,3);
        scope.click(4,4);

        scope.tick();

        expect(scope.isAlive(3, 3)).toBeTruthy();
        expect(scope.isAlive(3, 4)).toBeTruthy();
        expect(scope.isAlive(4, 3)).toBeTruthy();
        expect(scope.isAlive(4, 4)).toBeTruthy();

    });

    it('should count how many neighbours are alive', function() {
        scope.click(0,0);
        scope.click(0,1);
        var n = scope.neighbours(0,0);
        expect(scope.aliveCount(n)).toBe(1);
        scope.click(1,0);
        n = scope.neighbours(0,0);
        expect(scope.aliveCount(n)).toBe(2);
    });

    it('should calculate the neighbours', function() {
        var neighbours = scope.neighbours(0,0);
        expect(neighbours).toContain({x:1,y:-1});
        expect(neighbours).toContain({x:1,y:0});
        expect(neighbours).toContain({x:1,y:1});

        expect(neighbours).toContain({x:0,y:-1});
        expect(neighbours).toContain({x:0,y:1});

        expect(neighbours).toContain({x:-1,y:-1});
        expect(neighbours).toContain({x:-1,y:0});
        expect(neighbours).toContain({x:-1,y:1});

        expect(neighbours.length).toBe(8);
    });

    it('should create the correct amount of rows and cols', function() {
        scope.minX = 0;
        scope.maxX = 2;
        scope.minY = 0;
        scope.maxY = 3;
        scope.buildBoard()


        expect(scope.rows).toEqual( [ {i:0}, {i:1}]);
        expect(scope.cols).toEqual( [ {i:0}, {i:1}, {i:2}]);

    });

    it('should correctly add and remove a cell', function() {
        scope.click(5, 7);
        scope.click(3, 2);
        expect( scope.cells).toEqual({
            '5,7' : { x: 5, y: 7 },
            '3,2' : { x: 3, y: 2 }
        });
        scope.click(3, 2);
        expect( scope.cells).toEqual({
            '5,7' : { x: 5, y: 7 }
        });
    });

    it('should know if a cell is alive', function() {
        scope.click(3,2);
        expect(scope.alive(3,3)).toBe('');
        expect(scope.alive(3,2)).toBe('alive');
    })

});

var mazeApp = angular.module('mazeApp', []);
var mazer = window.Maze;
mazeApp.controller('MazeRenderer', function ($scope) {
    $scope.mazes = [];

    $scope.mazeConfig = {};

    $scope.createMaze = function () {
        var x = parseInt($scope.mazeConfig.x, 10) || 5,
            y = parseInt($scope.mazeConfig.y, 10) || 4,
            z = parseInt($scope.mazeConfig.z, 10) || 3;
        $scope.mazes.push(new Kruskal({x:x,y:y,z:z}).createMaze());

        return this;
    };

    $scope.renderMaze = function () {
        var canvas = document.getElementById('maze-canvas');
        $scope.renderer = new MazeRenderer({maze:this.maze, canvas:canvas});

        $scope.currentMaze = this.maze;
        $scope.marker = $scope.renderer.marker;

        $scope.renderer.renderMaze();

        return this;
    };

    $scope.keydown = function (e) {
        if ($scope.renderer.evaluateInput(e.keyCode)) {
            $scope.renderer.renderMaze();
        }
    }
});

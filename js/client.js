var MAZE = {};
var MarkerRenderer = function (options) {
    this.maze = options.maze;
    this.unit = this.maze.nodeSize;
    this.node = [0,0,0];
    this.canvas = options.canvas;
    this.ctxMarker = this.canvas.getContext('2d');
    this.x = this.y = this.unit + (this.unit/2);
    this.radius = this.unit/6;
    
    return this;

};

var MazeRenderer = function (options) {
    this.maze = options.maze;
    this.canvas = options.canvas;
    this.marker = new MarkerRenderer({maze:this.maze, canvas:this.canvas});

    return this;
};

MazeRenderer.prototype.evaluateInput = function (input) {
    console.log('input num: ', input);
    var move = false,
        toNode = [this.marker.node[0], this.marker.node[1], this.marker.node[2]];
    switch (input) {
        case 37://left arrow
            toNode[0] = toNode[0] - 1;
            if (!this.maze.evaluateMove(this.marker.node,toNode)) {
                move = true;
                this.marker.moveLeft();
            }
            break;
        case 38://up arrow
            toNode[1] = toNode[1] - 1;
            if (!this.maze.evaluateMove(this.marker.node,toNode)) {
                move = true;
                this.marker.moveUp();
            }
            break;
        case 39://right arrow
            toNode[0] = toNode[0] + 1;
            if (!this.maze.evaluateMove(this.marker.node,toNode)) {
                move = true;
                this.marker.moveRight();
            }
            break;
        case 40://down arrow
            toNode[1] = toNode[1] + 1;
            if (!this.maze.evaluateMove(this.marker.node,toNode)) {
                move = true;
                this.marker.moveDown();
            }
            break;
        case 83://s key
            toNode[2] = toNode[2] + 1;
            if (!this.maze.evaluateMove(this.marker.node,toNode)) {
                move = true;
                this.marker.levelDown();
            }
            break;
        case 87://w key 
            toNode[2] = toNode[2] - 1;
            if (!this.maze.evaluateMove(this.marker.node,toNode)) {
                move = true;
                this.marker.levelUp();
            }
            break;
        }

    console.log('ei ', input, move, toNode);
    return move;

};

MazeRenderer.prototype.drawBorder = function () {
    var ctx = this.canvas.getContext('2d'),
        unit = this.maze.nodeSize,
        isTopLevel = this.level === 0;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(unit, unit);
    ctx.lineTo(unit, unit*(this.maze.y+1));
    ctx.stroke();
    
    /*
    if (isTopLevel) {
        ctx.lineTo(unit*(this.maze.x), unit*(this.maze.y+1));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(unit*(this.maze.x+1),unit*(this.maze.y+1));
    } else {
        ctx.lineTo(unit*(this.maze.x+1), unit*(this.maze.y+1));
        ctx.stroke();

    }
    */
    ctx.lineTo(unit*(this.maze.x+1), unit*(this.maze.y+1));
    ctx.stroke();

    ctx.lineTo(unit*(this.maze.x+1), unit);
    ctx.stroke();

    /*
    if (isTopLevel) {
        ctx.lineTo(unit*2, unit);
    } else {
        ctx.lineTo(unit, unit);
    }
    */
    ctx.lineTo(unit, unit);
    ctx.stroke();
};

MazeRenderer.prototype.drawYWall = function (wall) {
    var ctx = this.canvas.getContext('2d'),
        unit = this.maze.nodeSize;
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    if (wall.exists) {
        ctx.beginPath();
        ctx.moveTo(unit*(wall.x+1),unit*(wall.y+2));
        ctx.lineTo(unit*(wall.x+2),unit*(wall.y+2));
        ctx.stroke();
    }
};

MazeRenderer.prototype.drawXWall = function (wall) {
    var ctx = this.canvas.getContext('2d'),
        unit = this.maze.nodeSize;

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'blue';
    if (wall.exists) {
        ctx.beginPath();
        ctx.moveTo(unit*(wall.x+2),unit*(wall.y+1));
        ctx.lineTo(unit*(wall.x+2),unit*(wall.y+2));
        ctx.stroke();
    }
};

MazeRenderer.prototype.drawFloorWall = function (wall) {
    var ctx = this.canvas.getContext('2d'),
        unit = this.maze.nodeSize,
        buf = 5;

    ctx.lineWidth = 3;
    ctx.fillStyle = 'red';
    if (wall && !wall.exists) {
        ctx.beginPath();
        ctx.moveTo(unit*(wall.x+1)+buf,unit*(wall.y+2)-buf);
        ctx.lineTo(unit*(wall.x+2)-buf,unit*(wall.y+2)-buf);
        ctx.lineTo(unit*(wall.x+2)-buf,unit*(wall.y+1)+buf);
        ctx.fill();
    }
};

MazeRenderer.prototype.drawCeilingWall = function (wall) {
    var ctx = this.canvas.getContext('2d'),
        unit = this.maze.nodeSize,
        buf = 5;

    ctx.lineWidth = 3;
    ctx.fillStyle = 'blue';
    if (wall && !wall.exists) {
        ctx.beginPath();
        ctx.moveTo(unit*(wall.x+1)+buf,unit*(wall.y+1)+buf);
        ctx.lineTo(unit*(wall.x+1)+buf,unit*(wall.y+2)-buf);
        ctx.lineTo(unit*(wall.x+2)-buf,unit*(wall.y+1)+buf);
        ctx.fill();
    }
};

MazeRenderer.prototype.drawWalls = function () {
    var wallArrays = this.maze.walls[this.level]
                    .concat(
                    0 < this.level ?
                    [this.maze.walls[this.level-1][2]] :
                    []
                    ),
        i,length, walls;

    $('#level-target').html(this.level);

    //this.drawBorder();
    walls = [];
    walls = walls.concat.apply(walls, wallArrays[0]);

    for (i=0;i<walls.length;i++) {
        this.drawXWall(walls[i]);
    }
    walls = [];
    walls = walls.concat.apply(walls, wallArrays[1]);
    for (i=0;i<walls.length;i++) {
        this.drawYWall(walls[i]);
    }
    walls = [];
    walls = walls.concat.apply(walls, wallArrays[2]);
    for (i=0;i<walls.length;i++) {
        this.drawFloorWall(walls[i]);
    }
    walls = [];
    walls = walls.concat.apply(walls, wallArrays[3]);
    for (i=0;i<walls.length;i++) {
        this.drawCeilingWall(walls[i]);
    }
    /*
    for (i = 0;i < length;i++) {
        this.drawXWall(wallArrays[0][i]);
    }
    
    length = wallArrays[1].length;
    for (i = 0;i < length;i++) {
        this.drawYWall(wallArrays[1][i]);
    }

    length = wallArrays[2].length;
    for (i = 0;i < length;i++) {
        this.drawFloorWall(wallArrays[2][i]);
    }

    if (wallArrays[3]) {
        length = wallArrays[3].length;
        for (i = 0;i < length;i++) {
            this.drawCeilingWall(wallArrays[3][i]);
        }
    }
    */
    console.log('wall arrays ', wallArrays);
    console.log('all walls ', this.maze.walls);

    return this;
    
};

MazeRenderer.prototype.renderMaze = function (level) {
    this.maze.nodeSize = 40;
    this.level = level || this.marker.node[2];
    this.canvas.getContext('2d').clearRect(
                    0,//this.maze.nodeSize,
                    0,//this.maze.nodeSize,
                    this.maze.nodeSize*(this.maze.x+2),
                    this.maze.nodeSize*(this.maze.y+2)
                    );

    //this.drawBorder();
    this.drawWalls();
    this.marker.renderMarker();
 
    return this;
};

MarkerRenderer.prototype.renderMarker = function () {
    console.log(this.x, this.y, this.radius, this.unit);
    var ctx = this.ctxMarker;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#003300';
    ctx.stroke();

    return this;
};

MarkerRenderer.prototype.moveRight = function () {
    this.x = this.x + this.unit;
    this.node[0] = this.node[0] + 1;

    return this;
};

MarkerRenderer.prototype.moveLeft = function () {
    this.x = this.x - this.unit;
    this.node[0] = this.node[0] - 1;

    return this;
};

MarkerRenderer.prototype.moveUp = function () {
    this.y = this.y - this.unit;
    this.node[1] = this.node[1] - 1;

    return this;
};

MarkerRenderer.prototype.moveDown = function () {
    this.y = this.y + this.unit;
    this.node[1] = this.node[1] + 1;

    return this;
};

MarkerRenderer.prototype.levelDown = function () {
    this.node[2] = this.node[2] + 1;

    return this;
};

MarkerRenderer.prototype.levelUp = function () {
    this.node[2] = this.node[2] - 1;

    return this;
};

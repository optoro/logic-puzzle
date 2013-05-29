(function() {
  var URL;

  URL = 'http://logic-puzzle-server.herokuapp.com/puzzle.json';

  describe("Board", function() {
    beforeEach(function() {
      return this.board = new Puzzler.Board();
    });
    describe('#getNewPuzzle', function() {
      return it('calls getJSON with the appropriate URL', function() {
        spyOn($, 'getJSON');
        this.board.getNewPuzzle();
        return expect($.getJSON).toHaveBeenCalledWith(URL, {}, jasmine.any(Function));
      });
    });
    describe('#newPuzzle', function() {
      return it('takes a board id, row hints, and column hints', function() {
        this.board.newPuzzle(10, [1, 2, 3], [1, 2, 3, 4]);
        return expect(this.board.id).toBe(10);
      });
    });
    describe('#alertUser', function() {
      return it('is a function that lets the user know if they won', function() {
        return expect(this.board.alertUser).toEqual(jasmine.any(Function));
      });
    });
    describe('#makeSolutionString', function() {
      return it('is a function that generates a solution to be sent to the server', function() {
        return expect(this.board.makeSolutionString).toEqual(jasmine.any(Function));
      });
    });
    describe('#sendSolution', function() {
      beforeEach(function() {
        this.boardId = 50;
        this.puzzleData = {
          id: this.boardId,
          row_hints: [3, 1, 3],
          col_hints: [2, 1, 3, 1]
        };

        /*
        Solution is a serialized representation of the board, its format is:
        number of rows, number of columns, (a 1 or 0 for each tile in the
        board, left-to-right, top-to-bottom).

        For example, a board like
        +---+---+
        | X | O |
        +---+---+
        | O | X |
        +---+---+
        (where Xs are filled tiles)

        would serialize to:
        '2,2,1,0,0,1'
        */

        this.solution = '3,4,1,1,1,0,0,0,1,0,1,0,1,1';
        spyOn(this.board, 'makeSolutionString').andReturn(this.solution);
        spyOn($, 'post');
        this.board.newPuzzle(this.boardId, [3, 1, 3], [2, 1, 3, 1]);
        return this.board.sendSolution();
      });
      it('transmits a solution for a puzzle', function() {
        return expect($.post).toHaveBeenCalledWith(URL, {
          board_id: this.boardId,
          solution: this.solution
        }, jasmine.any(Function));
      });
      return it('lets the user know if they won', function() {
        var fn;
        fn = $.post.mostRecentCall.args[2];
        spyOn(this.board, 'alertUser');
        fn({
          solved: true
        });
        return expect(this.board.alertUser).toHaveBeenCalledWith(true);
      });
    });

    // Extra credit! Check the solution in the browser first before sending it to
    // the server :)
    return xdescribe('#checkSolution', function() {});
  });

}).call(this);

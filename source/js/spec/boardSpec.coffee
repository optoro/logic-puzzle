URL = 'http://logic-puzzle-server.herokuapp.com/puzzle.json'

describe "Board", ->
  beforeEach ->
    @board = new Puzzler.Board()

  describe '#getNewPuzzle', ->

    it 'calls getJSON with the appropriate URL', ->
      spyOn($, 'getJSON')
      @board.getNewPuzzle()
      expect($.getJSON).toHaveBeenCalledWith(URL, {}, jasmine.any(Function))

  describe '#newPuzzle', ->
    it 'takes a board id, row hints, and column hints', ->
      @board.newPuzzle(10, [1,2,3], [1,2,3,4])
      expect(@board.id).toBe(10)

  describe '#alertUser', ->
    it 'is a function that lets the user know if they won', ->
      expect(@board.alertUser).toEqual(jasmine.any(Function))

  describe '#makeSolutionString', ->
    it 'is a function that generates a solution to be sent to the server', ->
      expect(@board.makeSolutionString).toEqual(jasmine.any(Function))

  describe '#sendSolution', ->
    beforeEach ->
      @boardId = 50
      @puzzleData = {
        id: @boardId,
        row_hints: [3,1,3],
        col_hints: [2,1,3,1]
      }

      # Solution is a serialized representation of the board, its format is:
      # number of rows, number of columns, (a 1 or 0 for each tile in the
      # board, left-to-right, top-to-bottom).
      #
      # For example, a board like
      # +---+---+
      # | X | O |
      # +---+---+
      # | O | X |
      # +---+---+
      # (where Xs are filled tiles)
      #
      # would serialize to:
      # '2,2,1,0,0,1'

      @solution = '3,4,1,1,1,0,0,0,1,0,1,0,1,1'
      spyOn(@board, 'makeSolutionString').andReturn(@solution)
      spyOn($, 'post')
      @board.newPuzzle(@boardId, [3,1,3], [2,1,3,1])
      @board.sendSolution()

    it 'transmits a solution for a puzzle', ->
      expect($.post).toHaveBeenCalledWith(
        URL
        {board_id: @boardId, solution: @solution}
        jasmine.any(Function)
      )

    it 'lets the user know if they won', ->
      fn = $.post.mostRecentCall.args[2]
      spyOn(@board, 'alertUser')
      fn({solved: true})
      expect(@board.alertUser).toHaveBeenCalledWith(true)

  # Extra credit! Check the solution in the browser first before sending it to
  # the server :)
  xdescribe '#checkSolution', ->

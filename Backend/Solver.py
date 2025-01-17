""" check if placing num at (row, col) is valid """
def is_valid(board, row, col, num):
    box_row, box_col = 3 * (row // 3), 3 * (col // 3)
    if num in board[row]:
        return False
    if num in [board[i][col] for i in range(9)]:
        return False
    if num in [board[i][j] for i in range(box_row, box_row + 3) for j in range(box_col, box_col + 3)]:
        return False
    return True

""" Function to find the next empty cell (row, col) using MRV heuristic """
def find_empty_cell(board):
    empty_cells = [(r, c) for r in range(9) for c in range(9) if board[r][c] == 0]
    min_moves_cell = None
    min_moves = 10 
    for r, c in empty_cells:
        num_moves = sum(is_valid(board, r, c, num) for num in range(1, 10))
        if num_moves < min_moves:
            min_moves = num_moves
            min_moves_cell = (r, c)
    return min_moves_cell

""" Backtracking solver with optimizations """
def solve_sudoku(board):
    cell = find_empty_cell(board)
    if not cell: 
        return True

    row, col = cell
    for num in range(1, 10):
        if is_valid(board, row, col, num):
            board[row][col] = num
            if solve_sudoku(board): 
                return True
            board[row][col] = 0 

    return False

def Solver(board):
    if(solve_sudoku(board)):
        return board
    else:
        return False

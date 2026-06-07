from GetSudoku import sudoku

grid = sudoku("sudoku.png")

if grid is None:
    print("❌ Grid extraction failed")
else:
    print("✅ Extracted grid:\n")
    print(grid)
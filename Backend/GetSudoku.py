import numpy as np
from skimage.transform import resize
import pickle
import os
from Pre_process import get_sudoku
import warnings
warnings.filterwarnings('ignore')

import os

model_path = os.path.join(os.path.dirname(__file__), 'Model', 'model.pkl')

try:
    with open(model_path, 'rb') as file:
        
        model = pickle.load(file)
    print("Model loaded successfully!")
except FileNotFoundError:
    print("model.pkl not found. Ensure it's in the same directory as this script.")

def get_grid(image_path):
    # Convert to absolute path and normalize
    try:
        absolute_path = os.path.abspath(image_path) 
        current_dir = os.path.dirname(absolute_path)
        if not os.path.exists(absolute_path):
            print(f"\nError: Image file not found at {absolute_path}")
            return None
            
        sudoku = get_sudoku(image_path)
        if sudoku is None:
            print(f"Error: Failed to process image at {absolute_path}")
            return None
            
        sudoku = resize(sudoku, (252, 252))
        grid = np.zeros([9, 9])
        
        if not os.path.exists(model_path):
            print(f"Error: Model file not found at {model_path}")
            return None
            
        with open(model_path, 'rb') as file:
            model = pickle.load(file)
        
        for i in range(9):
            for j in range(9):
                image = sudoku[i*28:(i+1)*28, j*28:(j+1)*28]
                if image.sum() > 105:
                    image = resize(image[1:27, 1:27], (28, 28))
                    image = image.astype('float32')
                    image_array = np.clip(image, 0, 255)
                    image_for_model = image_array.reshape(1, 28, 28, 1).astype(np.float32)
                    
                    # Convert to binary
                    image_for_model = np.where(image_for_model < 0.1, 0, image_for_model)
                    image_for_model = np.where(image_for_model > 0.6, 1, image_for_model)
                    
                    prediction = model.predict(image_for_model)
                    predicted_label = np.argmax(prediction)
                    grid[i][j] = predicted_label
                else:
                    grid[i][j] = 0
                    
        return grid.astype(int)
        
    except Exception as e:
        print(f"Error during processing: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def sudoku(image_path='sudoku.png'):
    try:
        possible_paths = [
            image_path,  # Current directory
            os.path.join(os.path.dirname(__file__), image_path),  # Same directory as script
            os.path.join(os.getcwd(), image_path),  # Working directory
            os.path.abspath(image_path)  # Absolute path
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                sudoku_grid = get_grid(path)
                if sudoku_grid is not None:
                    return sudoku_grid
        
        print("\nCould not find the image in any of the expected locations.")
        return None
        
    except Exception as e:
        print(f"Error in sudoku function: {str(e)}")
        import traceback
        traceback.print_exc()
        return None
    
def print_board(board):
    for row in board:
        print(" ".join(str(num) if num != 0 else '.' for num in row))

if __name__ == '__main__':
    result = sudoku()
    print_board(result)
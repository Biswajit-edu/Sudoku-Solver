import numpy as np
import cv2
import pickle
import os
from Pre_process import get_sudoku
import warnings
warnings.filterwarnings('ignore')

import os

model_path = os.path.join(os.path.dirname(__file__), 'Model', 'model.pkl')

# NOTE: Do not load the ML model at import time. Loading a pickled Keras/TensorFlow
# model may require heavy dependencies (tensorflow/keras) and can cause import-time
# failures when running simple endpoints (like health checks). The model is loaded
# lazily inside get_grid before prediction.

def get_grid(image_path):
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
        
        sudoku = cv2.resize(sudoku, (252, 252), interpolation=cv2.INTER_AREA)
        grid = np.zeros([9, 9])
        
        if not os.path.exists(model_path):
            print(f"Error: Model file not found at {model_path}")
            return None
            
       
        class KerasRedirectUnpickler(pickle.Unpickler):
            def find_class(self, module, name):
               
                if module == 'keras' or module.startswith('keras.'):
                    try:
                        import tensorflow as _tf
                        new_module = module.replace('keras', 'tensorflow.keras', 1)
                        mod = __import__(new_module, fromlist=[name])
                        return getattr(mod, name)
                    except Exception:
                       
                        pass
                return super().find_class(module, name)

        try:
            with open(model_path, 'rb') as file:
                model = KerasRedirectUnpickler(file).load()
        except ModuleNotFoundError as mnfe:
            
            if 'keras' in str(mnfe):
                print('\nError: A required dependency for loading the model is missing:')
                print('  ModuleNotFoundError:', str(mnfe))
            raise
        
        for i in range(9):
            for j in range(9):
                 image = sudoku[i*28:(i+1)*28, j*28:(j+1)*28]
                #  image = image_cell[1:27, 1:27]
                 ink_ratio = np.count_nonzero(image) / image.size
                 print("sum:", image.sum(), " ink_ratio:", ink_ratio)
                 if image.sum() > 25800:
                #  if ink_ratio > 0.03:
                     # Resize inner crop to 28x28 and normalize
                     image = cv2.resize(image[1:27, 1:27], (28, 28), interpolation=cv2.INTER_LINEAR)
                    #  print(image)
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
                #  print(f"Predicted digit at cell ({i}, {j}): {grid[i][j]}")
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
        
        # print("\nCould not find the image in any of the expected locations.")
        return None
        
    except Exception as e:
        # print(f"Error in sudoku function: {str(e)}")
        import traceback
        traceback.print_exc()
        return None
    
# def print_board(board):
#     for row in board:
#         print(" ".join(str(num) if num != 0 else '.' for num in row))

# if __name__ == '__main__':
#     result = sudoku()
#     print_board(result)
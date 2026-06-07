import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, UnidentifiedImageError
from GetSudoku import sudoku
import warnings
from Solver import Solver
warnings.filterwarnings('ignore')

app = Flask(__name__)

CORS(app, origins=["*"])

@app.route('/')
def index():
    return "Hello, welcome to the prediction API!"

@app.route('/predict', methods=['POST'])
def predict():
    if 'img' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    img_file = request.files['img']

    try:
        img = Image.open(img_file)
    except UnidentifiedImageError:
        return jsonify({"error": "Invalid image file provided"}), 400

    # Save the uploaded image to a known path and pass that path into
    # `sudoku()` so it attempts to process the exact file we saved.
    temp_image_path = os.path.join(os.path.dirname(__file__), 'sudoku.png')
    try:
        img.save(temp_image_path)
    except Exception as e:
        return jsonify({"error": f"Failed to save uploaded image: {str(e)}"}), 500

    # Call sudoku with the explicit path so it doesn't rely on guesswork.
    grid = sudoku(temp_image_path)
    # print(grid)
    if grid is None:
        # The GetSudoku module prints diagnostic information on stderr; return
        # a friendly JSON error so the front-end sees what went wrong.
        return jsonify({"error": "Failed to extract grid from image. Check server logs for details (model or image processing error)."}), 500

    return jsonify({"grid": grid.tolist()})

@app.route('/solve',methods=['POST'])
def solve():
    try:
        data = request.get_json() 
        matrix = data['matrix']
        ans = Solver(matrix)
        if ans == False:
            return jsonify({"Error": "Invalid Sudoku"}), 400
        return jsonify({"ans": ans})
    
    except Exception as e:
        return jsonify({"Error": str(e)}), 400
    
    
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)

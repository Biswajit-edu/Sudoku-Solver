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
        temp_image_path = os.path.join(os.path.dirname(__file__), 'sudoku.png')
        img.save(temp_image_path)
        grid = sudoku()
        grid = grid.tolist()
    except UnidentifiedImageError:
        return jsonify({"error": "Invalid image file provided"}), 400

    return jsonify({"grid": grid}) 

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
    app.run(debug=True)

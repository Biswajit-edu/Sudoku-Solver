import React, { useState } from 'react'
import Table from './SudokuTable/Table'
import Navbar from './Navbar/Navbar'
import Image_show from './Image_show/Image_show'
import './App.css';

const App = () => {
  const [matrix, setMatrix] = useState(Array(9).fill().map(() => Array(9).fill('')));
  const [predictedMatrix, setPredictedMatrix] = useState(Array(9).fill().map(() => Array(9).fill('')));
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div>
      <Navbar isDarkMode={isDarkMode}setIsDarkMode={setIsDarkMode}/>
      <hr style={{ width: '100%', textAlign: 'left', margin: '0', padding:'0' }} />
      <div className={`Components ${isDarkMode?'dark_card':'light_card'}`}>
        <Image_show 
          matrix={matrix} 
          setMatrix={setMatrix}
          setPredictedMatrix={setPredictedMatrix}
          isDarkMode={isDarkMode}
        />
        <Table 
          matrix={matrix} 
          setMatrix={setMatrix}
          predictedMatrix={predictedMatrix}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  )
}

export default App
import './App.css'

import { Route, Routes } from 'react-router-dom'

import Balance from './pages/Balance'
import Home from './pages/Home'
import NavBar from './components/NavBar'

function App() {
  return (
    <div className="container-fluid p-0">
      <NavBar />
      
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/balance" element={<Balance />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

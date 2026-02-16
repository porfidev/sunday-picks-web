import {Navigate, Route, Routes} from 'react-router-dom'
import {AboutPage, HomePage, LoginPage} from "./components";

function App() {
  return (
    <div className={'page'}>
      <main>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/home" element={<HomePage />}/>
          <Route path="/about" element={<AboutPage/>}/>
          <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
      </main>
    </div>
  )
}

export default App

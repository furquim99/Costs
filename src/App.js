import {BrowserRouter as Router,  Routes, Route} from 'react-router-dom'
import Home from './components/pages/Home'
import Company from './components/pages/Company'
import Contacts from './components/pages/Contacts'
import NewProject from './components/pages/NewProject'
import Container from './components/layout/Container'
import Project from './components/pages/Project'
import Projects from './components/pages/Projects'
import NavBar from './components/layout/NavBar'
import Footer from './components/layout/Footer'

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Container customClass="minHeigh">
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/projects' element={<Projects />} />
            <Route exact path='/company' element={<Company />} />
            <Route exact path='/contact' element={<Contacts />} />
            <Route exact path='/newproject' element={<NewProject />} />
            <Route exact path='/project/:id' element={<Project />} />
          </Routes>
        </Container>
        <Footer/>
      </Router>
    </div>
    
  );
}

export default App;

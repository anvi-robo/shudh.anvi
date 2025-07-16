import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './SignIn';
import Home from './Home';
import Search from './Search';
import Grid from './Grid';
import Dashboard from './Dashboard';
import ScrollToTop from './scrolToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/grid/:district" element={<Grid />} />
        <Route path="/dashboard/:DevName/:district" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

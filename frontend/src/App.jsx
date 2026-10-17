import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Schemes from './pages/Schemes';
import Assistant from './pages/Assistant';
import Profile from './pages/Profile';
import SavedSchemes from './pages/SavedSchemes';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="schemes" element={<Schemes />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="profile" element={<Profile />} />
          <Route path="saved" element={<SavedSchemes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

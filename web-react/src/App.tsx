import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Vitrine from './pages/Vitrine';
import Perfil from './pages/Perfil';
import Scout from './pages/Scout';
import Login from './pages/Login';

// Um componente layout para embrulhar as páginas autenticadas com a Sidebar
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

// Componente App Principal
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

// Lógica para esconder a Sidebar na tela de Login
const AppRoutes = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/jogadores" element={<Vitrine />} />
        <Route path="/jogador/:id" element={<Perfil />} />
        <Route path="/scout" element={<Scout />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </MainLayout>
  );
}

export default App;

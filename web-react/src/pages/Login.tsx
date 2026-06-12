
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #1e2130 0%, #0f111a 100%)'
    }}>
      <div className="card glass-panel fade-in" style={{ width: '400px', padding: '2.5rem', textAlign: 'center' }}>
        <div style={{ 
          width: '64px', height: '64px', 
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          borderRadius: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', fontWeight: 800, color: '#000',
          margin: '0 auto 1.5rem auto'
        }}>
          CH
        </div>
        
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Capixaba <span className="text-gradient">Hub</span></h1>
        <p className="text-secondary mb-6" style={{ fontSize: '0.9rem' }}>
          Sistema Integrado de Desenvolvimento e Dados do Futebol do Espírito Santo.
        </p>

        <div className="input-group" style={{ textAlign: 'left' }}>
          <label>Email de Acesso</label>
          <input type="email" value="admin@capixabahub.com.br" readOnly className="input-field" />
        </div>
        <div className="input-group" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <label>Senha</label>
          <input type="password" value="********" readOnly className="input-field" />
        </div>

        <button 
          className="btn btn-primary w-full" 
          onClick={() => navigate('/')}
          style={{ padding: '1rem', fontSize: '1rem', fontWeight: 700 }}
        >
          Acessar a Plataforma
        </button>

        <div className="mt-6 text-secondary" style={{ fontSize: '0.8rem' }}>
          By Caio & Natiam • Projeto Integrador PI3
        </div>
      </div>
    </div>
  );
};

export default Login;

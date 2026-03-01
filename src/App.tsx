import Homeloan from './components/homeloan/Homeloan';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="logo-area">
          <div className="logo-icon">🏦</div>
          <h1>FinSight</h1>
        </div>
        <div className="header-actions">
          <button className="user-btn">Profile</button>
        </div>
      </header>

      <aside className="app-sidebar">
        <nav className="side-menu">
          <a href="#" className="menu-item active">
            <span className="icon">📊</span>
            EMI Calculator
          </a>
          <a href="#" className="menu-item">
            <span className="icon">💰</span>
            Investment
          </a>
          <a href="#" className="menu-item">
            <span className="icon">📈</span>
            Tax Planner
          </a>
          <a href="#" className="menu-item">
            <span className="icon">⚙️</span>
            Settings
          </a>
        </nav>
      </aside>

      <main className="app-main">
        <div className="content-header">
          <h2>Home Loan EMI Calculator</h2>
          <p>Plan your finances with precision and ease</p>
        </div>

        <Homeloan />
      </main>
    </div>
  );
}

export default App;

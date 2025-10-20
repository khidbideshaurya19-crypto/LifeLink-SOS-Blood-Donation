import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styled, { createGlobalStyle } from 'styled-components';
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import HospitalDashboard from "./pages/HospitalDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import BankDashboard from "./pages/BankDashboard";
import CampEvents from "./pages/CampEvents";
import Leaderboard from "./pages/Leaderboard";
import BloodCamps from './pages/BloodCamps';


const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', sans-serif;
    overflow-x: hidden;
  }
`;

const NavContainer = styled.nav`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  padding: 1.2rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 30px rgba(229, 9, 20, 0.1);
  border-bottom: 1px solid rgba(229, 9, 20, 0.1);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Logo = styled(Link)`
  font-family: 'Poppins', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #E50914;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  position: relative;
  
  &:hover {
    text-shadow: 0 0 20px rgba(229, 9, 20, 0.3);
    &::after {
      transform: scaleX(1);
      opacity: 1;
    }
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #E50914;
    transform: scaleX(0);
    opacity: 0;
    transition: all 0.3s ease;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(229, 9, 20, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }

  &:hover {
    color: #E50914;
    border-color: rgba(229, 9, 20, 0.3);
    box-shadow: 0 4px 15px rgba(229, 9, 20, 0.15);

    &::before {
      width: 300px;
      height: 300px;
    }
  }
`;

const MainContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: 
    radial-gradient(circle at 10% 20%, rgba(229, 9, 20, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 90% 50%, rgba(229, 9, 20, 0.03) 0%, transparent 25%),
    radial-gradient(circle at 30% 80%, rgba(229, 9, 20, 0.04) 0%, transparent 15%),
    linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 249, 250, 1) 100%);
  position: relative;
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <NavContainer>
        <NavContent>
          <Logo to="/">
            <span role="img" aria-label="blood drop">🩸</span> 
            LifeLink SOS
          </Logo>
          <NavLinks>
            <NavLink to="/about">About Us</NavLink>
           
            <NavLink to="/login">Login</NavLink>
          </NavLinks>
        </NavContent>
      </NavContainer>

      <MainContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hospital" element={<HospitalDashboard />} />
          <Route path="/donor" element={<DonorDashboard />} />
          <Route path="/bank" element={<BankDashboard />} />
          <Route path="/camps" element={<CampEvents />} />
          <Route path="/About" element={<About />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/blood-camps" element={<BloodCamps />} />
        </Routes>
      </MainContainer>
    </Router>
  );
}

export default App;

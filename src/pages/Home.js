import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const PageContainer = styled.div`
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
`;

const HeroSection = styled.div`
  min-height: 85vh;
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
  position: relative;
  display: flex;
  align-items: center;
  padding: 4rem 2rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background: url('/images/blood-drop.svg') no-repeat center right;
    background-size: contain;
    opacity: 0.1;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  text-align: center;
`;

const MainHeading = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  span {
    color: #E50914;
  }
`;

const SubHeading = styled(motion.p)`
  font-size: 1.2rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.primary {
    background: #E50914;
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(229, 9, 20, 0.2);
    }
  }

  &.secondary {
    background: white;
    color: #E50914;
    border: 2px solid #E50914;
    
    &:hover {
      background: #fff5f5;
    }
  }

  &.emergency {
    background: #ff4b55;
    color: white;
    border: none;
    
    &:hover {
      background: #ff3540;
    }
  }
`;

const ProcessSection = styled.div`
  padding: 6rem 2rem;
  background: white;
`;

const ProcessGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProcessStep = styled(motion.div)`
  text-align: center;
  padding: 2rem;

  .step-number {
    width: 40px;
    height: 40px;
    background: #E50914;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    font-weight: 600;
  }

  .icon {
    font-size: 2.5rem;
    color: #E50914;
    margin-bottom: 1rem;
  }

  h3 {
    margin-bottom: 1rem;
    color: #333;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
`;

const StatsSection = styled.div`
  padding: 4rem 2rem;
  background: #fff5f5;
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;

  .number {
    font-size: 3rem;
    font-weight: 700;
    color: #E50914;
    margin-bottom: 0.5rem;
  }

  .label {
    color: #666;
    font-size: 1.1rem;
  }
`;

const EmergencyStrip = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #E50914;
  color: white;
  padding: 1rem;
  text-align: center;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const Footer = styled.footer`
  background: #1a1a1a;
  color: white;
  padding: 4rem 2rem;
  margin-bottom: 60px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const FooterColumn = styled.div`
  h4 {
    margin-bottom: 1.5rem;
    color: white;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 0.8rem;

      a {
        color: #ccc;
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: white;
        }
      }
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  a {
    color: white;
    font-size: 1.5rem;
    transition: color 0.3s ease;

    &:hover {
      color: #E50914;
    }
  }
`;

function Home() {
  const navigate = useNavigate();
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);

  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <MainHeading
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Every Drop Counts – <span>Save Lives Through Blood</span>
          </MainHeading>
          <SubHeading
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of donors and hospitals making emergency blood access faster and reliable.
          </SubHeading>
          <ButtonGroup>
            <Button
              className="primary"
              onClick={() => navigate('/Login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔴 Become a Donor
            </Button>
            <Button
              className="secondary"
              onClick={() => navigate('/Login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏥 Hospital Portal
            </Button>
            <Button
              className="emergency"
              onClick={() => setShowEmergencyForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚡ Request Emergency Blood
            </Button>
          </ButtonGroup>
        </HeroContent>
      </HeroSection>

      <ProcessSection>
        <ProcessGrid>
          {[
            { icon: '🏥', title: 'Raise Request', desc: 'Patient or hospital raises blood requirement' },
            { icon: '🔍', title: 'Find Matches', desc: 'System locates nearby matching donors' },
            { icon: '🤝', title: 'Quick Connect', desc: 'Instant connection with verified donors' },
            { icon: '✅', title: 'Safe Delivery', desc: 'Secure and monitored blood transfer' }
          ].map((step, index) => (
            <ProcessStep
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="step-number">{index + 1}</div>
              <div className="icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </ProcessStep>
          ))}
        </ProcessGrid>
      </ProcessSection>

      <StatsSection>
        <ProcessGrid>
          {[
            { number: 10000, label: 'Active Donors' },
            { number: 5000, label: 'Lives Saved' },
            { number: 200, label: 'Partner Hospitals' },
            { number: 50, label: 'Cities Covered' }
          ].map((stat, index) => (
            <StatCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="number">
                <CountUp end={stat.number} duration={2.5} separator="," />+
              </div>
              <div className="label">{stat.label}</div>
            </StatCard>
          ))}
        </ProcessGrid>
      </StatsSection>

      <EmergencyStrip>
        <span>Emergency? Request Blood Now</span>
        <Button
          className="secondary"
          onClick={() => setShowEmergencyForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Request Blood
        </Button>
      </EmergencyStrip>

      <Footer>
        <FooterContent>
          <FooterColumn>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/faq">FAQs</a></li>
            </ul>
          </FooterColumn>
          <FooterColumn>
            <h4>Legal</h4>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </FooterColumn>
          <FooterColumn>
            <h4>Connect With Us</h4>
            <SocialIcons>
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedin /></a>
            </SocialIcons>
          </FooterColumn>
        </FooterContent>
      </Footer>
    </PageContainer>
  );
}

export default Home;
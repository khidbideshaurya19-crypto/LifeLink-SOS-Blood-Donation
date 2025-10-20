import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AboutHero = styled.div`
  min-height: 50vh;
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
  position: relative;
  display: flex;
  align-items: center;
  padding: 4rem 2rem;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Section = styled.section`
  padding: 6rem 0;
  background: ${props => props.alt ? `
    linear-gradient(135deg, #fff5f5 0%, #fff 100%);
    background-image: radial-gradient(circle at 10% 20%, rgba(229, 9, 20, 0.05) 0%, transparent 20%),
                      radial-gradient(circle at 90% 80%, rgba(229, 9, 20, 0.05) 0%, transparent 20%);
  ` : '#fff'};
  position: relative;
  overflow: hidden;
`;

const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const ChartContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin: 2rem 0;
`;

const BloodTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const BloodTypeCard = styled.div`
  background: ${props => props.urgent ? '#fff5f5' : 'white'};
  border: 2px solid ${props => props.urgent ? '#E50914' : '#eee'};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;

  h3 {
    font-size: 2rem;
    color: #E50914;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    font-size: 0.9rem;
  }

  .status {
    color: ${props => props.urgent ? '#E50914' : '#28a745'};
    font-weight: 600;
    margin-top: 0.5rem;
  }
`;

// Add these new styled components after existing ones
const FactsSection = styled.div`
  ul {
    list-style: none;
    padding: 0;
    margin: 2rem 0;
    
    li {
      padding: 1rem;
      margin-bottom: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      gap: 1rem;
      
      &:before {
        content: '🔹';
      }
    }
  }
`;

const ImpactSection = styled.div`
  text-align: center;
  margin: 3rem 0;

  .impact-numbers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .impact-card {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);

    h3 {
      color: #E50914;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    p {
      color: #666;
    }
  }
`;

const TestimonialSection = styled.div`
  .testimonial-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .testimonial-card {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);

    .quote {
      font-style: italic;
      color: #666;
      margin-bottom: 1rem;
    }

    .author {
      display: flex;
      align-items: center;
      gap: 1rem;

      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .details {
        h4 {
          color: #333;
          margin: 0;
        }
        
        p {
          color: #666;
          margin: 0;
          font-size: 0.9rem;
        }
      }
    }
  }
`;

function About() {
  const navigate = useNavigate();

  const donationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Donations',
        data: [650, 750, 850, 800, 900, 1000],
        borderColor: '#E50914',
        tension: 0.4,
      }
    ]
  };

  const bloodTypeData = {
    labels: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'],
    datasets: [{
      data: [35, 25, 20, 10, 4, 3, 2, 1],
      backgroundColor: [
        '#E50914',
        '#ff4d4d',
        '#ff8080',
        '#ffb3b3',
        '#ff1a1a',
        '#cc0000',
        '#990000',
        '#660000'
      ]
    }]
  };

  return (
    <>
      <AboutHero>
        <Container>
          <h1>Making Blood Donation Accessible</h1>
          <p>Connecting donors with those in need, saving lives every day</p>
        </Container>
      </AboutHero>

      <Section>
        <Container>
          <h2>Blood Donation Statistics</h2>
          <StatisticsGrid>
            <ChartContainer>
              <h3>Monthly Donations</h3>
              <Line data={donationData} options={{ responsive: true }} />
            </ChartContainer>
            <ChartContainer>
              <h3>Blood Type Distribution</h3>
              <Pie data={bloodTypeData} options={{ responsive: true }} />
            </ChartContainer>
          </StatisticsGrid>
        </Container>
      </Section>

      <Section alt>
        <Container>
          <h2>Current Blood Type Status</h2>
          <BloodTypeGrid>
            <BloodTypeCard urgent>
              <h3>A+</h3>
              <p>Current Stock: 50 units</p>
              <div className="status">Urgent Need</div>
            </BloodTypeCard>
            <BloodTypeCard>
              <h3>B+</h3>
              <p>Current Stock: 120 units</p>
              <div className="status">Sufficient</div>
            </BloodTypeCard>
            <BloodTypeCard urgent>
              <h3>O-</h3>
              <p>Current Stock: 30 units</p>
              <div className="status">Critical Need</div>
            </BloodTypeCard>
            <BloodTypeCard>
              <h3>AB+</h3>
              <p>Current Stock: 80 units</p>
              <div className="status">Sufficient</div>
            </BloodTypeCard>
          </BloodTypeGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2>Blood Donation Facts</h2>
          <ul>
            <li>Every 2 seconds someone needs blood in India</li>
            <li>A single car accident victim can require up to 100 units of blood</li>
            <li>One donation can save up to three lives</li>
            <li>Less than 10% of eligible population donates blood</li>
            <li>Blood can be stored for only 42 days</li>
          </ul>
        </Container>
      </Section>

      <Section alt>
        <Container>
          <h2>Our Impact</h2>
          <ImpactSection>
            <div className="impact-numbers">
              <div className="impact-card">
                <h3>50,000+</h3>
                <p>Registered Donors</p>
              </div>
              <div className="impact-card">
                <h3>25,000+</h3>
                <p>Lives Saved</p>
              </div>
              <div className="impact-card">
                <h3>1,000+</h3>
                <p>Partner Hospitals</p>
              </div>
              <div className="impact-card">
                <h3>100+</h3>
                <p>Cities Covered</p>
              </div>
            </div>
          </ImpactSection>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2>Important Information</h2>
          <FactsSection>
            <ul>
              <li>Blood donation is a safe, simple procedure that takes about 10-15 minutes</li>
              <li>You can donate blood every 3 months safely</li>
              <li>All blood types are needed, but O-negative and AB-positive are especially valuable</li>
              <li>Regular blood donation can help reduce the risk of heart disease and cancer</li>
              <li>Your body replaces the donated blood volume within 24 hours</li>
              <li>Each unit of blood can be separated into red cells, platelets, and plasma</li>
            </ul>
          </FactsSection>
        </Container>
      </Section>

      <Section alt>
        <Container>
          <h2>Success Stories</h2>
          <TestimonialSection>
            <div className="testimonial-grid">
              <div className="testimonial-card">
                <p className="quote">"The quick response from donors through this platform saved my mother's life during her emergency surgery."</p>
                <div className="author">
                  <div className="details">
                    <h4>Rahul Sharma</h4>
                    <p>Blood Recipient's Son</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <p className="quote">"Being able to help save lives through regular blood donation gives me immense satisfaction. This platform makes it so easy."</p>
                <div className="author">
                  <div className="details">
                    <h4>Dr. Priya Patel</h4>
                    <p>Regular Donor</p>
                  </div>
                </div>
              </div>
            </div>
          </TestimonialSection>
        </Container>
      </Section>
    </>
  );
}

export default About;
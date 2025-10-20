// src/pages/BloodCamps.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

// ---------------- Styled Components ----------------
const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(229, 9, 20, 0.1);

  h1 {
    font-size: 2.5rem;
    color: #E50914;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    color: #666;
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto 2rem;
  }
`;

const Button = styled.button`
  background: #E50914;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(229, 9, 20, 0.2);
  }
`;

const CampsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const CampCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  padding: 1.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CampInfo = styled.div`
  h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }

  .location {
    color: #666;
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }

  .stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: #666;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #E50914;
    box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.1);
  }
`;

// ---------------- Component ----------------
function BloodCamps() {
  const [camps, setCamps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    capacity: '',
    contact: '',
    description: ''
  });

  useEffect(() => {
    loadCamps();
  }, []);

  // Fetch camps
  const loadCamps = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'bloodCamps'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCamps(data);
    } catch (error) {
      console.error('Error loading camps:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create camp
  const handleCreateCamp = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Please login to create a camp');
        return;
      }

      await addDoc(collection(db, 'bloodCamps'), {
        ...formData,
        capacity: Number(formData.capacity),
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        status: 'active'
      });

      setShowModal(false);
      loadCamps();
      setFormData({ title: '', date: '', location: '', capacity: '', contact: '', description: '' });
      alert('✅ Camp created successfully!');
    } catch (error) {
      console.error('Error creating camp:', error);
      alert('❌ Failed to create camp');
    }
  };

  // Register for a camp
  const handleRegister = async (campId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Please login to register');
        return;
      }

      await addDoc(collection(db, 'campRegistrations'), {
        campId,
        userId: user.uid,
        registeredAt: serverTimestamp(),
        status: 'pending'
      });

      alert('✅ Registered successfully!');
    } catch (error) {
      console.error('Error registering:', error);
      alert('❌ Failed to register');
    }
  };

  return (
    <PageContainer>
      <HeroSection>
        <h1>Blood Donation Camps</h1>
        <p>Join upcoming blood donation camps and save lives</p>
        <Button onClick={() => setShowModal(true)}>+ Create New Camp</Button>
      </HeroSection>

      {loading ? (
        <p>Loading camps...</p>
      ) : (
        <CampsGrid>
          {camps.map(camp => (
            <CampCard key={camp.id}>
              <CampInfo>
                <h3>{camp.title}</h3>
                <div className="location">📍 {camp.location}</div>
                <div className="stats">
                  <span>📅 {new Date(camp.date).toLocaleString()}</span>
                  <span>👥 Capacity: {camp.capacity}</span>
                  <span>📞 {camp.contact}</span>
                </div>
                <Button onClick={() => handleRegister(camp.id)}>Register Now</Button>
              </CampInfo>
            </CampCard>
          ))}
        </CampsGrid>
      )}

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2>Create Blood Donation Camp</h2>
            <Form onSubmit={handleCreateCamp}>
              <Input type="text" placeholder="Camp Title"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              <Input type="datetime-local"
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              <Input type="text" placeholder="Location"
                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
              <Input type="number" placeholder="Capacity"
                value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required />
              <Input type="tel" placeholder="Contact Number"
                value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} required />
              <Input as="textarea" placeholder="Description"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              <Button type="submit">Create Camp</Button>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
}

export default BloodCamps;

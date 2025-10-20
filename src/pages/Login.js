import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// ================== STYLES ==================
const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #fbeaea 100%);
  font-family: "Inter", sans-serif;
  padding: 1rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  padding: 2.5rem 2rem;
  border-radius: 24px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(229, 9, 20, 0.1);
  text-align: center;
`;

const Logo = styled.div`
  margin-bottom: 1.5rem;
  h1 {
    font-family: "Poppins", sans-serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #e50914;
    margin-bottom: 0.5rem;
  }
  p {
    color: #666;
    font-size: 0.95rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  background: #f8f8f8;
  padding: 0.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  gap: 0.5rem;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 0.8rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: ${({ active }) => (active ? "#e50914" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#666")};
  &:hover {
    background: ${({ active }) => (active ? "#b20710" : "#eee")};
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
  input {
    width: 100%;
    padding: 1rem;
    border: 1.5px solid #ddd;
    border-radius: 12px;
    font-size: 0.95rem;
    &:focus {
      border-color: #e50914;
      outline: none;
    }
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  &:hover {
    background: #b20710;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 1.5px solid #ddd;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  margin-bottom: 1rem;
`;

// ================== COMPONENT ==================
function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  // -------- LOGIN --------
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const role = form[0].value;
    const email = form[1].value;
    const password = form[2].value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const ref = doc(db, role === "donor" ? "donors" : "hospitals", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        navigate(role === "donor" ? "/donor" : "/hospital");
      } else {
        alert("Role mismatch. Try selecting correct role.");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // -------- REGISTER DONOR --------
  const handleDonorRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const donorData = {
      name: form[0].value,
      phone: form[1].value,
      age: form[2].value,
      gender: form[3].value,
      bloodGroup: form[4].value,
      email: form[5].value,
      location: form[7].value,
      availability: form[8].value,
    };
    const email = form[5].value;
    const password = form[6].value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "donors", user.uid), {
        ...donorData,
        uid: user.uid,
        role: "donor",
      });

      alert("✅ Donor registered successfully!");
      setActiveTab("login");
    } catch (err) {
      alert(err.message);
    }
  };

  // -------- REGISTER HOSPITAL --------
  const handleHospitalRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const hospitalData = {
      name: form[0].value,
      regNumber: form[1].value,
      contact: form[2].value,
      type: form[3].value,
      email: form[4].value,
      city: form[6].value,
      pincode: form[7].value,
      address: form[8].value,
      facility: form[9].value,
      emergency: form[10].value,
    };
    const email = form[4].value;
    const password = form[5].value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "hospitals", user.uid), {
        ...hospitalData,
        uid: user.uid,
        role: "hospital",
      });

      alert("✅ Hospital registered successfully!");
      setActiveTab("login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Wrapper>
      <Card>
        <Logo>
          <h1>🩸 LifeLink SOS</h1>
          <p>Welcome! Please login or register to continue</p>
        </Logo>

        <Tabs>
          <TabButton active={activeTab === "login"} onClick={() => setActiveTab("login")}>Login</TabButton>
          <TabButton active={activeTab === "donor"} onClick={() => setActiveTab("donor")}>Register Donor</TabButton>
          <TabButton active={activeTab === "hospital"} onClick={() => setActiveTab("hospital")}>Register Hospital</TabButton>
        </Tabs>

        {/* LOGIN FORM */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <Select required>
              <option value="">Select Role</option>
              <option value="donor">Donor</option>
              <option value="hospital">Hospital</option>
            </Select>
            <InputGroup><input type="email" placeholder="Email" required /></InputGroup>
            <InputGroup><input type="password" placeholder="Password" required /></InputGroup>
            <Button type="submit">Login</Button>
          </form>
        )}

        {/* DONOR REGISTER */}
        {activeTab === "donor" && (
          <form onSubmit={handleDonorRegister}>
            <InputGroup><input type="text" placeholder="Full Name" required /></InputGroup>
            <InputGroup><input type="tel" placeholder="Phone Number" required /></InputGroup>
            <InputGroup><input type="number" placeholder="Age" required /></InputGroup>
            <Select required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
            <Select required>
              <option value="">Blood Group</option>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
            </Select>
            <InputGroup><input type="email" placeholder="Email" required /></InputGroup>
            <InputGroup><input type="password" placeholder="Password" required /></InputGroup>
            <InputGroup><input type="text" placeholder="Location" required /></InputGroup>
            <Select required>
              <option value="">Availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="emergency">Emergency Only</option>
            </Select>
            <Button type="submit">Register as Donor</Button>
          </form>
        )}

        {/* HOSPITAL REGISTER */}
        {activeTab === "hospital" && (
          <form onSubmit={handleHospitalRegister}>
            <InputGroup><input type="text" placeholder="Hospital Name" required /></InputGroup>
            <InputGroup><input type="text" placeholder="Registration Number" required /></InputGroup>
            <InputGroup><input type="tel" placeholder="Contact Number" required /></InputGroup>
            <Select required>
              <option value="">Hospital Type</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
              <option value="charitable">Charitable</option>
            </Select>
            <InputGroup><input type="email" placeholder="Email" required /></InputGroup>
            <InputGroup><input type="password" placeholder="Password" required /></InputGroup>
            <InputGroup><input type="text" placeholder="City" required /></InputGroup>
            <InputGroup><input type="text" placeholder="Pincode" required /></InputGroup>
            <InputGroup><input type="text" placeholder="Complete Address" required /></InputGroup>
            <Select required>
              <option value="">Blood Bank Facility</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
            <Select required>
              <option value="">Emergency Service</option>
              <option value="24x7">24x7</option>
              <option value="day">Day Only</option>
            </Select>
            <Button type="submit">Register Hospital</Button>
          </form>
        )}
      </Card>
    </Wrapper>
  );
}

export default Login;

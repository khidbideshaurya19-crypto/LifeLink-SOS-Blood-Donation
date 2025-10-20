import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ Firebase
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// ------------------ Blood Compatibility ------------------
const getCompatibleGroups = (donorGroup) => {
  const map = {
    "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    "O+": ["O+", "A+", "B+", "AB+"],
    "A-": ["A-", "A+", "AB-", "AB+"],
    "A+": ["A+", "AB+"],
    "B-": ["B-", "B+", "AB-", "AB+"],
    "B+": ["B+", "AB+"],
    "AB-": ["AB-", "AB+"],
    "AB+": ["AB+"],
  };
  return map[donorGroup] || [];
};
const ManageCampButton = styled.button`
  background: #28a745;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
  
  &:hover {
    background: #218838;
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
`;


// ------------------ Styled Components ------------------
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
  padding: 2rem;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem 2rem;
  border-radius: 20px;

  .right-section {
    display: flex;
    align-items: center;
  }
`;

const WelcomeText = styled.div`
  h1 {
    font-family: 'Poppins', sans-serif;
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  span {
    color: #E50914;
    font-weight: 600;
  }
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #E50914;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 20px;
  text-align: center;

  .icon {
    font-size: 2rem;
    color: #E50914;
    margin-bottom: 1rem;
  }
  .number {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
  }
`;

const SOSSection = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 20px;
  margin-bottom: 2rem;
`;

const SOSTable = styled.div`
  overflow-x: auto;
  table {
    width: 100%;
    border-collapse: collapse;
    th, td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
      text-align: left;
    }
    th {
      font-weight: 600;
      color: #666;
    }
    tr:hover {
      background: rgba(229, 9, 20, 0.05);
    }
  }
`;

const RespondButton = styled.button`
  background: ${(props) => (props.urgent ? '#E50914' : 'transparent')};
  color: ${(props) => (props.urgent ? 'white' : '#E50914')};
  border: 2px solid #E50914;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  cursor: pointer;
`;

// ------------------ Modal ------------------
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 400px;
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
  color: #E50914;
`;

const FieldLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1rem;
  border: 1.5px solid #ddd;
  border-radius: 12px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1rem;
  border: 1.5px solid #ddd;
  border-radius: 12px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const CancelBtn = styled.button`
  background: #eee;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 12px;
`;

const SubmitBtn = styled.button`
  background: #E50914;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 12px;
`;

// ------------------ Component ------------------
function DonorDashboard() {
  const navigate = useNavigate();
  const [donorData, setDonorData] = useState(null);
  const [sosRequests, setSosRequests] = useState([]);
  const [activeReq, setActiveReq] = useState(null);

  // Form fields
  const [availability, setAvailability] = useState("");
  const [delivery, setDelivery] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Load donor data + SOS requests
  useEffect(() => {
    const run = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const donorDoc = await getDoc(doc(db, "donors", user.uid));
      if (!donorDoc.exists()) return;

      const donor = donorDoc.data();
      setDonorData(donor);

      const compatible = getCompatibleGroups(donor.bloodGroup);
      const q = query(collection(db, "sosRequests"), where("status", "==", "pending"));

      onSnapshot(q, (snap) => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setSosRequests(all.filter(r => compatible.includes(r.bloodGroup)));
      });
    };
    run();
  }, []);

  const openRespondForm = (req) => {
    setActiveReq(req);
    setAvailability("");
    setDelivery("");
    setAddress("");
    setNote("");
    setPhone("");
    setEmail("");
  };

  const submitResponse = async () => {
    if (!activeReq) return;

    if (!availability) {
      alert("Please select availability");
      return;
    }
    if (!phone.trim() || !email.trim()) {
      alert("Phone and email required");
      return;
    }

    if (availability === "no") {
      await updateDoc(doc(db, "sosRequests", activeReq.id), {
        status: "declined_by_donor",
        donorAvailability: "no",
        donorPhone: phone,
        donorEmail: email,
        donorNote: note,
        respondedBy: donorData?.name,
        respondedAt: serverTimestamp(),
      });
      setActiveReq(null);
      return;
    }

    if (!delivery) {
      alert("Select delivery choice");
      return;
    }
    if (delivery === "hospital_pickup" && !address.trim()) {
      alert("Enter your full address for pickup");
      return;
    }

    const newStatus = delivery === "donor_self"
      ? "donor_en_route"
      : "hospital_pickup_requested";

    await updateDoc(doc(db, "sosRequests", activeReq.id), {
      status: newStatus,
      donorAvailability: "yes",
      donorDeliveryChoice: delivery,
      donorAddress: delivery === "hospital_pickup" ? address : "",
      donorPhone: phone,
      donorEmail: email,
      donorNote: note,
      respondedBy: donorData?.name,
      respondedAt: serverTimestamp(),
    });

    alert("Response submitted! Hospital will be notified.");
    setActiveReq(null);
  };

  const initials = donorData?.name
    ? donorData.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "👤";

  return (
    <DashboardContainer>
    <Header>
      <WelcomeText>
        <h1>Welcome, <span>{donorData?.name || "Donor"}</span></h1>
        <p>Blood Group: <span>{donorData?.bloodGroup || "N/A"}</span></p>
      </WelcomeText>
      <div className="right-section">
        <ManageCampButton onClick={() => navigate('/blood-camps')}>
          🏕️ Manage Blood Camps
        </ManageCampButton>
        <Avatar>{initials}</Avatar>
      </div>
    </Header>

      {/* Stats */}
      <StatsGrid>
        <StatCard>
          <div className="icon">🩸</div>
          <div className="number">{donorData?.donations || 0}</div>
        </StatCard>
        <StatCard>
          <div className="icon">❤️</div>
          <div className="number">{donorData?.livesImpacted || 0}</div>
        </StatCard>
        <StatCard>
          <div className="icon">🏆</div>
          <div className="number">{donorData?.ranking || "N/A"}</div>
        </StatCard>
      </StatsGrid>

      {/* SOS Requests */}
      <SOSSection>
        <h2>Active SOS Requests</h2>
        <SOSTable>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Blood Group</th>
                <th>Hospital</th>
                <th>Urgency</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sosRequests.length > 0 ? (
                sosRequests.map(req => (
                  <tr key={req.id}>
                    <td>{req.patientName}</td>
                    <td>{req.bloodGroup}</td>
                    <td>{req.hospitalName}</td>
                    <td style={{ color: req.urgency === "high" ? "#E50914" : "#333" }}>
                      {req.urgency}
                    </td>
                    <td>
                      <RespondButton
                        urgent={req.urgency === "high"}
                        onClick={() => openRespondForm(req)}
                      >
                        Respond
                      </RespondButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No matching requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </SOSTable>
      </SOSSection>

      {/* Modal */}
      {activeReq && (
        <Modal>
          <ModalContent>
            <ModalTitle>Respond to {activeReq.patientName}</ModalTitle>

            <FieldLabel>Your Phone</FieldLabel>
            <Input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 9876543210"
            />

            <FieldLabel>Your Email</FieldLabel>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <FieldLabel>Are you available?</FieldLabel>
            <Select
              value={availability}
              onChange={e => setAvailability(e.target.value)}
            >
              <option value="">Select</option>
              <option value="yes">Yes, I can donate</option>
              <option value="no">No, not available</option>
            </Select>

            {availability === "yes" && (
              <>
                <FieldLabel>Delivery Option</FieldLabel>
                <Select
                  value={delivery}
                  onChange={e => setDelivery(e.target.value)}
                >
                  <option value="">Choose</option>
                  <option value="donor_self">I will come personally</option>
                  <option value="hospital_pickup">Hospital should send staff</option>
                </Select>

                {delivery === "hospital_pickup" && (
                  <>
                    <FieldLabel>Your Full Address</FieldLabel>
                    <Input
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Street, City, Pincode"
                    />
                  </>
                )}

                <FieldLabel>Note (optional)</FieldLabel>
                <Input
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g., I’ll reach in 30 mins"
                />
              </>
            )}

            <ModalActions>
              <CancelBtn onClick={() => setActiveReq(null)}>Cancel</CancelBtn>
              <SubmitBtn onClick={submitResponse}>Submit</SubmitBtn>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
      
    </DashboardContainer>
  );
}

export default DonorDashboard;

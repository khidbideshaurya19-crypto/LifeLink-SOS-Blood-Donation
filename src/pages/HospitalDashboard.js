import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Firebase
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

// ------------------ Styled Components ------------------

// Main container
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
  padding: 2rem;
`;

// Header
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(229, 9, 20, 0.1);
  margin-bottom: 2rem;
`;

const HospitalInfo = styled.div`
  h1 {
    font-family: "Poppins", sans-serif;
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  p {
    color: #666;
    span {
      color: #E50914;
      font-weight: 600;
    }
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NotificationBadge = styled.div`
  position: relative;
  cursor: pointer;

  .icon {
    font-size: 1.5rem;
    color: #666;
  }

  .badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #E50914;
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// Stats
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 15px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(229, 9, 20, 0.1);
  }

  .number {
    font-size: 2rem;
    font-weight: 700;
    color: #E50914;
    margin-bottom: 0.5rem;
  }

  .label {
    color: #666;
    font-size: 0.9rem;
  }
`;

// Requests
const MainSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const RequestsTable = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
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

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case "high":
        return "rgba(229, 9, 20, 0.1)";
      case "medium":
        return "rgba(255, 152, 0, 0.1)";
      default:
        return "rgba(76, 175, 80, 0.1)";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "high":
        return "#E50914";
      case "medium":
        return "#FF9800";
      default:
        return "#4CAF50";
    }
  }};
`;

const ActionButton = styled.button`
  background: transparent;
  border: 2px solid #E50914;
  color: #E50914;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 0.5rem;

  &:hover {
    background: #E50914;
    color: white;
  }
`;

// Floating Buttons
const FloatingButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #E50914;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(229, 9, 20, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(229, 9, 20, 0.4);
  }
`;

// Form
const FormContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(229, 9, 20, 0.2);
  padding: 2rem;
  width: 400px;
  z-index: 2000;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1.5px solid #ddd;
  border-radius: 12px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1.5px solid #ddd;
  border-radius: 12px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1.5px solid #ddd;
  border-radius: 12px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  background: #eee;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background: #e50914;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
`;

// Donor details popup
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 400px;
  text-align: center;
`;

// ------------------ Component ------------------
function HospitalDashboard() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [hospitalData, setHospitalData] = useState(null);
  const [sosRequests, setSosRequests] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("");
  const [urgency, setUrgency] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedDonor, setSelectedDonor] = useState(null); // popup
  const navigate = useNavigate();

  // ✅ Fetch hospital details
  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, "hospitals", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHospitalData(docSnap.data());

          // Fetch this hospital’s SOS requests in realtime
          const q = query(
            collection(db, "sosRequests"),
            where("hospitalId", "==", user.uid)
          );
          onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setSosRequests(requests);
          });
        }
      } catch (err) {
        console.error("Error fetching hospital:", err.message);
      }
    };

    fetchHospital();
  }, []);

  // ✅ Handle SOS Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user || !hospitalData) return;

      await addDoc(collection(db, "sosRequests"), {
        patientName,
        bloodGroup,
        units: Number(units),
        urgency,
        notes,
        status: "pending",
        hospitalId: user.uid,
        hospitalName: hospitalData.name || "Unknown",
        hospitalCity: hospitalData.city || "Unknown",
        createdAt: serverTimestamp(),
      });

      alert("✅ SOS Request submitted successfully!");
      setShowRequestForm(false);
      setPatientName("");
      setBloodGroup("");
      setUnits("");
      setUrgency("");
      setNotes("");
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  // ✅ Mark as fulfilled
  const handleMarkFulfilled = async (reqId) => {
    try {
      await updateDoc(doc(db, "sosRequests", reqId), {
        status: "fulfilled",
      });
      alert("✅ Request marked as fulfilled!");
    } catch (err) {
      console.error("❌ Error fulfilling:", err.message);
    }
  };

  return (
    <DashboardContainer>
      {/* ---------- Header ---------- */}
      <Header>
        <HospitalInfo>
          <h1>{hospitalData?.name || "Hospital Name"}</h1>
          <p>
            Branch: <span>{hospitalData?.city || "Unknown"}</span> | ID: #
            {hospitalData?.regNumber || "N/A"}
          </p>
        </HospitalInfo>
        <ProfileSection>
          <NotificationBadge>
            <div className="icon">🔔</div>
            <div className="badge">{sosRequests.length}</div>
          </NotificationBadge>
        </ProfileSection>
      </Header>

      {/* ---------- Stats ---------- */}
      <StatsGrid>
        <StatCard>
          <div className="number">{sosRequests.length}</div>
          <div className="label">Total SOS Requests</div>
        </StatCard>
        <StatCard>
          <div className="number">
            {sosRequests.filter((r) => r.status === "fulfilled").length}
          </div>
          <div className="label">Requests Fulfilled</div>
        </StatCard>
        <StatCard>
          <div className="number">156</div>
          <div className="label">Active Donors Nearby</div>
        </StatCard>
        <StatCard>
          <div className="number">
            {sosRequests.filter((r) => r.status === "pending").length}
          </div>
          <div className="label">Pending Requests</div>
        </StatCard>
      </StatsGrid>

      {/* ---------- Active Requests ---------- */}
      <MainSection>
        <RequestsTable>
          <h2>Active SOS Requests</h2>
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Blood Group</th>
                <th>Units</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sosRequests.length > 0 ? (
                sosRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.patientName}</td>
                    <td>{req.bloodGroup}</td>
                    <td>{req.units}</td>
                    <td>
                      <StatusBadge status={req.urgency}>{req.urgency}</StatusBadge>
                    </td>
                    <td>{req.status}</td>
                    <td>
                      <ActionButton onClick={() => setSelectedDonor(req)}>
                        View Donor Details
                      </ActionButton>
                      <ActionButton onClick={() => handleMarkFulfilled(req.id)}>
                        Mark Fulfilled
                      </ActionButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No active requests</td>
                </tr>
              )}
            </tbody>
          </table>
        </RequestsTable>
      </MainSection>

      {/* ---------- Floating Buttons ---------- */}
      <FloatingButton onClick={() => setShowRequestForm(true)}>
        🩸 Raise New SOS Request
      </FloatingButton>

      <FloatingButton
        onClick={() => navigate("/blood-camps")}
        style={{ right: "19rem" }}
      >
        🎪 Manage Blood Camps
      </FloatingButton>

      {/* ---------- Request Form Popup ---------- */}
      {showRequestForm && (
        <FormContainer>
          <h2>Raise New SOS Request</h2>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
            <Select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              required
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </Select>
            <Input
              type="number"
              placeholder="Units Required"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              required
            />
            <Select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              required
            >
              <option value="">Select Urgency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
            <TextArea
              placeholder="Additional Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <ButtonRow>
              <CancelButton onClick={() => setShowRequestForm(false)}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit">Submit Request</SubmitButton>
            </ButtonRow>
          </form>
        </FormContainer>
      )}

      {/* ---------- Donor Details Modal ---------- */}
      {selectedDonor && (
        <ModalOverlay>
          <ModalContent>
            <h2>Donor Details</h2>
            <p>
              <strong>Responded By:</strong> {selectedDonor.respondedBy || "N/A"}
            </p>
            <p>
              <strong>Contact:</strong> {selectedDonor.donorContact || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {selectedDonor.donorEmail || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {selectedDonor.status}
            </p>
            <ButtonRow>
              <CancelButton onClick={() => setSelectedDonor(null)}>
                Close
              </CancelButton>
            </ButtonRow>
          </ModalContent>
        </ModalOverlay>
      )}
    </DashboardContainer>
  );
}

export default HospitalDashboard;

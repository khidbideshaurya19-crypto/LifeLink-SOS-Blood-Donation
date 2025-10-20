import styled from 'styled-components';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FormCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 0.8rem;
    border: 1.5px solid #ddd;
    border-radius: 10px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #E50914;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background: #E50914;
    color: white;
    
    &:hover {
      background: #b20710;
    }
  }
  
  &.secondary {
    background: #f5f5f5;
    color: #666;
    
    &:hover {
      background: #eee;
    }
  }
`;

function NewRequestForm({ onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle form submission
    onClose();
  };

  return (
    <Modal>
      <FormCard>
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Raise New SOS Request</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Patient Name</label>
            <input type="text" required />
          </FormGroup>
          
          <FormGroup>
            <label>Blood Group Required</label>
            <select required>
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </FormGroup>
          
          <FormGroup>
            <label>Units Required</label>
            <input type="number" min="1" required />
          </FormGroup>
          
          <FormGroup>
            <label>Urgency Level</label>
            <select required>
              <option value="">Select Urgency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </FormGroup>
          
          <FormGroup>
            <label>Additional Notes</label>
            <textarea rows="3"></textarea>
          </FormGroup>
          
          <ButtonGroup>
            <Button type="button" className="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="primary">
              Submit Request
            </Button>
          </ButtonGroup>
        </form>
      </FormCard>
    </Modal>
  );
}

export default NewRequestForm;
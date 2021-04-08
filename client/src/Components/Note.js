import { useState } from "react";
import {
  MDBBtn,
  MDBCol,
  MDBIcon,
  MDBCard,
  MDBCardHeader,
  MDBCardFooter,
  MDBCardBody,
  MDBBadge,
} from "mdb-react-ui-kit";
import './note.css';

const Note = ({ title, text, handleRemove, handleEdit, id, color, textColor }) => {
  const [isPinned, setIsPinned] = useState(false);

  return (
    <MDBCol className="mt-3 mx-2" md='3' id={id}>
      <MDBBadge
        className="thumbtack p-2"
        notification
        onClick={() => setIsPinned(!isPinned)}
        pill
        color={isPinned && "danger"}
      >
        <MDBIcon icon={isPinned ? 'lock' : 'thumbtack'} size="2x" />
      </MDBBadge>
      <MDBCard style={{ color: textColor }} className="text-center">
        <MDBCardHeader style={{ backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1` }}>{title}</MDBCardHeader>
        <MDBCardBody style={{ backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)` }}>{text}</MDBCardBody>
        <MDBCardFooter className="p-3" style={{ backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1` }}>
          <MDBBtn
            className="me-2"
            color="success"
            id={`edit-${id}`}
            onClick={(e) => handleEdit(e)}
          >
            Edit <MDBIcon fas icon="edit" />
          </MDBBtn>
          <MDBBtn
            disabled={isPinned}
            color="danger"
            id={`remove-${id}`}
            onClick={(e) => handleRemove(e)}
          >
            Remove <MDBIcon fas icon="trash-alt" />
          </MDBBtn>
        </MDBCardFooter>
      </MDBCard>
    </MDBCol>
  );
};

export default Note;

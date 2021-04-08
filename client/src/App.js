import { useState, useRef, useEffect } from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import uuid from "react-uuid";
import "./App.css";
import {
  MDBContainer,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
} from "mdb-react-ui-kit";
import Note from "./Components/Note";
import { SwatchesPicker } from "react-color";

const App = () => {
  const retrievedNotesData = JSON.parse(localStorage.getItem('notes'));

  const [notes, setNotes] = useState(retrievedNotesData ? retrievedNotesData : []);
  const [modalState, setModalState] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add new note!");
  const [editId, setEditId] = useState("");
  const [modalMode, setModalMode] = useState("add");
  const [color, setColor] = useState({ r: 255, g: 255, b: 255, a: 1 });
  const [textColor, setTextColor] = useState("#fff");

  const textRef = useRef(null);
  const titleRef = useRef(null);

  const callAPI = () => {
    fetch("http://localhost:3000/testAPI")
      .then((res) => res.text())
      .then((res) => console.log(JSON.parse(res)))
      .catch((err) => err);
  };

  useEffect(() => {
    callAPI();
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/data", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notes),
    });
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);


  const handleColor = (color) => {
    setColor(color.rgb);
  };

  const handleTextColor = (color) => {
    setTextColor(color.hex);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalMode === "add") {
      setNotes([
        ...notes,
        {
          title: titleRef.current.value,
          text: textRef.current.value,
          id: `${uuid()}`,
          color,
          textColor,
        },
      ]);
    } else if (modalMode === "edit") {
      const updatedNotes = notes.map((note) => {
        if (note.id === editId) {
          note.title = titleRef.current.value;
          note.text = textRef.current.value;
          note.color = color;
          note.textColor = textColor;
        }

        return note;
      });

      setNotes(updatedNotes);
    }

    setModalState(false);
  };

  const handleAdd = () => {
    titleRef.current.value = "";
    textRef.current.value = "";

    setModalMode("add");
    setModalTitle("Add new note!");
    setModalState(true);
  };

  const handleEdit = (e) => {
    const id = e.target.id.replace("edit-", "");

    setModalMode("edit");
    setModalTitle("Edit your note!");
    setEditId(id);
    setModalState(true);

    const itemIndex = notes.findIndex((note) => note.id === id);

    if (notes[itemIndex].text !== "") {
      textRef.current.value = notes[itemIndex].text;
    }

    if (notes[itemIndex].title !== "") {
      titleRef.current.value = notes[itemIndex].title;
    }
  };

  const handleRemove = (e) => {
    const removeId = e.target.id.replace("remove-", "");

    const updatedNotes = notes.filter((note) => note.id !== removeId);

    setNotes(updatedNotes);
  };

  return (
    <MDBContainer>
      <MDBBtn
        className="mt-3 me-3 add-button"
        onClick={handleAdd}
        color="success"
        size="lg"
      >
        <MDBIcon fas icon="plus" size="lg" />
      </MDBBtn>
      <h2 className="text-center my-4">Sticky notes!</h2>
      <h5 className="text-center my-2">Still in progress :(</h5>
      <MDBRow className="justify-content-center">
        {notes.map((item) => (
          <Note
            handleRemove={handleRemove}
            handleEdit={handleEdit}
            text={item.text}
            key={item.id}
            title={item.title}
            id={item.id}
            color={item.color}
            textColor={item.textColor}
          />
        ))}
      </MDBRow>

      <MDBModal
        tabIndex="-1"
        show={modalState}
        getOpenState={(e) => setModalState(e)}
      >
        <MDBModalDialog className="modal-dialog-scrollable" centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>{modalTitle}</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setModalState(false)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <form className="text-center" onSubmit={(e) => handleSubmit(e)}>
                <p>Provide a title for your note</p>
                <MDBInput inputRef={titleRef} type="text" />
                <p className="mt-3">Provide a text for your note</p>
                <MDBInput inputRef={textRef} className="my-3" textarea />
                <p>Select a color for your note:</p>
                <SwatchesPicker
                  className="mx-auto"
                  color={color}
                  height={150}
                  onChangeComplete={handleColor}
                />
                <p className="my-3">Select a text color for your note:</p>
                <SwatchesPicker
                  className="mx-auto"
                  color={textColor}
                  height={150}
                  onChangeComplete={handleTextColor}
                />
                <MDBBtn type="submit" className="mt-4">
                  Submit
                </MDBBtn>
              </form>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={() => setModalState(false)}>
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </MDBContainer>
  );
};

export default App;

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Modal,
  TextField,
  Box,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Visibility, Edit, Delete, Close } from "@mui/icons-material";
import TablePaginationComponent from "./TablePagination";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { app } from "../firebase";

const firestore = getFirestore(app);

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    firstname: "",
    lastname: "",
    fatherName: "",
    dob: "",
    class: "",
    section: "",
    rollNo: "",
    contactNo: "",
    gender: "",
    city: "",
    state: "",
    nationality: "",
  });
  const [viewStudent, setViewStudent] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //putting the data in firestore
  const writeData = async () => {
    const result = await addDoc(collection(firestore, "students"), {
        firstname: newStudent.firstname,
        lastname: newStudent.lastname,
        fatherName: newStudent.fatherName,
        dob: newStudent.dob,
        class: newStudent.class,
        section: newStudent.section,
        rollNo: newStudent.rollNo,
        contactNo: newStudent.contactNo,
        gender: newStudent.gender,
        city: newStudent.city,
        state: newStudent.state,
        nationality: newStudent.nationality,
    });
    console.log("result" , result);
    
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editStudent) {
      setEditStudent((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewStudent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const newId = students.length + 1;
    setStudents([...students, { ...newStudent, id: newId }]);
    setNewStudent({
      firstname: "",
      lastname: "",
      fatherName: "",
      dob: "",
      class: "",
      section: "",
      rollNo: "",
      contactNo: "",
      gender: "",
      city: "",
      state: "",
      nationality: "",
    });
    setOpenModal(false);
    writeData();
  };

  const handleViewStudent = (student) => {
    setViewStudent(student);
    setOpenViewModal(true);
  };

  const handleEditStudent = (student) => {
    setEditStudent(student);
    setOpenModal(true);
  };

  const handleUpdateStudent = (e) => {
    e.preventDefault();
    if (editStudent) {
      setStudents(
        students.map((student) =>
          student.id === editStudent.id ? { ...editStudent } : student
        )
      );
    }
    setEditStudent(null);
    setOpenModal(false);
    writeData();
  };

  const handleDeleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  // Pagination handlers
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  // Get paginated data
  const paginatedStudents = students.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={3}>
      <h1>Student List</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
      >
        Add Student
      </Button>

      {/* Student Table */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Roll No</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.firstname +" "+ student.lastname}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>{student.rollNo}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewStudent(student)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditStudent(student)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Component */}
      <TablePaginationComponent
        count={students.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Add/Edit Student Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%", // Adjust to make it responsive
            maxWidth: 600, // Wider maxWidth for two-column layout
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh", // Prevents overflowing the viewport height
            overflowY: "auto", // Enables scrolling if content overflows
          }}
        >
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "text.primary",
            }}
          >
            <Close />
          </IconButton>

          <h2 style={{ textAlign: "center" }}>
            {editStudent ? "Edit Student" : "Add Student"}
          </h2>
          <form onSubmit={editStudent ? handleUpdateStudent : handleAddStudent}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr", // Two columns
                gap: 2, // Space between fields
              }}
            >
              {[
                { label: "First Name", name: "firstname" },
                { label: "Last Name", name: "lastname" },
                { label: "Father's Name", name: "fatherName" },
                { label: "Date of Birth", name: "dob", type: "date" },
                { label: "Class", name: "class" },
                { label: "Section", name: "section" },
                { label: "Roll No", name: "rollNo" },
                { label: "Contact No", name: "contactNo" },
                { label: "Gender", name: "gender" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "Nationality", name: "nationality" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={
                    editStudent
                      ? editStudent[field.name]
                      : newStudent[field.name]
                  }
                  onChange={handleInputChange}
                  InputLabelProps={
                    field.type === "date" ? { shrink: true } : {}
                  }
                />
              ))}
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3 }}
            >
              {editStudent ? "Update" : "Submit"}
            </Button>
          </form>
        </Box>
      </Modal>

      {/* View Student Dialog */}
      <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <DialogTitle>
          View Student
          <IconButton
            onClick={() => setOpenViewModal(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "text.primary",
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {viewStudent && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr", // Two columns
                gap: 2, // Space between items
              }}
            >
              {Object.keys(viewStudent).map((key) => (
                <Box
                  key={key}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <strong style={{ fontSize: "0.9rem", color: "gray" }}>
                    {key.replace(/([A-Z])/g, " $1")}:
                  </strong>
                  <span style={{ fontSize: "1rem" }}>{viewStudent[key]}</span>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenViewModal(false)}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentPage;

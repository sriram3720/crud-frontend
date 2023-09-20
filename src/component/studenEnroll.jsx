import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';
import "./index.css"

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ id: null, name: '', course: '', dob: '', phoneno: '' });
  const [editingStudent, setEditingStudent] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const addStudent = async () => {
    try {
      await axios.post('http://localhost:5000/api/students', newStudent);
      fetchStudents();
      setNewStudent({ id: null, name: '', course: '', dob: '', phoneno: '' });
    } catch (error) {
      console.error('Error adding student:', error);
      alert("id is already taken")
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const editStudent = (student) => {
    setEditingStudent(student);
    setNewStudent({ id: student.id, name: student.name, course: student.course, dob: student.dob, phoneno: student.phoneno });
  };
 

  const cancelEdit = () => {
    setEditingStudent(null);
    setNewStudent({ id: null, name: '', course: '', dob: '', phoneno: '' });
  };

  const updateStudent = async () => {
    try {
      await axios.put(`http://localhost:5000/api/students/${editingStudent.id}`, newStudent);
      fetchStudents();
      setEditingStudent(null);
      setNewStudent({ id: null, name: '', course: '', dob: '', phoneno: '' });
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };
  
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'DOB',
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: 'phoneno',
      dataIndex: 'phoneno',
      key: 'phoneno',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, student) => (
        <span>
          <Button type="primary" onClick={() => editStudent(student)}>
            Edit
          </Button>
          <Button type="primary" onClick={() => deleteStudent(student.id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];
  return (
    <div className="container">
      <h1>Student Enrollment</h1>
      <div>
        <h2>{editingStudent ? 'Edit Student' : 'Add Student'}</h2>
        <input
          type="number"
          name="id"
          placeholder="id"
          value={newStudent.id || ''}
          onChange={handleInputChange}
          min="1"
          step="1"
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newStudent.name}
          onChange={handleInputChange}
        />
  
        
<select name="course" id="cars" type="text"   placeholder="Course"  value={newStudent.course}   onChange={handleInputChange}>
  <option value="EEE">EEE</option>
  <option value="ECE">ECE</option>
  <option value="IT">IT</option>
  <option value="BME">BME</option>
  <option value="MECH">MECH</option>
</select>
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={newStudent.dob}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phoneno"
          placeholder="phoneno"
          value={newStudent.phoneno}
          onChange={handleInputChange}
        />
        {editingStudent ? (
          <div>
            <button onClick={updateStudent}>Update</button>
            <button onClick={cancelEdit}>Cancel</button>
          </div>
        ) : (
          <button onClick={addStudent}>Add</button>
        )}
      </div>
      <div>
        <h2>Students List</h2>
        {students.length === 0 ? (
          <p>No students available</p>
        ) : (

        <Table dataSource={students} columns={columns} />
          
        )}
      </div>
    </div>
  );
}

export default StudentManagement;

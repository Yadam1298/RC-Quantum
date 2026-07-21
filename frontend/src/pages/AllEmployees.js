import React, { useEffect, useState } from 'react';
import { employeeAPI } from '../services/api';

import EmployeeTable from '../components/employees/EmployeeTable/EmployeeTable';
import EmployeeFormModal from '../components/employees/EmployeeTable/EmployeeFormModal';
import DeleteDialog from '../components/employees/EmployeeTable/DeleteDialog';
import DeactivateDialog from '../components/employees/EmployeeTable/DeactivateDialog';

const emptyEmployee = {
  empID: '',
  cardUID: '',
  name: '',
  phone: '',
  email: '',
  password: '',
  designation: '',
  role: 'employee',
};

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);

  const [editing, setEditing] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [formData, setFormData] = useState(emptyEmployee);

  // =======================================
  // Load Employees
  // =======================================

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const res = await employeeAPI.getAllEmployees();

      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || 'Unable to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  // =======================================
  // Search
  // =======================================

  const filteredEmployees = employees.filter((emp) => {
    const keyword = search.toLowerCase();

    return (
      emp.name?.toLowerCase().includes(keyword) ||
      emp.empID?.toLowerCase().includes(keyword) ||
      emp.email?.toLowerCase().includes(keyword) ||
      emp.designation?.toLowerCase().includes(keyword)
    );
  });

  // =======================================
  // ADD
  // =======================================

  const handleAdd = () => {
    setEditing(false);

    setFormData(emptyEmployee);

    setShowForm(true);
  };

  // =======================================
  // EDIT
  // =======================================

  const handleEdit = (employee) => {
    setEditing(true);

    setSelectedEmployee(employee);

    setFormData({
      empID: employee.empID,
      cardUID: employee.cardUID,
      name: employee.name,
      phone: employee.phone,
      email: employee.email,
      designation: employee.designation,
      role: employee.role,
      password: '',
    });

    setShowForm(true);
  };

  // =======================================
  // SAVE
  // =======================================

  const handleSave = async () => {
    try {
      if (editing) {
        const payload = {
          cardUID: formData.cardUID,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          designation: formData.designation,
          role: formData.role,
        };

        console.log('UPDATE PAYLOAD');
        console.log(payload);

        await employeeAPI.updateEmployee(selectedEmployee.empID, payload);

        alert('Employee Updated Successfully');
      } else {
        const payload = {
          empID: formData.empID,
          cardUID: formData.cardUID,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          designation: formData.designation,
          role: formData.role,
        };

        console.log('REGISTER PAYLOAD');
        console.log(payload);

        await employeeAPI.addEmployee(payload);

        alert('Employee Added Successfully');
      }

      setShowForm(false);
      setFormData(emptyEmployee);

      loadEmployees();
    } catch (err) {
      console.error(err);

      console.log('Backend Response');
      console.log(err.response?.data);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Operation Failed',
      );
    }
  };

  // =======================================
  // DELETE
  // =======================================

  const handleDelete = async () => {
    try {
      await employeeAPI.deleteEmployee(selectedEmployee.empID);

      alert('Employee Deleted Successfully');

      setShowDelete(false);

      loadEmployees();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || 'Delete Failed');
    }
  };

  // =======================================
  // ACTIVATE / DEACTIVATE
  // =======================================

  const handleDeactivate = async () => {
    try {
      const res = await employeeAPI.toggleStatus(selectedEmployee.empID);

      alert(res.data.message);

      setShowDeactivate(false);

      loadEmployees();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || 'Status Update Failed');
    }
  };

  // =======================================
  // UI
  // =======================================

  return (
    <div
      style={{
        padding: 25,
      }}
    >
      {/* Employee Table */}

      <EmployeeTable
        loading={loading}
        employees={filteredEmployees}
        onEdit={handleEdit}
        onDelete={(employee) => {
          setSelectedEmployee(employee);
          setShowDelete(true);
        }}
        onDeactivate={(employee) => {
          setSelectedEmployee(employee);
          setShowDeactivate(true);
        }}
        handleAdd={handleAdd}
        totalemployees={filteredEmployees.length}
        isMobile={isMobile}
      />

      {/* Add / Edit Modal */}

      <EmployeeFormModal
        open={showForm}
        editing={editing}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
      />

      {/* Delete Dialog */}

      <DeleteDialog
        open={showDelete}
        employee={selectedEmployee}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      {/* Activate / Deactivate */}

      <DeactivateDialog
        open={showDeactivate}
        employee={selectedEmployee}
        onClose={() => setShowDeactivate(false)}
        onConfirm={handleDeactivate}
      />
    </div>
  );
};

export default AllEmployees;

import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

import { DndContext, closestCenter } from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  SortableHeader,
  SortableCell,
} from './SortableHeader';

import SearchBar from './SearchBar';
import ColumnSelector from './ColumnSelector';
import ExportCSV from './ExportCSV';
import Pagination from './Pagination';

const EmployeeTable = ({
  employees,
  loading,
  onEdit,
  onDelete,
  onDeactivate,
  handleAdd,
  totalemployees,
  isMobile,
}) => {
  const navigate = useNavigate(); // Add this hook

  // --- Table state ---
  const [sorting, setSorting] = useState([]);

  const [columnOrder, setColumnOrder] = useState([
    'employee',
    'empID',
    'cardUID',
    'phone',
    'designation',
    'role',
    'status',
    'joined',
    'actions',
  ]);

  const [columnVisibility, setColumnVisibility] = useState({});

  const [globalFilter, setGlobalFilter] = useState('');

  // --- Filtered data ---
  const filteredEmployees = useMemo(() => {
    if (!globalFilter) return employees;
    return employees.filter((emp) =>
      JSON.stringify(emp).toLowerCase().includes(globalFilter.toLowerCase()),
    );
  }, [employees, globalFilter]);

  // --- Navigate to employee profile ---
  const handleEmployeeClick = (employeeId) => {
    navigate(`/dashboard/employee/profile/${employeeId}`);
  };

  // --- Column definitions ---
  const columns = useMemo(
    () => [
      {
        id: 'employee',
        accessorFn: (row) => row.name,
        header: 'Employee',
        cell: ({ row }) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer', // Add pointer cursor
            }}
            onClick={() => handleEmployeeClick(row.empID || row.original.empID)} // Adjust based on your ID field
          >
            <div
              style={{
                width: isMobile ? 24 : 42,
                height: isMobile ? 24 : 42,
                borderRadius: '50%',
                background: '#2563eb',
                color: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 700,
                fontSize: isMobile ? 14 : 16,
              }}
            >
              {row.original.name?.charAt(0)}
            </div>
            <div>
              <strong
                style={{
                  fontSize: isMobile ? 10 : 16,
                  color: '#2563eb',
                  textDecoration: 'none',
                  transition: 'text-decoration 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                {row.original.name}
              </strong>
              <div
                style={{
                  color: '#64748b',
                  fontSize: isMobile ? 8 : 13,
                }}
              >
                {row.original.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'empID',
        header: 'Emp ID',
      },
      {
        accessorKey: 'cardUID',
        header: 'Card UID',
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
      },
      {
        accessorKey: 'designation',
        header: 'Designation',
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ getValue }) => {
          const role = getValue();
          let color = '#16a34a';
          if (role === 'admin') color = '#2563eb';
          if (role === 'superadmin') color = '#dc2626';
          return (
            <span
              style={{
                background: color,
                color: '#fff',
                padding: isMobile ? '3px 8px' : '5px 10px',
                borderRadius: 2,
                fontSize: isMobile ? 8 : 14,
              }}
            >
              {role}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue();
          return (
            <span
              style={{
                background: status === 'active' ? '#DCFCE7' : '#FEE2E2',
                color: status === 'active' ? '#166534' : '#991B1B',
                padding: isMobile ? '4px 8px' : '6px 12px',
                borderRadius: 30,
                fontSize: isMobile ? 8 : 14,
              }}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: 'joined',
        accessorFn: (row) => new Date(row.createdAt),
        header: 'Joined',
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
        sortingFn: 'datetime',
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => {
          const emp = row.original;
          return (
            <div
              style={{
                display: 'flex',
                gap: isMobile ? 2 : 8,
                flexWrap: isMobile ? 'wrap' : 'nowrap',
              }}
            >
              <button
                style={{
                  ...editBtn,
                  padding: isMobile ? '4px 8px' : '7px 12px',
                  fontSize: isMobile ? 8 : 14,
                }}
                onClick={() => onEdit(emp)}
              >
                Edit
              </button>
              <button
                style={{
                  ...deleteBtn,
                  padding: isMobile ? '4px 8px' : '7px 12px',
                  fontSize: isMobile ? 8 : 14,
                }}
                onClick={() => onDelete(emp)}
              >
                Delete
              </button>
              <button
                style={{
                  ...(emp.status === 'active' ? deactivateBtn : activateBtn),
                  padding: isMobile ? '4px 8px' : '7px 12px',
                  fontSize: isMobile ? 8 : 14,
                }}
                onClick={() => onDeactivate(emp)}
              >
                {emp.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete, onDeactivate, isMobile, navigate], // Add navigate to dependencies
  );

  // --- Table instance ---
  const table = useReactTable({
    data: filteredEmployees,
    columns,
    state: {
      sorting,
      columnOrder,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // --- Drag & drop handler ---
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setColumnOrder((cols) => {
      const oldIndex = cols.indexOf(active.id);
      const newIndex = cols.indexOf(over.id);
      return arrayMove(cols, oldIndex, newIndex);
    });
  };

  // --- Loading state ---
  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        Loading Employees...
      </div>
    );
  }

  // --- Main render ---
  return (
    <>
      {/* Header section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 15,
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: '#0f172a',
              fontSize: isMobile ? 9 : 24,
            }}
          >
            Employee Management
          </h2>
          <p
            style={{
              marginTop: 6,
              color: '#64748b',
              fontSize: isMobile ? 8 : 15,
            }}
          >
            Total Employees :<strong> {totalemployees}</strong>
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'flex-start' : 'flex-end',
            alignItems: 'center',
            gap: isMobile ? 2 : 10,
          }}
        >
          <ExportCSV employees={filteredEmployees} isMobile={isMobile} />
          <SearchBar
            value={globalFilter}
            onChange={setGlobalFilter}
            isMobile={isMobile}
          />{' '}
          <ColumnSelector table={table} isMobile={isMobile} />
          <button
            onClick={handleAdd}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 2,
              padding: isMobile ? '4px 8px' : '10px 18px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: isMobile ? 8 : 16,
            }}
          >
            + Add Employee
          </button>
        </div>
      </div>

      {/* Table container with horizontal scroll */}
      <div style={styles.tableContainer}>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columnOrder}
            strategy={horizontalListSortingStrategy}
          >
            <table
              style={{
                ...styles.table,
                fontSize: isMobile ? 9 : 14,
                minWidth: isMobile ? 900 : 1200,
              }}
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <SortableHeader
                        key={header.id}
                        header={header}
                        isMobile={isMobile}
                      />
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <SortableCell
                        key={cell.id}
                        cell={cell}
                        isMobile={isMobile}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>

      {/* Pagination */}
      <Pagination table={table} isMobile={isMobile} />
    </>
  );
};

// --- Static button styles ---
const editBtn = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 2,
  cursor: 'pointer',
};

const deleteBtn = {
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: 2,
  cursor: 'pointer',
};

const deactivateBtn = {
  background: '#ea580c',
  color: '#fff',
  border: 'none',
  borderRadius: 2,
  cursor: 'pointer',
};

const activateBtn = {
  background: '#16a34a',
  color: '#fff',
  border: 'none',
  borderRadius: 2,
  cursor: 'pointer',
};

// --- Static table container styles ---
const styles = {
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    borderRadius: 2,
    background: '#fff',
    boxShadow: '0 8px 24px rgba(15,23,42,.08)',
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    whiteSpace: 'nowrap',
  },
};

export default EmployeeTable;

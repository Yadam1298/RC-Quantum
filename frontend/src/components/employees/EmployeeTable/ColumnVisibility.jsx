import React, { useState, useRef, useEffect } from 'react';

const ColumnVisibility = ({ table }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', close);

    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div
      ref={menuRef}
      style={{
        position: 'relative',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: '10px 18px',
          borderRadius: 8,
          border: '1px solid #d1d5db',
          cursor: 'pointer',
          background: '#fff',
          fontWeight: 600,
        }}
      >
        ☰ Columns
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 45,
            right: 0,
            width: 220,
            background: '#fff',
            borderRadius: 10,
            boxShadow: '0 10px 30px rgba(0,0,0,.15)',
            padding: 15,
            zIndex: 999,
          }}
        >
          {table
            .getAllLeafColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <label
                key={column.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 10,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />

                {column.columnDef.header}
              </label>
            ))}
        </div>
      )}
    </div>
  );
};

export default ColumnVisibility;

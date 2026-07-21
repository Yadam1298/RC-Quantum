import React, { useState, useRef, useEffect } from 'react';

const ColumnSelector = ({ table, isMobile }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [open]);

  // Calculate dropdown position based on button position
  const getDropdownPosition = () => {
    if (!buttonRef.current) return {};

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Default position (below the button)
    let top = rect.bottom + 5;
    let left = rect.left;
    let transformOrigin = 'top left';

    // Check if dropdown would go below viewport
    const dropdownHeight = 300; // Approximate height
    if (top + dropdownHeight > viewportHeight) {
      top = rect.top - dropdownHeight - 5; // Show above
      transformOrigin = 'bottom left';
    }

    // Check if dropdown would go beyond right edge
    const dropdownWidth = 220;
    if (left + dropdownWidth > viewportWidth) {
      left = viewportWidth - dropdownWidth - 10; // Align to right edge
    }

    // Check if dropdown would go beyond left edge
    if (left < 10) {
      left = 10;
    }

    return {
      position: 'fixed',
      top: top,
      left: left,
      width: 220,
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      padding: 15,
      boxShadow: '0 5px 20px rgba(0,0,0,.15)',
      zIndex: 9999,
      maxHeight: 300,
      overflowY: 'auto',
      transformOrigin: transformOrigin,
    };
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        style={{
          padding: isMobile ? '4px 8px' : '10px 15px',
          background: '#0f172a',
          color: '#fff',
          border: 'none',
          borderRadius: 2,
          cursor: 'pointer',
          fontSize: isMobile ? 8 : 15,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {isMobile ? '📊' : 'Columns'}
        <span style={{ fontSize: isMobile ? 8 : 12 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={getDropdownPosition()}>
          {table.getAllLeafColumns().map((column) => (
            <label
              key={column.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 10,
                cursor: 'pointer',
                fontSize: isMobile ? 12 : 14,
                padding: isMobile ? '4px 0' : '2px 0',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
                style={{
                  marginRight: 10,
                  width: 16,
                  height: 16,
                  cursor: 'pointer',
                  accentColor: '#2563eb',
                }}
              />
              {column.columnDef.header}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnSelector;

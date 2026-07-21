import React, { useState, useRef, useEffect } from 'react';

const Pagination = ({ table, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentPageSize = table.getState().pagination.pageSize;
  const pageSizeOptions = [5, 10, 20, 30, 50];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleSelect = (pageSize) => {
    table.setPageSize(pageSize);
    setIsOpen(false);
  };

  return (
    <div
      style={{
        marginTop: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 15,
        fontSize: isMobile ? 8 : 16,
      }}
    >
      <div
        style={{
          fontSize: isMobile ? 10 : 16,
          color: '#374151',
        }}
      >
        Page{' '}
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </div>

      <div
        style={{
          display: 'flex',
          gap: isMobile ? 4 : 10,
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
          style={{
            padding: isMobile ? '4px 6px' : '6px 12px',
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
            opacity: table.getCanPreviousPage() ? 1 : 0.5,
            fontSize: isMobile ? 8 : 14,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (table.getCanPreviousPage()) {
              e.currentTarget.style.background = '#e5e7eb';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f3f4f6';
          }}
        >
          {'<<'}
        </button>

        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          style={{
            padding: isMobile ? '4px 6px' : '6px 12px',
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
            opacity: table.getCanPreviousPage() ? 1 : 0.5,
            fontSize: isMobile ? 8 : 14,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (table.getCanPreviousPage()) {
              e.currentTarget.style.background = '#e5e7eb';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f3f4f6';
          }}
        >
          {'<'}
        </button>

        <span
          style={{
            padding: isMobile ? '2px 6px' : '4px 10px',
            fontSize: isMobile ? 10 : 14,
            fontWeight: 600,
            color: '#2563eb',
            minWidth: isMobile ? 30 : 40,
            textAlign: 'center',
          }}
        >
          {table.getState().pagination.pageIndex + 1}
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          style={{
            padding: isMobile ? '4px 6px' : '6px 12px',
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
            opacity: table.getCanNextPage() ? 1 : 0.5,
            fontSize: isMobile ? 8 : 14,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (table.getCanNextPage()) {
              e.currentTarget.style.background = '#e5e7eb';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f3f4f6';
          }}
        >
          {'>'}
        </button>

        <button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
          style={{
            padding: isMobile ? '4px 6px' : '6px 12px',
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
            opacity: table.getCanNextPage() ? 1 : 0.5,
            fontSize: isMobile ? 8 : 14,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (table.getCanNextPage()) {
              e.currentTarget.style.background = '#e5e7eb';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f3f4f6';
          }}
        >
          {'>>'}
        </button>
      </div>

      {/* Custom Dropdown */}
      <div
        ref={dropdownRef}
        style={{
          position: 'relative',
          display: 'inline-block',
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: isMobile ? '4px 10px' : '8px 16px',
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: isMobile ? 10 : 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minWidth: isMobile ? 80 : 120,
            justifyContent: 'space-between',
            transition: 'all 0.2s',
            color: '#374151',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
        >
          <span>Show {currentPageSize}</span>
          <span
            style={{
              fontSize: isMobile ? 8 : 12,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            ▼
          </span>
        </button>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              marginTop: 4,
              background: '#fff',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              minWidth: isMobile ? 80 : 120,
              overflow: 'hidden',
            }}
          >
            {pageSizeOptions.map((pageSize) => (
              <div
                key={pageSize}
                onClick={() => handleSelect(pageSize)}
                style={{
                  padding: isMobile ? '6px 12px' : '8px 16px',
                  cursor: 'pointer',
                  fontSize: isMobile ? 10 : 14,
                  background:
                    currentPageSize === pageSize ? '#2563eb' : 'transparent',
                  color: currentPageSize === pageSize ? '#fff' : '#374151',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (currentPageSize !== pageSize) {
                    e.currentTarget.style.background = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPageSize !== pageSize) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                Show {pageSize}
                {currentPageSize === pageSize && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: isMobile ? 8 : 12,
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;

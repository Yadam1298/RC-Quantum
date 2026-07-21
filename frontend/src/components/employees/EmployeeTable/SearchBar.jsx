import React from 'react';

const SearchBar = ({ value, onChange, isMobile }) => {
  return (
    <input
      type="text"
      placeholder={isMobile ? '🔍 Search...' : '🔍 Search employees...'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: isMobile ? 100 : 320,
        padding: isMobile ? '4px 8px' : '10px 15px',
        borderRadius: 2,
        border: '1px solid #d1d5db',
        outline: 'none',
        fontSize: isMobile ? 8 : 14,
        transition: 'width 0.3s ease',
        minWidth: isMobile ? 100 : 200,
      }}
    />
  );
};

export default SearchBar;

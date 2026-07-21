import React from 'react';
import { flexRender } from '@tanstack/react-table';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ======================================
// Sortable Header
// Click = Sort
// Drag Icon = Reorder Columns
// ======================================

export const SortableHeader = ({ header, isMobile }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: header.column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    background: '#0f172a',
    color: '#fff',
    padding: isMobile ? '4px 8px' : '14px 16px',
    borderBottom: '1px solid #334155',
    fontSize: isMobile ? 8 : 15,
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  const sortState = header.column.getIsSorted();

  const sortIcon = sortState === 'asc' ? '▲' : sortState === 'desc' ? '▼' : '⇅';

  return (
    <th ref={setNodeRef} style={style}>
      <div
        onClick={header.column.getToggleSortingHandler()}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: isMobile ? 6 : 12,
          cursor: header.column.getCanSort() ? 'pointer' : 'default',
          width: '100%',
        }}
      >
        {/* Header Text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}

          {header.column.getCanSort() && (
            <span
              style={{
                fontSize: 12,
                opacity: sortState ? 1 : 0.5,
              }}
            >
              {sortIcon}
            </span>
          )}
        </div>

        {/* Drag Handle */}
        <span
          {...attributes}
          {...listeners}
          title="Drag to reorder column"
          style={{
            cursor: 'grab',
            fontSize: isMobile ? 9 : 18,
            opacity: 0.8,
            padding: '0 4px',
          }}
        >
          ⋮⋮
        </span>
      </div>
    </th>
  );
};

// ======================================
// Sortable Cell
// ======================================

export const SortableCell = ({ cell, isMobile }) => {
  const { setNodeRef, transform, transition } = useSortable({
    id: cell.column.id,
  });

  return (
    <td
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        padding: isMobile ? '6px 8px' : '14px 16px',
        borderBottom: '1px solid #e5e7eb',
        whiteSpace: 'nowrap',
        fontSize: isMobile ? 8 : 16,
      }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};

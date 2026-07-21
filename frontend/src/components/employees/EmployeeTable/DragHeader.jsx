import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DragHeader = ({ header }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: header.column.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    userSelect: 'none',
    background: '#0f172a',
    color: '#fff',
    padding: 16,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    borderRight: '1px solid rgba(255,255,255,.1)',
  };

  return (
    <th ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        ☰{header.isPlaceholder ? null : header.column.columnDef.header}
      </div>
    </th>
  );
};

export default DragHeader;

import React, { useState } from 'react';
import { useMultiColumnPicker } from './useMultiColumnPicker';
import type { MultiColumnPickerProps, PickerNode } from './types';

const ColumnItem: React.FC<{
  node: PickerNode;
  isSelected: boolean;
  onClick: () => void;
}> = ({ node, isSelected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
        isSelected
          ? 'bg-[#FFF36D] text-black'
          : 'text-gray-800 hover:bg-[#fff9a8]'
      }`}
    >
      {node.label}
    </button>
  );
};

const PickerColumn: React.FC<{
  nodes: PickerNode[];
  selectedId?: string;
  onSelect: (node: PickerNode) => void;
  initialVisibleItems: number;
}> = ({ nodes, selectedId, onSelect, initialVisibleItems }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleItems = isExpanded ? nodes : nodes.slice(0, initialVisibleItems);
  const canExpand = nodes.length > initialVisibleItems;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex-grow">
        {visibleItems.map(node => (
          <ColumnItem
            key={node.id}
            node={node}
            isSelected={node.id === selectedId}
            onClick={() => onSelect(node)}
          />
        ))}
      </div>
      {canExpand && !isExpanded && (
        <div className="flex-shrink-0 pt-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full text-center py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-md"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export const MultiColumnPicker: React.FC<MultiColumnPickerProps> = ({
  label,
  placeholder,
  data,
  valueIds,
  onChange,
  closeOnLeafSelect = false,
  initialVisibleItems = 5,
  renderValue,
}) => {
  const {
    isOpen,
    togglePicker,
    panelRef,
    triggerRef,
    columns,
    selectedPath,
    handleSelect,
  } = useMultiColumnPicker(data, valueIds, onChange, closeOnLeafSelect);

  const displayValue = renderValue
    ? renderValue(selectedPath)
    : selectedPath.map(p => p.label).join(' / ');

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <button
        ref={triggerRef}
        type="button"
        onClick={togglePicker}
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <span className={displayValue ? 'text-gray-900' : 'text-gray-400'}>
          {displayValue || placeholder}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.53a.75.75 0 011.06 0L10 15.19l2.67-2.66a.75.75 0 111.06 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="absolute z-10 mt-1 w-auto min-w-full rounded-md bg-[#EAFBFF] shadow-lg"
          style={{ minWidth: 'max-content' }}
        >
          <div className="flex h-64 max-h-64">
            {columns.map((columnNodes, colIndex) => (
              <div key={colIndex} className="w-48 border-r border-gray-200/50 last:border-r-0">
                <PickerColumn
                  nodes={columnNodes}
                  selectedId={selectedPath[colIndex]?.id}
                  onSelect={(node) => handleSelect(node, colIndex)}
                  initialVisibleItems={initialVisibleItems}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

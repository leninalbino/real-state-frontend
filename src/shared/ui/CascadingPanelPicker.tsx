import React, { useState, useEffect, useCallback, useRef, useMemo, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import type { PickerNode } from './MultiColumnPicker/types'; // Reuse the interface

export interface CascadingPanelPickerProps {
  trigger: React.ReactNode;
  data: PickerNode[];
  selectionMode: "single" | "multiple";
  value: string[];
  onChange: (selectedLeafIds: string[], selectedLeafNodes: PickerNode[]) => void;
  initialVisibleItems?: number;
  closeOnLeafSelect?: boolean;
  fullWidth?: boolean;
}

const ColumnItem: React.FC<{
  node: PickerNode;
  isSelected: boolean;
  isInPath: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onHover: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ node, isSelected, isInPath, onClick, onHover }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
        isSelected
          ? 'bg-[#FFF36D] text-black'
          : isInPath
          ? 'bg-blue-100 text-gray-800'
          : 'text-gray-800 hover:bg-[#fff9a8]'
      }`}
    >
      {node.label}
    </button>
  );
};

const PickerColumn: React.FC<{
  nodes: PickerNode[];
  selectedIdSet: Set<string>;
  pathIds: string[];
  onSelect: (node: PickerNode) => void;
  onHover: (node: PickerNode, event: React.MouseEvent<HTMLButtonElement>) => void;
  initialVisibleItems: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}> = ({ nodes, selectedIdSet, pathIds, onSelect, onHover, initialVisibleItems, isExpanded, onToggleExpanded }) => {
  const visibleItems = isExpanded ? nodes : nodes.slice(0, initialVisibleItems);
  const canExpand = nodes.length > initialVisibleItems;

  return (
    <div
      className={`flex flex-col h-full bg-[#EAFBFF] ${
        isExpanded ? 'max-h-60 overflow-y-auto' : 'overflow-y-hidden'
      }`}
    >
      <div className="flex-grow">
        {visibleItems.map((node) => (
          <ColumnItem
            key={node.id}
            node={node}
            isSelected={selectedIdSet.has(node.id)}
            isInPath={pathIds.includes(node.id)}
            onClick={() => onSelect(node)}
            onHover={(event) => onHover(node, event)}
          />
        ))}
      </div>
      {canExpand && (
        <div className="flex-shrink-0 pt-2">
          <button
            onClick={onToggleExpanded}
            className="w-full text-center py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-md"
          >
            {isExpanded ? '-' : '+'}
          </button>
        </div>
      )}
    </div>
  );
};

export const CascadingPanelPicker: React.FC<CascadingPanelPickerProps> = ({
  trigger,
  data,
  selectionMode,
  value,
  onChange,
  initialVisibleItems = 5,
  closeOnLeafSelect = selectionMode === 'single',
  fullWidth = false,
}) => {
  const columnWidth = 192;
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<PickerNode[]>([]);
  const [selectedLeafIds, setSelectedLeafIds] = useState<string[]>(value);
  const [expandedStates, setExpandedStates] = useState<Record<number, boolean>>({});
  const [columnTops, setColumnTops] = useState<Record<number, number>>({});
  const [panelPosition, setPanelPosition] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const [panelReady, setPanelReady] = useState(false);
  const instanceIdRef = useRef(`cascading-${Math.random().toString(36).slice(2)}`);
  
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const getSelectedLeafNodes = useCallback((ids: string[]) => {
    const allLeaves: PickerNode[] = [];
    const traverse = (nodes: PickerNode[]) => {
      nodes.forEach(node => {
        if (!node.children || node.children.length === 0) {
          allLeaves.push(node);
        } else {
          traverse(node.children);
        }
      });
    };
    traverse(data);
    return allLeaves.filter(node => ids.includes(node.id));
  }, [data]);

  const closePicker = useCallback(() => {
    setIsOpen(false);
  }, []);

  const columns = useMemo(() => {
    const cols: PickerNode[][] = [data];
    let currentLevel = data;
    for (let i = 0; i < currentPath.length; i++) {
      const nodeInPath = currentPath[i];
      const foundNode = currentLevel.find(n => n.id === nodeInPath.id);
      if (foundNode?.children && foundNode.children.length > 0) {
        cols.push(foundNode.children);
        currentLevel = foundNode.children;
      } else {
        break; 
      }
    }
    return cols;
  }, [data, currentPath]);

  const selectedIdSet = useMemo(() => {
    const selectedIds = new Set(selectedLeafIds);
    const highlighted = new Set<string>();

    const visit = (node: PickerNode): boolean => {
      let hasSelected = selectedIds.has(node.id);
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          if (visit(child)) {
            hasSelected = true;
          }
        }
      }
      if (hasSelected) {
        highlighted.add(node.id);
      }
      return hasSelected;
    };

    data.forEach(visit);
    return highlighted;
  }, [data, selectedLeafIds]);

  const handleSelect = useCallback((node: PickerNode) => {
    const isLeaf = !node.children || node.children.length === 0;

    if (isLeaf) {
      let newSelected;
      if (selectionMode === 'multiple') {
        newSelected = selectedLeafIds.includes(node.id)
          ? selectedLeafIds.filter(id => id !== node.id)
          : [...selectedLeafIds, node.id];
      } else {
        newSelected = [node.id];
      }
      setSelectedLeafIds(newSelected);
      onChange(newSelected, getSelectedLeafNodes(newSelected));
      if (closeOnLeafSelect) {
        closePicker();
      }
    }
    else {
      return;
    }
  }, [selectedLeafIds, selectionMode, onChange, getSelectedLeafNodes, closeOnLeafSelect, closePicker]);

  const handleHover = useCallback((node: PickerNode, colIndex: number, event: React.MouseEvent<HTMLButtonElement>) => {
    const hasChildren = node.children && node.children.length > 0;
    if (!hasChildren) {
      return;
    }

    const newPath = [...currentPath.slice(0, colIndex), node];
    setCurrentPath(newPath);

    const itemElement = event.currentTarget;
    if (itemElement && panelRef.current) {
      const panelRect = panelRef.current.getBoundingClientRect();
      const itemRect = itemElement.getBoundingClientRect();
      const top = itemRect.top - panelRect.top;
      setColumnTops(prev => ({ ...prev, [colIndex + 1]: top }));
    }
  }, [currentPath]);

  const updatePanelPosition = useCallback(() => {
    if (!triggerRef.current) {
      return;
    }
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const panelWidth = columns.length * columnWidth;
    const margin = 8;
    const shouldFlip = triggerRect.left + panelWidth > window.innerWidth - margin;
    const desiredLeft = shouldFlip ? triggerRect.right - panelWidth : triggerRect.left;
    const left = Math.min(Math.max(desiredLeft, margin), window.innerWidth - panelWidth - margin);
    const top = triggerRect.bottom + 4;
    setPanelPosition({ left, top });
  }, [columns.length, columnWidth]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    updatePanelPosition();
    const handleRelayout = () => updatePanelPosition();
    window.addEventListener('resize', handleRelayout);
    window.addEventListener('scroll', handleRelayout, true);
    return () => {
      window.removeEventListener('resize', handleRelayout);
      window.removeEventListener('scroll', handleRelayout, true);
    };
  }, [isOpen, updatePanelPosition]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }
    updatePanelPosition();
    setPanelReady(true);
  }, [isOpen, updatePanelPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        closePicker();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closePicker]);

  useEffect(() => {
    const handleOpenEvent = (event: Event) => {
      if (!isOpen) {
        return;
      }
      const detail = (event as CustomEvent<{ id: string }>).detail;
      if (detail?.id && detail.id !== instanceIdRef.current) {
        closePicker();
      }
    };
    window.addEventListener('cascading-picker-open', handleOpenEvent as EventListener);
    return () => window.removeEventListener('cascading-picker-open', handleOpenEvent as EventListener);
  }, [isOpen, closePicker]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePicker();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closePicker]);

  const togglePicker = () => {
    if (!isOpen) {
      setCurrentPath([]);
      setColumnTops({});
      setExpandedStates({});
      setPanelReady(false);
      window.dispatchEvent(new CustomEvent('cascading-picker-open', { detail: { id: instanceIdRef.current } }));
    }
    setIsOpen(prev => !prev);
  };

  return (
    <div className={fullWidth ? "relative w-full" : "relative"}>
      <div ref={triggerRef} onClick={togglePicker} className={fullWidth ? "w-full" : ""}>
        {trigger}
      </div>
      {isOpen && panelReady &&
        createPortal(
          <div
            ref={panelRef}
            className="fixed z-50 inline-flex bg-[#EAFBFF] shadow-lg"
            style={{
              width: 'fit-content',
              left: panelPosition.left,
              top: panelPosition.top,
            }}
          >
            {columns.map((columnNodes, colIndex) => (
              <div
                key={colIndex}
                className={`w-48 border-r border-gray-200/50 last:border-r-0 ${colIndex > 0 ? 'absolute' : 'relative'}`}
                style={colIndex > 0 ? { left: `${colIndex * 192}px`, top: columnTops[colIndex] || 0 } : {}}
              >
                <PickerColumn
                  nodes={columnNodes}
                  selectedIdSet={selectedIdSet}
                  pathIds={currentPath.map(p => p.id)}
                  onSelect={(node) => handleSelect(node)}
                  onHover={(node, event) => handleHover(node, colIndex, event)}
                  initialVisibleItems={initialVisibleItems}
                  isExpanded={expandedStates[colIndex] || false}
                  onToggleExpanded={() => setExpandedStates(prev => ({ ...prev, [colIndex]: !prev[colIndex] }))}
                />
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

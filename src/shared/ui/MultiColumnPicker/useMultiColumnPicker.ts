import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { PickerNode } from './types';

const findPathFromIds = (nodes: PickerNode[], ids: string[]): PickerNode[] => {
  if (!ids || ids.length === 0) {
    return [];
  }

  const path: PickerNode[] = [];
  let currentNodes = nodes;

  for (const id of ids) {
    const foundNode = currentNodes?.find(node => node.id === id);
    if (foundNode) {
      path.push(foundNode);
      currentNodes = foundNode.children || [];
    } else {
      // Path is broken, return what we have so far
      return path;
    }
  }

  return path;
};

export const useMultiColumnPicker = (
  data: PickerNode[],
  valueIds: string[],
  onChange: (path: PickerNode[], ids: string[]) => void,
  closeOnLeafSelect?: boolean
) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const committedPath = useMemo(() => findPathFromIds(data, valueIds), [data, valueIds]);
  const [uncommittedPath, setUncommittedPath] = useState<PickerNode[] | null>(null);

  const selectedPath = uncommittedPath || committedPath;

  const closePicker = useCallback(() => {
    setIsOpen(false);
    setUncommittedPath(null);
  }, []);

  const handleSelect = useCallback((node: PickerNode, columnIndex: number) => {
    const newPath = [...selectedPath.slice(0, columnIndex), node];

    const isLeaf = !node.children || node.children.length === 0;
    if (isLeaf) {
      const newIds = newPath.map(p => p.id);
      onChange(newPath, newIds);
      setUncommittedPath(null); 
      if (closeOnLeafSelect) {
        closePicker();
      }
    } else {
      setUncommittedPath(newPath);
    }
  }, [selectedPath, onChange, closeOnLeafSelect, closePicker]);

  const columns = useMemo(() => {
    const cols: PickerNode[][] = [data];
    const currentPath = selectedPath;

    for (let i = 0; i < currentPath.length; i++) {
      const node = currentPath[i];
      if (node.children && node.children.length > 0) {
        cols.push(node.children);
      } else {
        break; 
      }
    }
    return cols;
  }, [data, selectedPath]);

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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closePicker]);

  const togglePicker = () => {
    setIsOpen(prev => {
      const nextIsOpen = !prev;
      if (!nextIsOpen) {
        setUncommittedPath(null);
      }
      return nextIsOpen;
    });
  };

  return {
    isOpen,
    togglePicker,
    panelRef,
    triggerRef,
    columns,
    selectedPath,
    handleSelect,
  };
};

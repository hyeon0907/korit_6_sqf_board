import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ResizableDraggableBox = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startLeft, setStartLeft] = useState(0);
  const [startTop, setStartTop] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  const boxRef = useRef(null);
  const resizeHandleRef = useRef(null);

  // 드래그 시작 핸들러
  const handleMouseDown = useCallback((e) => {
    if (e.target !== resizeHandleRef.current) {
      setIsDragging(true);
      setStartX(e.clientX);
      setStartY(e.clientY);
      const box = boxRef.current;
      setStartLeft(box.offsetLeft);
      setStartTop(box.offsetTop);
    } 
  }, []);

  // 드래그 처리
  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const box = boxRef.current;
      box.style.left = `${startLeft + deltaX}px`;
      box.style.top = `${startTop + deltaY}px`;
    } else if (isResizing) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const box = boxRef.current;
      box.style.width = `${startWidth + deltaX}px`;
      box.style.height = `${startHeight + deltaY}px`;
    }
  }, [isDragging, isResizing, startX, startY, startLeft, startTop, startWidth, startHeight]);

  // 드래그 종료 핸들러
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    } else if (isResizing) {
      setIsResizing(false);
    }
  }, [isDragging, isResizing]);

  // 이펙트로 마우스 이벤트 추가 및 제거
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // 크기 조절 핸들 시작 핸들러
  const handleResizeMouseDown = useCallback((e) => {
    setIsResizing(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    const box = boxRef.current;
    setStartWidth(box.offsetWidth);
    setStartHeight(box.offsetHeight);
  }, []);

  return (
    <StyledBox
      ref={boxRef}
      onMouseDown={handleMouseDown}
      className="resizable-draggable-box"
    >
      이 박스의 크기와 위치를 조절할 수 있습니다.
      <ResizeHandle
        ref={resizeHandleRef}
        className="resize-handle"
        onMouseDown={handleResizeMouseDown}
      />
    </StyledBox>
  );
};

// Styled-components로 스타일 정의
const StyledBox = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  background-color: #f0f0f0;
  border: 1px solid #000;
  overflow: auto;
  cursor: move;
  box-sizing: border-box;
`;

const ResizeHandle = styled.div`
  width: 20px;
  height: 20px;
  background-color: #000;
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
`;

export default ResizableDraggableBox;

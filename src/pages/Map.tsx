import { useEffect, useRef, useState } from 'react';
import { useMapStore } from '../stores/mapStore';
import './Map.css';

function Map() {
  const villages = useMapStore((state) => state.villages);
  const playerVillage = useMapStore((state) => state.playerVillage);
  const selectedVillage = useMapStore((state) => state.selectedVillage);
  const selectVillage = useMapStore((state) => state.selectVillage);
  const generateMap = useMapStore((state) => state.generateMap);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [offset, setOffset] = useState({ x: -450, y: -450 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (villages.length === 0) {
      generateMap();
    }
  }, [villages, generateMap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#e8f5e9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#c8e6c9';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw player village
    const px = playerVillage.x + offset.x;
    const py = playerVillage.y + offset.y;
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(px, py, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(playerVillage.name, px, py + 20);

    // Draw other villages
    villages.forEach((village) => {
      const vx = village.x + offset.x;
      const vy = village.y + offset.y;
      
      const isSelected = selectedVillage?.id === village.id;
      ctx.fillStyle = isSelected ? '#FF5722' : '#FFC107';
      ctx.beginPath();
      ctx.arc(vx, vy, isSelected ? 8 : 6, 0, Math.PI * 2);
      ctx.fill();
      
      if (isSelected) {
        ctx.fillStyle = '#000';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(village.name, vx, vy + 20);
      }
    });
  }, [villages, playerVillage, offset, selectedVillage]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on any village
    let clicked = false;
    villages.forEach((village) => {
      const vx = village.x + offset.x;
      const vy = village.y + offset.y;
      const distance = Math.sqrt((x - vx) ** 2 + (y - vy) ** 2);
      
      if (distance <= 8) {
        selectVillage(village);
        clicked = true;
      }
    });

    if (!clicked) {
      selectVillage(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      setIsDragging(true);
      setOffset({
        x: offset.x + dx,
        y: offset.y + dy,
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(false);
    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const dx = touch.clientX - dragStart.x;
    const dy = touch.clientY - dragStart.y;
    
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      setIsDragging(true);
      setOffset({
        x: offset.x + dx,
        y: offset.y + dy,
      });
      setDragStart({ x: touch.clientX, y: touch.clientY });
    }
  };

  return (
    <div className="page map-page">
      <div className="page-header">
        <h1 className="page-title">🗺️ Map</h1>
        <p className="page-subtitle">Explore and find targets</p>
      </div>

      <div className="map-container">
        <canvas
          ref={canvasRef}
          width={350}
          height={400}
          className="map-canvas"
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        />
      </div>

      {selectedVillage && (
        <div className="village-info">
          <h3 className="info-title">{selectedVillage.name}</h3>
          <div className="info-details">
            <div>Position: ({selectedVillage.x}, {selectedVillage.y})</div>
            <div>Owner: Player {selectedVillage.playerId}</div>
          </div>
          <button
            className="button"
            onClick={() => {
              // Navigate to rally point would be handled by router
              window.location.hash = '/rally';
            }}
          >
            Attack This Village
          </button>
        </div>
      )}

      <div className="map-hint">
        💡 Drag to pan, tap villages to select
      </div>
    </div>
  );
}

export default Map;

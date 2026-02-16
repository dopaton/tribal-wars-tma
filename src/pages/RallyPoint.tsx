import { useState, useEffect } from 'react';
import { useMapStore } from '../stores/mapStore';
import { useUnitStore } from '../stores/unitStore';
import { useAttackStore } from '../stores/attackStore';
import { UNITS } from '../utils/constants';
import { formatTime } from '../utils/game';
import './RallyPoint.css';

function RallyPoint() {
  const selectedVillage = useMapStore((state) => state.selectedVillage);
  const units = useUnitStore((state) => state.units);
  const attacks = useAttackStore((state) => state.attacks);
  const launchAttack = useAttackStore((state) => state.launchAttack);
  
  const [attackUnits, setAttackUnits] = useState<Record<string, number>>({});
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUnitChange = (unitId: string, value: number) => {
    const maxUnits = units[unitId] || 0;
    const amount = Math.min(Math.max(0, value), maxUnits);
    setAttackUnits({ ...attackUnits, [unitId]: amount });
  };

  const handleLaunchAttack = () => {
    if (!selectedVillage) return;
    
    const hasUnits = Object.values(attackUnits).some(count => count > 0);
    if (!hasUnits) return;

    launchAttack(selectedVillage.id, attackUnits);
    setAttackUnits({});
  };

  const getTotalUnits = () => {
    return Object.values(attackUnits).reduce((sum, count) => sum + count, 0);
  };

  const getAttackRemaining = (attack: { arrivalTime: number }) => {
    const remaining = Math.max(0, attack.arrivalTime - currentTime);
    return Math.floor(remaining / 1000);
  };

  return (
    <div className="page rally-page">
      <div className="page-header">
        <h1 className="page-title">🎯 Rally Point</h1>
        <p className="page-subtitle">Launch attacks on enemy villages</p>
      </div>

      {attacks.length > 0 && (
        <div className="attacks-section">
          <h2 className="section-title">Active Attacks</h2>
          {attacks.map((attack) => (
            <div key={attack.id} className="card attack-card">
              <div className="attack-info">
                <div className="attack-target">
                  Target: Village {attack.targetVillageId}
                </div>
                <div className="attack-status">
                  {attack.status === 'traveling' && (
                    <span className="badge badge-warning">
                      Arrives in {formatTime(getAttackRemaining(attack))}
                    </span>
                  )}
                  {attack.status === 'completed' && (
                    <span className="badge badge-success">Completed</span>
                  )}
                </div>
              </div>
              <div className="attack-units">
                {Object.entries(attack.units).map(([unitId, count]) => (
                  <span key={unitId} className="unit-tag">
                    {UNITS[unitId]?.name}: {count}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="launch-section">
        <h2 className="section-title">Launch Attack</h2>
        
        {selectedVillage ? (
          <div className="target-info card">
            <div className="card-title">Target: {selectedVillage.name}</div>
            <div className="target-coords">
              Position: ({selectedVillage.x}, {selectedVillage.y})
            </div>
          </div>
        ) : (
          <div className="no-target">
            <p>🗺️ Select a village from the Map to attack</p>
          </div>
        )}

        <div className="select-units">
          <h3 className="subsection-title">Select Units</h3>
          {Object.entries(UNITS).map(([unitId, unit]) => {
            const available = units[unitId] || 0;
            const selected = attackUnits[unitId] || 0;
            
            return (
              <div key={unitId} className="unit-selector">
                <div className="unit-info">
                  <span className="unit-name">{unit.name}</span>
                  <span className="unit-available">Available: {available}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max={available}
                  value={selected}
                  onChange={(e) =>
                    handleUnitChange(unitId, parseInt(e.target.value) || 0)
                  }
                  disabled={!selectedVillage || available === 0}
                  className="unit-input"
                />
              </div>
            );
          })}
        </div>

        <div className="attack-summary">
          <div className="summary-item">
            <span>Total Units:</span>
            <span className="summary-value">{getTotalUnits()}</span>
          </div>
          <div className="summary-item">
            <span>Travel Time:</span>
            <span className="summary-value">5 minutes</span>
          </div>
        </div>

        <button
          className="button launch-button"
          onClick={handleLaunchAttack}
          disabled={!selectedVillage || getTotalUnits() === 0}
        >
          {!selectedVillage
            ? 'Select Target First'
            : getTotalUnits() === 0
            ? 'Select Units'
            : `Launch Attack with ${getTotalUnits()} Units`}
        </button>
      </div>
    </div>
  );
}

export default RallyPoint;

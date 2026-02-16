import { useState, useEffect } from 'react';
import { useUnitStore } from '../stores/unitStore';
import { useResourceStore } from '../stores/resourceStore';
import { UNITS } from '../utils/constants';
import { formatResources, formatTime } from '../utils/game';
import './Barracks.css';

function Barracks() {
  const units = useUnitStore((state) => state.units);
  const trainingQueue = useUnitStore((state) => state.trainingQueue);
  const addToQueue = useUnitStore((state) => state.addToQueue);
  const subtractResources = useResourceStore((state) => state.subtractResources);
  const canAfford = useResourceStore((state) => state.canAfford);
  
  const [trainAmount, setTrainAmount] = useState<Record<string, number>>({});
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTrain = (unitId: string) => {
    const amount = trainAmount[unitId] || 1;
    const unit = UNITS[unitId];
    
    const totalCost = {
      wood: unit.woodCost * amount,
      clay: unit.clayCost * amount,
      iron: unit.ironCost * amount,
      food: unit.foodCost * amount,
    };

    if (canAfford(totalCost)) {
      if (subtractResources(totalCost)) {
        addToQueue(unitId, amount);
        setTrainAmount({ ...trainAmount, [unitId]: 1 });
      }
    }
  };

  const getQueueRemaining = () => {
    if (trainingQueue.length === 0) return 0;
    const currentItem = trainingQueue[0];
    return Math.max(0, Math.floor((currentItem.endTime - currentTime) / 1000));
  };

  return (
    <div className="page barracks-page">
      <div className="page-header">
        <h1 className="page-title">⚔️ Barracks</h1>
        <p className="page-subtitle">Train units for battle</p>
      </div>

      {trainingQueue.length > 0 && (
        <div className="training-queue">
          <h2 className="section-title">Training Queue</h2>
          <div className="queue-current">
            <span>Training {trainingQueue[0].amount}x {UNITS[trainingQueue[0].unitId].name}</span>
            <span className="badge badge-info">{formatTime(getQueueRemaining())}</span>
          </div>
          {trainingQueue.length > 1 && (
            <div className="queue-pending">
              +{trainingQueue.length - 1} more in queue
            </div>
          )}
        </div>
      )}

      <div className="current-units">
        <h2 className="section-title">Your Units</h2>
        <div className="units-grid">
          {Object.entries(UNITS).map(([unitId, unit]) => (
            <div key={unitId} className="unit-count">
              <span className="unit-name">{unit.name}</span>
              <span className="unit-number">{units[unitId] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="train-section">
        <h2 className="section-title">Train Units</h2>
        <div className="units-list">
          {Object.entries(UNITS).map(([unitId, unit]) => {
            const amount = trainAmount[unitId] || 1;
            const totalCost = {
              wood: unit.woodCost * amount,
              clay: unit.clayCost * amount,
              iron: unit.ironCost * amount,
              food: unit.foodCost * amount,
            };
            const affordable = canAfford(totalCost);

            return (
              <div key={unitId} className="card unit-card">
                <div className="unit-header">
                  <div>
                    <div className="card-title">{unit.name}</div>
                    <div className="unit-stats">
                      ⚔️ {unit.attack} | 🛡️ {unit.defense}
                    </div>
                  </div>
                </div>

                <div className="card-description">{unit.description}</div>

                <div className="unit-costs">
                  <div className="cost-item">
                    <span>🪵 {formatResources(unit.woodCost * amount)}</span>
                  </div>
                  <div className="cost-item">
                    <span>🧱 {formatResources(unit.clayCost * amount)}</span>
                  </div>
                  <div className="cost-item">
                    <span>⚙️ {formatResources(unit.ironCost * amount)}</span>
                  </div>
                  <div className="cost-item">
                    <span>🌾 {formatResources(unit.foodCost * amount)}</span>
                  </div>
                </div>

                <div className="train-controls">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={amount}
                    onChange={(e) =>
                      setTrainAmount({
                        ...trainAmount,
                        [unitId]: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="train-input"
                  />
                  <button
                    className="button"
                    onClick={() => handleTrain(unitId)}
                    disabled={!affordable}
                  >
                    {affordable ? `Train ${amount}x` : 'Insufficient Resources'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Barracks;

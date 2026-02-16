import { useResourceStore } from '../stores/resourceStore';
import { useBuildingStore } from '../stores/buildingStore';
import { formatResources } from '../utils/game';
import './Village.css';

function Village() {
  const resources = useResourceStore((state) => state.resources);
  const buildings = useBuildingStore((state) => state.buildings);

  return (
    <div className="page village-page">
      <div className="page-header">
        <h1 className="page-title">⚔️ My Village</h1>
      </div>

      <div className="resources-display">
        <div className="resource-card">
          <span className="resource-icon">🪵</span>
          <div className="resource-info">
            <div className="resource-label">Wood</div>
            <div className="resource-value">{formatResources(resources.wood)}</div>
          </div>
        </div>
        <div className="resource-card">
          <span className="resource-icon">🧱</span>
          <div className="resource-info">
            <div className="resource-label">Clay</div>
            <div className="resource-value">{formatResources(resources.clay)}</div>
          </div>
        </div>
        <div className="resource-card">
          <span className="resource-icon">⚙️</span>
          <div className="resource-info">
            <div className="resource-label">Iron</div>
            <div className="resource-value">{formatResources(resources.iron)}</div>
          </div>
        </div>
        <div className="resource-card">
          <span className="resource-icon">🌾</span>
          <div className="resource-info">
            <div className="resource-label">Food</div>
            <div className="resource-value">{formatResources(resources.food)}</div>
          </div>
        </div>
      </div>

      <div className="buildings-section">
        <h2 className="section-title">Buildings</h2>
        <div className="buildings-list">
          {Object.values(buildings).map((building) => (
            <div key={building.id} className="card building-card">
              <div className="building-header">
                <div>
                  <div className="card-title">{building.name}</div>
                  <div className="building-level">Level {building.level}</div>
                </div>
                {building.upgrading && (
                  <span className="badge badge-warning">Upgrading...</span>
                )}
              </div>
              <div className="card-description">{building.description}</div>
              {building.effect && (
                <div className="building-effect">Effect: {building.effect}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Village;

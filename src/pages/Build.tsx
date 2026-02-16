import { useBuildingStore } from '../stores/buildingStore';
import { useResourceStore } from '../stores/resourceStore';
import { formatResources, formatTime } from '../utils/game';
import './Build.css';

function Build() {
  const buildings = useBuildingStore((state) => state.buildings);
  const startUpgrade = useBuildingStore((state) => state.startUpgrade);
  const subtractResources = useResourceStore((state) => state.subtractResources);
  const canAfford = useResourceStore((state) => state.canAfford);

  const handleUpgrade = (buildingId: string) => {
    const building = buildings[buildingId];
    const cost = {
      wood: building.woodCost,
      clay: building.clayCost,
      iron: building.ironCost,
    };

    if (canAfford(cost)) {
      if (subtractResources(cost)) {
        startUpgrade(buildingId);
      }
    }
  };

  const getRemainingTime = (building: any) => {
    if (!building.upgrading || !building.upgradeEndTime) return 0;
    const remaining = Math.max(0, building.upgradeEndTime - Date.now());
    return Math.floor(remaining / 1000);
  };

  return (
    <div className="page build-page">
      <div className="page-header">
        <h1 className="page-title">🏗️ Build</h1>
        <p className="page-subtitle">Upgrade your buildings</p>
      </div>

      <div className="buildings-list">
        {Object.values(buildings).map((building) => {
          const affordable = canAfford({
            wood: building.woodCost,
            clay: building.clayCost,
            iron: building.ironCost,
          });
          const remainingTime = getRemainingTime(building);

          return (
            <div key={building.id} className="card build-card">
              <div className="build-header">
                <div>
                  <div className="card-title">{building.name}</div>
                  <div className="build-level">Level {building.level}</div>
                </div>
                {building.upgrading && (
                  <span className="badge badge-warning">
                    {formatTime(remainingTime)}
                  </span>
                )}
              </div>

              <div className="card-description">{building.description}</div>

              <div className="build-costs">
                <div className="cost-item">
                  <span>🪵 {formatResources(building.woodCost)}</span>
                </div>
                <div className="cost-item">
                  <span>🧱 {formatResources(building.clayCost)}</span>
                </div>
                <div className="cost-item">
                  <span>⚙️ {formatResources(building.ironCost)}</span>
                </div>
                <div className="cost-item">
                  <span>⏱️ {formatTime(building.buildTime)}</span>
                </div>
              </div>

              <button
                className="button"
                onClick={() => handleUpgrade(building.id)}
                disabled={building.upgrading || !affordable}
              >
                {building.upgrading
                  ? 'Upgrading...'
                  : affordable
                  ? `Upgrade to Level ${building.level + 1}`
                  : 'Insufficient Resources'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Build;

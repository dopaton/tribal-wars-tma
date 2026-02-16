import { useEffect } from 'react';
import { useResourceStore } from '../stores/resourceStore';
import { useBuildingStore } from '../stores/buildingStore';
import { useUnitStore } from '../stores/unitStore';
import { useAttackStore } from '../stores/attackStore';

function GameLoop() {
  const updateProduction = useResourceStore((state) => state.updateProduction);
  const checkUpgrades = useBuildingStore((state) => state.checkUpgrades);
  const processQueue = useUnitStore((state) => state.processQueue);
  const processAttacks = useAttackStore((state) => state.processAttacks);

  useEffect(() => {
    // Game loop runs every second
    const interval = setInterval(() => {
      updateProduction();
      checkUpgrades();
      processQueue();
      processAttacks();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateProduction, checkUpgrades, processQueue, processAttacks]);

  return null;
}

export default GameLoop;

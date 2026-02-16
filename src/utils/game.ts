import { UNITS } from './constants';

export interface CombatResult {
  attackerLosses: Record<string, number>;
  defenderLosses: Record<string, number>;
  winner: 'attacker' | 'defender';
  resourcesStolen?: {
    wood: number;
    clay: number;
    iron: number;
    food: number;
  };
}

export function calculateCombat(
  attackerUnits: Record<string, number>,
  defenderUnits: Record<string, number>,
  defenseBonus: number = 0
): CombatResult {
  // Calculate total attack power
  let totalAttack = 0;
  for (const [unitId, count] of Object.entries(attackerUnits)) {
    const unit = UNITS[unitId];
    if (unit) {
      totalAttack += unit.attack * count;
    }
  }
  
  // Calculate total defense power with bonus
  let totalDefense = 0;
  for (const [unitId, count] of Object.entries(defenderUnits)) {
    const unit = UNITS[unitId];
    if (unit) {
      totalDefense += unit.defense * count;
    }
  }
  totalDefense = Math.floor(totalDefense * (1 + defenseBonus));
  
  // Simple combat formula: higher power wins
  const attackerWins = totalAttack > totalDefense;
  
  // Calculate losses based on power difference
  const powerRatio = attackerWins 
    ? totalDefense / totalAttack 
    : totalAttack / totalDefense;
  
  const attackerLossRate = attackerWins ? powerRatio * 0.5 : 0.8;
  const defenderLossRate = attackerWins ? 0.9 : powerRatio * 0.5;
  
  const attackerLosses: Record<string, number> = {};
  const defenderLosses: Record<string, number> = {};
  
  // Calculate attacker losses
  for (const [unitId, count] of Object.entries(attackerUnits)) {
    attackerLosses[unitId] = Math.floor(count * attackerLossRate);
  }
  
  // Calculate defender losses
  for (const [unitId, count] of Object.entries(defenderUnits)) {
    defenderLosses[unitId] = Math.floor(count * defenderLossRate);
  }
  
  // Calculate stolen resources if attacker wins
  let resourcesStolen;
  if (attackerWins) {
    const carryCapacity = 100; // per unit surviving
    const survivingUnits = Object.entries(attackerUnits).reduce(
      (sum, [unitId, count]) => sum + (count - (attackerLosses[unitId] || 0)),
      0
    );
    const maxSteal = survivingUnits * carryCapacity;
    
    resourcesStolen = {
      wood: Math.floor(Math.random() * maxSteal * 0.25),
      clay: Math.floor(Math.random() * maxSteal * 0.25),
      iron: Math.floor(Math.random() * maxSteal * 0.25),
      food: Math.floor(Math.random() * maxSteal * 0.25),
    };
  }
  
  return {
    attackerLosses,
    defenderLosses,
    winner: attackerWins ? 'attacker' : 'defender',
    resourcesStolen,
  };
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

export function formatResources(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
}

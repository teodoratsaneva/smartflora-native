import type { AiAnalysis, Plant } from '../types/Plant';

export function analyzePlant(plant: Plant): AiAnalysis {
  const last7 = [...plant.history].sort((a, b) => b.timestamp - a.timestamp).slice(0, 7);

  if (last7.length === 0) {
    return {
      score: 0,
      status: 'No Data',
      analysis: 'No care data has been logged yet for this plant.',
      recommendation: 'Add today\'s temperature and soil moisture to start tracking its health.',
    };
  }

  let score = 100;
  let tempSum = 0;
  let humiditySum = 0;
  let wateredCount = 0;
  let outOfRangeDays = 0;

  for (const record of last7) {
    if (record.temperature != null) {
      tempSum += record.temperature;
      if (Math.abs(record.temperature - plant.idealTemp) > 4) {
        score -= 8;
        outOfRangeDays += 1;
      }
    }
    if (record.soilHumidity != null) {
      humiditySum += record.soilHumidity;
      if (Math.abs(record.soilHumidity - plant.idealHumidity) > 15) {
        score -= 8;
        outOfRangeDays += 1;
      }
    }
    if (record.isWatered) wateredCount += 1;
  }

  score -= (7 - last7.length) * 10;

  const avgTemp = Math.round((tempSum / last7.length) * 10) / 10;
  const avgHumidity = Math.round((humiditySum / last7.length) * 10) / 10;

  if (wateredCount === 0 && avgHumidity < plant.idealHumidity - 10) {
    score -= 25;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const status = score >= 80 ? 'Optimal' : score >= 60 ? 'Stable' : score >= 40 ? 'Marginal' : 'Critical';

  const analysis =
    outOfRangeDays === 0
      ? `Over the last ${last7.length} days, your plant's environment has been within the optimal range. Temperature averaged ${avgTemp}°C and soil moisture averaged ${avgHumidity}%.`
      : `Over the last ${last7.length} days, conditions strayed from the ideal range on ${outOfRangeDays} ${outOfRangeDays === 1 ? 'reading' : 'readings'}. Temperature averaged ${avgTemp}°C and soil moisture averaged ${avgHumidity}%.`;

  const recommendation =
    score >= 80
      ? 'Current care is effective. Continue with the existing watering and light schedule to maintain optimal health.'
      : avgHumidity < plant.idealHumidity - 10
        ? 'The soil moisture levels for this plant have dropped below the typical range. It is recommended to increase watering.'
        : avgTemp > plant.idealTemp + 4
          ? 'The room has been warmer than ideal for this plant. Consider moving it away from direct heat or sunlight.'
          : 'Keep logging daily data so the assessment stays accurate, and adjust watering to stay closer to the ideal range.';

  return { score, status, analysis, recommendation };
}

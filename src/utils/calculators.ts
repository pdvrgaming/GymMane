export function calculate1RM(weight: number, reps: number, rpe?: number): {
  epley: number;
  brzycki: number;
  rpeEstimated: number;
  average: number;
} {
  if (reps <= 0 || weight <= 0) {
    return { epley: 0, brzycki: 0, rpeEstimated: 0, average: 0 };
  }
  if (reps === 1) {
    return { epley: weight, brzycki: weight, rpeEstimated: weight, average: weight };
  }

  // Epley formula: w * (1 + r / 30)
  const epley = Math.round((weight * (1 + reps / 30)) * 10) / 10;
  // Brzycki formula: w * (36 / (37 - r))
  const brzycki = reps < 37 ? Math.round((weight * (36 / (37 - reps))) * 10) / 10 : epley;

  // RPE table adjustment if available
  let rpeEstimated = epley;
  if (rpe && rpe >= 6 && rpe <= 10) {
    const rir = 10 - rpe;
    const totalPossibleReps = reps + rir;
    rpeEstimated = Math.round((weight * (1 + totalPossibleReps / 30)) * 10) / 10;
  }

  const average = Math.round(((epley + brzycki) / 2) * 10) / 10;
  return { epley, brzycki, rpeEstimated, average };
}

export function calculateBMI(weightKg: number, heightCm: number): {
  bmi: number;
  category: string;
  color: string;
} {
  if (heightCm <= 0 || weightKg <= 0) {
    return { bmi: 0, category: 'Unknown', color: '#9A9A9A' };
  }
  const hM = heightCm / 100;
  const bmi = Math.round((weightKg / (hM * hM)) * 10) / 10;

  if (bmi < 18.5) return { bmi, category: 'Underweight', color: '#7FA8C9' };
  if (bmi < 25) return { bmi, category: 'Normal weight', color: '#8FA377' };
  if (bmi < 30) return { bmi, category: 'Overweight', color: '#E0B15A' };
  return { bmi, category: 'Obesity', color: '#E05A5A' };
}

export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: 'male' | 'female',
  activityMultiplier: number
): {
  bmr: number;
  tdee: number;
  proteinGrams: number;
  fatGrams: number;
  carbGrams: number;
} {
  // Mifflin-St Jeor Equation
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr += sex === 'male' ? 5 : -161;

  const tdee = Math.round(bmr * activityMultiplier);

  // Standard macros: 2g protein per kg, 25% fats, remainder carbs
  const proteinGrams = Math.round(weightKg * 2);
  const fatGrams = Math.round((tdee * 0.25) / 9);
  const carbGrams = Math.max(0, Math.round((tdee - proteinGrams * 4 - fatGrams * 9) / 4));

  return { bmr: Math.round(bmr), tdee, proteinGrams, fatGrams, carbGrams };
}

export function calculateBodyFat(
  sex: 'male' | 'female',
  heightCm: number,
  waistCm: number,
  neckCm: number,
  hipCm: number = 0
): number {
  if (heightCm <= 0 || waistCm <= 0 || neckCm <= 0) return 0;

  let bodyFat = 0;
  if (sex === 'male') {
    // US Navy formula for men: 495 / (1.0324 - 0.19077*log10(waist - neck) + 0.15456*log10(height)) - 450
    const diff = waistCm - neckCm;
    if (diff > 0) {
      bodyFat =
        495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(heightCm)) - 450;
    }
  } else {
    // US Navy formula for women: 495 / (1.29579 - 0.35004*log10(waist + hip - neck) + 0.22100*log10(height)) - 450
    const sum = waistCm + (hipCm || waistCm * 1.1) - neckCm;
    if (sum > 0) {
      bodyFat =
        495 / (1.29579 - 0.35004 * Math.log10(sum) + 0.221 * Math.log10(heightCm)) - 450;
    }
  }
  return Math.max(3, Math.min(60, Math.round(bodyFat * 10) / 10));
}

export function calculatePlates(
  targetWeight: number,
  barWeight: number = 20,
  availablePlates: number[] = [25, 20, 15, 10, 5, 2.5, 1.25]
): {
  platesPerSide: { weight: number; count: number }[];
  totalActual: number;
  remainder: number;
} {
  if (targetWeight <= barWeight) {
    return { platesPerSide: [], totalActual: barWeight, remainder: 0 };
  }

  let weightPerSideNeeded = (targetWeight - barWeight) / 2;
  const platesPerSide: { weight: number; count: number }[] = [];
  const sortedPlates = [...availablePlates].sort((a, b) => b - a);

  for (const plate of sortedPlates) {
    const count = Math.floor(weightPerSideNeeded / plate);
    if (count > 0) {
      platesPerSide.push({ weight: plate, count });
      weightPerSideNeeded -= count * plate;
    }
  }

  const loadedPerSide = platesPerSide.reduce((acc, p) => acc + p.weight * p.count, 0);
  const totalActual = barWeight + loadedPerSide * 2;
  const remainder = Math.round((targetWeight - totalActual) * 10) / 10;

  return { platesPerSide, totalActual, remainder };
}

export function calculateWarmupSets(
  workingWeight: number,
  barWeight: number = 20
): {
  setNumber: number;
  percentage: number;
  weight: number;
  reps: number;
  label: string;
}[] {
  if (workingWeight <= barWeight) {
    return [{ setNumber: 1, percentage: 100, weight: barWeight, reps: 5, label: 'Empty Bar' }];
  }

  return [
    { setNumber: 1, percentage: 0, weight: barWeight, reps: 10, label: 'Empty Bar Warm-up' },
    {
      setNumber: 2,
      percentage: 50,
      weight: Math.round((barWeight + (workingWeight - barWeight) * 0.5) * 2) / 2,
      reps: 5,
      label: '50% Ramp-up',
    },
    {
      setNumber: 3,
      percentage: 70,
      weight: Math.round((barWeight + (workingWeight - barWeight) * 0.7) * 2) / 2,
      reps: 3,
      label: '70% Acclimatization',
    },
    {
      setNumber: 4,
      percentage: 85,
      weight: Math.round((barWeight + (workingWeight - barWeight) * 0.85) * 2) / 2,
      reps: 1,
      label: '85% Primer',
    },
  ];
}

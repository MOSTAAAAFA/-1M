const MODELS = {
  '911': `${process.env.PUBLIC_URL}/models/porsche_911_gt3.glb`,
  'M4': `${process.env.PUBLIC_URL}/models/2021_bmw_m4_competition.glb`,
  'M5': `${process.env.PUBLIC_URL}/models/bmw_m5_cs_f90.glb`,
};

export function modelSrcForCar(car) {
  const name = (car && (car.name || '')) || '';
  const key = Object.keys(MODELS).find((k) => name.includes(k));
  return key ? MODELS[key] : undefined;
}

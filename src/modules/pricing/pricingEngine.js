export function calculateSurface(item) {
  const length = Number(item.length) || 0;
  const width = Number(item.width) || 0;
  const quantity = Number(item.quantity) || 1;

  if (item.shape === "Rond") {
    const radius = length / 100 / 2;
    return Math.PI * radius * radius * quantity;
  }

  return (length / 100) * (width / 100) * quantity;
}

export function calculateProjectPrice({
  items,
  pricePerM2,
  wastePercent,
  finitionPrice,
  edgePrice,
  deliveryPrice,
  installationPrice,
}) {
  const rawSurface = items.reduce((sum, item) => {
    return sum + calculateSurface(item);
  }, 0);

  const surfaceWithWaste = rawSurface * (1 + wastePercent / 100);

  const materialTotal = surfaceWithWaste * pricePerM2;
  const finitionTotal = surfaceWithWaste * finitionPrice;
  const edgeTotal = surfaceWithWaste * edgePrice;

  const total =
    materialTotal +
    finitionTotal +
    edgeTotal +
    deliveryPrice +
    installationPrice;

  return {
    rawSurface,
    surfaceWithWaste,
    materialTotal,
    finitionTotal,
    edgeTotal,
    deliveryPrice,
    installationPrice,
    total,
  };
}
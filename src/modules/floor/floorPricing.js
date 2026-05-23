export function getFormatSurface(formatSize) {
  if (!formatSize) return 0;

  const [width, height] = formatSize
    .replace("×", "x")
    .split("x")
    .map((value) => Number(value.trim()));

  if (!width || !height) return 0;

  return (width / 100) * (height / 100);
}

export function calculateFloorPricing({
  rows,
  formats,
  delivery,
  handling,
  installationEnabled,
  installationType,
}) {
  const rowsWithTotals = rows.map((row) => {
    const formatData = formats.find((item) => item.size === row.format);

    const pieceSurface = getFormatSurface(row.format);
    const quantity = Number(row.quantity) || 0;
    const pricePerM2 = Number(formatData?.pricePerM2) || 0;

    const totalSurface = pieceSurface * quantity;
    const rowTotal = totalSurface * pricePerM2;

    return {
      ...row,
      quantity,
      pricePerM2,
      pieceSurface,
      totalSurface,
      rowTotal,
    };
  });

  const totalSurface = rowsWithTotals.reduce(
    (sum, row) => sum + row.totalSurface,
    0
  );

  const materialTotal = rowsWithTotals.reduce(
    (sum, row) => sum + row.rowTotal,
    0
  );

  const deliveryPrice = delivery ? 350 : 0;
  const handlingPrice = handling ? totalSurface * 35 : 0;

  const installationPrice = installationEnabled
    ? installationType === "pose_complete"
      ? totalSurface * 180
      : totalSurface * 90
    : 0;

  const servicesTotal = deliveryPrice + handlingPrice + installationPrice;
  const total = materialTotal + servicesTotal;

  return {
    rowsWithTotals,
    totalSurface,
    materialTotal,
    deliveryPrice,
    handlingPrice,
    installationPrice,
    servicesTotal,
    total,
  };
}
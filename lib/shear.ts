/** A horizontal shear on a discrete periodic grid. Integer rows restore at s = L. */
export function shearX(x: number, row: number, shear: number, width: number) {
  return ((x + shear * row) % width + width) % width;
}

/** Hold the original image, shear through one complete period, then hold again. */
export function shearAt(milliseconds: number, width: number) {
  const time = ((milliseconds % 18000) + 18000) % 18000;
  if (time <= 3000 || time >= 15000) return 0;
  const progress = (time - 3000) / 12000;
  const eased = progress * progress * (3 - 2 * progress);
  return eased * width;
}

/**
 * Remove a flat or checkerboard neutral backdrop without cutting holes into
 * the sprite itself. Only neutral pixels connected to the image border are
 * keyed out; dark outlines and enclosed white clothing remain intact.
 */
export function removeConnectedSpriteBackdrop(
  source: HTMLImageElement | HTMLCanvasElement,
): HTMLCanvasElement {
  const width =
    source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  const height =
    source instanceof HTMLImageElement ? source.naturalHeight : source.height;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context || width === 0 || height === 0) return canvas;

  context.drawImage(source, 0, 0, width, height);
  const image = context.getImageData(0, 0, width, height);
  const pixels = image.data;
  const histogram = new Map<number, number>();

  const isNeutral = (index: number) => {
    const r = pixels[index];
    const g = pixels[index + 1];
    const b = pixels[index + 2];
    return Math.max(r, g, b) - Math.min(r, g, b) <= 22;
  };
  const addBorderTone = (x: number, y: number) => {
    const index = (y * width + x) * 4;
    if (!isNeutral(index)) return;
    const gray = Math.round(
      (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3,
    );
    if (gray < 28 || gray > 255) return;
    const bucket = Math.round(gray / 4) * 4;
    histogram.set(bucket, (histogram.get(bucket) ?? 0) + 1);
  };

  for (let x = 0; x < width; x += 1) {
    addBorderTone(x, 0);
    if (height > 1) addBorderTone(x, height - 1);
  }
  for (let y = 1; y < height - 1; y += 1) {
    addBorderTone(0, y);
    if (width > 1) addBorderTone(width - 1, y);
  }

  const rankedTones = [...histogram.entries()].sort((a, b) => b[1] - a[1]);
  if (rankedTones.length === 0) return canvas;
  const strongest = rankedTones[0];
  const tones = [strongest[0]];
  const second = rankedTones.find(
    ([tone, count]) =>
      Math.abs(tone - strongest[0]) >= 28 && count >= strongest[1] * 0.12,
  );
  if (second) tones.push(second[0]);

  const matchesBackdrop = (index: number) => {
    if (!isNeutral(index)) return false;
    const gray = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
    return tones.some((tone) => Math.abs(gray - tone) <= 27);
  };

  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const seed = (x: number, y: number) => {
    const position = y * width + x;
    if (visited[position]) return;
    if (!matchesBackdrop(position * 4)) return;
    visited[position] = 1;
    queue[tail] = position;
    tail += 1;
  };

  for (let x = 0; x < width; x += 1) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 1; y < height - 1; y += 1) {
    seed(0, y);
    seed(width - 1, y);
  }

  while (head < tail) {
    const position = queue[head];
    head += 1;
    const x = position % width;
    const y = Math.floor(position / width);
    const index = position * 4;
    pixels[index + 3] = 0;

    if (x > 0) seed(x - 1, y);
    if (x + 1 < width) seed(x + 1, y);
    if (y > 0) seed(x, y - 1);
    if (y + 1 < height) seed(x, y + 1);
  }

  context.putImageData(image, 0, 0);
  return canvas;
}

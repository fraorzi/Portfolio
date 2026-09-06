export type NavSegment = {
  offset: number;
  size: number;
};

export function getGooeyNavPath({
  segments,
  thickness,
  vertical = false,
}: {
  segments: readonly NavSegment[];
  thickness: number;
  vertical?: boolean;
}): string {
  const first = segments[0];
  const last = segments[segments.length - 1];
  if (!first || !last) return '';

  const radius = vertical ? 18 : thickness / 2;
  if (vertical) {
    const center = thickness / 2;
    return segments
      .map((segment, index) => {
        const top = segment.offset;
        const bottom = top + segment.size;
        const next = segments[index + 1];
        const middle = next ? (bottom + next.offset) / 2 : bottom;
        return (
          `M${radius} ${top}H${thickness - radius}A${radius} ${radius} 0 0 1 ${thickness} ${top + radius}V${bottom - radius}A${radius} ${radius} 0 0 1 ${thickness - radius} ${bottom}H${radius}A${radius} ${radius} 0 0 1 0 ${bottom - radius}V${top + radius}A${radius} ${radius} 0 0 1 ${radius} ${top}Z` +
          (next
            ? `M${center - 20} ${bottom - 1}H${center + 20}C${center + 8} ${bottom - 1} ${center + 4} ${bottom} ${center + 4} ${middle}S${center + 8} ${next.offset + 1} ${center + 20} ${next.offset + 1}H${center - 20}C${center - 8} ${next.offset + 1} ${center - 4} ${next.offset} ${center - 4} ${middle}S${center - 8} ${bottom - 1} ${center - 20} ${bottom - 1}Z`
            : '')
        );
      })
      .join(' ');
  }
  const waist = thickness / 2 - 4;
  const tangent = radius / Math.SQRT2;
  const shoulder = radius - tangent;
  const end = last.offset + last.size;
  let path = `M${first.offset + radius} 0`;

  segments.forEach((segment, index) => {
    const right = segment.offset + segment.size;
    path += `H${right - radius}`;
    const next = segments[index + 1];
    if (!next) return;
    const middle = (right + next.offset) / 2;
    path += `A${radius} ${radius} 0 0 1 ${right - shoulder} ${shoulder}C${right - shoulder + 6} ${shoulder + 6} ${middle - 4} ${waist} ${middle} ${waist}C${middle + 4} ${waist} ${next.offset + shoulder - 6} ${shoulder + 6} ${next.offset + shoulder} ${shoulder}A${radius} ${radius} 0 0 1 ${next.offset + radius} 0`;
  });

  path += `A${radius} ${radius} 0 0 1 ${end - radius} ${thickness}`;

  for (let index = segments.length - 1; index >= 0; index--) {
    const segment = segments[index];
    path += `H${segment.offset + radius}`;
    const previous = segments[index - 1];
    if (!previous) continue;
    const right = previous.offset + previous.size;
    const middle = (right + segment.offset) / 2;
    path += `A${radius} ${radius} 0 0 1 ${segment.offset + shoulder} ${thickness - shoulder}C${segment.offset + shoulder - 6} ${thickness - shoulder - 6} ${middle + 4} ${thickness - waist} ${middle} ${thickness - waist}C${middle - 4} ${thickness - waist} ${right - shoulder + 6} ${thickness - shoulder - 6} ${right - shoulder} ${thickness - shoulder}A${radius} ${radius} 0 0 1 ${right - radius} ${thickness}`;
  }

  return `${path}A${radius} ${radius} 0 0 1 ${first.offset + radius} 0Z`;
}

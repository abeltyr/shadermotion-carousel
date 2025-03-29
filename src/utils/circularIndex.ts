/**
 * Calculate next and previous indices in a circular array
 * @param length Total length of the array
 * @param index Current index position
 * @returns Object containing next and previous indices
 */
export const getCircularIndices = ({
  index,
  length,
}: {
  length: number;
  index: number;
}) => {
  // Ensure index is within bounds
  const normalizedIndex =
    ((index % (length - 1)) + (length - 1)) % (length - 1);

  return {
    next: (normalizedIndex + 1) % (length - 1),
    previous: (normalizedIndex - 1 + (length - 1)) % (length - 1),
    current: normalizedIndex,
  };
};

/**
 * Shift the current index one position to the left (previous) in a circular array
 * @param length Total length of the array
 * @param index Current index position
 * @returns New index after shifting left
 */
export const shiftLeft = ({
  index,
  length,
}: {
  length: number;
  index: number;
}) => {
  const current = (index - 1 + (length - 1)) % (length - 1);
  return {
    next: (current + 1) % (length - 1),
    previous: (current - 1 + (length - 1)) % (length - 1),
    current,
  };
};

/**
 * Shift the current index one position to the right (next) in a circular array
 * @param length Total length of the array
 * @param index Current index position
 * @returns New index after shifting right
 */
export const shiftRight = ({
  index,
  length,
}: {
  length: number;
  index: number;
}) => {
  const current = (index + 1) % (length - 1);
  return {
    next: (current + 1) % (length - 1),
    previous: (current - 1 + (length - 1)) % (length - 1),
    current,
  };
};

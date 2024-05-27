export const omit = <T extends object>(entity: T, attrs: (keyof T)[]) =>
  Object.fromEntries(
    Object.entries(entity).filter(([key]) => !attrs.includes(key as keyof T)),
  );

export const capitalize = (value: string) =>
  `${value[0].toUpperCase()}${value.slice(1)}`;

const valueToCamelCase = (value: string) => {
  if (!value.includes('_')) return value;
  const valueArray = value.split('_');
  const capitalizedValueArray = valueArray.map((v, index) => {
    if (index === 0) return v;
    return capitalize(v);
  });
  return capitalizedValueArray.join('');
};

export const toCamelCase = <T extends object>(entity: T) =>
  Object.fromEntries(
    Object.entries(entity).map(([key, value]) => [
      valueToCamelCase(key),
      value,
    ]),
  );

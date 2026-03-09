import Color from 'color';

export const generateGradient = (
  base: string
): [string, string, string] => {
  const baseColor = Color(base);

  return [
    baseColor.lighten(0.4).hex(),
    baseColor.hex(),
    baseColor.darken(0.45).hex(),
  ];
};
export default async (lastAgenda: string) => {
  const currentValue = parseInt(lastAgenda, 10);
  const newValue = currentValue + 1;

  return newValue.toString().padStart(7, "0");
};

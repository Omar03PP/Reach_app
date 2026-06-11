export const categoryLabels = {
  IT_PROGRAMMING: "IT y programacion",
  DESIGN_MULTIMEDIA: "Diseno y multimedia",
  WRITING_TRANSLATION: "Redaccion y traduccion",
  SALES_MARKETING: "Ventas y marketing",
  ADMIN_SUPPORT: "Soporte administrativo",
  FINANCE: "Finanzas",
  ENGINEERING: "Ingenieria",
} as const;

export const categoryValues = Object.keys(categoryLabels) as [
  keyof typeof categoryLabels,
  ...(keyof typeof categoryLabels)[],
];

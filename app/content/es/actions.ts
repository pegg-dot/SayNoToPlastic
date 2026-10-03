import type { ActionStep } from "../actions";

export const coreRulesEs = [
  {
    number: "01",
    title: "No calientes plástico.",
    detail: "Recalienta y sirve los alimentos calientes en vidrio, cerámica, acero inoxidable u otro material adecuado que no sea plástico.",
  },
  {
    number: "02",
    title: "No guardes alimentos en plástico.",
    detail: "Cuando sea práctico, usa vidrio, cerámica o acero inoxidable para almacenar alimentos de forma habitual.",
  },
  {
    number: "03",
    title: "No bebas de recipientes de plástico.",
    detail: "Para las bebidas que consumes con más frecuencia, usa botellas y vasos de vidrio o acero inoxidable.",
  },
] as const;

export const plannerActionsEs: ActionStep[] = [
  {
    number: "01",
    title: "Saca una rutina de comida caliente del plástico",
    shortTitle: "Aleja el calor del plástico",
    practical: "Elige una comida o una rutina de sobras y recalienta en vidrio o cerámica esta semana.",
    why: "El calor y el contacto con alimentos son un lugar claro para empezar.",
    guide: "/resources/heating-food-in-plastic",
  },
  {
    number: "02",
    title: "Cambia una rutina de almacenamiento",
    shortTitle: "Cambia el almacenamiento",
    practical: "Usa vidrio, cerámica o acero inoxidable para un alimento que guardas con frecuencia.",
    why: "La meta es sacar el plástico de una rutina que se repite, no rehacer toda la cocina de una vez.",
    guide: "/resources/plastic-kitchen-conversion",
  },
  {
    number: "03",
    title: "Reemplaza tu botella o vaso de uso diario",
    shortTitle: "Cambia lo que usas para beber",
    practical: "Usa una botella o un vaso de vidrio o acero inoxidable para la bebida que llevas con más frecuencia.",
    why: "Una rutina diaria de bebida es fácil de reconocer y repetir.",
    guide: "/resources/microplastics-drinking-water-filter-guide",
  },
];

export const authoredQuickActionCardEs = [
  { number: "01", text: "Bebe de vidrio o acero inoxidable, nunca de botellas de plástico." },
  { number: "02", text: "Filtra el agua (ósmosis inversa o carbón activado)." },
  { number: "03", text: "Nunca calientes alimentos en plástico en el microondas." },
  { number: "04", text: "Guarda los alimentos solo en vidrio, cerámica o acero." },
  { number: "05", text: "Elige ropa de fibras naturales (algodón, lino, lana)." },
  { number: "06", text: "Aspira con filtro HEPA y abre las ventanas a diario." },
  { number: "07", text: "Evita los alimentos enlatados y muy empaquetados." },
  { number: "08", text: "Usa cosméticos y productos para la piel sin plástico cuando sea posible." },
  { number: "09", text: "Reduce los recipientes de comida para llevar; lleva los tuyos de vidrio o acero." },
  {
    number: "10",
    text: "Suda con regularidad (sauna, ejercicio) para eliminar toxinas.",
    reviewNote: "Traducción del texto del autor. La evidencia actual no establece que la sauna o el ejercicio eliminen microplásticos del cuerpo.",
  },
  {
    number: "11",
    text: "Añade alimentos de 'desintoxicación': brotes de brócoli, algas, cilantro y fibra.",
    reviewNote: "Traducción del texto del autor. La evidencia actual no establece que un alimento o una limpieza específica elimine microplásticos del cuerpo.",
  },
  { number: "12", text: "Enséñale a una persona algo sobre los microplásticos esta semana." },
] as const;

export const authoredCardRememberEs = [
  "Pequeñas acciones diarias → un gran impacto a lo largo de la vida.",
  "Tus decisiones protegen tus hormonas, tu fertilidad, tu corazón, tus hijos y tu futuro.",
] as const;

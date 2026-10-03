import type { ExposomeCategory } from "../haddad-topics";

export const detectionStepsEs = [
  {
    number: "01",
    title: "Recoger una muestra",
    text: "Los investigadores comienzan con sangre, tejido, leche materna, tejido placentario, heces u otra muestra biológica definida.",
  },
  {
    number: "02",
    title: "Prepararla con cuidado",
    text: "Se eliminan grasas, proteínas y otros materiales biológicos mientras el equipo intenta conservar las partículas que puedan estar presentes.",
  },
  {
    number: "03",
    title: "Analizar el material restante",
    text: "Instrumentos especializados examinan el tamaño, la forma, la masa o las características espectrales de las partículas, según el método del estudio.",
  },
  {
    number: "04",
    title: "Identificar el polímero",
    text: "Los investigadores comparan la firma química con materiales conocidos como PE, PP, PET, PS y PVC.",
  },
] as const;

export const commonPolymersEs = [
  { abbreviation: "PE", name: "Polietileno", examples: "Botellas, bolsas, películas y envases" },
  { abbreviation: "PP", name: "Polipropileno", examples: "Recipientes de alimentos, tapas, fibras y productos del hogar" },
  { abbreviation: "PET", name: "Tereftalato de polietileno", examples: "Botellas de bebidas, envases y textiles de poliéster" },
  { abbreviation: "PS", name: "Poliestireno", examples: "Espumas y materiales rígidos para servicio de alimentos" },
  { abbreviation: "PVC", name: "Cloruro de polivinilo", examples: "Materiales de construcción, médicos y del hogar" },
] as const;

export const detectionContentEs = {
  title: "Cómo detectan los científicos los microplásticos",
  subtitle: "Encontrar lo invisible",
  description: "Una guía en lenguaje claro sobre recolección de muestras, preparación de laboratorio, identificación de polímeros, control de contaminación y límites de los estudios de detección.",
  sections: [
    {
      id: "why-detection-matters",
      title: "Por qué importa la detección",
      paragraphs: [
        "Los microplásticos y nanoplásticos pueden ser demasiado pequeños para verse a simple vista. Por eso los científicos dependen de tecnología de laboratorio capaz de identificar no solo si hay material derivado del plástico, sino también su tamaño, forma, masa o composición química.",
        "Antes de preguntar si un material afecta la salud, los investigadores deben responder una pregunta más básica: ¿está realmente presente en la muestra? Las mejoras en los métodos analíticos han permitido medir material que antes pasaba desapercibido. El borrador proporcionado describe reportes en sangre, cerebro, arterias, pulmones, órganos reproductivos, placenta, leche materna y otras muestras humanas; cada hallazgo debe evaluarse según su propio método y registro de fuentes.",
      ],
    },
    {
      id: "how-it-works",
      title: "Cómo encuentran microplásticos los científicos",
      paragraphs: [
        "La detección comienza con una muestra biológica definida. La muestra se prepara para retirar material biológico mientras se intentan conservar las posibles partículas. Después, los investigadores utilizan instrumentos seleccionados para la pregunta que están estudiando.",
        "Métodos diferentes miden cosas diferentes. Algunos estiman la masa de polímeros. Otros visualizan partículas, identifican firmas espectrales o caracterizan su morfología. Los resultados obtenidos con métodos distintos no deben tratarse como perfectamente intercambiables.",
      ],
    },
    {
      id: "trust",
      title: "¿Podemos confiar en estos estudios?",
      paragraphs: [
        "Como el plástico es común en laboratorios, ropa, recipientes y el aire circundante, el control de contaminación es esencial. Los estudios sólidos documentan los materiales de recolección, los blancos de control, los controles del aire, la limpieza de instrumentos, el aseguramiento de calidad y los criterios utilizados para identificar un polímero.",
        "Los métodos siguen evolucionando. Un estudio puede estar bien realizado y aun así tener límites relacionados con el tamaño de las partículas, el umbral de detección, la preparación de la muestra, las bibliotecas de referencia o la diferencia entre medir el número de partículas y la masa del polímero.",
      ],
    },
    {
      id: "meaning",
      title: "Qué puede y qué no puede decirnos la detección",
      paragraphs: [
        "La detección establece que un material fue medido en una muestra mediante un método definido. No establece automáticamente de dónde vino, cuánto tiempo estuvo presente, si fue absorbido por tejido vivo o si causó una enfermedad.",
        "El siguiente reto es conectar una medición fiable con las vías de exposición, la dosis, la respuesta biológica, la replicación y los resultados en humanos. La detección es el primer paso, no la conclusión final.",
      ],
    },
  ],
  takeaways: [
    "Los microplásticos requieren equipos de laboratorio especializados para identificarlos y medirlos.",
    "Instrumentos diferentes responden preguntas diferentes y pueden informar número, tamaño, forma, química o masa de polímeros.",
    "Los controles estrictos de contaminación son esenciales porque el plástico es común tanto en el ambiente como en el laboratorio.",
    "Una partícula detectada no equivale a un diagnóstico, un mecanismo ni una prueba de daño.",
    "Los métodos están mejorando, pero comparar estudios distintos todavía requiere cuidado.",
  ],
  sourceDocument: "Detecting microplastics.pdf",
  reviewNote: "Esta explicación conserva la organización y el enfoque del borrador proporcionado por el Dr. Haddad. El registro verificado de estudios en la página de Ciencia enlaza cada estudio humano con su artículo original y el método indicado.",
} as const;

export const exposomeCategoriesEs: ExposomeCategory[] = [
  {
    id: "air",
    title: "Aire",
    summary: "Lo que respiramos incluye contaminación exterior, polvo interior, polen, fibras y otras partículas.",
    examples: ["PM2.5", "Polvo", "Polen", "Microplásticos"],
    related: [
      { label: "Guía sobre polvo interior (en inglés)", href: "/resources/microplastics-indoor-dust" },
      { label: "Ropa sintética y fibras (en inglés)", href: "/resources/synthetic-clothing-microfibers" },
    ],
  },
  {
    id: "water",
    title: "Agua",
    summary: "El agua potable, el agua embotellada, las tuberías, el tratamiento y la filtración doméstica forman parte del panorama de exposición.",
    examples: ["Agua potable", "Agua embotellada", "Sistemas locales de agua", "Contacto con plástico"],
    related: [
      { label: "Guía sobre agua potable (en inglés)", href: "/resources/microplastics-drinking-water-filter-guide" },
      { label: "Acción práctica", href: "/es/accion" },
    ],
  },
  {
    id: "food",
    title: "Alimentos",
    summary: "La producción, el procesamiento, los envases, los aditivos, el almacenamiento y el calor influyen en el contacto repetido.",
    examples: ["Envases", "Procesamiento", "Pesticidas", "Aditivos"],
    related: [
      { label: "Sistema digestivo", href: "/es/ciencia/cuerpo/digestive-system" },
      { label: "Calentar y almacenar alimentos (en inglés)", href: "/resources/heating-food-in-plastic" },
    ],
  },
  {
    id: "products",
    title: "Productos",
    summary: "Cosméticos, productos de limpieza, ropa, muebles y materiales del hogar crean muchas formas de contacto.",
    examples: ["Cosméticos", "Productos de limpieza", "Ropa", "Muebles", "Plásticos"],
    related: [
      { label: "Piel", href: "/es/ciencia/cuerpo/skin" },
      { label: "Guía de cuidado personal (en inglés)", href: "/resources/personal-care-cosmetics-plastic" },
    ],
  },
  {
    id: "lifestyle",
    title: "Estilo de vida",
    summary: "El tabaquismo, el ejercicio, el estrés, el sueño, el trabajo y las rutinas diarias influyen en cómo responde el cuerpo al mundo que lo rodea.",
    examples: ["Tabaquismo", "Ejercicio", "Estrés", "Sueño"],
    related: [
      { label: "Sistema cardiovascular", href: "/es/ciencia/cuerpo/cardiovascular-system" },
      { label: "Sistema endocrino y metabólico", href: "/es/ciencia/cuerpo/endocrine-metabolic-system" },
    ],
  },
];

export const exposomeContentEs = {
  title: "El exposoma",
  subtitle: "Todo lo que te rodea influye en lo que ocurre dentro de ti",
  description: "El exposoma es el efecto combinado del aire, el agua, los alimentos, los productos, los lugares y los comportamientos encontrados a lo largo de la vida.",
  bodyResponse: ["Genética", "Nutrición", "Ejercicio", "Edad"],
  closing: "La salud no está determinada por una sola exposición, sino por el efecto combinado de lo que una persona encuentra a lo largo de su vida y por cómo responde el cuerpo, lo que influye en la salud a largo plazo.",
  sourceDocument: "Exposome diagram.pdf",
} as const;

export const reduceExposureGroupsEs = [
  {
    id: "food-drink",
    number: "01",
    title: "Alimentos y bebidas",
    summary: "Empieza por el plástico que toca repetidamente lo que comes y bebes.",
    actions: [
      "Reemplaza los artículos de plástico de uso frecuente en la cocina por madera, cerámica, acero inoxidable o vidrio cuando sea práctico.",
      "Evita el uso rutinario de botellas de agua de plástico y usa recipientes de vidrio o acero inoxidable.",
      "Compara la ósmosis inversa u otro filtro con mantenimiento con la calidad del agua local y las necesidades del hogar.",
      "Evita calentar alimentos en recipientes de plástico.",
      "Guarda las sobras en vidrio, cerámica o acero inoxidable cuando sea práctico.",
      "Reduce los utensilios y recipientes de plástico de un solo uso y, cuando sea práctico, elige alimentos frescos o mínimamente procesados frente a opciones muy empaquetadas.",
    ],
    links: [
      { label: "Guía del agua (en inglés)", href: "/resources/microplastics-drinking-water-filter-guide" },
      { label: "Conversión de la cocina (en inglés)", href: "/resources/plastic-kitchen-conversion" },
      { label: "Utensilios de un solo uso (en inglés)", href: "/resources/single-use-plastic-foodware" },
    ],
  },
  {
    id: "home-air",
    number: "02",
    title: "Hogar y aire interior",
    summary: "El polvo, los textiles, los muebles, la ventilación y la limpieza influyen en el ambiente interior.",
    actions: [
      "Aspira y quita el polvo con regularidad usando, cuando sea posible, una máquina bien sellada con filtro HEPA.",
      "Usa métodos de limpieza húmeda que retiren el polvo en lugar de volver a moverlo al aire.",
      "Ventila el hogar cuando la calidad del aire exterior y el clima lo hagan razonable.",
      "Concéntrate en rutinas repetidas en lugar de intentar crear un hogar sin partículas.",
    ],
    links: [
      { label: "Guía sobre polvo interior (en inglés)", href: "/resources/microplastics-indoor-dust" },
      { label: "Prioridades para niños y el hogar (en inglés)", href: "/resources/children-household-plastic-priorities" },
    ],
  },
  {
    id: "clothing-care",
    number: "03",
    title: "Ropa y cuidado personal",
    summary: "Elige materiales duraderos y revisa los productos que entran en contacto con la piel todos los días.",
    actions: [
      "Cuando una prenda ya necesite reemplazo, considera fibras naturales como algodón, lino, lana o cáñamo si el material funciona para ese uso.",
      "Sigue usando la ropa que todavía sirve en lugar de reemplazar todo el armario.",
      "Revisa cosméticos y productos de cuidado personal para detectar polímeros sintéticos innecesarios y sustancias químicas asociadas al plástico.",
      "Prioriza productos útiles, mantenibles y apropiados para la persona que los usa.",
    ],
    links: [
      { label: "Guía sobre ropa sintética (en inglés)", href: "/resources/synthetic-clothing-microfibers" },
      { label: "Guía de cuidado personal (en inglés)", href: "/resources/personal-care-cosmetics-plastic" },
      { label: "Resumen de la piel", href: "/es/ciencia/cuerpo/skin" },
    ],
  },
  {
    id: "habit",
    number: "04",
    title: "Construye un hábito a la vez",
    summary: "La meta no es la perfección. La meta es un cambio pequeño que pueda repetirse durante años.",
    actions: [
      "Identifica el contacto con plástico que ocurre con mayor frecuencia en tu rutina.",
      "Elige un reemplazo o cambio de comportamiento realista.",
      "Mantén primero las necesidades médicas, de seguridad alimentaria, higiene y accesibilidad.",
      "Revisa qué funcionó antes de añadir otro cambio.",
      "Comparte con otra persona una idea clara y consciente de los límites de la evidencia.",
    ],
    links: [
      { label: "Guía rápida de 12 pasos", href: "/es/guia-12-pasos" },
      { label: "Elige un siguiente cambio", href: "/es/accion#planner" },
      { label: "Comunidad (en inglés)", href: "/community" },
    ],
  },
] as const;

export const reduceExposureContentEs = {
  title: "Cómo reducir tu exposición al plástico",
  subtitle: "Los cambios pequeños pueden marcar una gran diferencia",
  description: "Un enfoque práctico, sin buscar perfección, para reducir la exposición repetida al plástico en alimentos, agua, calor, almacenamiento, ropa, polvo, aire interior y cuidado personal.",
  introduction: [
    "Los microplásticos forman parte del ambiente moderno y se han detectado en el aire, el agua, los alimentos y múltiples tejidos humanos.",
    "Esto no se trata de perfección. Evitar por completo el plástico no es realista ni necesario. La meta es identificar las fuentes repetidas más importantes y hacer cambios sencillos que puedan reducir la exposición a lo largo de la vida.",
    "Piensa en ello como mejorar tu entorno una decisión a la vez.",
  ],
  takeaways: [
    "No necesitas eliminar todo el plástico de tu vida para marcar una diferencia.",
    "Concéntrate primero en las fuentes repetidas más grandes y prácticas.",
    "Los cambios pequeños y constantes son más útiles que los esfuerzos drásticos y de corta duración.",
    "Mejorar el entorno que te rodea es una inversión a largo plazo, no una limpieza de emergencia.",
    "La conciencia es el primer paso hacia una acción significativa.",
  ],
  reflection: "La ciencia nos ayuda a entender el problema. Las decisiones pequeñas de cada día se convierten en la respuesta. La meta no es el miedo, sino una acción informada que proteja la salud, la familia y las generaciones futuras una decisión a la vez.",
  sourceDocument: "Reduce exposure.pdf",
} as const;

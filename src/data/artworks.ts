export type CategoryId = string;
export type AuthorId = string;

export type LocalizedText = { en: string; ru: string };

export type Artwork = {
  id: string;
  slug: string;
  categoryId: CategoryId;
  authorId: AuthorId;
  hidden: boolean;
  /** До 4 работ на главной в блоке «Галерея». */
  featuredOnHome?: boolean;
  images: string[];
  title: LocalizedText;
  description: LocalizedText;
};

/** Стабильные URL через picsum.photos (seed = постоянное изображение) */
const baseArtworks: Artwork[] = [
  {
    id: "1",
    slug: "silent-harmony",
    categoryId: "painting",
    authorId: "ivan-petrov",
    hidden: false,
    images: [
      "https://picsum.photos/seed/silent-harmony-a/1200/1500",
      "https://picsum.photos/seed/silent-harmony-b/1200/1500",
    ],
    title: { en: "Silent Harmony", ru: "Тихая гармония" },
    description: {
      en: "Oil on canvas exploring the tension between stillness and movement through layered brushwork.",
      ru: "Масло на холсте — исследование напряжения между покоем и движением через наслоение мазков.",
    },
  },
  {
    id: "2",
    slug: "urban-echo",
    categoryId: "photography",
    authorId: "maria-sokolova",
    hidden: false,
    images: ["https://picsum.photos/seed/urban-echo/1200/1500"],
    title: { en: "Urban Echo", ru: "Городское эхо" },
    description: {
      en: "Archival pigment print capturing the geometry of post-industrial landscapes at dusk.",
      ru: "Архивная пигментная печать — геометрия постиндустриальных пейзажей в сумерках.",
    },
  },
  {
    id: "3",
    slug: "terra-form",
    categoryId: "sculpture",
    authorId: "dmitry-orlov",
    hidden: false,
    images: [
      "https://picsum.photos/seed/terra-form-a/1200/1500",
      "https://picsum.photos/seed/terra-form-b/1200/1500",
    ],
    title: { en: "Terra Form", ru: "Терра форма" },
    description: {
      en: "Hand-built ceramic vessel series inspired by geological stratification.",
      ru: "Серия керамических сосудов ручной работы, вдохновлённая геологической стратификацией.",
    },
  },
  {
    id: "4",
    slug: "digital-dawn",
    categoryId: "digital",
    authorId: "elena-kuznetsova",
    hidden: false,
    images: ["https://picsum.photos/seed/digital-dawn/1200/1500"],
    title: { en: "Digital Dawn", ru: "Цифровой рассвет" },
    description: {
      en: "Generative composition rendered in 4K, limited edition of 10.",
      ru: "Генеративная композиция в 4K, лимитированная серия из 10 экземпляров.",
    },
  },
  {
    id: "5",
    slug: "woven-light",
    categoryId: "mixed-media",
    authorId: "anna-volkova",
    hidden: false,
    images: ["https://picsum.photos/seed/woven-light/1200/1500"],
    title: { en: "Woven Light", ru: "Тканый свет" },
    description: {
      en: "Textile and resin installation examining translucency and memory.",
      ru: "Инсталляция из текстиля и смолы — исследование прозрачности и памяти.",
    },
  },
  {
    id: "6",
    slug: "crimson-field",
    categoryId: "painting",
    authorId: "maria-sokolova",
    hidden: false,
    images: ["https://picsum.photos/seed/crimson-field/1200/1500"],
    title: { en: "Crimson Field", ru: "Багровое поле" },
    description: {
      en: "Large-format acrylic work referencing Russian avant-garde colour theory.",
      ru: "Крупноформатная акриловая работа с отсылкой к теории цвета русского авангарда.",
    },
  },
  {
    id: "7",
    slug: "nocturne-study",
    categoryId: "photography",
    authorId: "ivan-petrov",
    hidden: false,
    images: ["https://picsum.photos/seed/nocturne-study/1200/1500"],
    title: { en: "Nocturne Study", ru: "Ноктюрн" },
    description: {
      en: "Long-exposure landscape series from the White Sea coast.",
      ru: "Серия пейзажей с длинной выдержкой с побережья Белого моря.",
    },
  },
  {
    id: "8",
    slug: "fragment-vii",
    categoryId: "sculpture",
    authorId: "elena-kuznetsova",
    hidden: true,
    images: ["https://picsum.photos/seed/fragment-vii/1200/1500"],
    title: { en: "Fragment VII", ru: "Фрагмент VII" },
    description: {
      en: "Bronze cast fragment from an ongoing series on architectural ruin.",
      ru: "Бронзовый фрагмент из продолжающейся серии об архитектурных руинах.",
    },
  },
];

const CATEGORY_ROTATION: CategoryId[] = [
  "painting",
  "photography",
  "sculpture",
  "digital",
  "mixed-media",
];

const AUTHOR_ROTATION: AuthorId[] = [
  "ivan-petrov",
  "maria-sokolova",
  "elena-kuznetsova",
  "dmitry-orlov",
  "anna-volkova",
];

const EXTRA_CATALOG: {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
}[] = [
  {
    slug: "morning-mist",
    title: { en: "Morning Mist", ru: "Утренний туман" },
    description: {
      en: "Atmospheric landscape in muted tones, oil on linen.",
      ru: "Атмосферный пейзаж в приглушённых тонах, масло на льне.",
    },
  },
  {
    slug: "glass-refraction",
    title: { en: "Glass Refraction", ru: "Преломление стекла" },
    description: {
      en: "Studio photograph exploring light through sculpted glass forms.",
      ru: "Студийная фотография — свет сквозь объёмные стеклянные формы.",
    },
  },
  {
    slug: "stone-dialogue",
    title: { en: "Stone Dialogue", ru: "Каменный диалог" },
    description: {
      en: "Carved limestone pair, part of a site-specific installation.",
      ru: "Парная скульптура из известняка, часть инсталляции для пространства.",
    },
  },
  {
    slug: "signal-noise",
    title: { en: "Signal / Noise", ru: "Сигнал / Шум" },
    description: {
      en: "Algorithmic print series, edition of 15 with certificate.",
      ru: "Алгоритмическая серия печатей, тираж 15 с сертификатом.",
    },
  },
  {
    slug: "thread-memory",
    title: { en: "Thread Memory", ru: "Память нити" },
    description: {
      en: "Embroidery and ink on paper, diptych.",
      ru: "Вышивка и тушь на бумаге, диптих.",
    },
  },
  {
    slug: "vermillion-study",
    title: { en: "Vermillion Study", ru: "Киноварное исследование" },
    description: {
      en: "Abstract painting built from translucent glazes.",
      ru: "Абстрактная живопись, построенная из прозрачных глазурей.",
    },
  },
  {
    slug: "coastal-line",
    title: { en: "Coastal Line", ru: "Береговая линия" },
    description: {
      en: "Black-and-white seascape, silver gelatin print.",
      ru: "Морской пейзаж в чёрно-белой печати, желатино-серебряный отпечаток.",
    },
  },
  {
    slug: "hollow-form",
    title: { en: "Hollow Form", ru: "Полая форма" },
    description: {
      en: "Terracotta sculpture with burnished surface.",
      ru: "Терракотовая скульптура с полированной поверхностью.",
    },
  },
  {
    slug: "pixel-garden",
    title: { en: "Pixel Garden", ru: "Пиксельный сад" },
    description: {
      en: "Animated still frame from a generative garden cycle.",
      ru: "Кадр из генеративного цикла «сад», анимированная работа.",
    },
  },
  {
    slug: "paper-archive",
    title: { en: "Paper Archive", ru: "Бумажный архив" },
    description: {
      en: "Collage of found ephemera and monotype fragments.",
      ru: "Коллаж из найденных эфемер и монотипий.",
    },
  },
  {
    slug: "winter-room",
    title: { en: "Winter Room", ru: "Зимняя комната" },
    description: {
      en: "Interior scene in oil, study of northern light.",
      ru: "Интерьер маслом, этюд северного света.",
    },
  },
  {
    slug: "metro-passage",
    title: { en: "Metro Passage", ru: "Метропроход" },
    description: {
      en: "Documentary photograph series, C-print.",
      ru: "Документальная фотосерия, C-print.",
    },
  },
  {
    slug: "bronze-sleep",
    title: { en: "Bronze Sleep", ru: "Бронзовый сон" },
    description: {
      en: "Figurative bronze maquette, cast in an edition of 5.",
      ru: "Фигуративный бронзовый макет, тираж 5.",
    },
  },
  {
    slug: "cloud-index",
    title: { en: "Cloud Index", ru: "Индекс облаков" },
    description: {
      en: "Data visualization printed on aluminium composite.",
      ru: "Визуализация данных на алюминиевом композите.",
    },
  },
  {
    slug: "wax-seal",
    title: { en: "Wax Seal", ru: "Восковая печать" },
    description: {
      en: "Encaustic and pigment on board.",
      ru: "Энкаустика и пигмент на панели.",
    },
  },
  {
    slug: "amber-field",
    title: { en: "Amber Field", ru: "Янтарное поле" },
    description: {
      en: "Landscape with gold leaf accents on canvas.",
      ru: "Пейзаж с акцентами золочения на холсте.",
    },
  },
  {
    slug: "silent-portrait",
    title: { en: "Silent Portrait", ru: "Безмолвный портрет" },
    description: {
      en: "Portrait study, natural light, medium format.",
      ru: "Портретный этюд при естественном свете, средний формат.",
    },
  },
  {
    slug: "clay-horizon",
    title: { en: "Clay Horizon", ru: "Горизонт глины" },
    description: {
      en: "Horizontal ceramic relief, 120 × 40 cm.",
      ru: "Горизонтальный керамический рельеф, 120 × 40 см.",
    },
  },
  {
    slug: "neon-verse",
    title: { en: "Neon Verse", ru: "Неоновый стих" },
    description: {
      en: "LED and acrylic wall piece with programmable sequence.",
      ru: "Настенная работа LED и акрил с программируемой последовательностью.",
    },
  },
  {
    slug: "folded-map",
    title: { en: "Folded Map", ru: "Сложенная карта" },
    description: {
      en: "Map fragments, thread and graphite on paper.",
      ru: "Фрагменты карт, нить и графит на бумаге.",
    },
  },
  {
    slug: "lake-mirror",
    title: { en: "Lake Mirror", ru: "Озеро-зеркало" },
    description: {
      en: "Reflective water study, oil on panel.",
      ru: "Этюд отражений на воде, масло на панели.",
    },
  },
  {
    slug: "urban-grid",
    title: { en: "Urban Grid", ru: "Городская сетка" },
    description: {
      en: "Aerial photograph of industrial zoning patterns.",
      ru: "Аэрофотосъёмка индустриальных зон.",
    },
  },
  {
    slug: "marble-breath",
    title: { en: "Marble Breath", ru: "Мраморное дыхание" },
    description: {
      en: "White marble carving with pierced negative space.",
      ru: "Резьба по белому мрамору с прорезным негативным пространством.",
    },
  },
  {
    slug: "soft-machine",
    title: { en: "Soft Machine", ru: "Мягкая машина" },
    description: {
      en: "3D-rendered sculpture file, physical print optional.",
      ru: "3D-модель скульптуры, возможна физическая печать.",
    },
  },
  {
    slug: "ink-river",
    title: { en: "Ink River", ru: "Река туши" },
    description: {
      en: "Sumi-e inspired ink wash on rice paper.",
      ru: "Тушь на рисовой бумаге в духе суми-э.",
    },
  },
  {
    slug: "evening-balcony",
    title: { en: "Evening Balcony", ru: "Вечерний балкон" },
    description: {
      en: "Figurative painting of a city balcony at blue hour.",
      ru: "Фигуративная живопись городского балкона в синий час.",
    },
  },
];

function generateExtraArtworks(count: number): Artwork[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 9;
    const catalog = EXTRA_CATALOG[i % EXTRA_CATALOG.length];
    const slug = i < EXTRA_CATALOG.length ? catalog.slug : `${catalog.slug}-${n}`;
    const title =
      i < EXTRA_CATALOG.length
        ? catalog.title
        : {
            en: `${catalog.title.en} ${n}`,
            ru: `${catalog.title.ru} ${n}`,
          };
    const description = catalog.description;

    return {
      id: String(n),
      slug,
      categoryId: CATEGORY_ROTATION[i % CATEGORY_ROTATION.length],
      authorId: AUTHOR_ROTATION[i % AUTHOR_ROTATION.length],
      hidden: false,
      images: [`https://picsum.photos/seed/gallery-work-${n}/1200/1500`],
      title,
      description,
    };
  });
}

export function buildDefaultArtworks(): Artwork[] {
  return [...baseArtworks, ...generateExtraArtworks(25)];
}

/** Показывает текст для текущей локали; если пусто — подставляет второй язык. */
export function getLocalized(
  text: LocalizedText,
  locale: string
): string {
  const primary = locale === "ru" ? text.ru : text.en;
  const fallback = locale === "ru" ? text.en : text.ru;
  const trimmed = primary.trim();
  return trimmed.length > 0 ? trimmed : fallback.trim();
}

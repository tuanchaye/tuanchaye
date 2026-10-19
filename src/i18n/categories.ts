import { type Locale } from './config';

// 6 个规范分类的本地化名称与描述
export interface CatI18n {
  name: string;
  description: string;
}

export const CATEGORY_I18N: Record<string, Record<Locale, CatI18n>> = {
  'tea-basics': {
    en: { name: 'Tea Basics', description: 'What tea is, how it is made, and the fundamentals every beginner should know.' },
    zh: { name: '茶基础', description: '茶是什么、如何制成，以及每位初学者都该知道的基础知识。' },
    es: { name: 'Fundamentos del té', description: 'Qué es el té, cómo se elabora y lo esencial que todo principiante debe saber.' },
    fr: { name: 'Bases du thé', description: 'Ce qu’est le thé, comment il est fabriqué et les fondamentaux pour bien démarrer.' },
    de: { name: 'Tee-Grundlagen', description: 'Was Tee ist, wie er hergestellt wird und die Grundlagen für Einsteiger.' },
    ja: { name: '茶の基礎', description: '茶とは何か、どう作られるか、初心者が知るべき基本を解説します。' },
    pt: { name: 'Noções básicas', description: 'O que é o chá, como é feito e o essencial que todo iniciante deve saber.' },
    ru: { name: 'Основы чая', description: 'Что такое чай, как он производится и азы, которые должен знать каждый новичок.' },
  },
  'tea-types': {
    en: { name: 'Tea Types', description: 'Green, black, white, oolong, pu-erh and more — explore the six major types.' },
    zh: { name: '茶的种类', description: '绿茶、红茶、白茶、乌龙、普洱等——探索六大茶类。' },
    es: { name: 'Tipos de té', description: 'Verde, negro, blanco, oolong, pu-erh y más: explore los seis grandes tipos.' },
    fr: { name: 'Types de thé', description: 'Vert, noir, blanc, oolong, pu-erh et plus — explorez les six grands types.' },
    de: { name: 'Teesorten', description: 'Grün-, Schwarz-, Weiß-, Oolong-, Pu-Erh-Tee und mehr — die sechs Hauptarten.' },
    ja: { name: '茶の種類', description: '緑茶・紅茶・白茶・烏龍・普洱など、六大茶類を探る。' },
    pt: { name: 'Tipos de chá', description: 'Verde, preto, branco, oolong, pu-erh e mais — explore os seis grandes tipos.' },
    ru: { name: 'Виды чая', description: 'Зелёный, чёрный, белый, улун, пуэр и другие — шесть основных типов.' },
  },
  brewing: {
    en: { name: 'Brewing', description: 'Water temperature, ratios and step-by-step methods to brew a great cup.' },
    zh: { name: '冲泡', description: '水温、投茶比例与一步步的冲泡方法，泡出一杯好茶。' },
    es: { name: 'Preparación', description: 'Temperatura del agua, proporciones y métodos paso a paso para una taza perfecta.' },
    fr: { name: 'Infusion', description: 'Température de l’eau, dosages et méthodes pas à pas pour une tasse parfaite.' },
    de: { name: 'Zubereitung', description: 'Wassertemperatur, Mengenverhältnis und Schritt-für-Schritt-Methoden für die perfekte Tasse.' },
    ja: { name: '淹れ方', description: '水温、割合、手順を解説。美味しい一杯を淹れる方法。' },
    pt: { name: 'Preparo', description: 'Temperatura da água, proporções e métodos passo a passo para uma xícara perfeita.' },
    ru: { name: 'Заваривание', description: 'Температура воды, пропорции и пошаговые методы для отличной чашки.' },
  },
  culture: {
    en: { name: 'Culture', description: 'Tea ceremonies, history and how tea is enjoyed around the world.' },
    zh: { name: '茶文化', description: '茶道、历史，以及世界各地如何品饮茶饮。' },
    es: { name: 'Cultura', description: 'Ceremonias del té, historia y cómo se disfruta el té en el mundo.' },
    fr: { name: 'Culture', description: 'Cérémonies du thé, histoire et comment le thé se déguste dans le monde.' },
    de: { name: 'Kultur', description: 'Teezeremonien, Geschichte und wie Tee weltweit genossen wird.' },
    ja: { name: '茶文化', description: '茶道、歴史、そして世界でお茶がどう楽しまれるか。' },
    pt: { name: 'Cultura', description: 'Cerimônias do chá, história e como o chá é apreciado no mundo.' },
    ru: { name: 'Культура', description: 'Чайные церемонии, история и как чай пьют по всему миру.' },
  },
  'buying-guide': {
    en: { name: 'Buying Guide', description: 'How to choose, buy and not overpay for quality tea.' },
    zh: { name: '选购指南', description: '如何挑选、购买优质好茶，又不花冤枉钱。' },
    es: { name: 'Guía de compra', description: 'Cómo elegir, comprar y no pagar de más por un té de calidad.' },
    fr: { name: 'Guide d’achat', description: 'Comment choisir, acheter et ne pas payer trop cher un thé de qualité.' },
    de: { name: 'Kaufberatung', description: 'Wie Sie qualitativ hochwertigen Tee auswählen und faire kaufen.' },
    ja: { name: '選び方ガイド', description: '良いお茶を選び、高く買わずに手に入れる方法。' },
    pt: { name: 'Guia de compra', description: 'Como escolher, comprar e não pagar caro por um chá de qualidade.' },
    ru: { name: 'Как выбрать', description: 'Как выбрать, купить качественный чай и не переплатить.' },
  },
  'care-wellbeing': {
    en: { name: 'Care & Wellbeing', description: 'Storing tea, cleaning ware, and tea and your health.' },
    zh: { name: '存放与养生', description: '茶叶储存、器具清洁，以及茶与健康。' },
    es: { name: 'Cuidado y bienestar', description: 'Conservación del té, limpieza de utensilios y té y salud.' },
    fr: { name: 'Entretien et bien-être', description: 'Conservation du thé, nettoyage du matériel, et thé et santé.' },
    de: { name: 'Pflege & Wohlbefinden', description: 'Tee lagern, Zubehör reinigen sowie Tee und Gesundheit.' },
    ja: { name: '保管と健康', description: 'お茶の保存、器具のお手入れ、そして茶と健康。' },
    pt: { name: 'Cuidados e bem-estar', description: 'Armazenar chá, limpar utensílios e chá e saúde.' },
    ru: { name: 'Хранение и здоровье', description: 'Хранение чая, уход за посудой, а также чай и здоровье.' },
  },
};

export function getCatI18n(slug: string, locale: Locale): CatI18n {
  return CATEGORY_I18N[slug]?.[locale] ?? CATEGORY_I18N[slug]?.en ?? { name: slug, description: '' };
}

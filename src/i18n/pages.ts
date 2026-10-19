import { type Locale } from './config';

// 关于 / 联系 / 隐私 三个信息页的多语言正文（段落数组）
export const ABOUT: Record<Locale, string[]> = {
  en: [
    'TuanChaYe (团茶叶) is a Chinese-tea knowledge platform created for global readers who want to understand Chinese tea — its types, brewing methods, culture, and how to choose and buy good tea.',
    'Our content is researched and written to be beginner-friendly, accurate and practical. We are an independent site supported by advertising; we do not sell tea directly.',
  ],
  zh: [
    '团茶叶（TuanChaYe）是一个面向全球读者的中国茶知识平台，帮助你了解中国茶——它的种类、冲泡方法、茶文化，以及如何挑选与购买好茶。',
    '我们的内容经过钻研与撰写，力求通俗易懂、准确且实用。本站为独立站点，依靠广告运营，不直接售卖茶叶。',
  ],
  es: [
    'TuanChaYe (团茶叶) es una plataforma de conocimiento sobre el té chino para lectores de todo el mundo que quieren entender el té chino: sus tipos, métodos de preparación, cultura y cómo elegir y comprar buen té.',
    'Nuestro contenido está investigado y redactado para ser accesible, preciso y práctico. Somos un sitio independiente financiado por publicidad; no vendemos té directamente.',
  ],
  fr: [
    'TuanChaYe (团茶叶) est une plateforme de connaissances sur le thé chinois destinée aux lecteurs du monde entier qui souhaitent comprendre le thé chinois : ses types, ses méthodes d’infusion, sa culture et comment choisir et acheter un bon thé.',
    'Notre contenu est recherché et rédigé pour être accessible, précis et pratique. Nous sommes un site indépendant financé par la publicité ; nous ne vendons pas de thé directement.',
  ],
  de: [
    'TuanChaYe (团茶叶) ist eine Wissensplattform für chinesischen Tee für Leser weltweit, die den chinesischen Tee verstehen möchten — seine Sorten, Zubereitungsarten, Kultur sowie den Kauf von gutem Tee.',
    'Unsere Inhalte sind gründlich recherchiert und verständlich, präzise sowie praxisnah aufbereitet. Wir sind ein unabhängiges, werbefinanziertes Angebot und verkaufen keinen Tee direkt.',
  ],
  ja: [
    '団茶葉（TuanChaYe）は、中国茶を理解したい世界中の読者に向けた中国茶の知識プラットフォームです。茶の種類、淹れ方、文化、そして良いお茶の選び方と買い方をご紹介します。',
    'コンテンツは丁寧に調査・執筆され、初心者にも分かりやすく、正確で実用的です。当サイトは広告で運営する独立サイトであり、お茶を直接販売することはありません。',
  ],
  pt: [
    'TuanChaYe (团茶叶) é uma plataforma de conhecimento sobre o chá chinês para leitores de todo o mundo que querem entender o chá chinês: seus tipos, métodos de preparo, cultura e como escolher e comprar um bom chá.',
    'Nosso conteúdo é pesquisado e redigido para ser acessível, preciso e prático. Somos um site independente mantido por publicidade; não vendemos chá diretamente.',
  ],
  ru: [
    'TuanChaYe (团茶叶) — платформа знаний о китайском чае для читателей со всего мира, которые хотят понять китайский чай: его виды, способы заваривания, культуру и то, как выбрать и купить хороший чай.',
    'Наши материалы тщательно изучены и написаны просто, точно и практично. Мы независимый сайт, существующий за счёт рекламы, и не продаём чай напрямую.',
  ],
};

export const CONTACT: Record<Locale, { body: string[]; note: string }> = {
  en: {
    body: [
      'Have a question, suggestion or correction? Reach us at zhishuyunqi001@hwpys.com.',
      'We aim to reply within a few business days.',
    ],
    note: 'Please note: we share general tea knowledge only. We do not provide medical or health advice.',
  },
  zh: {
    body: [
      '有疑问、建议或纠错？欢迎来信：zhishuyunqi001@hwpys.com。',
      '我们会在几个工作日内回复。',
    ],
    note: '请注意：我们仅分享一般性的茶知识，不提供医疗或健康建议。',
  },
  es: {
    body: [
      '¿Tiene alguna pregunta, sugerencia o corrección? Escríbanos a zhishuyunqi001@hwpys.com.',
      'Intentamos responder en unos pocos días hábiles.',
    ],
    note: 'Tenga en cuenta: solo compartimos conocimientos generales sobre el té. No ofrecemos consejos médicos ni de salud.',
  },
  fr: {
    body: [
      'Une question, une suggestion ou une correction ? Écrivez-nous à zhishuyunqi001@hwpys.com.',
      'Nous essayons de répondre sous quelques jours ouvrés.',
    ],
    note: 'Notez que nous partageons uniquement des connaissances générales sur le thé. Nous ne donnons pas de conseils médicaux.',
  },
  de: {
    body: [
      'Haben Sie eine Frage, einen Vorschlag oder eine Korrektur? Schreiben Sie uns an zhishuyunqi001@hwpys.com.',
      'Wir antworten in der Regel innerhalb weniger Werktage.',
    ],
    note: 'Hinweis: Wir geben nur allgemeine Teekenntnisse weiter und keine medizinischen Ratschläge.',
  },
  ja: {
    body: [
      'ご質問、ご提案、修正のご依頼は zhishuyunqi001@hwpys.com までお寄せください。',
      '通常、数営業日以内に返信いたします。',
    ],
    note: '注意：当サイトが提供するのは一般的な茶の知識のみであり、医療・健康上のアドバイスではありません。',
  },
  pt: {
    body: [
      'Tem alguma dúvida, sugestão ou correção? Fale conosco em zhishuyunqi001@hwpys.com.',
      'Procuramos responder em alguns dias úteis.',
    ],
    note: 'Observe: compartilhamos apenas conhecimentos gerais sobre chá. Não damos conselhos médicos ou de saúde.',
  },
  ru: {
    body: [
      'Есть вопрос, предложение или замечание? Пишите нам: zhishuyunqi001@hwpys.com.',
      'Мы стараемся ответить в течение нескольких рабочих дней.',
    ],
    note: 'Обратите внимание: мы делимся только общими знаниями о чае и не даём медицинских советов.',
  },
};

export const PRIVACY: Record<Locale, { updated: string; sections: { h: string; p: string }[] }> = {
  en: {
    updated: 'Last updated: 2026-10-17',
    sections: [
      { h: '1. Information We Collect', p: 'TuanChaYe is a content website. We do not require account registration to read articles. We may collect anonymous usage data through analytics and advertising partners (such as Google AdSense) including pages viewed, approximate location, device and browser type.' },
      { h: '2. Cookies and Advertising', p: 'We use Google AdSense to serve ads. AdSense and its partners may use cookies to personalize ads and measure performance. You can manage ad preferences via Google’s Ads Settings and opt out of personalized advertising.' },
      { h: '3. Contact', p: 'For privacy requests, contact zhishuyunqi001@hwpys.com.' },
    ],
  },
  zh: {
    updated: '最后更新：2026-10-17',
    sections: [
      { h: '1. 我们收集的信息', p: '团茶叶是一个内容型网站。阅读文章无需注册账户。我们可能通过分析与广告合作伙伴（如 Google AdSense）收集匿名使用数据，包括浏览页面、大致位置、设备与浏览器类型。' },
      { h: '2. Cookie 与广告', p: '我们使用 Google AdSense 投放广告。AdSense 及其合作伙伴可能使用 Cookie 来个性化广告并衡量效果。你可通过 Google 广告设置管理偏好并选择退出个性化广告。' },
      { h: '3. 联系我们', p: '隐私相关请求请联系：zhishuyunqi001@hwpys.com。' },
    ],
  },
  es: {
    updated: 'Última actualización: 2026-10-17',
    sections: [
      { h: '1. Información que recopilamos', p: 'TuanChaYe es un sitio de contenido. No requiere registro para leer artículos. Podemos recopilar datos de uso anónimos a través de socios de analítica y publicidad (como Google AdSense), incluyendo páginas vistas, ubicación aproximada, dispositivo y tipo de navegador.' },
      { h: '2. Cookies y publicidad', p: 'Usamos Google AdSense para servir anuncios. AdSense y sus socios pueden usar cookies para personalizar anuncios y medir el rendimiento. Puede gestionar sus preferencias en la Configuración de anuncios de Google y optar por no recibir publicidad personalizada.' },
      { h: '3. Contacto', p: 'Para solicitudes de privacidad, contacte a zhishuyunqi001@hwpys.com.' },
    ],
  },
  fr: {
    updated: 'Dernière mise à jour : 2026-10-17',
    sections: [
      { h: '1. Informations collectées', p: 'TuanChaYe est un site de contenu. Aucune inscription n’est requise pour lire les articles. Nous pouvons collecter des données d’usage anonymes via des partenaires d’analyse et de publicité (comme Google AdSense), notamment les pages vues, la localisation approximative, l’appareil et le navigateur.' },
      { h: '2. Cookies et publicité', p: 'Nous utilisons Google AdSense pour diffuser des annonces. AdSense et ses partenaires peuvent utiliser des cookies pour personnaliser les annonces et mesurer les performances. Vous pouvez gérer vos préférences via les paramètres d’annonces de Google et refuser la publicité personnalisée.' },
      { h: '3. Contact', p: 'Pour toute demande relative à la confidentialité, contactez zhishuyunqi001@hwpys.com.' },
    ],
  },
  de: {
    updated: 'Zuletzt aktualisiert: 2026-10-17',
    sections: [
      { h: '1. Erhobene Informationen', p: 'TuanChaYe ist eine Inhaltswebsite. Zum Lesen der Artikel ist keine Registrierung erforderlich. Wir können anonyme Nutzungsdaten über Analyse- und Werbepartner (wie Google AdSense) erheben, darunter angesehene Seiten, ungefähren Standort, Gerät und Browsertyp.' },
      { h: '2. Cookies und Werbung', p: 'Wir verwenden Google AdSense zur Schaltung von Anzeigen. AdSense und seine Partner können Cookies verwenden, um Anzeigen zu personalisieren und die Leistung zu messen. Sie können Ihre Einstellungen über die Google-Anzeigeneinstellungen verwalten und sich von personalisierter Werbung abmelden.' },
      { h: '3. Kontakt', p: 'Für Datenschutzanfragen kontaktieren Sie zhishuyunqi001@hwpys.com.' },
    ],
  },
  ja: {
    updated: '最終更新：2026-10-17',
    sections: [
      { h: '1. 収集する情報', p: '団茶葉はコンテンツサイトです。記事を読むために登録は不要です。アナリティクスや広告パートナー（Google AdSense など）を通じて、閲覧ページ、おおよその地域、デバイスやブラウザの種類などの匿名の利用データを収集することがあります。' },
      { h: '2. Cookie と広告', p: '広告配信に Google AdSense を使用しています。AdSense とそのパートナーは、広告のパーソナライズや効果測定のために Cookie を使用する場合があります。Google の広告設定から広告の偏好を管理し、パーソナライズ広告を無効にできます。' },
      { h: '3. お問い合わせ', p: 'プライバシーに関するご要望は zhishuyunqi001@hwpys.com まで。' },
    ],
  },
  pt: {
    updated: 'Última atualização: 2026-10-17',
    sections: [
      { h: '1. Informações que coletamos', p: 'TuanChaYe é um site de conteúdo. Não é necessário cadastro para ler os artigos. Podemos coletar dados de uso anônimos por meio de parceiros de análise e publicidade (como o Google AdSense), incluindo páginas visualizadas, localização aproximada, dispositivo e tipo de navegador.' },
      { h: '2. Cookies e publicidade', p: 'Usamos o Google AdSense para veicular anúncios. O AdSense e seus parceiros podem usar cookies para personalizar anúncios e medir o desempenho. Você pode gerenciar suas preferências nas Configurações de anúncios do Google e optar por não receber publicidade personalizada.' },
      { h: '3. Contato', p: 'Para solicitações de privacidade, contate zhishuyunqi001@hwpys.com.' },
    ],
  },
  ru: {
    updated: 'Последнее обновление: 2026-10-17',
    sections: [
      { h: '1. Какие данные мы собираем', p: 'TuanChaYe — сайт с контентом. Для чтения статей регистрация не требуется. Мы можем собирать анонимные данные об использовании через партнёров по аналитике и рекламе (например, Google AdSense), включая просмотренные страницы, примерное местоположение, устройство и тип браузера.' },
      { h: '2. Cookie и реклама', p: 'Мы используем Google AdSense для показа объявлений. AdSense и его партнёры могут использовать файлы cookie для персонализации объявлений и оценки эффективности. Вы можете управлять предпочтениями в настройках рекламы Google и отказаться от персонализированной рекламы.' },
      { h: '3. Контакты', p: 'По вопросам конфиденциальности пишите на zhishuyunqi001@hwpys.com.' },
    ],
  },
};

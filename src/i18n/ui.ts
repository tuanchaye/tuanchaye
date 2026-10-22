import { type Locale } from './config';

// 全站界面文案（导航/搜索/Hero/首页/分类/文章按钮/页脚等）
// 文章正文由翻译脚本批量生成，这里只管"外壳"文案。
export interface UIStrings {
  nav: { home: string; articles: string; about: string; contact: string };
  search: { placeholder: string; aria: string };
  hero: { title: string; subtitle: string };
  home: {
    browseByCategory: string;
    latest: string;
    browseAll: string; // 后接分类名
    newGuides: string;
    viewAll: string;
  };
  category: { home: string; articlesIn: string };
  postsList: { title: string; description: string };
  article: {
    shareLabel: string;
    copy: string;
    copied: string;
    like: string;
    save: string;
    commentsTitle: string;
    yourName: string;
    commentPlaceholder: string;
    postComment: string;
    posting: string;
    beFirst: string;
    thanks: string;
    errName: string;
    errEmpty: string;
    errContact: string;
    networkErr: string;
    commentsClosed: string;
    relatedPosts: string;
  };
  footer: string;
  notAvailable: string;
  languageLabel: string;
  searchPage: { title: string; placeholder: string; noResult: string };
}

export const UI: Record<Locale, UIStrings> = {
  en: {
    nav: { home: 'Home', articles: 'Articles', about: 'About', contact: 'Contact' },
    search: { placeholder: 'Search articles…', aria: 'Search articles' },
    hero: {
      title: 'Chinese Tea Knowledge, Made Simple',
      subtitle:
        'TuanChaYe (团茶叶) is a Chinese-tea knowledge platform for global readers. Explore tea types, brewing guides, culture and how to choose your tea.',
    },
    home: {
      browseByCategory: 'Browse by Category',
      latest: 'Latest',
      browseAll: 'Browse all',
      newGuides: 'New guides are added regularly.',
      viewAll: 'View all articles',
    },
    category: { home: 'Home', articlesIn: 'Articles in' },
    postsList: {
      title: 'Articles',
      description: 'All Chinese tea articles on TuanChaYe: tea types, brewing guides and tea culture.',
    },
    article: {
      shareLabel: 'Share this article',
      copy: 'Copy link',
      copied: 'Copied!',
      like: 'Like',
      save: 'Save',
      commentsTitle: 'Comments',
      yourName: 'Your name',
      commentPlaceholder: 'Share your thought (no contact info, please)',
      postComment: 'Post comment',
      posting: 'Posting…',
      beFirst: 'Be the first to comment.',
      thanks: 'Thanks! Your comment is published.',
      errName: 'Please enter your name.',
      errEmpty: 'Please write something.',
      errContact: 'Do not leave phone / email / social / links in your comment.',
      networkErr: 'Network error, please retry.',
      commentsClosed: 'Comments are closed for this article.',
      relatedPosts: 'Related articles',
    },
    footer: '© {year} TuanChaYe · Chinese Tea Knowledge for Global Readers',
    notAvailable: 'This article is not yet available in your language. Showing the English version.',
    languageLabel: 'Language',
    searchPage: {
      title: 'Search',
      placeholder: 'Search articles…',
      noResult: 'No results found.',
    },
  },

  zh: {
    nav: { home: '首页', articles: '文章', about: '关于', contact: '联系' },
    search: { placeholder: '搜索文章…', aria: '搜索文章' },
    hero: {
      title: '中国茶文化知识，化繁为简',
      subtitle:
        '团茶叶（TuanChaYe）是一个面向全球读者的中国茶知识平台。了解茶的种类、冲泡方法、茶文化以及如何挑选好茶。',
    },
    home: {
      browseByCategory: '按分类浏览',
      latest: '最新',
      browseAll: '浏览全部',
      newGuides: '我们会持续更新更多指南。',
      viewAll: '查看全部文章',
    },
    category: { home: '首页', articlesIn: '分类文章：' },
    postsList: {
      title: '文章',
      description: '团茶叶上的全部中国茶文章：茶的种类、冲泡指南与茶文化。',
    },
    article: {
      shareLabel: '分享这篇文章',
      copy: '复制链接',
      copied: '已复制！',
      like: '点赞',
      save: '收藏',
      commentsTitle: '评论',
      yourName: '你的昵称',
      commentPlaceholder: '说说你的想法（请勿留下联系方式）',
      postComment: '发表评论',
      posting: '发表中…',
      beFirst: '来抢沙发，发表第一条评论。',
      thanks: '谢谢！你的评论已发布。',
      errName: '请填写昵称。',
      errEmpty: '请输入评论内容。',
      errContact: '评论中请勿留下电话 / 邮箱 / 社交账号 / 链接。',
      networkErr: '网络错误，请重试。',
      commentsClosed: '本文已关闭评论。',
      relatedPosts: '相关文章',
    },
    footer: '© {year} 团茶叶 TuanChaYe · 面向全球读者的中国茶知识',
    notAvailable: '本文暂未提供你的语言版本，以下为英文原文。',
    languageLabel: '语言',
    searchPage: { title: '搜索', placeholder: '搜索文章…', noResult: '没有找到相关结果。' },
  },

  es: {
    nav: { home: 'Inicio', articles: 'Artículos', about: 'Acerca de', contact: 'Contacto' },
    search: { placeholder: 'Buscar artículos…', aria: 'Buscar artículos' },
    hero: {
      title: 'El conocimiento del té chino, simplificado',
      subtitle:
        'TuanChaYe (团茶叶) es una plataforma de conocimiento sobre el té chino para lectores de todo el mundo. Explora tipos de té, guías de preparación, cultura y cómo elegir tu té.',
    },
    home: {
      browseByCategory: 'Explorar por categoría',
      latest: 'Último',
      browseAll: 'Ver todo',
      newGuides: 'Publicamos nuevas guías con regularidad.',
      viewAll: 'Ver todos los artículos',
    },
    category: { home: 'Inicio', articlesIn: 'Artículos en' },
    postsList: {
      title: 'Artículos',
      description: 'Todos los artículos sobre té chino en TuanChaYe: tipos de té, guías de preparación y cultura.',
    },
    article: {
      shareLabel: 'Compartir este artículo',
      copy: 'Copiar enlace',
      copied: '¡Copiado!',
      like: 'Me gusta',
      save: 'Guardar',
      commentsTitle: 'Comentarios',
      yourName: 'Tu nombre',
      commentPlaceholder: 'Comparte tu opinión (sin datos de contacto, por favor)',
      postComment: 'Publicar comentario',
      posting: 'Publicando…',
      beFirst: 'Sé el primero en comentar.',
      thanks: '¡Gracias! Tu comentario se ha publicado.',
      errName: 'Por favor, introduce tu nombre.',
      errEmpty: 'Por favor, escribe algo.',
      errContact: 'No dejes teléfono / correo / redes / enlaces en tu comentario.',
      networkErr: 'Error de red, inténtalo de nuevo.',
      commentsClosed: 'Los comentarios están cerrados en este artículo.',
      relatedPosts: 'Artículos relacionados',
    },
    footer: '© {year} TuanChaYe · Conocimiento del té chino para lectores de todo el mundo',
    notAvailable: 'Este artículo aún no está disponible en tu idioma. Mostrando la versión en inglés.',
    languageLabel: 'Idioma',
    searchPage: { title: 'Buscar', placeholder: 'Buscar artículos…', noResult: 'No se encontraron resultados.' },
  },

  fr: {
    nav: { home: 'Accueil', articles: 'Articles', about: 'À propos', contact: 'Contact' },
    search: { placeholder: 'Rechercher des articles…', aria: 'Rechercher des articles' },
    hero: {
      title: 'Le thé chinois expliqué simplement',
      subtitle:
        'TuanChaYe (团茶叶) est une plateforme de connaissances sur le thé chinois pour les lecteurs du monde entier. Explorez les types de thé, les guides d’infusion, la culture et comment choisir votre thé.',
    },
    home: {
      browseByCategory: 'Parcourir par catégorie',
      latest: 'Dernier',
      browseAll: 'Tout voir',
      newGuides: 'De nouveaux guides sont ajoutés régulièrement.',
      viewAll: 'Voir tous les articles',
    },
    category: { home: 'Accueil', articlesIn: 'Articles dans' },
    postsList: {
      title: 'Articles',
      description: 'Tous les articles sur le thé chinois sur TuanChaYe : types de thé, guides d’infusion et culture.',
    },
    article: {
      shareLabel: 'Partager cet article',
      copy: 'Copier le lien',
      copied: 'Copié !',
      like: 'J’aime',
      save: 'Enregistrer',
      commentsTitle: 'Commentaires',
      yourName: 'Votre nom',
      commentPlaceholder: 'Partagez votre avis (pas de coordonnées, merci)',
      postComment: 'Publier le commentaire',
      posting: 'Publication…',
      beFirst: 'Soyez le premier à commenter.',
      thanks: 'Merci ! Votre commentaire est publié.',
      errName: 'Veuillez indiquer votre nom.',
      errEmpty: 'Veuillez écrire quelque chose.',
      errContact: 'N’indiquez pas de téléphone / e-mail / réseau / lien dans votre commentaire.',
      networkErr: 'Erreur réseau, réessayez.',
      commentsClosed: 'Les commentaires sont fermés pour cet article.',
      relatedPosts: 'Articles similaires',
    },
    footer: '© {year} TuanChaYe · Connaissances sur le thé chinois pour les lecteurs du monde entier',
    notAvailable: 'Cet article n’est pas encore disponible dans votre langue. Version anglaise affichée.',
    languageLabel: 'Langue',
    searchPage: { title: 'Rechercher', placeholder: 'Rechercher des articles…', noResult: 'Aucun résultat trouvé.' },
  },

  de: {
    nav: { home: 'Start', articles: 'Artikel', about: 'Über uns', contact: 'Kontakt' },
    search: { placeholder: 'Artikel suchen…', aria: 'Artikel suchen' },
    hero: {
      title: 'Chinesisches Teewissen, einfach erklärt',
      subtitle:
        'TuanChaYe (团茶叶) ist eine Wissensplattform für chinesischen Tee für Leser weltweit. Entdecken Sie Teesorten, Zubereitungsanleitungen, Kultur und wie Sie Ihren Tee auswählen.',
    },
    home: {
      browseByCategory: 'Nach Kategorie stöbern',
      latest: 'Neueste',
      browseAll: 'Alle ansehen',
      newGuides: 'Regelmäßig erscheinen neue Anleitungen.',
      viewAll: 'Alle Artikel ansehen',
    },
    category: { home: 'Start', articlesIn: 'Artikel in' },
    postsList: {
      title: 'Artikel',
      description: 'Alle Artikel über chinesischen Tee auf TuanChaYe: Teesorten, Zubereitung und Kultur.',
    },
    article: {
      shareLabel: 'Artikel teilen',
      copy: 'Link kopieren',
      copied: 'Kopiert!',
      like: 'Gefällt mir',
      save: 'Speichern',
      commentsTitle: 'Kommentare',
      yourName: 'Ihr Name',
      commentPlaceholder: 'Teilen Sie Ihre Gedanken (bitte keine Kontaktdaten)',
      postComment: 'Kommentar absenden',
      posting: 'Wird gesendet…',
      beFirst: 'Schreiben Sie den ersten Kommentar.',
      thanks: 'Danke! Ihr Kommentar ist veröffentlicht.',
      errName: 'Bitte geben Sie Ihren Namen ein.',
      errEmpty: 'Bitte schreiben Sie etwas.',
      errContact: 'Keine Telefon- / E-Mail- / Social- / Link-Angaben im Kommentar.',
      networkErr: 'Netzwerkfehler, bitte erneut versuchen.',
      commentsClosed: 'Die Kommentare sind für diesen Artikel geschlossen.',
      relatedPosts: 'Ähnliche Artikel',
    },
    footer: '© {year} TuanChaYe · Chinesisches Teewissen für Leser weltweit',
    notAvailable: 'Dieser Artikel ist noch nicht in Ihrer Sprache verfügbar. Englische Version wird angezeigt.',
    languageLabel: 'Sprache',
    searchPage: { title: 'Suchen', placeholder: 'Artikel suchen…', noResult: 'Keine Ergebnisse gefunden.' },
  },

  ja: {
    nav: { home: 'ホーム', articles: '記事', about: '概要', contact: 'お問い合わせ' },
    search: { placeholder: '記事を検索…', aria: '記事を検索' },
    hero: {
      title: '中国茶の知識を、わかりやすく',
      subtitle:
        '団茶葉（TuanChaYe）は世界中の読者に向けた中国茶の知識プラットフォームです。茶の種類、淹れ方、文化、お茶の選び方をご紹介します。',
    },
    home: {
      browseByCategory: 'カテゴリーから探す',
      latest: '最新',
      browseAll: 'すべて見る',
      newGuides: '新しいガイドを随時公開しています。',
      viewAll: 'すべての記事を見る',
    },
    category: { home: 'ホーム', articlesIn: 'カテゴリーの記事：' },
    postsList: {
      title: '記事',
      description: '団茶葉の中国茶記事：茶の種類、淹れ方ガイド、茶文化。',
    },
    article: {
      shareLabel: 'この記事を共有',
      copy: 'リンクをコピー',
      copied: 'コピーしました！',
      like: 'いいね',
      save: '保存',
      commentsTitle: 'コメント',
      yourName: 'お名前',
      commentPlaceholder: 'ご感想をどうぞ（連絡先はご遠慮ください）',
      postComment: 'コメントを投稿',
      posting: '投稿中…',
      beFirst: '最初のコメントをどうぞ。',
      thanks: 'ありがとうございます！コメントが公開されました。',
      errName: 'お名前を入力してください。',
      errEmpty: '内容を入力してください。',
      errContact: 'コメントに電話番号・メール・SNS・リンクは入れないでください。',
      networkErr: '通信エラーです。もう一度お試しください。',
      commentsClosed: 'この記事のコメントは受け付けていません。',
      relatedPosts: '関連記事',
    },
    footer: '© {year} 団茶葉 TuanChaYe · 世界中の読者へ中国茶の知識を',
    notAvailable: 'この記事はまだあなたの言語で利用できません。英語版を表示しています。',
    languageLabel: '言語',
    searchPage: { title: '検索', placeholder: '記事を検索…', noResult: '該当する結果が見つかりませんでした。' },
  },

  pt: {
    nav: { home: 'Início', articles: 'Artigos', about: 'Sobre', contact: 'Contato' },
    search: { placeholder: 'Buscar artigos…', aria: 'Buscar artigos' },
    hero: {
      title: 'O conhecimento do chá chinês, simplificado',
      subtitle:
        'TuanChaYe (团茶叶) é uma plataforma de conhecimento sobre chá chinês para leitores de todo o mundo. Explore tipos de chá, guias de preparo, cultura e como escolher o seu chá.',
    },
    home: {
      browseByCategory: 'Navegar por categoria',
      latest: 'Mais recente',
      browseAll: 'Ver tudo',
      newGuides: 'Publicamos novos guias regularmente.',
      viewAll: 'Ver todos os artigos',
    },
    category: { home: 'Início', articlesIn: 'Artigos em' },
    postsList: {
      title: 'Artigos',
      description: 'Todos os artigos sobre chá chinês na TuanChaYe: tipos de chá, guias de preparo e cultura.',
    },
    article: {
      shareLabel: 'Compartilhar este artigo',
      copy: 'Copiar link',
      copied: 'Copiado!',
      like: 'Curtir',
      save: 'Salvar',
      commentsTitle: 'Comentários',
      yourName: 'Seu nome',
      commentPlaceholder: 'Compartilhe sua opinião (sem dados de contato, por favor)',
      postComment: 'Publicar comentário',
      posting: 'Publicando…',
      beFirst: 'Seja o primeiro a comentar.',
      thanks: 'Obrigado! Seu comentário foi publicado.',
      errName: 'Por favor, informe seu nome.',
      errEmpty: 'Por favor, escreva algo.',
      errContact: 'Não deixe telefone / e-mail / redes / links no comentário.',
      networkErr: 'Erro de rede, tente novamente.',
      commentsClosed: 'Os comentários estão encerrados neste artigo.',
      relatedPosts: 'Artigos relacionados',
    },
    footer: '© {year} TuanChaYe · Conhecimento do chá chinês para leitores de todo o mundo',
    notAvailable: 'Este artigo ainda não está disponível no seu idioma. Exibindo a versão em inglês.',
    languageLabel: 'Idioma',
    searchPage: { title: 'Buscar', placeholder: 'Buscar artigos…', noResult: 'Nenhum resultado encontrado.' },
  },

  ru: {
    nav: { home: 'Главная', articles: 'Статьи', about: 'О нас', contact: 'Контакт' },
    search: { placeholder: 'Искать статьи…', aria: 'Искать статьи' },
    hero: {
      title: 'Китайский чай — просто и понятно',
      subtitle:
        'TuanChaYe (团茶叶) — платформа знаний о китайском чае для читателей со всего мира. Узнайте о видах чая, способах заваривания, культуре и том, как выбрать свой чай.',
    },
    home: {
      browseByCategory: 'Смотреть по категориям',
      latest: 'Новое',
      browseAll: 'Смотреть всё',
      newGuides: 'Новые руководства выходят регулярно.',
      viewAll: 'Все статьи',
    },
    category: { home: 'Главная', articlesIn: 'Статьи в разделе' },
    postsList: {
      title: 'Статьи',
      description: 'Все статьи о китайском чае на TuanChaYe: виды чая, руководства по завариванию и культура.',
    },
    article: {
      shareLabel: 'Поделиться статьёй',
      copy: 'Копировать ссылку',
      copied: 'Скопировано!',
      like: 'Нравится',
      save: 'Сохранить',
      commentsTitle: 'Комментарии',
      yourName: 'Ваше имя',
      commentPlaceholder: 'Поделитесь мыслями (без контактов, пожалуйста)',
      postComment: 'Отправить комментарий',
      posting: 'Отправка…',
      beFirst: 'Будьте первым, кто напишет комментарий.',
      thanks: 'Спасибо! Ваш комментарий опубликован.',
      errName: 'Пожалуйста, введите имя.',
      errEmpty: 'Пожалуйста, напишите что-нибудь.',
      errContact: 'Не указывайте телефон / e-mail / соцсети / ссылки в комментарии.',
      networkErr: 'Ошибка сети, попробуйте ещё раз.',
      commentsClosed: 'Комментарии к этой статье закрыты.',
      relatedPosts: 'Похожие статьи',
    },
    footer: '© {year} TuanChaYe · Знания о китайском чае для читателей всего мира',
    notAvailable: 'Эта статья пока недоступна на вашем языке. Показана английская версия.',
    languageLabel: 'Язык',
    searchPage: { title: 'Поиск', placeholder: 'Искать статьи…', noResult: 'Ничего не найдено.' },
  },
};

export function getUI(locale: Locale): UIStrings {
  return UI[locale] ?? UI.en;
}

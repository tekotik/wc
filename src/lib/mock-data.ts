
export type CampaignStatus = "Черновик" | "На модерации" | "Одобрено" | "Отклонено" | "Активна" | "Завершена";

export interface Campaign {
    id: string;
    name: string;
    status: CampaignStatus;
    text: string;
    rejectionReason?: string;
    baseFile?: {
        name: string;
        content: string; // base64 encoded content
    };
    stats?: {
      data: Array<{
        date: string;
        sent: number;
        replies: number;
      }>
    },
    scheduledAt?: string;
}

export interface Reply {
    campaignId: string;
    name: string;
    reply: string;
    time: string;
    avatar: {
        src: string;
        fallback: string;
        hint: string;
    };
    unread?: boolean;
}

export const allReplies: Reply[] = [
  // Campaign: summer_sale_24
  {
    campaignId: "summer_sale_24",
    name: "Елена Воронова",
    reply: "Спасибо, очень актуально! А есть ли размеры побольше?",
    time: "2 мин назад",
    avatar: { src: "https://placehold.co/40x40.png", fallback: "ЕВ", hint: "woman thinking" },
    unread: true,
  },
  {
    campaignId: "summer_sale_24",
    name: "Максим Петров",
    reply: "Отличное предложение! Уже оформил заказ на сайте.",
    time: "15 мин назад",
    avatar: { src: "https://placehold.co/40x40.png", fallback: "МП", hint: "man smiling" },
  },
  {
    campaignId: "summer_sale_24",
    name: "Светлана Кузнецова",
    reply: "Подскажите, а суммируется ли скидка с картой лояльности?",
    time: "28 мин назад",
    avatar: { src: "https://placehold.co/40x40.png", fallback: "СК", hint: "woman glasses" },
  },
   {
    campaignId: "summer_sale_24",
    name: "Артур Пирожков",
    reply: "Это просто бомба!",
    time: "45 мин назад",
    avatar: { src: "https://placehold.co/40x40.png", fallback: "АП", hint: "man handsome" },
  },
  // Campaign: new_collection_24
  {
    campaignId: "new_collection_24",
    name: "Анна Сидорова",
    reply: "Подскажите, пожалуйста, до какого числа действует скидка на новую коллекцию?",
    time: "48 мин назад",
    avatar: { src: "https://placehold.co/40x40.png", fallback: "АС", hint: "woman casual" },
    unread: true,
  },
  {
    campaignId: "new_collection_24",
    name: "Иван Козлов",
    reply: "Коллекция супер! Есть ли доставка в Санкт-Петербург?",
    time: "1 час назад",
    avatar: { src: "https://placehold.co/40x40.png", fallback: "ИК", hint: "man thoughtful" },
  },
  {
    campaignId: "new_collection_24",
    name: "Дмитрий Иванов",
    reply: "Ого, выглядит круто. А из какого материала сделаны куртки?",
    time: "2 часа назад",
    avatar: { src: "https://placehold.co/40x40.png", fallback: "ДИ", hint: "man professional" },
  },
  {
    campaignId: "new_collection_24",
    name: "Мария Новикова",
    reply: "Здравствуйте! Не могу найти на сайте синее платье из рассылки.",
    time: "2 часа назад",
    avatar: { src: "https://placehold.co/40x40.png", fallback: "МН", hint: "woman elegant" },
  },
  // Campaign: loyalty_program
  {
    campaignId: "loyalty_program",
    name: "Ольга Белова",
    reply: "Спасибо за информацию о программе лояльности. Как я могу присоединиться?",
    time: "3 часа назад",
    avatar: { src: "https://placehold.co/40x40.png", fallback: "ОБ", hint: "woman happy" },
  },
];


// This data is now seeded into campaigns.json and this file is no longer the source of truth for campaigns.
// It is kept for type definitions.
export const mockCampaigns: Campaign[] = [];


import { NextResponse } from 'next/server';
import { getCampaignById } from '@/lib/campaign-service';
import { getRepliesFromCsvUrl } from '@/lib/replies-service';

// Отключаем кеширование для этого маршрута
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id;
    if (!campaignId) {
      return NextResponse.json({ error: 'ID кампании не указан' }, { status: 400 });
    }

    const campaign = await getCampaignById(campaignId);

    if (!campaign) {
      return NextResponse.json({ error: 'Кампания не найдена' }, { status: 404 });
    }

    // Извлекаем URL CSV-файла из текста кампании
    const csvUrlMatch = campaign.text.match(/База: (https?:\/\/[^\s]+)/);
    const csvUrl = csvUrlMatch ? csvUrlMatch[1] : null;

    // Получаем ответы, используя этот URL
    const { replies } = await getRepliesFromCsvUrl(csvUrl);

    // Возвращаем данные в формате JSON
    return NextResponse.json({ campaign, replies });

  } catch (error) {
    console.error(`Ошибка в API-маршруте для кампании ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Внутренняя ошибка сервера';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

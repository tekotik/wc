
import { NextResponse } from 'next/server';
import { getCampaignById } from '@/lib/campaign-service';

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
    
    // Возвращаем данные в формате JSON
    return NextResponse.json({ campaign });

  } catch (error) {
    console.error(`Ошибка в API-маршруте для кампании ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Внутренняя ошибка сервера';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

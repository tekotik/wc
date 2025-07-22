
import React from 'react';
import ClientRepliesView from './_components/client-replies-view';

// This makes the page dynamic, so it's rendered for each request, preventing cached data.
export const dynamic = 'force-dynamic';

export default function ClientCampaignPage({ params }: { params: { id: string } }) {

  return (
    <ClientRepliesView campaignId={params.id} />
  );
}


'use client';

import React, { useEffect } from 'react';
import { markRepliesAsReadAction } from '../actions';

/**
 * This is a client component that triggers the server action to mark all replies as read.
 * This is the correct way to trigger a revalidation from a page load, by doing it
 * in a client-side effect after the initial render, rather than during the render itself.
 */
export default function RepliesPageClient() {
  useEffect(() => {
    // This action will run on the server, update the data, and revalidate the path.
    markRepliesAsReadAction();
  }, []);

  return null; // This component doesn't render anything
}

import {config} from 'dotenv';
config();

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This is a default instance, but API calls should provide their own key.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});

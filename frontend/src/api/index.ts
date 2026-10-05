import { httpApi } from './httpApi';
import { mockApi } from './mockApi';
import type { Api } from './api';

// Use real backend (httpApi) for local development (which has your 27 beans).
// Use mockApi for GitHub Pages deployment.
export const api: Api = import.meta.env.DEV ? httpApi : mockApi;

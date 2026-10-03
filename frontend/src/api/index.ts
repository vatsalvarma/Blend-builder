import { mockApi } from './mockApi';
import type { Api } from './api';

// Using mockApi so the app functions as a static demo on GitHub Pages without a backend.
export const api: Api = mockApi;

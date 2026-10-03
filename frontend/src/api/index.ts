import { httpApi } from './httpApi';
import type { Api } from './api';

// For this project, we'll use httpApi in production and dev if connected to backend.
// To use a mock, we could export a mockApi conditionally.
export const api: Api = httpApi;

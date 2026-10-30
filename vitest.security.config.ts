import {defineConfig} from 'vitest/config';
export default defineConfig({test:{include:['tests/session.test.ts'],environment:'node'}});

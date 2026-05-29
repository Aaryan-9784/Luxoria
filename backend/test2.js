import { generateAccessToken } from './src/services/authService.js';
try {
  generateAccessToken('123');
} catch (e) {
  console.error(e);
}

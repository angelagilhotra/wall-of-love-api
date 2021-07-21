import { Router } from 'express';
import wol from './routes/wol.js';

export default () => {
  const app = Router();
  wol(app);
  return app;
};

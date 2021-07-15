import { Router } from 'express';
import wol from './routes/wol';

export default () => {
  const app = Router();
  wol(app);
  return app;
};

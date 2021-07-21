import expressLoader from './express.js';
import Logger from './logger.js';

export default async (app) => {
  await expressLoader(app);
  Logger.info('✌️ Express loaded');
};

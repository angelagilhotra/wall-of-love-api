import expressLoader from './express';
import Logger from './logger';

export default async (app) => {
  await expressLoader(app);
  Logger.info('✌️ Express loaded');
};

/* eslint-disable import/prefer-default-export */
import Airtable from 'airtable';
import config from '../config';

const base = new Airtable({
  apiKey: config.airtable.kernel_main.api_key,
}).base(config.airtable.kernel_main.base_key);

export async function createRow(data, tableName) {
  return base(tableName).create([{
    fields: { ...data },
  }]);
}

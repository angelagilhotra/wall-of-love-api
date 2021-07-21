/* eslint-disable import/prefer-default-export */
import { createRow } from '../services/airtable.js';
/**
 * upload testimonials to airtable
 */
export const uploadTestimonialToAirtable = async (req, res, next) => {
  /**
   * @note the keys in `data` json need to change if the column name on airtable changes
   */
  if (req.testimonial) {
    const WOLTable = 'Wall of Love';
    const data = {
      link: req.testimonial.link,
      override_text: req.testimonial.override_text,
    };
    req.responsePayload = await createRow(data, WOLTable);
  }
  next();
};

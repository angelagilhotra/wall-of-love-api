import {
  parseAndGenerateObject,
  parseSource,
  upload,
  fetchRaw,
  markTestimonialsNotStale,
  markAllTestimonialsStale,
} from '../services/testimonial.js';

export const parseAndUploadTestimonials = async (req, res, next) => {
  let data = [];
  const parsedSource = [];
  req.testimonials.forEach((obj) => {
    const testimonialObject = parseAndGenerateObject(obj);
    parsedSource.push(parseSource(testimonialObject));
  });
  data = await Promise.all(parsedSource);
  await upload(data);
  req.responsePayload = data;
  next();
};

export const fetchTestimonialsRaw = async (req, res, next) => {
  req.responsePayload = await fetchRaw();
  next();
};

export const updateStale = async (req, res, next) => {
  // mark stale: true for all records
  await markAllTestimonialsStale();
  // mark stale: false for given record Ids
  req.responsePayload = markTestimonialsNotStale({ recordIds: req.testimonialRecordIds });
  next();
};

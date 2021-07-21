import {
  parseAndGenerateObject,
  parseSource,
  upload,
  fetchRaw,
  markTestimonialsNotStale,
  markAllTestimonialsStale,
} from '../services/testimonial.js';

export const parseAndUploadTestimonials = async (req, res, next) => {
  const data = [];
	for (const obj of req.testimonials) {
		const testimonialObject = parseAndGenerateObject(obj);
    data.push(await parseSource(testimonialObject));
	}
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
  req.responsePayload = markTestimonialsNotStale({recordIds: req.testimonialRecordIds});
  next();
};

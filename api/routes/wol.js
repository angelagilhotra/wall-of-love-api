// import dependencies
import { Router } from 'express';
import parseAndRespond from '../middlewares/parseAndRespond';
import { parseAndUploadTestimonials, fetchTestimonialsRaw, updateStale } from '../../controllers/testimonialsController';
import { respondToSlackChallenge, slackConfiguration } from '../../controllers/slackWorkflowController';
import { uploadTestimonialToAirtable } from '../../controllers/airtableController';

const route = Router();

export default (app) => {
  app.use('/wol', route);
  // test route
  route.get('/', (req, res) => {
    res.status(200).json({
      message: 'Connected to Wall of Love!',
    });
  });
  /**
   * POST to upload testimonial to the Database
   * @note only purpose is to keep heroku DB in sync with airtable table
   * runs every 15 mins from airtable automation
   */
  route.post(
    '/new',
    async (req, res, next) => {
      req.testimonials = req.body.data;
      next();
    },
    parseAndUploadTestimonials,
    parseAndRespond,
  );

  /**
   * POST to mark testimonials as stale (deleted from airtable)
   * runs every 15 mins from airtable automation
   * marks all record ids that are not present on airtable table as stale: true
   */
  route.post('/sync',
    async (req, res, next) => {
      // expects array of record ids in 'data' field
      req.testimonialRecordIds = req.body.data;
      next();
    },
    updateStale,
    parseAndRespond);

  /**
   * GET to fetch all testimonials, all columns
   * @todo add pagination
   */
  route.get(
    '/raw',
    fetchTestimonialsRaw,
    parseAndRespond,
  );
  /**
   * POST to submit new testimonial from slack ⚡️
   */
  route.post(
    '/slack/new',
    respondToSlackChallenge,
    (req, res, next) => {
      if (req.body.event) {
        req.testimonial = {
          link: req.body.event.workflow_step.inputs.link_to_testimonial.value,
          override_text: req.body.event.workflow_step.inputs.override_text.value,
        };
      }
      next();
    },
    uploadTestimonialToAirtable,
    parseAndRespond,
  );
  /**
   * POST to open slack modal from ⚡️
   */
  route.post(
    '/slack/configure',
    slackConfiguration,
    parseAndRespond,
  );
};

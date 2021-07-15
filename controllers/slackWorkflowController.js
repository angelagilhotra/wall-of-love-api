import viewModal from './helpers/configureWOL';
import { openView, updateConfigurationView, generateInputs } from '../services/slack';

/**
 * respond to slack challenge api call - done to verify if the endpoint is working
 */
export const respondToSlackChallenge = async (req, res, next) => {
  if (req.body.challenge) {
    res.status(200).send({ challenge: req.body.challenge });
  }
  next();
};

/**
 * configuration screen of the workflow (seen when building the workflow)
 * editing & confirmation
 */
export const slackConfiguration = async (req, res, next) => {
  const payload = JSON.parse(req.body.payload);
  if (payload.type === 'workflow_step_edit') {
    const triggerId = payload.trigger_id;
    const { view } = viewModal;
    req.responsePayload = await openView({ triggerId, view });
  } else if (payload.type === 'view_submission') {
    const inputs = generateInputs({ state: payload.view.state.values });
    const workflowStepEditId = payload.workflow_step.workflow_step_edit_id;
    req.responsePayload = await updateConfigurationView({ workflowStepEditId, inputs });
  }
  next();
};

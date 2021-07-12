import viewModal from './helpers/modals/configureWOL.js'
import {openView, updateConfigurationView} from './helpers/slack.js'
export const respondToSlackChallenge = async (req, res, next) => {
	if (req.body['challenge']) {
		res.status(200).send({ 'challenge': req.body['challenge'] })
	}
	next()
}

export const slackConfiguration = async (req, res, next) => {
	const payload = JSON.parse(req.body['payload'])
	if (payload.type === 'workflow_step_edit') {
		const trigger_id = payload['trigger_id']
		const view = viewModal.view
		req.responsePayload = await openView({trigger_id, view})
	} else if (payload.type === 'view_submission') {
		const state = payload['view']['state']['values']
		const inputs = {}
		for (const s in state) {
			const _in = state[s]
			for (const _i in _in) {
				inputs[_i] = _in[_i]
			}
		}
		const workflow_step_edit_id = payload['workflow_step']['workflow_step_edit_id']
		req.responsePayload = await updateConfigurationView({workflow_step_edit_id, inputs})
	}
	next()
}

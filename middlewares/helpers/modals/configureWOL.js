const viewModal = {
	'view': {
		'type': 'workflow_step',
		'blocks': [
			{
				'type': 'input',
				'element': {
					'type': 'plain_text_input',
					'action_id': 'link_to_testimonial',
					'placeholder': {
						'type': 'plain_text',
						'text': 'link to testimonial'
					}
				},
				'label': {
					'type': 'plain_text',
					'text': 'link to testimonial'
				}
			},
			{
				'type': 'input',
				'element': {
					'type': 'plain_text_input',
					'action_id': 'override_text',
					'placeholder': {
						'type': 'plain_text',
						'text': 'override_text'
					}
				},
				'label': {
					'type': 'plain_text',
					'text': 'override_text'
				}
			}
		]
	}
}
export default viewModal

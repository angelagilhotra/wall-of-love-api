/* eslint-disable no-useless-escape */
// import config
import { WebClient } from '@slack/web-api';
import config from '../config/index.js';

// initialise constants
const slackBotToken = config.slack.bot_token;
const slackWOLWorkflowToken = config.slack.wol_bot_token;

const slackClient = new WebClient(slackBotToken);
const slackWOLClient = new WebClient(slackWOLWorkflowToken);

export async function openView({ triggerId, view }) {
  return slackWOLClient.views.open({
    trigger_id: triggerId, view,
  });
}

export function generateInputs({ state }) {
  const inputs = {};
  Object.keys(state).forEach((key) => {
    const i = state[key];
    Object.keys(i).forEach((iKey) => {
      inputs[iKey] = i[iKey];
    });
  });
  return inputs;
  // for (const s in state) {
  //   const _in = state[s];
  //   for (const _i in _in) {
  //     inputs[_i] = _in[_i];
  //   }
  // }
}

export async function updateConfigurationView({
  workflowStepEditId, inputs,
}) {
  return slackWOLClient.workflows.updateStep({
    workflowStepEditId,
    inputs,
  });
}

async function replaceMentionedUsers(text) {
  let t = text;
  const matches = text.matchAll('\<([^>]*)\>');
  const mentionedUsers = [];
  [...matches].forEach((match) => {
    if (match[1].substring(1)[0] === 'U') {
      mentionedUsers.push(match[1].substring(1));
    }
  });
  let users = [];
  // eslint-disable-next-line prefer-const
  let userPromises = [];
  mentionedUsers.forEach((user) => {
    userPromises.push(slackClient.users.info({ user }));
  });
  users = await Promise.all(userPromises);
  users.forEach((u) => {
    const user = u.user.real_name.replace(/ /g, '');
    t = t.replace(`<@${user.id}>`, `@${user}`);
  });
  return t;
}

/**
 * fetch a slack message details (image, author, message) given channel and message id
 * @param {string} conversationId slack channel id
 * @param {string} messageId timestamp of the message
 * @param {string} oText overridden text
 * @param {string} oImage overriden image
 * @returns { image: image of author, author: author name, text: text of the message }
 */
export async function fetchSlackMessage({
  conversationId, messageId, oText, oImage,
}) {
  const r = await slackClient.conversations.history({
    channel: conversationId,
    inclusive: true,
    limit: 1,
    latest: messageId,
    oldest: messageId,
  });
  const intermediateText = r.messages[0].text;
  let text = await replaceMentionedUsers(intermediateText);
  const intermediateAuthor = await slackClient.users.info({
    user: r.messages[0].user,
  });
  const author = intermediateAuthor.user.real_name;
  let image = intermediateAuthor.user.profile.image_72;

  if (oText) {
    text = oText;
  }
  if (oImage) {
    image = oImage;
  }

  if (r.ok) {
    return { image, author, text };
  } return 'error';
}

/**
 *
 * @param {string} url url of a message from slack
 * @returns {conversationid: channel id, messageId: timestamp}
 */
export function fetchSlackConversationAndMessageId(url) {
  const r = url.split('/');
  const c = r.findIndex((el) => el === 'archives');
  const messageId = (r[c + 2].replace('p', '') * 0.000001).toFixed(6);
  return { conversationId: r[c + 1], messageId };
}

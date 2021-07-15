import needle from 'needle';
import config from '../config';

const twitterLookupEndpoint = 'https://api.twitter.com/2/tweets/';
const twitterBearerToken = config.twitter.bearer_token;

export function fetchTweetIdFromUrl(url) {
  const r = url.split('/');
  const c = r.findIndex((el) => el === 'status');
  return r[c + 1];
}

export async function fetchFromTwitter({
  id,
  text,
  image,
}) {
  const params = {
    expansions: 'author_id',
    'user.fields': 'profile_image_url',
  };
  const r = await needle('get', twitterLookupEndpoint + id, params, {
    headers: {
      'User-Agent': 'v2TweetLookupJS',
      authorization: `Bearer ${twitterBearerToken}`,
    },
  });
  return {
    image: image || r.body.includes.users[0].profile_image_url.replace('normal', 'bigger'),
    author: r.body.includes.users[0].username,
    text: text || r.body.data.text,
  };
}

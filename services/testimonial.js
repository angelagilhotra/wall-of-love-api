import Prisma from '@prisma/client';
import { fetchSlackConversationAndMessageId, fetchSlackMessage } from './slack';
import { fetchFromTwitter, fetchTweetIdFromUrl } from './twitter';
import Logger from '../loaders/logger';

const { PrismaClient } = Prisma;
const prisma = new PrismaClient();

// @todo {generic}
const supportedFormats = ['twitter', 'slack', '{generic}'];

export const parseAndGenerateObject = (obj) => {
  const testimonialObject = {
    id: '',
    link: '',
    override_text: '',
    override_image: '',
    source: '',
  };
  // const keys = Object.keys(testimonialObject);
  Object.keys(testimonialObject).forEach((tKey) => {
    testimonialObject[tKey] = obj[tKey];
  });
  // for (const key of keys) {
  //   testimonialObject[key] = obj[key];
  // }
  supportedFormats.forEach((source) => {
    if (obj.link.includes(source)) {
      testimonialObject.source = source;
    }
  });
  // for (const source of supportedFormats) {
  //   if (obj.link.includes(source)) testimonialObject.source = source;
  // }
};

export const parseSource = async (obj) => {
  let parsed;
  // twitter
  if (obj.source === supportedFormats[0]) {
    const tweetId = fetchTweetIdFromUrl(obj.link);
    parsed = await fetchFromTwitter({
      id: tweetId,
    });
  }
  // slack
  if (obj.source === supportedFormats[1]) {
    const { conversationId, messageId } = fetchSlackConversationAndMessageId(obj.link);
    parsed = await fetchSlackMessage({
      conversationId, messageId,
    });
  }

  return {
    ...obj,
    image: parsed.image,
    author: parsed.author,
    text: parsed.text,
  };
};

/**
 * find a testimonial in the local database
 * if found - update
 * if not found - create new
 * find happens via 'id'
 * @param {array} data array of testimonial objects
 */
export const upload = async (data) => {
  data.forEach(async (testimonial) => {
    await prisma.testimonials.upsert({
      where: {
        id: testimonial.id,
      },
      create: {
        id: testimonial.id,
        source: testimonial.source,
        url: testimonial.link,
        author_name: testimonial.author,
        text: testimonial.text,
        author_image: testimonial.image,
      },
      update: {
        source: testimonial.source,
        url: testimonial.link,
        author_name: testimonial.author,
        text: testimonial.text,
        author_image: testimonial.image,
      },
    });
  });
};

export const fetchRaw = async () => prisma.testimonials.findMany({
  orderBy: {
    id: 'asc',
  },
  where: {
    stale: false,
  },
});

export const markTestimonialsNotStale = async ({ recordIds }) => {
  const data = [];
  recordIds.testimonialRecordIds.forEach(async (rec) => {
    try {
      data.push(await prisma.testimonials.update({
        where: { id: rec },
        data: { stale: false },
        select: { id: true },
      }));
    } catch (err) {
      Logger.error(err);
      Logger.error('error on update');
    }
  });
  return data;
};

export const markAllTestimonialsStale = async () => {
  await prisma.testimonials.updateMany({
    data: { stale: true },
  });
};

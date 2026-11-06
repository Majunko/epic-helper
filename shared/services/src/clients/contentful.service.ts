import * as contentful from 'contentful';

const {CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN} = process.env;

const hasContentfulCredentials =
  !!CONTENTFUL_SPACE_ID && !!CONTENTFUL_ACCESS_TOKEN;

export const contentfulService =
  hasContentfulCredentials &&
  contentful.createClient({
    // @ts-ignore
    space: process.env.CONTENTFUL_SPACE_ID,

    // @ts-ignore
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });

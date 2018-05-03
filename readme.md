# Chatlog

Blogs by Brian and various Chatmans

## Setup

This site is built from the static site generator, Spike.

- make sure [node.js](http://nodejs.org) is at version >= `6`
- `npm i spike -g`
- run `npm install`
- run `spike watch` or `spike compile`

## Testing

Tests are located in `test/**` and are powered by [ava](https://github.com/sindresorhus/ava)
- `npm install` to ensure devDeps are installed
- `npm test` to run test suite

## Deploy

Staging is on Netlify, which enables continuous deployment. Any push to master will update Netlify stating.

If there isn't already a staging server setup for this site, then we can set it up via command line. Make sure you have Netlify CLI installed:

`npm install netlify-cli -g`

Then, setup the Netlify config:

`netlify init`

To make things more efficient, we'll add a webhook to trigger the build when we update something in Contentful. Add a new one in the webhooks section of the Netlify dashboard. Go to Settings -> Build & deploy -> Build hooks and create a new hook URL.

Then, in your Contentful app, go to Settings -> Webhooks -> New Webhook and paste the URL provided by Netlify.

The changes won't be instant. You may not see changes for a minute.

## Notes

- Add your own Contentful settings in app.js
- Change the content types you pull in for Contentful to match your Contentful content models
- Add your sitename in app.js

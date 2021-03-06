require('dotenv').config({ silent: true });
const htmlStandards = require('reshape-standard');
const cssStandards = require('spike-css-standards');
const jsStandards = require('spike-js-standards');
const Contentful = require('spike-contentful');
const marked = require('marked');
const globImporter = require('node-sass-glob-importer');
const moment = require('moment');

const env = process.env.SPIKE_ENV;
const previewToken = process.env.PREVIEW_TOKEN;
const deliveryToken = process.env.ACCESS_TOKEN;
// This is the local variable object to be accessed via template files
const space = process.env.SPACE_ID;
// The variables above implement dotenv and pull access tokens from an external source.
// site URL
const siteUrl = 'https://www.chatlog.blog';
const locals = {};
// Add markdown to local variables so they can be used in templates
marked.setOptions({
  gfm: true,
  tables: true
});
locals.md = marked;
// Add current year to local variables
locals.year = new Date().getFullYear();
// Sitename to be used in templates
locals.sitename = 'Chatlog';
locals.env = env;
locals.siteUrl = siteUrl;

module.exports = {
  devtool: 'source-map',
  matchers: { html: '*(**/)*.html', css: '*(**/)*.scss' },
  ignore: [
    '**/index.html',
    'src/components/**/*.scss',
    'src/components/**/*.html',
    '**/.*',
    'readme.md',
    'yarn.lock'
  ],
  module: {
    rules: [
      {
        test: /\.scss/,
        use: [
          {
            loader: 'sass-loader',
            options: {
              importer: globImporter()
            }
          }
        ]
      },
      {
        test: /\.js/,
        use: [
          {
            loader: 'import-glob'
          }
        ]
      }
    ]
  },
  dumpDirs: ['src'],
  postcss: cssStandards({
    minify: env === 'production',
    warnForDuplicates: env !== 'production',
    plugins: { browsers: ['last 4 versions', '> 1%', 'ie >= 9'] }
  }),
  babel: jsStandards(),
  plugins: [
    new Contentful({
      addDataTo: locals,
      spaceId: space || 'yourspace',
      accessToken: env !== 'production' ? previewToken : deliveryToken,
      preview: env !== 'production',
      // By default, this plugin will only fetch data once when you start your watcher, for development speed purposes. This means that if you change your data, you will have to restart the watcher to pick up the changes. If you are in a phase where you are making frequent data changes and would like a more aggressive updating strategy, you can set the aggressiveRefresh option to true, and your dreams will come true. However, note that this will slow down your local development, as it will fetch and link all entires every time you save a file, so it's only recommended for temporary use.
      // aggressiveRefresh: true,
      contentTypes: [
        {
          name: 'pages',
          id: 'page',
          transform: page => {
            const updated = page;
            updated.canonical = `${siteUrl}/${updated.fields.slug}`;
            return updated;
          },
          template: {
            path: 'src/layout/page.html',
            output: page => {
              if (page.fields.slug === 'chatlog') {
                return `index.html`;
              }
              return `${page.fields.slug}.html`;
            }
          }
        },
        {
          name: 'posts',
          id: 'post',
          filters: {
            order: '-fields.manualDate'
          },
          transform: post => {
            const updated = post;
            const { content, author, manualDate, tags, slug } = updated.fields;
            const { createdAt } = updated.sys;

            if (content) {
              updated.content = marked(content);
            } else {
              updated.content = '';
            }

            if (tags) {
              updated.tags = tags.join(' ');
            } else {
              updated.tags = false;
            }

            updated.slug = post.fields.slug;

            updated.date = manualDate
              ? moment(manualDate).format('D MMMM YYYY')
              : moment(createdAt).format('D MMMM YYYY');
            if (author && author.fields) {
              updated.author = author.fields.name;
            }
            updated.canonical = `${siteUrl}/${slug}`;
            return updated;
          },
          template: {
            path: 'src/layout/post.html',
            output: post => `${post.slug}.html`
          }
        }
      ],
      json: 'data.json'
    })
  ],
  reshape: htmlStandards({
    locals: () => locals,
    minify: env === 'production',
    retext: []
  }),
  entry: { 'assets/main': ['./src/assets/main.js'] }
};

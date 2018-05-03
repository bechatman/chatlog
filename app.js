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
          transform: post => {
            const updated = post;
            const { category, content, author } = updated.fields;
            const { createdAt } = updated.sys;
            if (category.fields) {
              const cat = category.fields.name
                .toLowerCase()
                .replace(/\s/g, '-');
              updated.slug = `${cat}/${updated.fields.slug}`;
            } else {
              updated.slug = `${updated.fields.slug}`;
            }
            updated.content = marked(content);
            updated.date = moment(createdAt).format('D MMMM YYYY');
            updated.author = author.fields.name;
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

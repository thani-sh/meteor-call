Package.describe({
  name: 'mnmtanish:call',
  summary: "Simple method calls for Meteor",
  git: 'https://github.com/mnmtanish/meteor-call.git',
  version: "1.1.0",
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('reactive-var')
  api.addFiles('lib/call.js');
  api.export('Call')
});

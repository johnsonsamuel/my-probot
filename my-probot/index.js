/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */

const axios = require('axios');

const {
  createUnitTestsAnnotations,
  createOutdatedCheckAnnotations,
  createAuditCheckAnnotations,
  createESLintAnnotations
} = require('./checks');

module.exports = async app => {
  app.log('Yay, the app was loaded! Johnson C Samuel');

  // Get an express router to expose new HTTP endpoints
  const router = app.route('/my-app')
  router.get('/hello-world', (req, res) => {
    res.send('Hello World')
  })
 

  app.on(['check_run.completed'], async context => {
    const checkRun = context.payload.check_run;

    axios.get(context.payload.check_run.url + '/annotations', {
      headers: { 'Accept': 'application/vnd.github.antiope-preview+json' }
    })
      .then(response => {
        const { data } = response;

        /* 
          TODO - As of now, updating a automatically initiated check run is not possible, 
          so parsing the initial check run output and creating a new check run with presentable annotations and summary.
         */

        if (checkRun.name.includes('tests-check')) {
          createUnitTestsAnnotations(data, context);
        } else if (checkRun.name.includes('eslint-check')) {
          createESLintAnnotations(data, context);
        } else if (checkRun.name.includes('outdated-check')) {
          createOutdatedCheckAnnotations(data, context);
        } else if (checkRun.name.includes('audit-check')) {
          createAuditCheckAnnotations(data, context);
        }
      });
  })
}



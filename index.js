/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */



module.exports = async app => {
  app.log('Yay, the app was loaded! Johnson C Samuel');

  app.on('issues.opened', async context => {
    // A new issue was opened, what should we do with it?
    app.log('Issue opened', context.payload);
    context.log(context.payload)
  })
}



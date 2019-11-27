//Create check run for ESLint
const createESLintAnnotations = (data, context) => {
    const repoOwner = context.payload.repository.owner.login;
    const repoName = context.payload.repository.name;
    data.map((item) => {
      item.raw_details = 'Does not have raw details';
      return item.end_column !== null;
    })

    return context.github.checks.create({
      owner: repoOwner,
      repo: repoName,
    name: 'ESLint - Annotations Bot',
      head_sha: context.payload.check_run.head_sha,
      conclusion: 'failure',
      output: {
        title: 'ESLint Check',
        summary: `<h1>Summary</h1>`,
        annotations: data
      }
    })

  }

  module.exports = createESLintAnnotations
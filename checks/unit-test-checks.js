
const createUnitTestsAnnotations = (data, context) => {
    const repoOwner = context.payload.repository.owner.login;
    const repoName = context.payload.repository.name;

    const formattedAnnotationsData = [];
    const failedUnitTestsInfo = data.filter(item => item.annotation_level === 'failure');

    failedUnitTestsInfo.map(item => {
        const formattedMessage = item.message.trim().replace(/"|'|,/g, '');
        const annotationMessage = formattedMessage.split('error').map(val => val.trim());
        const lineNumbers = annotationMessage[0].split(':');

        const splitMessage = annotationMessage[1].split('path:');


        const message = splitMessage[0];
        const splitPathName = splitMessage[1].split('name:')
        const path = splitPathName[0];
        const name = 'name: ' + splitMessage[1];


        formattedAnnotationsData.push({
            start_line: parseInt(lineNumbers[0]),
            end_line: parseInt(lineNumbers[0]),
            start_column: 0,
            end_column: parseInt(lineNumbers[1]),
            annotation_level: 'failure',
            title: name,
            message: message.trim(),
            path: path.trim()
        });

        return context.github.checks.create({
            owner: repoOwner,
            repo: repoName,
            name: 'Unit tests - Annotations Bot',
            head_sha: context.payload.check_run.head_sha,
            conclusion: 'failure',
            output: {
                title: 'Annotations List',
                summary:
                    `<div>
            <h3>Summary</h3>
          </div>`,
                annotations: formattedAnnotationsData.filter((item) => item.end_column !== null)
            }
        })
    });
};

module.exports = createUnitTestsAnnotations

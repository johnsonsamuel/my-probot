const validatePackageVersion = (output) => {
    const current = parseFloat(output.current);
    const latest = parseFloat(output.latest);

    return current < latest ?
        `<span style="color:#FF0000">😕${output.current}</span>`
        : `<span style="color:#90ee90">😎${output.current}</span>`
}
const createOutdatedCheckAnnotations = (data, context) => {
    const repoOwner = context.payload.repository.owner.login;
    const repoName = context.payload.repository.name;

    const outputData = data.map(item => {
        return JSON.parse(item.message.split('~')[1])
    });

    const summaryData = outputData.length && Object.keys(outputData[0]).map(key =>
        `<tr>
        <td>${key}</td>
        <td>${validatePackageVersion(outputData[0][key])}</td>
        <td>${outputData[0][key].wanted}</td>
        <td>${outputData[0][key].latest}</td>
    </tr>`).join('');


    return context.github.checks.create({
        owner: repoOwner,
        repo: repoName,
        name: 'Outdated Check - Annotations Bot',
        head_sha: context.payload.check_run.head_sha,
        conclusion: 'success',
        output: {
            title: 'Outdated Check',
            summary: `<h1>Summary</h1> <table>
            <tr>
            <th>Package name</th>
            <th>Current</th>
            <th>Wanted</th>
            <th>Latest</th>
            </tr>
            ${summaryData}
            </table>`,
            annotations: []
        }
    })

}


module.exports = createOutdatedCheckAnnotations;
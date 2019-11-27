const severities = [{
    type: 'high',
    emoji: '🤕'
}, {
    type: 'low',
    emoji: '😟'
},{
    type: 'info',
    emoji: '🧐'
},{
    type: 'moderate',
    emoji: '😐'
},{
    type: 'critical',
    emoji: '‼️'
}];

const renderSeverityValue = (selectedSeverity) => {
    const severityValue = severities.filter(severity => severity.type === selectedSeverity)[0];
    return severityValue ? severityValue.emoji : '';
}

const renderVulnerabilitiesSummary = (summaries) => {
    return Object.keys(summaries).map(summary => `<span><b>${summary}</b>: ${summaries[summary]}</span>`).join(', ')
};

const createAuditCheckAnnotations = (data, context) => {
    const repoOwner = context.payload.repository.owner.login;
    const repoName = context.payload.repository.name;

    if (!data.length) return;

    const outputData = JSON.parse(data[0].message.split('~')[1]);

    const summaryData = Object.keys(outputData.advisories)
        .map(item => outputData.advisories[item])
        .map(advisory =>
            `<tr>
                <td>${advisory.module_name}</td>
                <td>${advisory.title}</td>
                <td><span style="color:green" class="severity">${advisory.vulnerable_versions}</span></td>
                <td><span style="color:green" class="severity"><h3>${renderSeverityValue(advisory.severity)}</h3></span></td>
                <td><a href=${advisory.url} style="color:yellow" target="_blank">${advisory.url}</a></td>
                <td>${advisory.findings.map(item => item.paths).join(', ')}</td>
            </tr>`
        );

    return context.github.checks.create({
        owner: repoOwner,
        repo: repoName,
        name: 'Audit Check - Annotations Bot',
        head_sha: context.payload.check_run.head_sha,
        conclusion: 'success',
        output: {
            title: 'Audit Check',
            summary: `<h1>Summary</h1> <h3>Vulnerabilities</h3>${renderVulnerabilitiesSummary(outputData.metadata.vulnerabilities)}<hr /><table>
                        <tr>
                        <th>Module</th>
                        <th>Issue</th>
                        <th>Vulnerability versions</th>
                        <th>Severity</th>
                        <th>Advisory URL</th>
                        <th>Path</th>
                        </tr>
        ${summaryData}
      </table>`,
            annotations: []
        }
    });
};


module.exports = createAuditCheckAnnotations;
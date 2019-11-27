module.exports = {
    createUnitTestsAnnotations: require('./unit-test-checks'),
    createOutdatedCheckAnnotations: require('./outdated-checks'),
    createAuditCheckAnnotations: require('./audit-checks'),
    createESLintAnnotations: require('./eslint-checks')
}
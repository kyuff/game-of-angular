basePath = './';

files = [
    'web/lib/angular.min.js',
    JASMINE,
    JASMINE_ADAPTER,
    'lib/angular.mocks.js',
    'web/js/*.js',
    'test/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
    outputFile: 'unit.xml',
    suite: 'unit'
};

logLevel = LOG_INFO;


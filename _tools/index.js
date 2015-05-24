var path = require('path'),
    scan = require('./scan'),
    elasticsearch = require('elasticsearch'),
    yaml = require('meta-marked'),
    fs = require('fs'),
    program = require('commander');

program
    .option('-p, --path [path]', 'path')
    .option('-i, --index', 'index')
    .parse(process.argv);

var path = program.path || './';
var needIndex = program.index || false;

var endPoint = 'localhost:9200';
var index = 'developer';
var type = 'docs';

var esClient = new elasticsearch.Client({
    host: endPoint
});

if (needIndex) {
    esClient.index({
        index: index,
        type: type
    }).then(function(resp) {
        console.log(resp);
    });
    return;
}

function indexFunc(item) {
    item.url = '/' + item.url.replace(/\.md$/, '.html');
    var b = {
        index: index,
        type: type,
        id: item.url,
        body: {
            doc: item
        }
    };
    esClient.exists({
        index: index,
        type: type,
        id: item.url
    }, function(error, exists) {
        if (exists === true) {
            esClient.update(b).then(function(resp) {
                console.log(item.title, item.url, 'update successed!');
            });
        } else {
            esClient.create(b).then(function(resp) {
                console.log(item.title, item.url, 'create successed!');
            });
        }
    });
}

var ignoreDirs = /^_|node_modules|dist|tools|makefile/,
    allowFiles = /.md$/;


scan(path, function(p) {

    var doc = yaml(fs.readFileSync(p, 'utf8'));
    p = p.replace(path, "");
    if (ignoreDirs.test(p)) {
        return;
    }

    if (!allowFiles.test(p)) {
        return;
    }

    var item = {
        url: p,
        title: (doc.meta && doc.meta.title) || '',
        content: doc.html.replace(/<[^>]*>|\n/g, '')
    };
    indexFunc(item);
});

var fs = require('fs'),
    path = require('path');


module.exports = walk;

function walk(dir, callback) {



    if (!fs.existsSync(dir)) {
        return;
    }

    return fs.readdirSync(dir).filter(function(f) {
        return f && f[0] != '.'; // Ignore hidden files
    }).map(function(f) {

        var p = path.join(dir, f),
            stat = fs.statSync(p);

        if (stat.isDirectory()) {
            walk(p, callback);
        }

        if (/\.md$/.test(f)) {
            try {
                
                callback(p);
                return;
                var doc = yaml(fs.readFileSync(p, 'utf8'));

                var item = {
                    url: p.replace(prefix, ''),
                    title: (doc.meta && doc.meta.title) || '',
                    content: doc.html.replace(/<[^>]*>|\n/g, '')
                };
                callback && callback(item);
            } catch (err) {
                console.log(p, err);
            }
        }

    });
};

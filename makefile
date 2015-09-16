all:
	#成生菜单所需的json文件
	./_genMenu  docs/v6/api/overview > _data/apiview.json
	./_genMenu docs/v6/api/reference > _data/apiref.json
	./_genMenu docs/v6/kb > _data/kb.json

	npm install

fc:
	#分词索引
	./_jkl --plugin 'fc _dictionary.txt static/js/fc.js' --server

test: all
	./_jkl --server

install: all
	grunt production
	rm -rf node_modules

	#指定上传文件：
	#make install file=file1,file2,file3
	#file1,file2,file3采用弱匹配模式,指定文件名的部分即可，副作用是可能上传其它的文件

	./_jkl --qiniu-config _jekyll_qiniu.yml --qiniu --qiniu-up-files '$(file)' --verbose 2>&1 | sed '/_site/{h; s,^.*/_site,http://developer.qiniu.com,; H; x;}'
	@echo
	rm -rf .tmp

clean:
	rm _includes/footer.html
	rm _includes/header.html
	rm -rf .tmp
	rm -rf _site
	rm -rf dist

dev: all
	# rm _includes/footer.html
	# rm _includes/header.html
	# rm -rf dist
	grunt
	./_jkl --server

production: all
	rm _includes/footer.html
	rm _includes/header.html
	grunt production
	./_jkl --server

mapsite:
	echo 'http://developer.qiniu.com/sitemap.xml' | perl -ne 'use URI::Escape; chomp; printf "http://www.bing.com/ping?sitemap=%s\n", uri_escape($$_);' | xargs -I {} curl -i -L '{}'

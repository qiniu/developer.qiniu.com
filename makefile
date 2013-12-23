all:
	#成生菜单所需的json文件
	./_genMenu docs/v6/api/overview > _data/apiview.json 
	./_genMenu docs/v6/api/reference > _data/apiref.json 
	./_genMenu docs/v6/tutorial > _data/guide.json 
	./_genMenu docs/v6/kb > _data/kb.json 
fc:
	#分词索引
	./_jkl --plugin 'fc _dictionary.txt static/js/fc.js' --server
	
test: all
	./_jkl --server

install:
	#指定上传文件： 
	#make install file=file1,file2,file3 
	#file1,file2,file3采用弱匹配模式,指定文件名的部分即可，副作用是可能上传其它的文件
	./_jkl --qiniu-config _jekyll_qiniu.yml --qiniu --qiniu-up-files '$(file)' --verbose
	@echo

clean:
	rm -rf _site

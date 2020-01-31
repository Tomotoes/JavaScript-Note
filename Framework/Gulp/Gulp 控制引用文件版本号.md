# Gulp 控制文件版本引用

## 安装

```bash
npm i -D gulp-rev gulp-rev-collector
```



## 使用

```js
/* 生成文件名带着 hash 值 */
const rev = require('gulp-rev')

/* 将带着 hash 值的文件替换到 html 中 */
const revCollector = require('gulp-rev-collector')


gulp.task('css', function() {
	return gulp
		.src('D:/Blog/Home/css/*.css')
		
  	/* 生成 文件名-hash.后缀名*/
		.pipe(rev())
		.pipe(gulp.dest('D:/Blog/Home/Home/css'))
  
  /* 生成版本控制文件 */
		.pipe(rev.manifest())
		.pipe(gulp.dest('D:/Blog/Home/css'))
})

gulp.task('html', function() {
	return (
		gulp
			.src(['D:/Blog/Home/**/rev-manifest.json', 'D:/Blog/Home/index.html'])
			/* 替换原有文件的引用 , 换成 文件名-hash */
    	.pipe(revCollector({ replaceReved: true}))
			.pipe(htmlclean())
		
			.pipe(gulp.dest('D:/Blog/Home/Home'))
	)
})

gulp.task('js', function() {
	pump([
		gulp.src('D:/Blog/Home/js/*.js'),
		babel({ presets: ['es2015'] }),
		uglify(),
		rev(),
		gulp.dest('D:/Blog/Home/Home/js'),
		rev.manifest(),
		gulp.dest('D:/Blog/Home/js')
	])
})


```



## 优化

将 `文件-hash.ext` 修改成 `引用文件?t=哈希`



1. node_modules/gulp-rev/index.js

  ```js
  135行：manifest[originalFile] = revisionedFile;
  改为：manifest[originalFile] = originalFile + '?v=' + file.revHash;
  ```

2. node_modules/rev-path/index.js

  ```js
  9行：return modifyFilename(pth, (filename, ext) => `${filename}-${hash}${ext}`);
  改为：return modifyFilename(pth, (filename, ext) => `${filename}${ext}`);
  ```

3. node_modules/gulp-rev-collector/index.js

  ```js
  40行：var cleanReplacement =  path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' );
  改为：var cleanReplacement = path.basename(json[key]).split('?')[0];
  ```

4. 继续更改 gulp-rev-collector

  ```js
  打开node_modules\gulp-rev-collector\index.js
  第107行 regexp: new RegExp( '([\/\\\\\'"])' + pattern, 'g' ),
  更新为: regexp: new RegExp( '([\/\\\\\'"])' + pattern+'(\\?v=\\w{10})?', 'g' ),
  ```

## 坑

1. 生成的 html 文件不及时会替换依赖

   假如 你使用了 `run-sequence` task 执行的先后是不一定的, 很有可能是先执行的 html

   所以 , 要将 html 任务放到最后来执行.

   修改如下:

   ```js
   gulp.task('compress', function(cb) {
   	runSequence(['css', 'js'], ['html'], cb)
   })
   ```

   
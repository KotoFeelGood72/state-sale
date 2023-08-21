# gulp-srcset-lazy
## (clone of the innactive `gulp-img-retina` repo with some improvements)

Add img attribute 'srcset' for variable density/width image loading for lazyload data attributes (specifically webp).

## Prerequisites
You must have webp images in the folder which the original image in.

## Install

`npm install gulp-srcset-lazy`

## Usage

``` js
var gulp = require('gulp');
var srcsetLazy = require('gulp-srcset-lazy');

var retinaOpts = {
    // Your options here.
};

gulp.task('views', function() {

  return gulp.src('./views/**/*.html')
    .pipe(srcsetLazy(retinaOpts))
    .on('error', function(e) {
      console.log(e.message);
    })
    .pipe(gulp.dest('./build'));

});
```

You put html in:
``` html
<figure>
	<img src="images/default/example.webp" alt="example image" />
</figure>
```

And get html out:
``` html
<figure>
	<img data-src="images/default/example.webp" alt="example image" data-srcset="images/default/example.webp 1x, images/default/example@2x.webp 2x, images/default/example@3x.webp 3x, images/default/example-mobile.webp 480w" />
</figure>
```

## Options (Optional)

### options.suffix
Type: ```Object```

Default:

```
srcsetLazy({
  suffix: {
    '1x': '.webp',
    '2x': '@2x.webp',
    '3x': '@3x.webp'
  }
})
```

The suffix will insert to image's path, the key is resolution, and value is suffix.

You can also use width srcset params eg.

```
srcsetLazy({
  suffix: {
    '1x': '.webp',
    '2x': '@2x.webp',
    '3x': '@3x.webp',
    '480w': '-mobile.webp'
  }
})
```

## Note

SVG's are ignored

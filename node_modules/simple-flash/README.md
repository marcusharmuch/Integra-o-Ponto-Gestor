# simple-flash
Simple Flash is a very simple way to set flash messages in Express routes.

<p>
	<a href="https://www.npmjs.com/package/simple-flash">
		<img src="https://img.shields.io/npm/v/simple-flash.svg" />
		<img src="https://img.shields.io/npm/dm/simple-flash.svg" />
	</a>
</p>

## Installation

``` sh
npm install simple-flash
```

## Usage

In your app.js (after session setup line):

``` js
var flash = require('simple-flash');
app.use(flash());
```

In your route, only add your messages using the new funcion `req.flash(type,message)`:

``` js
app.post('/foo', function(req, res){
    try {
        // your awesom code here
        req.flash('success','Your success message here!');
        res.redirect('/bar');
    } catch (e){
        req.flash('error','Your error message here!');
        res.redirect('/foo');
    }
})
```

For render messages in view, simpliest use the new local function `flash()` to return messages array.

Jade example:

``` jade
for message in flash()
	.row
		.col-xs-12
			div(class="alert alert-#{message.type}") #{message.message}
```

 Or:
``` jade
- flash().forEach(function(message){
	.row
		.col-xs-12
			div(class="alert alert-#{message.type}") #{message.message}
- })
```

## For development and tests:

``` sh
git clone https://github.com/thiagobs/simple-flash.git && cd simple-flash
npm install
```

Run tests:

``` sh
npm test
```

## License

[MIT License](http://opensource.org/licenses/MIT)

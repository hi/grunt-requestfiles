# grunt-requestfiles

> Clear file cache by http requests.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install git://github.com/hi/grunt-requestfiles.git#v0.0.1 --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-requestfiles');
```

## The "requestfiles" task

### Overview
In your project's Gruntfile, add a section named `requestfiles` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    options: {
        relative: 'theme/',
        path: '/layout/'
    },

    'dev': {
        options: {
            host: '<%= pkg.config.devHost %>'
        },
        files: [{
            expand: true,
            cwd: 'theme/_dev',
            src: [ '**' ],
        }, {
            expand: true,
            cwd: 'theme/skins',
            src: [ '**/_dev/**/*.*' ],
        }]
    },
})
```

### Options

#### options.host
Type: `String`
Default value: `''`

A valid hostname for a template.

#### options.path
Type: `String`
Default value: `'/layout/'`

A valid path to be added before the file path.

#### options.relative
Type: `String`
Default value: `'theme/'`

A relative path to subtract from file paths.

#### options.params
Type: `String`
Default value: `'?reset=1'`

The param to be called after the file path.




module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Settings for Accounts (Litmus, Mailgun)
    secrets: grunt.file.readJSON('secrets.json'),

    // Folders for assets, development environment and production environment
    paths: {
      src:        'src',
      src_img:    'src/img',
      dist:       'dist',
      dist_img:   'dist/img',
      dist_css:   'dist/css',
      preview:    'preview'
    },

    /* ====================================================================================== */
    /* Development tasks                                                                      */
    /* ====================================================================================== */

    // Takes your SCSS files and compiles them to CSS
    shell: {
      sass: {
        command: 'sass --watch --compass --sourcemap ' + '<%= paths.src %>/styles/style.scss:<%= paths.dist_css %>/main.css'
      },
      sass_compile: {
        command: 'sass --compass --sourcemap ' + '<%= paths.src %>/styles/style.scss:<%= paths.dist_css %>/main.css'
      }
    },    

    // Assembles the email content with HTML layout. This function receive a parameter with the template name (grunt.option('template'))
    assemble: {
      options: {
        layoutdir: '<%= paths.src %>/layouts',
        partials: ['<%= paths.src %>/partials/**/*.hbs'],
        helpers: ['<%= paths.src %>/helpers/**/*.js'],
        data: ['<%= paths.src %>/data/*.{json,yml}'],
        flatten: true
      },
      pages: {
        src: ['<%= paths.src %>/emails/' + grunt.option('template') + '.hbs'],
        dest: '<%= paths.dist %>/' + grunt.option('template') + '/'
      }
    },

    // Watches for changes to CSS or email templates then runs grunt tasks
    watch: {
      options: {
        livereload: true
      },
      emails: {
        files: ['<%= paths.src %>/emails/' + grunt.option('template') + '.hbs','<%= paths.src %>/layouts/*', '<%= paths.src %>/data/*'],
        tasks: ['assemble']
      },
      css: {
        files: ['<%= paths.dist_css %>/main.css']
      }
    },

    // Concurrent task executes
    concurrent: {
      watch: {
        tasks: [
          'watch',
          'shell:sass',
          'open'
        ],
        options: {
          logConcurrentOutput: true,
          limit: 4
        }
      }
    },

    /* ====================================================================================== */
    /* Production tasks                                                                       */
    /* ====================================================================================== */

    // Inlines your CSS
    juice: {
      your_target: {
        options: {
          preserveMediaQueries: true,
          applyAttributesTableElements: true,
          applyWidthAttributes: true,
          preserveImportant: true
        },
        files: [{
          expand: true,
          src: ['<%= paths.dist %>/' + grunt.option('template') + '/*.html'],
          dest: ''
        }]
      },
    },

    // Replace compiled template images sources from ../src/html to ../dist/html
    replace: {
      src_images: {
        options: {
          usePrefix: false,
          patterns: [
            {
              match: /(<img[^>]+[\"'])(\.\.\/src\/img\/)/gi,  // Matches <img * src="../src/img or <img * src='../src/img'
              replacement: '$1../<%= paths.src_img %>/' + grunt.option('template') + '/'
            },
            {
              match: /(url\(*[^)])(\.\.\/src\/img\/)/gi,  // Matches url('../src/img') or url(../src/img) and even url("../src/img")
              replacement: '$1../<%= paths.dist_img %>/' + grunt.option('template') + '/'
            }
          ]
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['<%= paths.dist %>/' + grunt.option('template') + '.html'],
          dest: '<%= paths.dist %>/' + grunt.option('template') + '/'
        }]
      }
    },

    // Optimize images
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 4,
          svgoPlugins: [{ removeViewBox: false }]
        },
        files: [{
          expand: true,
          cwd: '<%= paths.src_img %>/' + grunt.option('template') + '/',
          src: ['**/*.{png,jpg,gif}'],
          dest: '<%= paths.dist %>/' + grunt.option('template') + '/'
        }]
      }
    },

    /* ====================================================================================== */
    /* Optionals   tasks                                                                      */
    /* ====================================================================================== */

    // Use Mailgun option if you want to email the design to your inbox or to something like Litmus
    // grunt send --template=transaction.html
    mailgun: {
      mailer: {
        options: {
          key: '<%= secrets.mailgun.api_key %>', // See README for secrets.json or replace this with your own key
          sender: '<%= secrets.mailgun.sender %>', // See README for secrets.json or replace this with your preferred sender
          recipient: '<%= secrets.mailgun.recipient %>', // See README for secrets.json or replace this with your preferred recipient
          subject: 'This is a test email'
        },
        src: ['<%= paths.dist %>/'+grunt.option('template')]
      }
    },

    // Send your email template to Litmus for testing
    // grunt litmus --template=transaction.html
    litmus: {
      test: {
        src: ['<%= paths.dist %>/'+grunt.option('template')],
        options: {
          username: '<%= secrets.litmus.username %>', // See README for secrets.json or replace this with your username
          password: '<%= secrets.litmus.password %>', // See README for secrets.json or replace this with your password
          url: 'https://<%= secrets.litmus.company %>.litmus.com', // See README for secrets.json or replace this with your company url
          clients: ['android4', 'aolonline', 'androidgmailapp', 'aolonline', 'ffaolonline',
          'chromeaolonline', 'appmail6', 'iphone6', 'ipadmini', 'ipad', 'chromegmailnew',
          'iphone6plus', 'notes85', 'ol2002', 'ol2003', 'ol2007', 'ol2010', 'ol2011',
          'ol2013', 'outlookcom', 'chromeoutlookcom', 'chromeyahoo', 'windowsphone8'] // https://#{company}.litmus.com/emails/clients.xml
        }
      }
    },

    /* ====================================================================================== */
    /* Server tasks                                                                           */
    /* ====================================================================================== */

    // Express server for browser previews
    express: {
      server: {
        options: {
          port: 4000,
          hostname: '127.0.0.1',
          bases: ['<%= paths.dist %>', '<%= paths.preview %>', '<%= paths.src %>'],
          server: './server.js',
          livereload: true
        }
      }
    },

    // Open browser preview
    open: {
      preview: {
        path: 'http://localhost:4000'
      }
    }

  });

  // Load all Grunt tasks
  require('load-grunt-tasks')(grunt);

  // grunt dev --template=newsletter
  grunt.registerTask('dev', [
    'express', 
    'concurrent'
  ]);

  //Generate a final email
  grunt.registerTask('build', [
    'shell:sass_compile',
    'assemble',
    'juice',
    'imagemin',
    'replace:src_images'
  ]);

  // Use grunt send if you want to actually send the email to your inbox
  grunt.registerTask('send', ['mailgun']);  

};

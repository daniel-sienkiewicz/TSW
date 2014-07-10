module.exports = function(grunt) {
    "use strict";
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: './app/lib',
                    layout: 'byType',
                    install: true,
                    verbose: true,
                    cleanTargetDir: false,
                    cleanBowerDir: false
                }
            }
        },
        clean: {
            bower: ["bower_components"],
            lib: ['./app/lib'],
            node_modules: ['node_modules']
        }
    });

    grunt.registerTask('default', ['bower:install']);
}

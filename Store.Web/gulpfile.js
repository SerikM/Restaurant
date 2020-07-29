/// <binding BeforeBuild='default' ProjectOpened='default' />
var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify")

var paths = {
    webroot: "./wwwroot/"
};


paths.css = paths.webroot + "css/**/*.css";
paths.minifiedJsDest = paths.webroot + "js/dest/site.min.js";
paths.minifiedCssDest = paths.webroot + "css/dest/site.min.css";
paths.notMinifiedJsDest = paths.webroot + "js/dest/site.js";
paths.notMinifiedCssDest = paths.webroot + "css/dest/site.css";
paths.vendorJsDest = paths.webroot + "js/dest/vendor.min.js";
paths.vendorCssDest = paths.webroot + "css/dest/vendor.min.css";
paths.jsClean = paths.webroot + "js/dest/**/*.js";
paths.cssClean = paths.webroot + "css/dest/**/*.css";
paths.fontsClean = paths.webroot + "css/fonts/**/*";// have to place fonts inside css folder because of the reference in one of vendor css files
paths.fontsDest = paths.webroot + "css/fonts/";


gulp.task("clean:js", function (cb) {
    rimraf(paths.jsClean, cb); 
});
gulp.task("clean:css", function (cb) {
    rimraf(paths.cssClean, cb);
});
gulp.task("clean:fonts", function (cb) {
    rimraf(paths.fontsClean, cb);
});
gulp.task("clean", ["clean:js", "clean:css", "clean:fonts"]);

gulp.task("min:js", function () {
    return gulp.src([

        paths.webroot + "js/store/modules/common.core.js",
        paths.webroot + "js/store/modules/common.ui.js",
        paths.webroot + "js/store/modules/hm.reservation.js",
        paths.webroot + "js/store/reservation/reservation.js",
        paths.webroot + "js/store/app.js",
        paths.webroot + "js/store/layouts/topBar.directive.js",
        paths.webroot + "js/store/layouts/leftBar.directive.js",
        paths.webroot + "js/store/layouts/bottomBar.directive.js",
        paths.webroot + "js/store/layouts/owlCarousel.directive.js",
        paths.webroot + "js/store/layouts/numberPicker.directive.js",
        paths.webroot + "js/store/layouts/customOnChange.directive.js",
        paths.webroot + "js/store/layouts/usSpinner.js",
        paths.webroot + "js/store/home/rootCtrl.js",
        paths.webroot + "js/store/home/indexCtrl.js",
        paths.webroot + "js/store/whatson/whatsonCtrl.js",
        paths.webroot + "js/store/menu/menuCtrl.js",
        paths.webroot + "js/store/bookings/bookingsCtrl.js",
        paths.webroot + "js/store/admin/adminCtrl.js",
        paths.webroot + "js/store/admin/whatson/whatsonAdminCtrl.js",
        paths.webroot + "js/store/admin/carousel/carouselAdminCtrl.js",
        paths.webroot + "js/store/admin/menu/menuAdminCtrl.js",
        paths.webroot + "js/store/services/apiService.js",
        paths.webroot + "js/store/services/notificationService.js"
    ],
        { base: "." })
        .pipe(concat(paths.notMinifiedJsDest))
        .pipe(gulp.dest("."))
        .pipe(concat(paths.minifiedJsDest))
        .pipe(uglify({mangle:false}))
        .pipe(gulp.dest("."));
});
gulp.task("min:css", function () {
    return gulp.src([
        paths.css, "!" + paths.cssClean
    ])
        .pipe(concat(paths.notMinifiedCssDest))
        .pipe(gulp.dest("."))
        .pipe(concat(paths.minifiedCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});
gulp.task('vendor:js', function () {

    return gulp.src([
        'node_modules/jquery/dist/jquery.js', 
        'node_modules/angular/angular.js',
        'node_modules/angular-route/angular-route.js',
        //'node_modules/angular-cookies/angular-cookies.js',
        //'node_modules/angular-validator/dist/angular-validator.js',
        'node_modules/angular-base64/angular-base64.js',
        'node_modules/ngUpload/ng-upload.js',
        //'node_modules/angucomplete-alt/dist/angucomplete-alt.min.js', 
        'node_modules/angular-loading-bar/src/loading-bar.js',
        'node_modules/angular-material/angular-material.js',
        'node_modules/angular-animate/angular-animate.js',
        'node_modules/angular-aria/angular-aria.js',
        'node_modules/angular-messages/angular-messages.js', 
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'node_modules/toastr/toastr.js',  
        //'node_modules/raphael/raphael.js',
        'node_modules/fancybox/dist/js/jquery.fancybox.js',
        'node_modules/fancybox/dist/js/jquery.fancybox.pack.js',
        'node_modules/angular-material-icons/angular-material-icons.min.js',
        'node_modules/angular-spinner/dist/angular-spinner.min.js',
        'node_modules/owl-carousel-2-beta/dist/owl.carousel.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
        'node_modules/angular-number-picker/dist/angular-number-picker.js'

    ])
        .pipe(concat(paths.vendorJsDest))
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest('.'));
});
gulp.task('vendor:css', function () {

    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/bootstrap/dist/css/bootstrap-theme.css',
        'node_modules/font-awesome/css/font-awesome.css',
        'node_modules/toastr/toastr.scss', 
        'node_modules/angular-material/angular-material.css',
        'node_modules/owl-carousel-2-beta/dist/assets/owl.carousel.min.css',
        'node_modules/owl-carousel-2-beta/dist/assets/owl.theme.default.min.css',
        'node_modules/fancybox/dist/css/jquery.fancybox.css'
    ])
        .pipe(concat(paths.vendorCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest('.'));
});
gulp.task('fonts', function () {
    return gulp.src([
        'node_modules/font-awesome/fonts/**/*',
        'customfont/**/*',
        'node_modules/bootstrap/dist/fonts/**/*'])
        .pipe(gulp.dest(paths.fontsDest));
});

gulp.task("default", ["clean", "vendor:css", "vendor:js", "fonts", "min:js", "min:css"]);

//gulp.watch(paths.webroot + 'js/store/**/*.js',['default']);


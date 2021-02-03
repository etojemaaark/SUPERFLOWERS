// Переменные для каталогов
let project_folder = require("path").basename(__dirname);
let source_folder = "#src";

let fs = require("fs");

// Переменные путей
let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
	},

	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/main.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,gif.ico,webp}",
		fonts: source_folder + "/fonts/*.ttf",
		fonts_woff: source_folder + "/fonts/*.woff*",
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,gif.ico,webp}",
	},
	clean: "./" + project_folder + "/",
};

// Подключаем плагины

let {
	src,
	dest
} = require("gulp"),
	gulp = require("gulp"),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	scss = require("gulp-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	group_media = require("gulp-group-css-media-queries"),
	clean_css = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	uglify = require("gulp-uglify-es").default,
	imagemin = require("gulp-imagemin"),
	webp = require("gulp-webp"),
	webphtml = require("gulp-webp-html"),
	webpcss = require("gulp-webp-css"),
	svgSprite = require("gulp-svg-sprite"),
	ttf2woff = require("gulp-ttf2woff"),
	ttf2woff2 = require("gulp-ttf2woff2"),
	fonter = require("gulp-fonter");

// Функция обновления браузера

function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/",
		},
		port: 3000,
		notify: false,
	});
}

// Функция сборки html страницы

function html() {
	return src(path.src.html)
		.pipe(webphtml())
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}

// Функция работы со страницами стилей

function css() {
	return src(path.src.css)
		.pipe(
			scss({
				outputStyle: "expanded",
			})
		)
		.pipe(group_media())
		.pipe(browsersync.stream())

		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true,
			})
		)
		.pipe(webpcss())
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css",
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}

// Функция работы с файлами javaScript

function js() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				extname: ".min.js",
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}

// Функция работы с изображениями. Ужимает изображения а также конвертирует в webp

function images() {
	return src(path.src.img)
		.pipe(
			webp({
				quality: 70,
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3,
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream());
}

// Функция по обработке и преобразованию шрифтов
function fonts() {
	src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
	return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
}

function fontsWoff() {
	return src(path.src.fonts_woff)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts));
}

// Задача по конвертации шрифтов

gulp.task("otf2ttf", function () {
	return (
		gulp,
		src([source_folder + "/fonts/*.otf"])
			.pipe(
				fonter({
					formats: ["ttf"],
				})
			)
			.pipe(dest(source_folder + "/fonts/"))
	);
});

// Функция, которая записывает имена файлов, сконвертированных нами шрифтов в файл fonts.scss

function fontsStyle(params) {
	let file_content = fs.readFileSync(source_folder + "/scss/utils/fonts.scss");
	if (file_content == "") {
		fs.writeFile(source_folder + "/scss/utils/fonts.scss", "", cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split(".");
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(
							source_folder + "/scss/utils/fonts.scss",
							'@include font("' +
							fontname +
							'", "' +
							fontname +
							'", "400", "normal");\r\n',
							cb
						);
					}
					c_fontname = fontname;
				}
			}
		});
	}
}

// Задача на сборку векторных иконок в спрайт

gulp.task('svgSprite', function () {
	return gulp.src([source_folder + '/iconsprite/*.svg'])
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../icons/icons.svg",
					example: true
				}
			},
		}
		))
		.pipe(dest(path.build.img))
})

// Функция callback, необходима для корректной работы

function cb() { }

// PUG


// Функция присмотра за файлами, смотрит за изменением файлов

function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

function clean(params) {
	return del(path.clean);
}

let build = gulp.series(
	clean,
	gulp.parallel(js, css, html, images, fontsWoff, fonts),
	fontsStyle
);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.fontsWoff = fontsWoff;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
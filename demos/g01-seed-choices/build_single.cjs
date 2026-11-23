// Inlines css/style.css, js/data.js and js/app.js into one file: G01_standalone.html
// Run: node build_single.cjs   (edit the source files, then rebuild)
const fs = require('fs'), path = require('path');
const r = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
let html = r('index.html');
html = html.replace('<link rel="stylesheet" href="css/style.css">', () => '<style>\n' + r('css/style.css') + '\n</style>');
html = html.replace('<script src="js/data.js"></script>', () => '<script>\n' + r('js/data.js').replace(/<\/script>/gi, '<\/script>') + '\n</script>');
html = html.replace('<script src="js/app.js"></script>', () => '<script>\n' + r('js/app.js').replace(/<\/script>/gi, '<\/script>') + '\n</script>');
fs.writeFileSync(path.join(__dirname, 'G01_standalone.html'), html);
console.log('Wrote G01_standalone.html (' + html.length + ' bytes)');

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const distDir = path.join(__dirname, 'dist/build/h5');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(distDir, filePath);

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在，返回 404
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - 文件未找到</h1><p>请求的页面不存在</p>', 'utf-8');
      } else {
        // 其他错误
        res.writeHead(500);
        res.end('服务器错误: ' + err.code, 'utf-8');
      }
    } else {
      // 成功
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 H5 预览服务器已启动`);
  console.log(`   本地访问: http://localhost:${PORT}`);
  console.log(`   构建目录: ${distDir}`);
  console.log(`   按 Ctrl+C 停止服务器\n`);
});

server.on('error', (err) => {
  console.error('服务器启动失败:', err);
});
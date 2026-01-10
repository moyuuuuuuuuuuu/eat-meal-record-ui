const http = require('http');

function testConnection(port, path = '/') {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          success: true,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          data: data.substring(0, 200)
        });
      });
    });

    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.end();
  });
}

async function diagnose() {
  console.log('🔍 诊断 H5 开发服务器...\n');

  // 测试端口
  const ports = [5173, 5174, 5175, 5176];
  let activePort = null;

  for (const port of ports) {
    const result = await testConnection(port);
    if (result.success) {
      activePort = port;
      console.log(`✅ 端口 ${port} 可访问`);
      console.log(`   状态码: ${result.status}`);
      console.log(`   内容类型: ${result.contentType}`);
      console.log(`   前100字符: ${result.data}\n`);
      break;
    } else {
      console.log(`❌ 端口 ${port} 不可访问: ${result.error}`);
    }
  }

  if (!activePort) {
    console.log('\n❌ 没有找到活跃的开发服务器');
    console.log('请运行: npm run dev:h5');
    return;
  }

  // 测试具体路径
  console.log('🔍 测试页面路径...\n');
  const paths = ['/', '/pages/index/index', '/main.js', '/@vite/client'];

  for (const path of paths) {
    const result = await testConnection(activePort, path);
    if (result.success) {
      console.log(`✅ ${path} - 状态: ${result.status}`);
    } else {
      console.log(`❌ ${path} - 错误: ${result.error}`);
    }
  }

  console.log('\n💡 建议:');
  console.log('1. 在浏览器中打开: http://localhost:' + activePort);
  console.log('2. 打开浏览器开发者工具 (F12)');
  console.log('3. 查看 Console 和 Network 标签页的错误信息');
  console.log('4. 如果页面显示"加载中"但没有反应，通常是 JavaScript 错误导致的');
}

diagnose();
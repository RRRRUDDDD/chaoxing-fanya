const { app, BrowserWindow, Menu } = require('electron');
const { spawn } = require('child_process');
const net = require('net');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let backend = null;
let port = 0;
const isDev = !app.isPackaged;

// 单实例锁
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

/**
 * 获取空闲端口
 */
function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

/**
 * 启动后端进程
 */
async function startBackend() {
  port = await getFreePort();

  let cmd, args, cwd;
  if (isDev) {
    // 开发模式：运行仓库根目录的 app.py
    cmd = 'python';
    args = ['app.py'];
    cwd = path.join(__dirname, '..');
  } else {
    // 生产模式：运行打包后的 backend exe
    cmd = path.join(process.resourcesPath, 'backend', 'chaoxing-backend.exe');
    args = [];
    cwd = app.getPath('userData');
  }

  // 确保工作目录存在
  fs.mkdirSync(cwd, { recursive: true });

  // 启动后端，重定向日志
  const logPath = path.join(cwd, 'backend.log');
  const logStream = fs.createWriteStream(logPath, { flags: 'a' });

  backend = spawn(cmd, args, {
    cwd,
    env: {
      ...process.env,
      CHAOXING_HEADLESS: '1',
      CHAOXING_PORT: String(port),
    },
    stdio: ['pipe', logStream, logStream],
    windowsHide: true,
  });

  backend.on('exit', (code) => {
    console.log(`后端进程退出，code=${code}`);
    backend = null;
    if (mainWindow && !isDev) {
      const { dialog } = require('electron');
      dialog.showErrorBox('后端异常', `后端进程退出 (code=${code})，应用即将关闭`);
      app.quit();
    }
  });

  console.log(`后端已启动，PID=${backend.pid}, PORT=${port}`);
}

/**
 * 等待后端健康检查
 */
function waitForBackend(timeoutMs = 90000) {
  const url = `http://127.0.0.1:${port}/api/health`;
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve();
      } catch (err) {
        // 继续重试
      }

      if (Date.now() - start > timeoutMs) {
        return reject(new Error('后端启动超时'));
      }
      setTimeout(check, 500);
    };
    check();
  });
}

/**
 * 创建主窗口
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  Menu.setApplicationMenu(null);

  // 安全限制：只允许加载本地 Flask
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(`http://127.0.0.1:${port}`)) {
      e.preventDefault();
    }
  });

  mainWindow.loadURL(`http://127.0.0.1:${port}`);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * 停止后端
 */
function stopBackend() {
  if (!backend) return;

  try {
    // 关闭 stdin 触发后端 watch_parent_stdin 退出
    backend.stdin.end();
  } catch (err) {
    console.error('停止后端失败:', err);
  }

  // 3 秒后强制杀进程树（兜底）
  setTimeout(() => {
    if (backend && backend.pid) {
      const { exec } = require('child_process');
      exec(`taskkill /pid ${backend.pid} /T /F`, () => {});
    }
  }, 3000);

  backend = null;
}

/**
 * 应用启动
 */
app.whenReady().then(async () => {
  try {
    await startBackend();
    await waitForBackend();
    createWindow();
  } catch (err) {
    const { dialog } = require('electron');
    dialog.showErrorBox('启动失败', String(err));
    stopBackend();
    app.exit(1);
  }
});

app.on('before-quit', () => {
  stopBackend();
});

app.on('window-all-closed', () => {
  app.quit();
});

#!/usr/bin/env node

/**
 * npm postinstall 脚本
 * 在安装或更新组件库时自动运行，显示重要通知
 */

const fs = require('fs');
const path = require('path');

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function showWelcome() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                                                            ║', 'cyan');
  log('║   📦 Element Business Components 安装成功！                ║', 'cyan');
  log('║                                                            ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  console.log('\n');
}

function showVersion() {
  try {
    const packageJson = require('../package.json');
    log(`✅ 当前版本: ${packageJson.version}`, 'green');
    console.log('\n');
  } catch (error) {
    // 忽略错误
  }
}

function showImportantNotices() {
  // 读取重要通知文件（如果存在）
  const noticesPath = path.join(__dirname, '../NOTICES.md');

  if (fs.existsSync(noticesPath)) {
    const notices = fs.readFileSync(noticesPath, 'utf-8');
    if (notices.trim()) {
      log('⚠️  重要通知:', 'yellow');
      console.log(notices);
      console.log('\n');
    }
  }
}

function showBreakingChanges() {
  try {
    const packageJson = require('../package.json');
    const currentVersion = packageJson.version;
    const currentMajor = parseInt(currentVersion.split('.')[0]);

    // 尝试从 package-lock.json 获取之前安装的版本
    const lockFilePath = path.join(process.cwd(), 'package-lock.json');

    if (fs.existsSync(lockFilePath)) {
      try {
        const lockFile = JSON.parse(fs.readFileSync(lockFilePath, 'utf-8'));
        const previousVersion = lockFile.packages?.['node_modules/@company/element-business-components']?.version;

        if (previousVersion) {
          const previousMajor = parseInt(previousVersion.split('.')[0]);

          // 只有当主版本号增加时才显示警告
          if (currentMajor > previousMajor) {
            log('🚨 破坏性变更警告:', 'red');
            log(`   从 v${previousVersion} 升级到 v${currentVersion}`, 'red');
            log(`   主版本更新包含破坏性变更`, 'red');
            log('   请查看迁移指南: https://github.com/your-org/element-doc/blob/main/MIGRATION.md', 'yellow');
            console.log('\n');
          }
        }
      } catch (err) {
        // 无法读取 package-lock.json，跳过
      }
    }
  } catch (error) {
    // 忽略错误
  }
}

function showQuickStart() {
  log('📚 快速开始:', 'blue');
  console.log('');
  console.log('   // 完整引入');
  console.log('   import ElementBusinessComponents from \'@company/element-business-components\';');
  console.log('   Vue.use(ElementBusinessComponents);');
  console.log('');
  console.log('   // 按需引入（推荐）');
  console.log('   import { ProductSelector, ImageUploader } from \'@company/element-business-components\';');
  console.log('');
}

function showLinks() {
  log('🔗 相关链接:', 'blue');
  console.log('');
  console.log('   📖 完整文档: https://github.com/your-org/element-doc/blob/main/README.md');
  console.log('   📝 变更日志: https://github.com/your-org/element-doc/blob/main/CHANGELOG.md');
  console.log('   🔄 升级指南: https://github.com/your-org/element-doc/blob/main/UPGRADE_GUIDE.md');
  console.log('   🐛 问题反馈: https://github.com/your-org/element-doc/issues');
  console.log('');
}

function checkForUpdates() {
  // 检查是否是首次安装还是更新
  const lockFilePath = path.join(process.cwd(), 'package-lock.json');

  if (fs.existsSync(lockFilePath)) {
    try {
      const lockFile = JSON.parse(fs.readFileSync(lockFilePath, 'utf-8'));
      const installedVersion = lockFile.packages?.['node_modules/@company/element-business-components']?.version;
      const currentVersion = require('../package.json').version;

      if (installedVersion && installedVersion !== currentVersion) {
        log(`🎉 组件库已更新: ${installedVersion} → ${currentVersion}`, 'green');
        log('   请查看变更日志了解新功能和修复: https://github.com/your-org/element-doc/blob/main/CHANGELOG.md', 'cyan');
        console.log('\n');
      }
    } catch (error) {
      // 忽略错误
    }
  }
}

function showDeprecationWarnings() {
  // 如果有废弃的 API，在这里显示警告
  const deprecations = [
    // 示例：
    // { api: 'ProductSelector.onSuccess', replacement: '@success 事件', removeVersion: '2.0.0' }
  ];

  if (deprecations.length > 0) {
    log('⚠️  废弃警告:', 'yellow');
    deprecations.forEach(dep => {
      console.log(`   - ${dep.api} 已废弃，将在 v${dep.removeVersion} 移除`);
      console.log(`     请使用 ${dep.replacement} 代替`);
    });
    console.log('\n');
  }
}

// 主函数
function main() {
  // 只在非 CI 环境显示
  if (process.env.CI) {
    return;
  }

  showWelcome();
  showVersion();
  checkForUpdates();
  showBreakingChanges();
  showImportantNotices();
  showDeprecationWarnings();
  showQuickStart();
  showLinks();

  log('感谢使用 Element Business Components! 🎉', 'bright');
  console.log('\n');
}

main();

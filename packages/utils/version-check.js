/**
 * 版本检查工具
 * 在开发环境下检查组件库版本，提示用户升级
 */

// 动态导入 package.json 获取当前版本
import packageJson from '../../package.json';

const PACKAGE_NAME = '@company/element-business-components';
const CURRENT_VERSION = packageJson.version; // ✅ 从 package.json 动态读取
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24小时检查一次

let hasChecked = false;

/**
 * 检查是否有新版本
 */
export async function checkVersion() {
  // 只在开发环境检查
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // 避免重复检查
  if (hasChecked) {
    return;
  }

  // 检查本地缓存
  const lastCheckTime = localStorage.getItem(`${PACKAGE_NAME}:lastCheck`);
  const now = Date.now();

  if (lastCheckTime && now - parseInt(lastCheckTime) < CHECK_INTERVAL) {
    return;
  }

  hasChecked = true;

  try {
    // 尝试多个 registry，按优先级顺序
    const registries = [
      `https://registry.npmmirror.com/${PACKAGE_NAME}/latest`,  // cnpm 镜像（国内快）
      `https://registry.npmjs.org/${PACKAGE_NAME}/latest`       // 官方 npm（备用）
    ];

    let latestVersion = null;

    // 尝试从各个 registry 获取版本信息
    for (const registryUrl of registries) {
      try {
        const response = await fetch(registryUrl, { timeout: 3000 });
        if (response.ok) {
          const data = await response.json();
          latestVersion = data.version;
          break;  // 成功获取，跳出循环
        }
      } catch (err) {
        // 当前 registry 失败，尝试下一个
        continue;
      }
    }

    if (!latestVersion) {
      // 所有 registry 都失败
      console.debug('无法获取最新版本信息');
      return;
    }

    // 保存检查时间
    localStorage.setItem(`${PACKAGE_NAME}:lastCheck`, now.toString());

    // 比较版本
    if (compareVersion(CURRENT_VERSION, latestVersion) < 0) {
      console.warn(
        `%c[${PACKAGE_NAME}] 发现新版本！`,
        'color: #ff9800; font-size: 14px; font-weight: bold;'
      );
      console.warn(
        `当前版本: ${CURRENT_VERSION}\n` +
        `最新版本: ${latestVersion}\n` +
        `更新命令: npm install ${PACKAGE_NAME}@latest\n` +
        `查看更新日志: https://github.com/your-org/element-doc/blob/main/CHANGELOG.md`
      );
    }
  } catch (error) {
    // 静默失败，不影响正常使用
    console.debug('版本检查失败:', error);
  }
}

/**
 * 比较版本号
 * @returns {number} -1: v1 < v2, 0: v1 = v2, 1: v1 > v2
 */
function compareVersion(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }

  return 0;
}

/**
 * 显示废弃警告
 */
export function deprecatedWarning(componentName, oldAPI, newAPI, removeVersion) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.warn(
    `%c[${componentName}] 废弃警告`,
    'color: #ff9800; font-weight: bold;',
    `\n"${oldAPI}" 已废弃，将在 v${removeVersion} 中移除。` +
    `\n请使用 "${newAPI}" 代替。` +
    `\n查看迁移指南: https://github.com/your-org/element-doc/blob/main/MIGRATION.md`
  );
}

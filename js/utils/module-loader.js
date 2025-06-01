// 动态模块加载器
export class ModuleLoader {
  constructor() {
    this.loadedModules = new Map();
  }

  async loadModule(modulePath, cacheable = true) {
    if (cacheable && this.loadedModules.has(modulePath)) {
      return this.loadedModules.get(modulePath);
    }

    try {
      const module = await import(modulePath);
      
      if (cacheable) {
        this.loadedModules.set(modulePath, module);
      }
      
      return module;
    } catch (error) {
      console.error(`模块加载失败: ${modulePath}`, error);
      throw error;
    }
  }

  // 预加载模块
  async preloadModules(modulePaths) {
    const promises = modulePaths.map(path => this.loadModule(path));
    return Promise.allSettled(promises);
  }

  // 懒加载模块
  async lazyLoadModule(modulePath, condition) {
    if (condition()) {
      return this.loadModule(modulePath);
    }
    return null;
  }
}

export const moduleLoader = new ModuleLoader(); 
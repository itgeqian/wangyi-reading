/**
 * 分类菜单交互功能
 * 实现向右展开的分类菜单效果
 */

class CategoryMenu {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        console.log('分类菜单初始化完成');
    }

    bindEvents() {
        const categories = document.querySelectorAll('.nav-category');
        
        categories.forEach(category => {
            const main = category.querySelector('.category-main');
            const dropdown = category.querySelector('.category-dropdown');
            
            // 只为有折叠区的分类项绑定事件
            if (main && dropdown && !category.classList.contains('no-dropdown')) {
                // 鼠标进入分类项
                category.addEventListener('mouseenter', () => {
                    this.showDropdown(category);
                });
                
                // 鼠标离开分类项
                category.addEventListener('mouseleave', () => {
                    this.hideDropdown(category);
                });
                
                // 防止快速移动鼠标导致的闪烁
                dropdown.addEventListener('mouseenter', () => {
                    this.showDropdown(category);
                });
            }
        });
    }

    showDropdown(category) {
        const dropdown = category.querySelector('.category-dropdown');
        const arrow = category.querySelector('.expand-arrow');
        
        if (dropdown && arrow) {
            // 添加展开状态类
            category.classList.add('expanded');
            
            // 箭头旋转动画
            arrow.style.transform = 'rotate(90deg)';
            arrow.style.color = '#c9483c';
            
            // 显示下拉菜单
            dropdown.style.width = '400px';
            dropdown.style.opacity = '1';
            dropdown.style.visibility = 'visible';
        }
    }

    hideDropdown(category) {
        const dropdown = category.querySelector('.category-dropdown');
        const arrow = category.querySelector('.expand-arrow');
        
        if (dropdown && arrow) {
            // 移除展开状态类
            category.classList.remove('expanded');
            
            // 箭头复位
            arrow.style.transform = 'rotate(0deg)';
            arrow.style.color = '#888';
            
            // 隐藏下拉菜单
            dropdown.style.width = '0';
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
        }
    }

    // 添加键盘导航支持
    addKeyboardNavigation() {
        const categories = document.querySelectorAll('.nav-category:not(.no-dropdown)');
        
        categories.forEach((category, index) => {
            const main = category.querySelector('.category-main');
            
            if (main) {
                main.setAttribute('tabindex', '0');
                
                main.addEventListener('keydown', (e) => {
                    switch(e.key) {
                        case 'Enter':
                        case ' ':
                            e.preventDefault();
                            if (category.classList.contains('expanded')) {
                                this.hideDropdown(category);
                            } else {
                                this.showDropdown(category);
                            }
                            break;
                        case 'Escape':
                            this.hideDropdown(category);
                            break;
                        case 'ArrowDown':
                            e.preventDefault();
                            const nextCategory = categories[index + 1];
                            if (nextCategory) {
                                nextCategory.querySelector('.category-main').focus();
                            }
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            const prevCategory = categories[index - 1];
                            if (prevCategory) {
                                prevCategory.querySelector('.category-main').focus();
                            }
                            break;
                    }
                });
            }
        });
    }

    // 响应式处理
    handleResponsive() {
        const checkWidth = () => {
            const width = window.innerWidth;
            const categories = document.querySelectorAll('.nav-category:not(.no-dropdown)');
            
            if (width < 768) {
                // 移动端：禁用悬停效果，改为点击
                categories.forEach(category => {
                    const main = category.querySelector('.category-main');
                    if (main) {
                        main.addEventListener('click', (e) => {
                            e.preventDefault();
                            if (category.classList.contains('expanded')) {
                                this.hideDropdown(category);
                            } else {
                                // 先关闭其他展开的菜单
                                categories.forEach(other => {
                                    if (other !== category) {
                                        this.hideDropdown(other);
                                    }
                                });
                                this.showDropdown(category);
                            }
                        });
                    }
                });
            }
        };
        
        checkWidth();
        window.addEventListener('resize', checkWidth);
    }
}

// 初始化分类菜单
document.addEventListener('DOMContentLoaded', function() {
    const categoryMenu = new CategoryMenu();
    categoryMenu.addKeyboardNavigation();
    categoryMenu.handleResponsive();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CategoryMenu;
} 
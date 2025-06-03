/**
 * 项目演示公告系统
 * 智能显示项目功能介绍弹窗，使用sessionStorage避免在当前会话中重复显示
 * 关闭页面重新打开后会重新显示公告
 */

class ProjectAnnouncement {
    constructor() {
        this.storageKey = 'netease_reading_announcement_dismissed';
        this.init();
    }

    // 初始化系统
    init() {
        // 检查用户是否已经选择不再显示（仅限当前会话）
        if (this.isDismissed()) {
            console.log('用户在此会话中已选择不再显示项目演示公告');
            return;
        }

        // 延迟显示公告，确保页面加载完成
        setTimeout(() => {
            this.showAnnouncement();
        }, 1500);
    }

    // 检查是否已被用户关闭（当前会话）
    isDismissed() {
        return sessionStorage.getItem(this.storageKey) === 'true';
    }

    // 标记为已关闭（仅限当前会话）
    setDismissed() {
        sessionStorage.setItem(this.storageKey, 'true');
        console.log('公告已设置为本次会话不再显示');
    }

    // 显示项目演示公告
    showAnnouncement() {
        this.createAnnouncementModal();
    }

    // 创建公告弹窗
    createAnnouncementModal() {
        // 检查是否已存在弹窗
        if (document.getElementById('project-announcement-modal')) {
            return;
        }

        // 创建样式
        this.createStyles();

        // 创建弹窗HTML
        const modal = document.createElement('div');
        modal.id = 'project-announcement-modal';
        modal.className = 'announcement-modal';
        modal.innerHTML = `
            <div class="announcement-overlay">
                <div class="announcement-content">
                    <div class="announcement-header">
                        <div class="announcement-icon">🎉</div>
                        <h3>欢迎体验网易云阅读项目！</h3>
                        <button class="announcement-close" onclick="projectAnnouncement.closeAnnouncement()">✖</button>
                    </div>
                    
                    <div class="announcement-body">
                        <p class="announcement-text">
                            为了让您更全面地了解这个项目的完整功能和技术实现，我们特别为您准备了<strong>项目功能演示页面</strong>。
                        </p>
                        
                        <div class="announcement-features">
                            <div class="feature-item">
                                <span class="feature-icon">📖</span>
                                <span>完整开发文档</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">🎨</span>
                                <span>设计稿展示</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">🔧</span>
                                <span>功能演示</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">💡</span>
                                <span>技术亮点</span>
                            </div>
                        </div>
                        
                        <p class="announcement-description">
                            在演示页面中，您可以深入了解项目的技术架构、设计理念和开发过程，探索更多精彩功能！
                        </p>
                    </div>
                    
                    <div class="announcement-footer">
                        <div class="no-more-container">
                            <label class="no-more-label">
                                <input type="checkbox" id="no-more-announcement" class="no-more-checkbox">
                                <span class="checkmark"></span>
                                本次访问不再显示
                            </label>
                        </div>
                        
                        <div class="announcement-buttons">
                            <button class="announcement-btn btn-secondary" onclick="projectAnnouncement.closeAnnouncement()">
                                稍后再看
                            </button>
                            <button class="announcement-btn btn-primary" onclick="projectAnnouncement.goToDemo()">
                                立即体验 →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 添加显示动画
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }

    // 创建样式
    createStyles() {
        if (document.getElementById('announcement-styles')) return;

        const style = document.createElement('style');
        style.id = 'announcement-styles';
        style.textContent = `
            .announcement-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .announcement-modal.show {
                opacity: 1;
                visibility: visible;
            }

            .announcement-overlay {
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }

            .announcement-content {
                background: white;
                border-radius: 20px;
                max-width: 500px;
                width: 100%;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transform: translateY(30px);
                transition: transform 0.3s ease;
            }

            .announcement-modal.show .announcement-content {
                transform: translateY(0);
            }

            .announcement-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px;
                text-align: center;
                position: relative;
            }

            .announcement-icon {
                font-size: 48px;
                margin-bottom: 10px;
                animation: bounce 2s infinite;
            }

            .announcement-header h3 {
                margin: 0;
                font-size: 22px;
                font-weight: bold;
            }

            .announcement-close {
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.2s ease;
            }

            .announcement-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg);
            }

            .announcement-body {
                padding: 30px 25px 20px;
            }

            .announcement-text {
                color: #333;
                line-height: 1.6;
                margin-bottom: 20px;
                font-size: 16px;
            }

            .announcement-features {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin: 20px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 12px;
            }

            .feature-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                color: #555;
            }

            .feature-icon {
                font-size: 16px;
            }

            .announcement-description {
                color: #666;
                font-size: 14px;
                line-height: 1.5;
                margin-bottom: 0;
            }

            .announcement-footer {
                padding: 20px 25px 25px;
                border-top: 1px solid #eee;
            }

            .no-more-container {
                margin-bottom: 20px;
            }

            .no-more-label {
                display: flex;
                align-items: center;
                cursor: pointer;
                font-size: 14px;
                color: #666;
            }

            .no-more-checkbox {
                margin-right: 8px;
                transform: scale(1.1);
            }

            .announcement-buttons {
                display: flex;
                gap: 12px;
            }

            .announcement-btn {
                flex: 1;
                padding: 12px 20px;
                border: none;
                border-radius: 25px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-secondary {
                background: #f1f2f6;
                color: #555;
            }

            .btn-secondary:hover {
                background: #ddd;
                transform: translateY(-1px);
            }

            .btn-primary {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
            }

            .btn-primary:hover {
                background: linear-gradient(135deg, #764ba2, #667eea);
                transform: translateY(-1px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }

            @media (max-width: 600px) {
                .announcement-content {
                    margin: 20px;
                }
                
                .announcement-features {
                    grid-template-columns: 1fr;
                }
                
                .announcement-buttons {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 关闭公告
    closeAnnouncement() {
        const modal = document.getElementById('project-announcement-modal');
        const checkbox = document.getElementById('no-more-announcement');
        
        if (checkbox && checkbox.checked) {
            this.setDismissed();
            console.log('用户选择本次访问不再显示项目演示公告');
        }

        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    // 跳转到演示页面
    goToDemo() {
        const checkbox = document.getElementById('no-more-announcement');
        
        if (checkbox && checkbox.checked) {
            this.setDismissed();
        }

        // 关闭弹窗
        this.closeAnnouncement();
        
        // 延迟跳转，确保动画完成
        setTimeout(() => {
            window.open('demo.html', '_blank');
        }, 200);
    }

    // 重置设置（开发调试用）
    reset() {
        sessionStorage.removeItem(this.storageKey);
        console.log('项目演示公告设置已重置');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 只在首页显示公告
    if (document.body.getAttribute('data-page') === 'home') {
        window.projectAnnouncement = new ProjectAnnouncement();
    }
});

// 开发调试功能（可选）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.resetProjectAnnouncement = () => {
        if (window.projectAnnouncement) {
            window.projectAnnouncement.reset();
        }
    };
} 
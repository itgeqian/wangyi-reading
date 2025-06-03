/**
 * 幽默弹窗提示系统
 * 为未实现功能提供有趣的用户提示
 */

class HumorAlerts {
    constructor() {
        this.messages = [
            {
                title: "⚠️ 程序员求救 ⚠️", 
                content: "老师说这个小组实验下周就要交，但为什么我的小组就我一个人，奶奶的累死我了┗( T﹏T )┛",
                emoji: "👨‍💻☕"
            },
            {
                title: "🚧 功能建设中 🚧",
                content: "当前功能尚未实现，你要累死我呀！生产队的驴都不敢这么赶~ (╯°□°）╯︵ ┻━┻",
                emoji: "🐴💨"
            },
            
            {
                title: "🔧 敬请期待 🔧",
                content: "功能正在紧急开发中，请给我一点时间，我已经连续加班72小时了 (；′⌒`)",
                emoji: "⏰💻"
            },
            {
                title: "💡 创意无限 💡",
                content: "这个功能太复杂了，我需要先喝三杯咖啡☕️才能想明白... ٩(◕‿◕)۶",
                emoji: "☕🧠"
            },
            {
                title: "🎯 即将上线 🎯",
                content: "功能开发进度：███████░░░ 70% 快了快了，别催了~ (´･ω･`)",
                emoji: "📊🚀"
            }
        ];
        this.currentIndex = 0;
        this.init();
    }

    // 初始化事件监听
    init() {
        this.bindEvents();
        this.createCustomModal();
    }

    // 绑定事件
    bindEvents() {
        // 监听个人中心和充值点击
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.tagName === 'A') {
                const text = target.textContent || target.innerText;
                // 检查是否包含个人中心或充值文本（忽略图标字符）
                if (text.includes('个人中心') || text.includes('充值')) {
                    e.preventDefault();
                    this.showHumorAlert();
                }
            }
        });
    }

    // 创建自定义弹窗样式
    createCustomModal() {
        if (document.getElementById('humor-modal-style')) return;

        const style = document.createElement('style');
        style.id = 'humor-modal-style';
        style.textContent = `
            .humor-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease-out;
            }

            .humor-modal-content {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                padding: 30px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                animation: slideInDown 0.4s ease-out;
                border: 3px solid #fff;
                position: relative;
                overflow: hidden;
            }

            .humor-modal-content::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                animation: shine 2s infinite;
            }

            .humor-modal h3 {
                color: #fff;
                font-size: 24px;
                margin-bottom: 15px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                position: relative;
                z-index: 1;
            }

            .humor-modal-emoji {
                font-size: 48px;
                margin: 15px 0;
                display: block;
                animation: bounce 1s infinite;
                position: relative;
                z-index: 1;
            }

            .humor-modal p {
                color: #fff;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 25px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                position: relative;
                z-index: 1;
            }

            .humor-modal-buttons {
                display: flex;
                gap: 15px;
                justify-content: center;
                position: relative;
                z-index: 1;
            }

            .humor-btn {
                padding: 12px 25px;
                border: none;
                border-radius: 25px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: bold;
                text-transform: uppercase;
            }

            .humor-btn-primary {
                background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                color: white;
                box-shadow: 0 5px 15px rgba(238, 90, 36, 0.3);
            }

            .humor-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(238, 90, 36, 0.4);
            }

            .humor-btn-secondary {
                background: linear-gradient(45deg, #74b9ff, #0984e3);
                color: white;
                box-shadow: 0 5px 15px rgba(116, 185, 255, 0.3);
            }

            .humor-btn-secondary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(116, 185, 255, 0.4);
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideInDown {
                from {
                    transform: translateY(-100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }

            @keyframes shine {
                0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
            }

            .humor-modal-close {
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                font-size: 24px;
                color: #fff;
                cursor: pointer;
                z-index: 2;
                transition: transform 0.2s ease;
            }

            .humor-modal-close:hover {
                transform: scale(1.2) rotate(90deg);
            }
        `;
        document.head.appendChild(style);
    }

    // 显示幽默弹窗
    showHumorAlert() {
        const message = this.messages[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.messages.length;

        const modal = document.createElement('div');
        modal.className = 'humor-modal';
        modal.innerHTML = `
            <div class="humor-modal-content">
                <button class="humor-modal-close" onclick="this.closest('.humor-modal').remove()">✖</button>
                <h3>${message.title}</h3>
                <div class="humor-modal-emoji">${message.emoji}</div>
                <p>${message.content}</p>
                <div class="humor-modal-buttons">
                    <button class="humor-btn humor-btn-primary" onclick="this.closest('.humor-modal').remove()">
                        😭 我知道了
                    </button>
                    <button class="humor-btn humor-btn-secondary" onclick="this.closest('.humor-modal').remove(); humorAlerts.showEncouragement();">
                        💪 加油开发
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 3秒后自动关闭（可选）
        setTimeout(() => {
            if (modal.parentNode) {
                modal.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => modal.remove(), 300);
            }
        }, 8000);

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // 显示鼓励信息
    showEncouragement() {
        const encouragements = [
            "谢谢理解！我会努力的~ (ง •̀_•́)ง",
            "您的支持是我最大的动力！✨",
            "我收到了您的鼓励，士气+100！🚀",
            "程序员感动得快哭了... (´；ω；`)",
            "我会加班加点完成的！💪"
        ];
        
        const randomMessage = encouragements[Math.floor(Math.random() * encouragements.length)];
        
        // 简单的toast提示
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #28a745, #20c997);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 16px;
            z-index: 10001;
            animation: slideInRight 0.5s ease-out;
            box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
        `;
        toast.textContent = randomMessage;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.humorAlerts = new HumorAlerts();
});

// 添加动画样式
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(animationStyle); 
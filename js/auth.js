/**
 * 认证模块 - 处理登录和注册功能
 */
const Auth = {
    // 验证码倒计时
    countdown: 0,
    countdownTimer: null,

    /**
     * 初始化登录页面
     */
    initLogin: function() {
        console.log('初始化登录页面');
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // 绑定社交登录按钮
        this.bindSocialLogin();
        
        // 绑定输入框实时验证
        this.bindInputValidation();
    },

    /**
     * 初始化注册页面
     */
    initRegister: function() {
        console.log('初始化注册页面');
        
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }

        // 绑定验证码发送
        const sendVerifyBtn = document.getElementById('sendVerifyCode');
        if (sendVerifyBtn) {
            sendVerifyBtn.addEventListener('click', this.sendVerifyCode.bind(this));
        }

        // 绑定社交登录按钮
        this.bindSocialLogin();
        
        // 绑定输入框实时验证
        this.bindInputValidation();
    },

    /**
     * 绑定输入框实时验证
     */
    bindInputValidation: function() {
        // 邮箱验证
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                this.validateEmail(emailInput.value, 'emailError');
            });
        }

        // 用户名验证（注册页面）
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.addEventListener('blur', () => {
                this.validateUsername(usernameInput.value, 'usernameError');
            });
        }

        // 手机号验证（注册页面）
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', () => {
                this.validatePhone(phoneInput.value, 'phoneError');
            });
        }

        // 密码验证
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('blur', () => {
                this.validatePassword(passwordInput.value, 'passwordError');
            });
        }

        // 确认密码验证（注册页面）
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('blur', () => {
                const password = document.getElementById('password').value;
                this.validateConfirmPassword(password, confirmPasswordInput.value, 'confirmPasswordError');
            });
        }
    },

    /**
     * 处理登录
     */
    handleLogin: function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on'
        };

        // 验证表单
        if (!this.validateLoginForm(loginData)) {
            return;
        }

        // 显示加载状态
        const submitBtn = e.target.querySelector('.auth-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '登录中...';
        submitBtn.disabled = true;

        // 模拟登录请求
        setTimeout(() => {
            // 这里应该是实际的API调用
            const loginResult = this.performLogin(loginData);
            if (loginResult.success) {
                this.showMessage('登录成功！正在跳转...', 'success');
                
                // 保存登录状态
                const userInfo = {
                    username: loginResult.user.username,
                    email: loginResult.user.email,
                    phone: loginResult.user.phone,
                    loginTime: new Date().toISOString()
                };

                localStorage.setItem('userToken', 'token_' + Date.now());
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                
                if (loginData.remember) {
                    localStorage.setItem('rememberLogin', 'true');
                }

                // 跳转到首页
                setTimeout(() => {
                    // 添加登录成功参数，用于触发购物车迁移
                    window.location.href = 'index.html?login=success';
                }, 1500);
            } else {
                this.showMessage(loginResult.message || '登录失败，请检查邮箱和密码', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }, 1000);
    },

    /**
     * 处理注册
     */
    handleRegister: function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const registerData = {
            username: formData.get('username'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            verifyCode: formData.get('verifyCode'),
            agreement: formData.get('agreement') === 'on'
        };

        // 验证表单
        if (!this.validateRegisterForm(registerData)) {
            return;
        }

        // 显示加载状态
        const submitBtn = e.target.querySelector('.auth-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '注册中...';
        submitBtn.disabled = true;

        // 模拟注册请求
        setTimeout(() => {
            // 这里应该是实际的API调用
            const registerResult = this.performRegister(registerData);
            if (registerResult.success) {
                this.showMessage('注册成功！正在跳转到登录页面...', 'success');
                
                // 跳转到登录页面
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                this.showMessage(registerResult.message || '注册失败，请稍后重试', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }, 1500);
    },

    /**
     * 执行登录验证
     */
    performLogin: function(loginData) {
        // 获取已注册用户列表
        const registeredUsers = this.getRegisteredUsers();
        
        // 默认测试账号
        const defaultUsers = [
            { 
                username: '测试用户', 
                email: 'test@example.com', 
                phone: '13800138000', 
                password: '123456' 
            },
            { 
                username: '管理员', 
                email: 'admin@wyy.com', 
                phone: '13900139000', 
                password: 'admin123' 
            }
        ];

        // 合并用户列表
        const allUsers = [...defaultUsers, ...registeredUsers];
        
        // 查找匹配的用户
        const user = allUsers.find(u => 
            (u.email === loginData.email || u.phone === loginData.email) && 
            u.password === loginData.password
        );

        if (user) {
            return {
                success: true,
                user: user
            };
        } else {
            return {
                success: false,
                message: '邮箱/手机号或密码错误'
            };
        }
    },

    /**
     * 执行用户注册
     */
    performRegister: function(registerData) {
        // 获取已注册用户列表
        const registeredUsers = this.getRegisteredUsers();
        
        // 检查用户名是否已存在
        const existingUsernames = ['admin', 'test', 'user', ...registeredUsers.map(u => u.username)];
        if (existingUsernames.includes(registerData.username)) {
            return {
                success: false,
                message: '用户名已存在'
            };
        }

        // 检查邮箱是否已注册
        const existingEmails = ['test@example.com', 'admin@wyy.com', ...registeredUsers.map(u => u.email)];
        if (existingEmails.includes(registerData.email)) {
            return {
                success: false,
                message: '邮箱已被注册'
            };
        }

        // 检查手机号是否已注册
        const existingPhones = ['13800138000', '13900139000', ...registeredUsers.map(u => u.phone)];
        if (existingPhones.includes(registerData.phone)) {
            return {
                success: false,
                message: '手机号已被注册'
            };
        }

        // 保存新用户
        const newUser = {
            username: registerData.username,
            email: registerData.email,
            phone: registerData.phone,
            password: registerData.password,
            registerTime: new Date().toISOString()
        };

        registeredUsers.push(newUser);
        this.saveRegisteredUsers(registeredUsers);

        console.log('新用户注册成功:', newUser);
        
        return {
            success: true,
            user: newUser
        };
    },

    /**
     * 获取已注册用户列表
     */
    getRegisteredUsers: function() {
        try {
            const users = localStorage.getItem('registeredUsers');
            return users ? JSON.parse(users) : [];
        } catch (e) {
            console.error('获取注册用户列表失败:', e);
            return [];
        }
    },

    /**
     * 保存已注册用户列表
     */
    saveRegisteredUsers: function(users) {
        try {
            localStorage.setItem('registeredUsers', JSON.stringify(users));
        } catch (e) {
            console.error('保存注册用户列表失败:', e);
        }
    },

    /**
     * 发送验证码
     */
    sendVerifyCode: function() {
        const phoneInput = document.getElementById('phone');
        const phone = phoneInput.value;

        // 验证手机号
        if (!this.validatePhone(phone, 'phoneError')) {
            return;
        }

        const btn = document.getElementById('sendVerifyCode');
        
        // 开始倒计时
        this.countdown = 60;
        btn.disabled = true;
        btn.textContent = `${this.countdown}秒后重发`;

        this.countdownTimer = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(this.countdownTimer);
                btn.disabled = false;
                btn.textContent = '发送验证码';
            } else {
                btn.textContent = `${this.countdown}秒后重发`;
            }
        }, 1000);

        // 模拟发送验证码
        this.showMessage('验证码已发送到您的手机', 'success');
    },

    /**
     * 绑定社交登录
     */
    bindSocialLogin: function() {
        const wechatBtn = document.querySelector('.wechat-btn');
        const qqBtn = document.querySelector('.qq-btn');

        if (wechatBtn) {
            wechatBtn.addEventListener('click', () => {
                this.showMessage('微信登录功能开发中...', 'info');
            });
        }

        if (qqBtn) {
            qqBtn.addEventListener('click', () => {
                this.showMessage('QQ登录功能开发中...', 'info');
            });
        }
    },

    /**
     * 验证登录表单
     */
    validateLoginForm: function(data) {
        let isValid = true;

        // 验证邮箱
        if (!this.validateEmail(data.email, 'emailError')) {
            isValid = false;
        }

        // 验证密码
        if (!this.validatePassword(data.password, 'passwordError')) {
            isValid = false;
        }

        return isValid;
    },

    /**
     * 验证注册表单
     */
    validateRegisterForm: function(data) {
        let isValid = true;

        // 验证用户名
        if (!this.validateUsername(data.username, 'usernameError')) {
            isValid = false;
        }

        // 验证邮箱
        if (!this.validateEmail(data.email, 'emailError')) {
            isValid = false;
        }

        // 验证手机号
        if (!this.validatePhone(data.phone, 'phoneError')) {
            isValid = false;
        }

        // 验证密码
        if (!this.validatePassword(data.password, 'passwordError')) {
            isValid = false;
        }

        // 验证确认密码
        if (!this.validateConfirmPassword(data.password, data.confirmPassword, 'confirmPasswordError')) {
            isValid = false;
        }

        // 验证验证码
        if (!this.validateVerifyCode(data.verifyCode, 'verifyCodeError')) {
            isValid = false;
        }

        // 验证协议
        if (!data.agreement) {
            this.showMessage('请阅读并同意用户协议和隐私政策', 'warning');
            isValid = false;
        }

        return isValid;
    },

    /**
     * 验证邮箱
     */
    validateEmail: function(email, errorId) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^1[3-9]\d{9}$/;
        
        if (!email) {
            this.showError(errorId, '请输入邮箱或手机号');
            return false;
        }

        if (!emailRegex.test(email) && !phoneRegex.test(email)) {
            this.showError(errorId, '请输入正确的邮箱或手机号');
            return false;
        }

        this.clearError(errorId);
        return true;
    },

    /**
     * 验证用户名
     */
    validateUsername: function(username, errorId) {
        if (!username) {
            this.showError(errorId, '请输入用户名');
            return false;
        }

        if (username.length < 3 || username.length > 20) {
            this.showError(errorId, '用户名长度应为3-20个字符');
            return false;
        }

        if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
            this.showError(errorId, '用户名只能包含字母、数字、下划线和中文');
            return false;
        }

        this.clearError(errorId);
        return true;
    },

    /**
     * 验证手机号
     */
    validatePhone: function(phone, errorId) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        
        if (!phone) {
            this.showError(errorId, '请输入手机号');
            return false;
        }

        if (!phoneRegex.test(phone)) {
            this.showError(errorId, '请输入正确的手机号');
            return false;
        }

        this.clearError(errorId);
        return true;
    },

    /**
     * 验证密码
     */
    validatePassword: function(password, errorId) {
        if (!password) {
            this.showError(errorId, '请输入密码');
            return false;
        }

        if (password.length < 6 || password.length > 20) {
            this.showError(errorId, '密码长度应为6-20位');
            return false;
        }

        this.clearError(errorId);
        return true;
    },

    /**
     * 验证确认密码
     */
    validateConfirmPassword: function(password, confirmPassword, errorId) {
        if (!confirmPassword) {
            this.showError(errorId, '请确认密码');
            return false;
        }

        if (password !== confirmPassword) {
            this.showError(errorId, '两次输入的密码不一致');
            return false;
        }

        this.clearError(errorId);
        return true;
    },

    /**
     * 验证验证码
     */
    validateVerifyCode: function(code, errorId) {
        if (!code) {
            this.showError(errorId, '请输入验证码');
            return false;
        }

        if (code.length !== 6) {
            this.showError(errorId, '验证码应为6位数字');
            return false;
        }

        // 这里应该验证验证码是否正确
        // 目前使用模拟验证
        if (code !== '123456') {
            this.showError(errorId, '验证码错误');
            return false;
        }

        this.clearError(errorId);
        return true;
    },

    /**
     * 显示错误信息
     */
    showError: function(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            
            // 添加错误样式到输入框
            const input = errorElement.previousElementSibling;
            if (input && input.tagName === 'INPUT') {
                input.classList.add('error');
            } else if (input && input.classList.contains('verify-input')) {
                const actualInput = input.querySelector('input');
                if (actualInput) {
                    actualInput.classList.add('error');
                }
            }
        }
    },

    /**
     * 清除错误信息
     */
    clearError: function(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
            
            // 移除错误样式
            const input = errorElement.previousElementSibling;
            if (input && input.tagName === 'INPUT') {
                input.classList.remove('error');
            } else if (input && input.classList.contains('verify-input')) {
                const actualInput = input.querySelector('input');
                if (actualInput) {
                    actualInput.classList.remove('error');
                }
            }
        }
    },

    /**
     * 显示消息提示
     */
    showMessage: function(message, type = 'info') {
        const messageEl = document.getElementById('message');
        if (!messageEl) return;

        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.classList.remove('hidden');
        messageEl.classList.add('show');

        // 3秒后自动隐藏
        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => {
                messageEl.classList.add('hidden');
            }, 300);
        }, 3000);
    }
};

// 工具函数：检查用户登录状态
function checkLoginStatus() {
    const token = localStorage.getItem('userToken');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token && userInfo) {
        try {
            const user = JSON.parse(userInfo);
            return {
                isLoggedIn: true,
                user: user
            };
        } catch (e) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userInfo');
        }
    }
    
    return {
        isLoggedIn: false,
        user: null
    };
}

// 工具函数：退出登录
function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('rememberLogin');
    window.location.href = 'login.html';
}

// 工具函数：更新首页用户状态显示
function updateUserStatus() {
    const loginStatus = checkLoginStatus();
    const loginDiv = document.querySelector('.login');
    
    if (!loginDiv) return;
    
    if (loginStatus.isLoggedIn) {
        // 用户已登录，显示用户信息
        const userInfo = loginStatus.user;
        const displayName = userInfo.username || userInfo.email || userInfo.phone;
        
        loginDiv.innerHTML = `
            <ul>
                <li>
                    <span style="color: #c9483c;">你好，${displayName}</span>
                </li>
                <li><span>|</span></li>
                <li>
                    <a href="#" onclick="logout()">退出登录</a>
                </li>
                <li><span>|</span></li>
                <li>
                    <a href="#">个人中心</a>
                </li>
                <li><span>|</span></li>
                <li>
                    <a href="#">举报</a>
                </li>
            </ul>
        `;
    } else {
        // 用户未登录，显示登录注册链接
        loginDiv.innerHTML = `
            <ul>
                <li>
                    <a href="login.html">登陆<i class="triangle"></i></a>
                </li>
                <li><span>|</span></li>
                <li>
                    <a href="register.html">注册</a>
                </li>
                <li><span>|</span></li>
                <li>
                    <a href="#">举报</a>
                </li>
            </ul>
        `;
    }
}

// 导出模块（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
} 
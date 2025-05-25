// 购物车管理系统
class ShoppingCart {
  constructor() {
    this.items = this.loadFromStorage();
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateCartDisplay();
  }

  // 检查用户登录状态
  checkLoginStatus() {
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

  // 获取当前用户的购物车存储键
  getCartStorageKey() {
    const loginStatus = this.checkLoginStatus();
    if (loginStatus.isLoggedIn) {
      // 为每个用户创建独立的购物车
      const userId = loginStatus.user.email || loginStatus.user.phone || 'anonymous';
      return `shopping_cart_${userId}`;
    }
    return 'shopping_cart_guest'; // 未登录用户使用临时购物车
  }

  // 从本地存储加载购物车数据
  loadFromStorage() {
    const storageKey = this.getCartStorageKey();
    return Utils.storage.get(storageKey) || [];
  }

  // 保存到本地存储
  saveToStorage() {
    const storageKey = this.getCartStorageKey();
    Utils.storage.set(storageKey, this.items);
  }

  // 显示登录提示并跳转
  showLoginPrompt() {
    // 创建登录提示弹窗
    const modal = document.createElement('div');
    modal.className = 'login-prompt-modal';
    modal.innerHTML = `
      <div class="login-prompt-overlay"></div>
      <div class="login-prompt-content">
        <div class="login-prompt-header">
          <h3>需要登录</h3>
          <button class="close-btn">&times;</button>
        </div>
        <div class="login-prompt-body">
          <div class="login-icon">🔒</div>
          <p>未登录，请先登录后再添加商品到购物车</p>
          <div class="login-prompt-actions">
            <button class="btn-secondary cancel-btn">取消</button>
            <button class="btn-primary login-btn">立即登录</button>
          </div>
        </div>
      </div>
    `;

    // 添加样式
    if (!document.querySelector('#login-prompt-styles')) {
      const style = document.createElement('style');
      style.id = 'login-prompt-styles';
      style.textContent = `
        .login-prompt-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-prompt-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }
        .login-prompt-content {
          position: relative;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          max-width: 400px;
          width: 90%;
          animation: modalSlideIn 0.3s ease;
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .login-prompt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 20px 0;
          border-bottom: 1px solid #eee;
          margin-bottom: 20px;
        }
        .login-prompt-header h3 {
          margin: 0;
          color: #333;
          font-size: 18px;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .close-btn:hover {
          color: #666;
        }
        .login-prompt-body {
          padding: 0 20px 20px;
          text-align: center;
        }
        .login-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }
        .login-prompt-body p {
          color: #666;
          margin-bottom: 25px;
          line-height: 1.5;
        }
        .login-prompt-actions {
          display: flex;
          gap: 15px;
        }
        .login-prompt-actions button {
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-secondary {
          background: #f5f5f5;
          color: #666;
        }
        .btn-secondary:hover {
          background: #e8e8e8;
        }
        .btn-primary {
          background: #c9483c;
          color: white;
        }
        .btn-primary:hover {
          background: #b03d33;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(modal);

    // 绑定事件
    const closeModal = () => {
      modal.remove();
    };

    modal.querySelector('.close-btn').addEventListener('click', closeModal);
    modal.querySelector('.cancel-btn').addEventListener('click', closeModal);
    modal.querySelector('.login-prompt-overlay').addEventListener('click', closeModal);
    
    modal.querySelector('.login-btn').addEventListener('click', () => {
      closeModal();
      // 跳转到登录页面
      window.location.href = 'login.html';
    });

    // ESC键关闭
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  }

  // 显示购物车添加成功弹窗
  showCartSuccessModal(product) {
    // 移除已存在的弹窗
    const existingModal = document.querySelector('.cart-success-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'cart-success-modal';
    modal.innerHTML = `
      <div class="cart-success-overlay"></div>
      <div class="cart-success-content">
        <div class="success-icon">
          <div class="checkmark">
            <div class="checkmark-circle"></div>
            <div class="checkmark-stem"></div>
            <div class="checkmark-kick"></div>
          </div>
        </div>
        <h3>添加成功！</h3>
        <div class="product-info">
          <img src="${product.img}" alt="${product.title}" onerror="this.src='img/default-book.jpg'">
          <div class="product-details">
            <h4>《${product.title}》</h4>
            <p>已成功添加到购物车</p>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-stay">继续购物</button>
          <button class="btn-goto-cart">去购物车看看</button>
        </div>
      </div>
    `;

    // 添加样式
    if (!document.querySelector('#cart-success-styles')) {
      const style = document.createElement('style');
      style.id = 'cart-success-styles';
      style.textContent = `
        .cart-success-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-success-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }
        .cart-success-content {
          position: relative;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          max-width: 450px;
          width: 90%;
          padding: 40px 30px 30px;
          text-align: center;
          animation: modalSlideIn 0.4s ease;
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .success-icon {
          margin-bottom: 20px;
        }
        .checkmark {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: block;
          stroke-width: 3;
          stroke: #4CAF50;
          stroke-miterlimit: 10;
          margin: 0 auto;
          position: relative;
        }
        .checkmark-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid #4CAF50;
          background: #f0f8f0;
          animation: checkmarkCircle 0.6s ease-in-out;
        }
        .checkmark-stem {
          position: absolute;
          width: 3px;
          height: 12px;
          background: #4CAF50;
          left: 26px;
          top: 30px;
          transform: rotate(45deg);
          animation: checkmarkStem 0.3s ease-in-out 0.3s both;
        }
        .checkmark-kick {
          position: absolute;
          width: 3px;
          height: 6px;
          background: #4CAF50;
          left: 20px;
          top: 36px;
          transform: rotate(-45deg);
          animation: checkmarkKick 0.2s ease-in-out 0.5s both;
        }
        @keyframes checkmarkCircle {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes checkmarkStem {
          0% { height: 0; }
          100% { height: 12px; }
        }
        @keyframes checkmarkKick {
          0% { height: 0; }
          100% { height: 6px; }
        }
        .cart-success-content h3 {
          margin: 0 0 20px;
          color: #333;
          font-size: 24px;
          font-weight: 600;
        }
        .product-info {
          display: flex;
          align-items: center;
          background: #f8f9fa;
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 25px;
          text-align: left;
        }
        .product-info img {
          width: 60px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          margin-right: 15px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .product-details h4 {
          margin: 0 0 5px;
          color: #333;
          font-size: 16px;
          font-weight: 600;
        }
        .product-details p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        .modal-actions {
          display: flex;
          gap: 15px;
        }
        .modal-actions button {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-stay {
          background: #f1f2f6;
          color: #666;
        }
        .btn-stay:hover {
          background: #e8e9ed;
          transform: translateY(-1px);
        }
        .btn-goto-cart {
          background: linear-gradient(135deg, #c9483c 0%, #b03d33 100%);
          color: white;
        }
        .btn-goto-cart:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(201, 72, 60, 0.3);
        }
        @media (max-width: 480px) {
          .cart-success-content {
            padding: 30px 20px 20px;
          }
          .modal-actions {
            flex-direction: column;
          }
          .product-info {
            flex-direction: column;
            text-align: center;
          }
          .product-info img {
            margin-right: 0;
            margin-bottom: 10px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(modal);

    // 绑定事件
    const closeModal = () => {
      modal.style.opacity = '0';
      modal.style.transform = 'scale(0.9)';
      setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.btn-stay').addEventListener('click', closeModal);
    modal.querySelector('.btn-goto-cart').addEventListener('click', () => {
      closeModal();
      window.location.href = 'shopCar.html';
    });
    modal.querySelector('.cart-success-overlay').addEventListener('click', closeModal);

    // ESC键关闭
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);

    // 3秒后自动关闭
    setTimeout(closeModal, 3000);
  }

  // 添加商品到购物车
  addItem(product) {
    // 检查登录状态
    if (!this.checkLoginStatus()) {
      this.showLoginPrompt();
      return false;
    }

    // 检查商品是否已存在
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        title: product.title,
        author: product.author,
        price: product.price,
        img: product.img,
        quantity: 1,
        addedTime: new Date().toISOString()
      });
    }

    this.saveToStorage();
    this.updateCartDisplay();
    
    // 显示美观的成功弹窗
    this.showCartSuccessModal(product);
    
    return true;
  }

  // 移除商品
  removeItem(productId) {
    const index = this.items.findIndex(item => item.id === productId);
    if (index > -1) {
      const removedItem = this.items.splice(index, 1)[0];
      this.saveToStorage();
      this.updateCartDisplay();
      Utils.showMessage(`《${removedItem.title}》已从购物车移除`, 'info');
    }
  }

  // 更新商品数量
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveToStorage();
        this.updateCartDisplay();
      }
    }
  }

  // 清空购物车
  clear() {
    this.items = [];
    this.saveToStorage();
    this.updateCartDisplay();
    Utils.showMessage('购物车已清空', 'info');
  }

  // 用户登录后迁移临时购物车
  migrateGuestCart() {
    const guestCartKey = 'shopping_cart_guest';
    const guestItems = Utils.storage.get(guestCartKey) || [];
    
    if (guestItems.length > 0) {
      // 合并临时购物车到用户购物车
      const loginStatus = this.checkLoginStatus();
      if (loginStatus.isLoggedIn) {
        guestItems.forEach(guestItem => {
          const existingItem = this.items.find(item => item.id === guestItem.id);
          if (existingItem) {
            existingItem.quantity += guestItem.quantity;
          } else {
            this.items.push({
              ...guestItem,
              userId: loginStatus.user.email || loginStatus.user.phone
            });
          }
        });
        
        this.saveToStorage();
        this.updateCartDisplay();
        
        // 清除临时购物车
        Utils.storage.remove(guestCartKey);
        
        Utils.showMessage(`已将${guestItems.length}件商品迁移到您的购物车`, 'success');
      }
    }
  }

  // 用户退出登录时清理购物车
  clearUserCart() {
    this.items = [];
    this.updateCartDisplay();
  }

  // 获取购物车总数量
  getTotalQuantity() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // 获取购物车总价格
  getTotalPrice() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // 价格格式化函数 - 修复双重¥符号问题
  formatPrice(price) {
    if (typeof Utils !== 'undefined' && Utils.formatPrice) {
      return Utils.formatPrice(price);
    }
    // 备用价格格式化方案
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return '¥0.00';
    
    // 检查价格是否已经包含¥符号
    const priceStr = String(price);
    if (priceStr.includes('¥')) {
      // 如果已经包含¥符号，直接返回格式化的数字部分
      const cleanPrice = priceStr.replace(/[¥￥]/g, '');
      const cleanNum = parseFloat(cleanPrice);
      return isNaN(cleanNum) ? '¥0.00' : `¥${cleanNum.toFixed(2)}`;
    }
    
    return `¥${numPrice.toFixed(2)}`;
  }

  // 更新购物车显示
  updateCartDisplay() {
    this.updateCartIcon();
    this.updateCartPage();
  }

  // 更新购物车图标数量
  updateCartIcon() {
    // 更新导航栏中的购物车图标
    const cartLinks = document.querySelectorAll('a[href*="shopCar"]');
    cartLinks.forEach(link => {
      const cartText = link.textContent;
      const quantity = this.getTotalQuantity();
      if (quantity > 0) {
        // 如果还没有数量显示，添加数量
        if (!cartText.includes('(')) {
          link.innerHTML = `<i class="iconfont icon-gouwuche"></i>购物车(${quantity})`;
        } else {
          // 更新现有数量
          link.innerHTML = `<i class="iconfont icon-gouwuche"></i>购物车(${quantity})`;
        }
      } else {
        // 没有商品时显示原始文本
        link.innerHTML = `<i class="iconfont icon-gouwuche"></i>购物车`;
      }
    });
    
    // 更新购物车页面的数量显示
    const cartNum = document.querySelector('.book-num');
    if (cartNum) {
      cartNum.textContent = this.getTotalQuantity();
    }
  }

  // 更新购物车页面
  updateCartPage() {
    const cartContainer = document.querySelector('.cart-container .cart-content') || 
                         document.querySelector('.cart-items') ||
                         document.querySelector('#cart-items');
    
    if (!cartContainer) {
      console.warn('购物车容器未找到');
      return;
    }

    // 更新购物车商品数量显示
    const bookNumEl = document.querySelector('.book-num');
    if (bookNumEl) {
      bookNumEl.textContent = this.getTotalQuantity();
    }

    if (this.items.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart">
          <div class="empty-icon">📚</div>
          <h3>购物车是空的</h3>
          <p>去挑选一些好书吧！</p>
          <a href="index.html" class="btn-primary">去购物</a>
        </div>
      `;
      
      // 隐藏购物车总计
      const existingSummary = document.querySelector('.cart-summary');
      if (existingSummary) {
        existingSummary.style.display = 'none';
      }
      return;
    }

    // 生成购物车商品HTML
    cartContainer.innerHTML = this.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="book-cover">
          <img src="${item.img}" alt="${item.title}" onerror="this.src='img/default-book.jpg'">
        </div>
        <div class="book-info">
          <h4 class="book-title">${item.title}</h4>
          <p class="book-author">作者：${item.author || '未知作者'}</p>
          <p class="book-desc">${item.content || '暂无描述'}</p>
          <div class="book-price">
            <span class="price">${this.formatPrice(item.price)}</span>
            <span class="original-price">原价：${this.formatPrice(item.price * 1.2)}</span>
          </div>
        </div>
        <div class="quantity-controls">
          <button class="quantity-btn minus" data-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
          <button class="quantity-btn plus" data-id="${item.id}">+</button>
        </div>
        <div class="item-total">
          <span class="total-price">${this.formatPrice(item.price * item.quantity)}</span>
          <button class="remove-btn" data-id="${item.id}">移除</button>
        </div>
      </div>
    `).join('');

    // 添加或更新购物车总计
    let cartSummary = document.querySelector('.cart-summary');
    if (!cartSummary) {
      cartSummary = document.createElement('div');
      cartSummary.className = 'cart-summary';
      
      // 查找合适的父容器
      const cartContent = document.querySelector('.cart-container .cart-content') || 
                         document.querySelector('.cart-container');
      if (cartContent) {
        cartContent.appendChild(cartSummary);
      }
    }
    
    cartSummary.style.display = 'block';
    cartSummary.innerHTML = `
      <div class="summary-content">
        <div class="summary-row">
          <span>商品总数：</span>
          <span>${this.getTotalQuantity()} 件</span>
        </div>
        <div class="summary-row">
          <span>商品总价：</span>
          <span class="total-amount">${this.formatPrice(this.getTotalPrice())}</span>
        </div>
        <div class="cart-actions">
          <button class="btn-secondary clear-cart">清空购物车</button>
          <button class="btn-primary checkout">去结算</button>
        </div>
      </div>
    `;
  }

  // 绑定事件
  bindEvents() {
    // 使用事件委托处理购物车操作
    document.addEventListener('click', (e) => {
      const target = e.target;
      
      // 立即购买按钮（首页的huai-ready按钮）
      if (target.classList.contains('huai-ready')) {
        e.preventDefault();
        
        // 检查登录状态
        const loginStatus = this.checkLoginStatus();
        if (!loginStatus.isLoggedIn) {
          this.showLoginPrompt();
          return;
        }
        
        // 已登录，正常跳转到详情页
        window.location.href = target.href;
      }
      
      // 添加到购物车按钮
      if (target.classList.contains('add-to-cart')) {
        e.preventDefault();
        const productId = parseInt(target.dataset.id);
        const product = shop.find(item => item.id === productId);
        if (product) {
          this.addItem(product);
        }
      }
      
      // 数量控制按钮
      if (target.classList.contains('quantity-btn')) {
        const productId = parseInt(target.dataset.id);
        const quantityInput = document.querySelector(`.quantity-input[data-id="${productId}"]`);
        let currentQuantity = parseInt(quantityInput.value);
        
        if (target.classList.contains('plus')) {
          currentQuantity++;
        } else if (target.classList.contains('minus')) {
          currentQuantity--;
        }
        
        this.updateQuantity(productId, currentQuantity);
      }
      
      // 移除商品按钮
      if (target.classList.contains('remove-btn')) {
        const productId = parseInt(target.dataset.id);
        
        // 检查是否在购物车页面，如果是则让shopCarPage处理
        const isCartPage = window.location.pathname.includes('shopCar.html') || 
                          document.querySelector('.cart-page');
        
        if (isCartPage && window.shopCarPage) {
          // 在购物车页面，阻止cart.js处理，让shopCarPage处理
          e.preventDefault();
          e.stopPropagation();
          return;
        } else {
          // 在其他页面，直接从购物车移除
          this.removeItem(productId);
        }
      }
      
      // 清空购物车按钮
      if (target.classList.contains('clear-cart')) {
        if (confirm('确定要清空购物车吗？')) {
          this.clear();
        }
      }
      
      // 结算按钮
      if (target.classList.contains('checkout')) {
        this.checkout();
      }
    });

    // 数量输入框变化事件
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('quantity-input')) {
        const productId = parseInt(e.target.dataset.id);
        const quantity = parseInt(e.target.value);
        this.updateQuantity(productId, quantity);
      }
    });
  }

  // 结算功能
  checkout() {
    // 检查登录状态
    const loginStatus = this.checkLoginStatus();
    if (!loginStatus.isLoggedIn) {
      this.showLoginPrompt();
      return;
    }

    if (this.items.length === 0) {
      Utils.showMessage('购物车是空的，无法结算', 'warning');
      return;
    }

    const orderData = {
      id: Utils.generateId(),
      items: Utils.deepClone(this.items),
      totalQuantity: this.getTotalQuantity(),
      totalPrice: this.getTotalPrice(),
      orderTime: new Date().toISOString(),
      status: 'pending',
      userId: loginStatus.user.email || loginStatus.user.phone
    };

    // 保存订单到本地存储
    const orders = Utils.storage.get('orders') || [];
    orders.push(orderData);
    Utils.storage.set('orders', orders);

    // 清空购物车
    this.clear();

    // 显示成功消息
    Utils.showMessage('订单提交成功！', 'success');
    
    // 可以跳转到订单页面
    // window.location.href = 'orders.html';
  }

  // 获取购物车商品列表
  getItems() {
    return this.items;
  }

  // 检查商品是否在购物车中
  hasItem(productId) {
    return this.items.some(item => item.id === productId);
  }

  // 用户登录后的回调处理
  onUserLogin() {
    // 重新加载购物车数据（切换到用户专属购物车）
    this.items = this.loadFromStorage();
    
    // 迁移临时购物车
    this.migrateGuestCart();
    
    // 更新显示
    this.updateCartDisplay();
  }

  // 用户退出登录后的回调处理
  onUserLogout() {
    // 清理当前购物车显示
    this.clearUserCart();
  }
}

// 创建全局购物车实例
window.cart = new ShoppingCart();

// 扩展全局退出登录函数
const originalLogout = window.logout;
window.logout = function() {
  // 调用购物车的退出登录处理
  if (window.cart) {
    window.cart.onUserLogout();
  }
  
  // 调用原始的退出登录函数
  if (originalLogout) {
    originalLogout();
  } else {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('rememberLogin');
    window.location.href = 'login.html';
  }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 检查是否刚刚登录，如果是则处理购物车迁移
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('login') === 'success' && window.cart) {
    window.cart.onUserLogin();
  }

  // 为商品添加"加入购物车"按钮
  const addCartButtons = () => {
    const productElements = document.querySelectorAll('.book-item, .product-item');
    productElements.forEach(element => {
      if (!element.querySelector('.add-to-cart')) {
        const productId = element.dataset.id;
        if (productId) {
          const button = document.createElement('button');
          button.className = 'add-to-cart btn-primary';
          button.dataset.id = productId;
          button.textContent = '加入购物车';
          element.appendChild(button);
        }
      }
    });
  };

  // 延迟执行，确保页面内容已加载
  setTimeout(addCartButtons, 1000);
}); 
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

  // 从本地存储加载购物车数据
  loadFromStorage() {
    return Utils.storage.get('shopping_cart') || [];
  }

  // 保存到本地存储
  saveToStorage() {
    Utils.storage.set('shopping_cart', this.items);
  }

  // 添加商品到购物车
  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        ...product,
        quantity: quantity,
        addTime: new Date().toISOString()
      });
    }
    
    this.saveToStorage();
    this.updateCartDisplay();
    Utils.showMessage(`《${product.title}》已添加到购物车`, 'success');
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

  // 获取购物车总数量
  getTotalQuantity() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // 获取购物车总价格
  getTotalPrice() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
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
    // 只在购物车页面更新购物车显示
    const isCartPage = window.location.pathname.includes('shopCar.html') || 
                       document.querySelector('.cart-page') || 
                       document.querySelector('#cart-container');
    
    if (!isCartPage) {
      return; // 不在购物车页面，不执行更新
    }
    
    const cartContainer = document.querySelector('.cart-container') || 
                         document.querySelector('#cart-items') ||
                         document.querySelector('.swiper-wrapper');
    
    if (!cartContainer) return;

    if (this.items.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart">
          <div class="empty-icon">📚</div>
          <h3>购物车是空的</h3>
          <p>去挑选一些好书吧！</p>
          <a href="index.html" class="btn-primary">去购物</a>
        </div>
      `;
      return;
    }

    cartContainer.innerHTML = this.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="book-cover">
          <img src="${item.img}" alt="${item.title}" onerror="this.src='img/default-book.jpg'">
        </div>
        <div class="book-info">
          <h4 class="book-title">${item.title}</h4>
          <p class="book-author">作者：${item.author}</p>
          <p class="book-desc">${item.content}</p>
          <div class="book-price">
            <span class="price">${Utils.formatPrice(item.price)}</span>
            <span class="original-price">原价：${Utils.formatPrice(item.price * 1.2)}</span>
          </div>
        </div>
        <div class="quantity-controls">
          <button class="quantity-btn minus" data-id="${item.id}">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
          <button class="quantity-btn plus" data-id="${item.id}">+</button>
        </div>
        <div class="item-total">
          <span class="total-price">${Utils.formatPrice(item.price * item.quantity)}</span>
          <button class="remove-btn" data-id="${item.id}">移除</button>
        </div>
      </div>
    `).join('');

    // 添加购物车总计
    let cartSummary = document.querySelector('.cart-summary');
    if (!cartSummary) {
      cartSummary = document.createElement('div');
      cartSummary.className = 'cart-summary';
      cartContainer.parentNode.appendChild(cartSummary);
    }
    
    cartSummary.innerHTML = `
      <div class="summary-content">
        <div class="summary-row">
          <span>商品总数：</span>
          <span>${this.getTotalQuantity()} 件</span>
        </div>
        <div class="summary-row">
          <span>商品总价：</span>
          <span class="total-amount">${Utils.formatPrice(this.getTotalPrice())}</span>
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
        this.removeItem(productId);
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
      status: 'pending'
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
}

// 创建全局购物车实例
window.cart = new ShoppingCart();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
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
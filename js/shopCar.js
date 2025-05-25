var carShop = (function(){
	let $swiper,$divAll,$operation,$bookNum
	return {
		init(){
			$swiper = document.querySelector(".swiper-wrapper");
			$operation = document.querySelector(".operation");
			$bookNum = document.querySelector(".book-num");
			$divAll = $swiper.children;
			this.event()
		},
		event(){
			var _this = this;
			var num = localStorage.num;
			var obj = localStorage.obj;
			obj = obj.split("undefined")[1];
			$swiper.innerHTML = obj;
			$bookNum.innerHTML = num;
		}	
	}	
}())

var showText = (function() {
	let $el, $search, $btn, $showBox, timer;
	return {
		init($ele) {
			$el = $($ele);
			$search = $el.children(".search");
			$showBox = $el.children(".showBox");
			$btn = $el.children(".btn-seach");
			this.event()
		},
		event() {
			let _this = this;
			$search.on("focus", function() {
				_this.show();
			})
			$search.on("click", function(e) {
				e = e || event;
				let target = e.target || e.srcElement;
				e.stopPropagation();
			})
			$search.on("input", function() {
				clearTimeout(timer);
				timer = setTimeout(_ => {
					_this.searchBooks(this.value);
				}, 300)
			})
			// 搜索按钮点击事件
			$btn.on("click", function() {
				const searchValue = $search.val().trim();
				if (searchValue) {
					_this.performSearch(searchValue);
				}
			})
			// 回车搜索
			$search.on("keypress", function(e) {
				if (e.which === 13) {
					const searchValue = $(this).val().trim();
					if (searchValue) {
						_this.performSearch(searchValue);
					}
				}
			})
			window.onclick = function() {
				_this.hidden();
			}
			$showBox.on("click", function(e) {
				e = e || event;
				let target = e.target || e.srcElement;
				if(target.nodeName == "LI") {
					const searchText = target.innerHTML;
					$search.val(searchText);
					_this.hidden();
					_this.performSearch(searchText);
				}
			})
		},
		show() {
			$showBox.css("display", "block");
		},
		hidden() {
			$showBox.css("display", "none");
		},
		// 搜索本地书籍
		searchBooks(query) {
			if (!query || query.length < 1) {
				this.hidden();
				return;
			}

			// 搜索本地书籍数据
			const results = [];
			
			// 从shop数组中搜索
			if (typeof shop !== 'undefined') {
				shop.forEach(book => {
					if (book.title && book.title.toLowerCase().includes(query.toLowerCase()) ||
						book.author && book.author.toLowerCase().includes(query.toLowerCase()) ||
						book.content && book.content.toLowerCase().includes(query.toLowerCase())) {
						results.push({
							title: book.title,
							author: book.author,
							type: 'book',
							id: book.id
						});
					}
				});
			}

			// 添加一些常见搜索建议
			const suggestions = [
				'人类简史', '未来简史', '嫌疑人X的献身', '解忧杂货店',
				'小说', '历史', '科幻', '推理', '言情', '文学'
			];
			
			suggestions.forEach(suggestion => {
				if (suggestion.toLowerCase().includes(query.toLowerCase()) && 
					!results.find(r => r.title === suggestion)) {
					results.push({
						title: suggestion,
						type: 'suggestion'
					});
				}
			});

			this.displaySearchResults(results.slice(0, 8)); // 最多显示8个结果
		},
		// 显示搜索结果
		displaySearchResults(results) {
			$showBox.html('');
			
			if (results.length === 0) {
				const $li = document.createElement('li');
				$li.className = 'no-results';
				$li.innerHTML = '暂无相关结果';
				$showBox.append($li);
			} else {
				results.forEach(result => {
					const $li = document.createElement('li');
					$li.className = result.type === 'book' ? 'search-book' : 'search-suggestion';
					
					if (result.type === 'book') {
						$li.innerHTML = `
							<div class="search-item">
								<span class="book-title">${result.title}</span>
								<span class="book-author">- ${result.author || '未知作者'}</span>
							</div>
						`;
						$li.dataset.bookId = result.id;
					} else {
						$li.innerHTML = result.title;
					}
					
					$showBox.append($li);
				});
			}
			
			this.show();
		},
		// 执行搜索
		performSearch(query) {
			this.hidden();
			
			// 搜索本地书籍
			const results = [];
			if (typeof shop !== 'undefined') {
				shop.forEach(book => {
					if (book.title && book.title.toLowerCase().includes(query.toLowerCase()) ||
						book.author && book.author.toLowerCase().includes(query.toLowerCase()) ||
						book.content && book.content.toLowerCase().includes(query.toLowerCase())) {
						results.push(book);
					}
				});
			}

			// 显示搜索结果
			this.showSearchResults(query, results);
		},
		// 显示搜索结果页面
		showSearchResults(query, results) {
			// 创建搜索结果弹窗
			const modal = document.createElement('div');
			modal.className = 'search-results-modal';
			modal.innerHTML = `
				<div class="search-results-overlay"></div>
				<div class="search-results-content">
					<div class="search-results-header">
						<h3>搜索结果</h3>
						<span class="search-query">关键词：${query}</span>
						<button class="close-search-btn">&times;</button>
					</div>
					<div class="search-results-body">
						${results.length === 0 ? 
							'<div class="no-results-message">抱歉，没有找到相关书籍</div>' :
							results.map(book => `
								<div class="search-result-item" data-book-id="${book.id}">
									<img src="${book.img}" alt="${book.title}" onerror="this.src='img/default-book.jpg'">
									<div class="book-details">
										<h4>${book.title}</h4>
										<p class="author">作者：${book.author || '未知作者'}</p>
										<p class="price">¥${book.price}</p>
										<p class="desc">${book.content ? book.content.substring(0, 100) + '...' : '暂无描述'}</p>
									</div>
									<div class="book-actions">
										<button class="btn-view-details" data-book-id="${book.id}">查看详情</button>
										<button class="btn-add-cart" data-book-id="${book.id}">加入购物车</button>
									</div>
								</div>
							`).join('')
						}
					</div>
				</div>
			`;

			// 添加样式
			if (!document.querySelector('#search-results-styles')) {
				const style = document.createElement('style');
				style.id = 'search-results-styles';
				style.textContent = `
					.search-results-modal {
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
					.search-results-overlay {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						background: rgba(0, 0, 0, 0.5);
					}
					.search-results-content {
						position: relative;
						background: white;
						border-radius: 12px;
						box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
						max-width: 800px;
						width: 90%;
						max-height: 80vh;
						overflow: hidden;
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
					.search-results-header {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 20px 25px;
						border-bottom: 1px solid #eee;
						background: #f8f9fa;
					}
					.search-results-header h3 {
						margin: 0;
						color: #333;
						font-size: 20px;
					}
					.search-query {
						color: #666;
						font-size: 14px;
					}
					.close-search-btn {
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
					.close-search-btn:hover {
						color: #666;
					}
					.search-results-body {
						padding: 20px;
						max-height: 60vh;
						overflow-y: auto;
					}
					.no-results-message {
						text-align: center;
						color: #666;
						font-size: 16px;
						padding: 40px 20px;
					}
					.search-result-item {
						display: flex;
						align-items: center;
						padding: 15px;
						border: 1px solid #eee;
						border-radius: 8px;
						margin-bottom: 15px;
						transition: all 0.2s ease;
					}
					.search-result-item:hover {
						box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
						transform: translateY(-2px);
					}
					.search-result-item img {
						width: 60px;
						height: 80px;
						object-fit: cover;
						border-radius: 4px;
						margin-right: 15px;
					}
					.book-details {
						flex: 1;
						margin-right: 15px;
					}
					.book-details h4 {
						margin: 0 0 8px;
						color: #333;
						font-size: 16px;
					}
					.book-details .author {
						margin: 0 0 5px;
						color: #666;
						font-size: 14px;
					}
					.book-details .price {
						margin: 0 0 8px;
						color: #c9483c;
						font-size: 16px;
						font-weight: 600;
					}
					.book-details .desc {
						margin: 0;
						color: #888;
						font-size: 13px;
						line-height: 1.4;
					}
					.book-actions {
						display: flex;
						flex-direction: column;
						gap: 8px;
					}
					.book-actions button {
						padding: 8px 16px;
						border: none;
						border-radius: 4px;
						cursor: pointer;
						font-size: 14px;
						transition: all 0.2s ease;
					}
					.btn-view-details {
						background: #f8f9fa;
						color: #666;
					}
					.btn-view-details:hover {
						background: #e9ecef;
					}
					.btn-add-cart {
						background: #c9483c;
						color: white;
					}
					.btn-add-cart:hover {
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

			modal.querySelector('.close-search-btn').addEventListener('click', closeModal);
			modal.querySelector('.search-results-overlay').addEventListener('click', closeModal);

			// 查看详情按钮
			modal.querySelectorAll('.btn-view-details').forEach(btn => {
				btn.addEventListener('click', (e) => {
					const bookId = e.target.dataset.bookId;
					closeModal();
					window.location.href = `details.html?id=${bookId}`;
				});
			});

			// 加入购物车按钮
			modal.querySelectorAll('.btn-add-cart').forEach(btn => {
				btn.addEventListener('click', (e) => {
					const bookId = parseInt(e.target.dataset.bookId);
					const book = shop.find(b => b.id === bookId);
					if (book && window.cart) {
						window.cart.addItem(book);
					}
				});
			});

			// ESC键关闭
			const handleEsc = (e) => {
				if (e.key === 'Escape') {
					closeModal();
					document.removeEventListener('keydown', handleEsc);
				}
			};
			document.addEventListener('keydown', handleEsc);
		},
		getData(val) {
			// 保留原有的百度搜索建议功能作为补充
			const url = 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su'
			const data = {
				wd: val,
				cb: 'showText.insertData'
			}
			sendJsonp(url, data);
		},
		insertData(data) {
			// 百度搜索建议的回调函数（保留原功能）
			if (data && data.s) {
				const suggestions = data.s.slice(0, 5); // 只取前5个建议
				const currentResults = Array.from($showBox[0].children);
				
				suggestions.forEach(suggestion => {
					const $li = document.createElement('li');
					$li.className = 'search-suggestion';
					$li.innerHTML = suggestion;
					$showBox.append($li);
				});
			}
		}
	}
}())

window.onscroll = function(e) {
	var $herdFix = document.querySelector(".headerFix");
	e = e || event;
	const doc = document.documentElement;
	let restScroll = parseInt(doc.scrollTop);
	if(restScroll > 177) {
		$herdFix.style.display = "block";
	} else {
		$herdFix.style.display = "none";
	}
}

/**
 * 购物车页面管理系统
 */
class ShopCarPage {
	constructor() {
		this.deletedItems = this.loadDeletedItems();
		this.init();
	}

	init() {
		this.bindEvents();
		this.updateDeletedCount();
		this.initCartSearch();
	}

	// 工具函数 - 本地存储
	storage = {
		set(key, value) {
			try {
				localStorage.setItem(key, JSON.stringify(value));
				return true;
			} catch (e) {
				console.error('存储失败:', e);
				return false;
			}
		},

		get(key) {
			try {
				const item = localStorage.getItem(key);
				return item ? JSON.parse(item) : null;
			} catch (e) {
				console.error('读取失败:', e);
				return null;
			}
		},

		remove(key) {
			try {
				localStorage.removeItem(key);
				return true;
			} catch (e) {
				console.error('删除失败:', e);
				return false;
			}
		}
	};

	// 工具函数 - 显示消息
	showMessage(message, type = 'info', duration = 3000) {
		// 如果Utils存在，使用Utils的showMessage
		if (typeof Utils !== 'undefined' && Utils.showMessage) {
			return Utils.showMessage(message, type, duration);
		}

		// 备用消息显示方案
		const messageEl = document.createElement('div');
		messageEl.className = `message message-${type}`;
		messageEl.textContent = message;
		
		// 添加样式
		Object.assign(messageEl.style, {
			position: 'fixed',
			top: '20px',
			right: '20px',
			padding: '12px 20px',
			borderRadius: '4px',
			color: '#fff',
			fontSize: '14px',
			zIndex: '10000',
			opacity: '0',
			transform: 'translateX(100%)',
			transition: 'all 0.3s ease'
		});

		// 根据类型设置背景色
		const colors = {
			success: '#52c41a',
			error: '#ff4d4f',
			warning: '#faad14',
			info: '#1890ff'
		};
		messageEl.style.backgroundColor = colors[type] || colors.info;

		document.body.appendChild(messageEl);

		// 显示动画
		setTimeout(() => {
			messageEl.style.opacity = '1';
			messageEl.style.transform = 'translateX(0)';
		}, 10);

		// 自动隐藏
		setTimeout(() => {
			messageEl.style.opacity = '0';
			messageEl.style.transform = 'translateX(100%)';
			setTimeout(() => {
				if (messageEl.parentNode) {
					document.body.removeChild(messageEl);
				}
			}, 300);
		}, duration);
	}

	// 价格格式化函数
	formatPrice(price) {
		if (typeof Utils !== 'undefined' && Utils.formatPrice) {
			return Utils.formatPrice(price);
		}
		// 备用价格格式化方案 - 修复双重¥符号问题
		const numPrice = parseFloat(price);
		if (isNaN(numPrice)) return '¥0.00';
		return `¥${numPrice.toFixed(2)}`;
	}

	// 加载已删除的商品
	loadDeletedItems() {
		const loginStatus = this.getLoginStatus();
		const storageKey = loginStatus.isLoggedIn 
			? `deleted_items_${loginStatus.user.email || loginStatus.user.phone}`
			: 'deleted_items_guest';
		
		return this.storage.get(storageKey) || [];
	}

	// 保存已删除的商品
	saveDeletedItems() {
		const loginStatus = this.getLoginStatus();
		const storageKey = loginStatus.isLoggedIn 
			? `deleted_items_${loginStatus.user.email || loginStatus.user.phone}`
			: 'deleted_items_guest';
		
		this.storage.set(storageKey, this.deletedItems);
	}

	// 获取登录状态
	getLoginStatus() {
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
				return { isLoggedIn: false, user: null };
			}
		}
		
		return { isLoggedIn: false, user: null };
	}

	// 删除商品（移动到已删除列表）
	deleteItem(productId) {
		if (!window.cart) return;

		const item = window.cart.getItems().find(item => item.id === productId);
		if (!item) return;

		// 检查是否已经在删除过程中，避免重复处理
		if (this.isDeleting) return;
		this.isDeleting = true;

		// 显示删除确认弹窗
		this.showDeleteConfirm(item, () => {
			// 添加到已删除列表
			const deletedItem = {
				...item,
				deletedTime: new Date().toISOString(),
				deletedBy: this.getLoginStatus().user?.email || 'guest'
			};
			
			this.deletedItems.push(deletedItem);
			this.saveDeletedItems();
			
			// 从购物车中移除（直接调用内部方法，避免触发其他事件）
			const index = window.cart.items.findIndex(cartItem => cartItem.id === productId);
			if (index > -1) {
				window.cart.items.splice(index, 1);
				window.cart.saveToStorage();
				window.cart.updateCartDisplay();
			}
			
			// 更新显示
			this.updateDeletedCount();
			this.updateDeletedItemsDisplay();
			
			this.showMessage(`《${item.title}》已移除，可在"已删除的书籍"中查看`, 'info');
			
			// 重置删除状态
			this.isDeleting = false;
		}, () => {
			// 取消删除时也要重置状态
			this.isDeleting = false;
		});
	}

	// 显示删除确认弹窗
	showDeleteConfirm(item, onConfirm, onCancel) {
		// 检查是否已经有删除弹窗存在
		const existingModal = document.querySelector('.delete-modal');
		if (existingModal) {
			existingModal.remove();
		}

		const modal = document.createElement('div');
		modal.className = 'delete-modal';
		modal.innerHTML = `
			<div class="delete-modal-content">
				<h3>确认删除</h3>
				<p>确定要将《${item.title}》从购物车中移除吗？<br>移除后可在"已删除的书籍"中找回。</p>
				<div class="delete-modal-actions">
					<button class="btn-cancel">取消</button>
					<button class="btn-confirm">确认删除</button>
				</div>
			</div>
		`;

		document.body.appendChild(modal);

		// 绑定事件
		const closeModal = () => {
			modal.remove();
			if (onCancel) onCancel();
		};
		
		modal.querySelector('.btn-cancel').addEventListener('click', closeModal);
		modal.querySelector('.btn-confirm').addEventListener('click', () => {
			modal.remove();
			onConfirm();
		});
		
		// 点击背景关闭
		modal.addEventListener('click', (e) => {
			if (e.target === modal) closeModal();
		});
	}

	// 恢复已删除的商品
	restoreItem(productId) {
		const itemIndex = this.deletedItems.findIndex(item => item.id === productId);
		if (itemIndex === -1) return;

		const item = this.deletedItems[itemIndex];
		
		// 从已删除列表中移除
		this.deletedItems.splice(itemIndex, 1);
		this.saveDeletedItems();
		
		// 添加回购物车
		if (window.cart) {
			const { deletedTime, deletedBy, ...restoreItem } = item;
			window.cart.addItem(restoreItem, item.quantity);
		}
		
		// 更新显示
		this.updateDeletedCount();
		this.updateDeletedItemsDisplay();
		
		this.showMessage(`《${item.title}》已恢复到购物车`, 'success');
	}

	// 永久删除商品
	permanentDelete(productId) {
		const itemIndex = this.deletedItems.findIndex(item => item.id === productId);
		if (itemIndex === -1) return;

		const item = this.deletedItems[itemIndex];
		
		if (confirm(`确定要永久删除《${item.title}》吗？此操作不可恢复！`)) {
			this.deletedItems.splice(itemIndex, 1);
			this.saveDeletedItems();
			
			this.updateDeletedCount();
			this.updateDeletedItemsDisplay();
			
			this.showMessage(`《${item.title}》已永久删除`, 'info');
		}
	}

	// 更新已删除商品数量显示
	updateDeletedCount() {
		const deletedNumEl = document.querySelector('.deleted-num');
		if (deletedNumEl) {
			deletedNumEl.textContent = this.deletedItems.length;
		}
	}

	// 更新已删除商品列表显示
	updateDeletedItemsDisplay() {
		const deletedList = document.querySelector('.deleted-items-list');
		if (!deletedList) return;

		if (this.deletedItems.length === 0) {
			deletedList.innerHTML = `
				<div class="empty-cart">
					<div class="empty-icon">🗑️</div>
					<h3>没有已删除的书籍</h3>
					<p>您还没有删除任何书籍</p>
				</div>
			`;
			return;
		}

		deletedList.innerHTML = this.deletedItems.map(item => `
			<div class="cart-item deleted-item" data-id="${item.id}">
				<div class="book-cover">
					<img src="${item.img}" alt="${item.title}" onerror="this.src='img/default-book.jpg'">
					<div class="deleted-overlay">已删除</div>
				</div>
				<div class="book-info">
					<h4 class="book-title">${item.title}</h4>
					<p class="book-author">作者：${item.author || '未知作者'}</p>
					<p class="book-desc">${item.content || '暂无描述'}</p>
					<div class="book-price">
						<span class="price">¥${this.formatPrice(item.price)}</span>
						<span class="deleted-time">删除时间：${new Date(item.deletedTime).toLocaleString()}</span>
					</div>
				</div>
				<div class="quantity-info">
					<span class="quantity-display">数量：${item.quantity}</span>
				</div>
				<div class="item-actions">
					<button class="restore-btn" data-id="${item.id}">恢复</button>
					<button class="permanent-delete-btn" data-id="${item.id}">永久删除</button>
				</div>
			</div>
		`).join('');

		// 添加已删除商品的特殊样式
		if (!document.querySelector('#deleted-items-styles')) {
			const style = document.createElement('style');
			style.id = 'deleted-items-styles';
			style.textContent = `
				.deleted-item {
					opacity: 0.7;
					background: #f8f9fa;
				}
				.deleted-overlay {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: rgba(255, 71, 87, 0.8);
					color: white;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 12px;
					font-weight: 600;
					border-radius: 8px;
				}
				.book-cover {
					position: relative;
				}
				.deleted-time {
					font-size: 12px;
					color: #999;
					margin-left: 10px;
				}
				.quantity-display {
					font-size: 14px;
					color: #666;
					background: #f1f2f6;
					padding: 8px 12px;
					border-radius: 6px;
				}
				.item-actions {
					display: flex;
					flex-direction: column;
					gap: 8px;
					min-width: 100px;
				}
				.restore-btn, .permanent-delete-btn {
					padding: 8px 12px;
					border: none;
					border-radius: 6px;
					cursor: pointer;
					font-size: 12px;
					font-weight: 600;
					transition: all 0.2s ease;
				}
				.restore-btn {
					background: #2ed573;
					color: white;
				}
				.restore-btn:hover {
					background: #26d467;
				}
				.permanent-delete-btn {
					background: #ff4757;
					color: white;
				}
				.permanent-delete-btn:hover {
					background: #ff3742;
				}
				.tab-link {
					text-decoration: none;
					color: #666;
					padding: 10px 15px;
					border-radius: 6px;
					transition: all 0.2s ease;
				}
				.tab-link.active {
					background: #c9483c;
					color: white;
				}
				.tab-link:hover {
					background: #f0f0f0;
				}
				.tab-link.active:hover {
					background: #b03d33;
				}
			`;
			document.head.appendChild(style);
		}
	}

	// 购物车搜索功能
	initCartSearch() {
		// 在购物车操作栏添加搜索框
		const operation = document.querySelector('.operation');
		if (!operation) return;

		// 检查是否已经添加了搜索框
		if (operation.querySelector('.cart-search-box')) return;

		// 创建搜索框HTML
		const searchBoxHTML = `
			<div class="cart-search-box" style="display: flex; align-items: center; gap: 10px; margin-left: 20px;">
				<input type="text" class="cart-search-input" placeholder="搜索购物车中的书籍..." 
					   style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; width: 200px; font-size: 14px;">
				<button class="cart-search-btn" style="padding: 8px 16px; background: #c9483c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
					搜索
				</button>
				<button class="cart-search-clear" style="padding: 8px 12px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
					清除
				</button>
			</div>
		`;

		// 找到操作栏中的第一个div并添加搜索框
		const operationDiv = operation.querySelector('div');
		if (operationDiv) {
			operationDiv.insertAdjacentHTML('beforeend', searchBoxHTML);
		}

		// 绑定搜索事件
		this.bindCartSearchEvents();
	}

	// 绑定购物车搜索事件
	bindCartSearchEvents() {
		const searchInput = document.querySelector('.cart-search-input');
		const searchBtn = document.querySelector('.cart-search-btn');
		const clearBtn = document.querySelector('.cart-search-clear');

		if (!searchInput || !searchBtn || !clearBtn) return;

		let searchTimer;

		// 实时搜索
		searchInput.addEventListener('input', () => {
			clearTimeout(searchTimer);
			searchTimer = setTimeout(() => {
				this.performCartSearch(searchInput.value.trim());
			}, 300);
		});

		// 搜索按钮点击
		searchBtn.addEventListener('click', () => {
			this.performCartSearch(searchInput.value.trim());
		});

		// 回车搜索
		searchInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') {
				this.performCartSearch(searchInput.value.trim());
			}
		});

		// 清除搜索
		clearBtn.addEventListener('click', () => {
			searchInput.value = '';
			this.performCartSearch('');
		});
	}

	// 执行购物车搜索
	performCartSearch(query) {
		const cartItems = document.querySelectorAll('.cart-item');
		const deletedItems = document.querySelectorAll('.deleted-item');
		
		// 搜索购物车商品
		cartItems.forEach(item => {
			const title = item.querySelector('.book-title')?.textContent || '';
			const author = item.querySelector('.book-author')?.textContent || '';
			const desc = item.querySelector('.book-desc')?.textContent || '';
			
			const isMatch = !query || 
				title.toLowerCase().includes(query.toLowerCase()) ||
				author.toLowerCase().includes(query.toLowerCase()) ||
				desc.toLowerCase().includes(query.toLowerCase());
			
			item.style.display = isMatch ? 'flex' : 'none';
		});

		// 搜索已删除商品
		deletedItems.forEach(item => {
			const title = item.querySelector('.book-title')?.textContent || '';
			const author = item.querySelector('.book-author')?.textContent || '';
			const desc = item.querySelector('.book-desc')?.textContent || '';
			
			const isMatch = !query || 
				title.toLowerCase().includes(query.toLowerCase()) ||
				author.toLowerCase().includes(query.toLowerCase()) ||
				desc.toLowerCase().includes(query.toLowerCase());
			
			item.style.display = isMatch ? 'flex' : 'none';
		});

		// 显示搜索结果统计
		this.showSearchStats(query, cartItems, deletedItems);
	}

	// 显示搜索结果统计
	showSearchStats(query, cartItems, deletedItems) {
		// 移除之前的搜索统计
		const existingStats = document.querySelector('.search-stats');
		if (existingStats) {
			existingStats.remove();
		}

		if (!query) return;

		// 计算匹配的商品数量
		const visibleCartItems = Array.from(cartItems).filter(item => item.style.display !== 'none').length;
		const visibleDeletedItems = Array.from(deletedItems).filter(item => item.style.display !== 'none').length;

		// 创建搜索统计信息
		const statsHTML = `
			<div class="search-stats" style="padding: 15px 30px; background: #f8f9fa; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">
				搜索 "${query}" 的结果：购物车中找到 ${visibleCartItems} 件商品，已删除中找到 ${visibleDeletedItems} 件商品
			</div>
		`;

		// 插入到购物车内容区域的顶部
		const cartContent = document.querySelector('.cart-content');
		if (cartContent) {
			cartContent.insertAdjacentHTML('afterbegin', statsHTML);
		}
	}

	// 绑定事件
	bindEvents() {
		// 使用事件委托处理所有按钮点击
		document.addEventListener('click', (e) => {
			const target = e.target;
			
			// 删除商品按钮（重写购物车的删除功能）
			if (target.classList.contains('remove-btn')) {
				e.preventDefault();
				const productId = parseInt(target.dataset.id);
				this.deleteItem(productId);
			}
			
			// 恢复商品按钮
			if (target.classList.contains('restore-btn')) {
				e.preventDefault();
				const productId = parseInt(target.dataset.id);
				this.restoreItem(productId);
			}
			
			// 永久删除按钮
			if (target.classList.contains('permanent-delete-btn')) {
				e.preventDefault();
				const productId = parseInt(target.dataset.id);
				this.permanentDelete(productId);
			}
			
			// 查看已删除商品按钮
			if (target.classList.contains('view-deleted-btn')) {
				e.preventDefault();
				const deletedContainer = document.querySelector('.deleted-items-container');
				if (deletedContainer) {
					const isVisible = deletedContainer.style.display !== 'none';
					deletedContainer.style.display = isVisible ? 'none' : 'block';
					target.textContent = isVisible ? '查看已删除' : '隐藏已删除';
					
					if (!isVisible) {
						this.updateDeletedItemsDisplay();
					}
				}
			}
		});
	}

	// 清空已删除的商品
	clearDeletedItems() {
		if (this.deletedItems.length === 0) {
			this.showMessage('没有已删除的商品', 'info');
			return;
		}

		if (confirm(`确定要清空所有已删除的商品吗？共${this.deletedItems.length}件商品将被永久删除！`)) {
			this.deletedItems = [];
			this.saveDeletedItems();
			this.updateDeletedCount();
			this.updateDeletedItemsDisplay();
			this.showMessage('已清空所有已删除的商品', 'info');
		}
	}

	// 批量恢复已删除的商品
	restoreAllItems() {
		if (this.deletedItems.length === 0) {
			this.showMessage('没有已删除的商品', 'info');
			return;
		}

		if (confirm(`确定要恢复所有已删除的商品吗？共${this.deletedItems.length}件商品将被恢复到购物车。`)) {
			const restoredCount = this.deletedItems.length;
			
			// 恢复所有商品到购物车
			this.deletedItems.forEach(item => {
				if (window.cart) {
					const { deletedTime, deletedBy, ...restoreItem } = item;
					window.cart.addItem(restoreItem, item.quantity);
				}
			});
			
			// 清空已删除列表
			this.deletedItems = [];
			this.saveDeletedItems();
			this.updateDeletedCount();
			this.updateDeletedItemsDisplay();
			
			this.showMessage(`已恢复${restoredCount}件商品到购物车`, 'success');
		}
	}
}

// 创建全局购物车页面实例
window.shopCarPage = new ShopCarPage();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
	console.log('购物车页面管理系统初始化完成');
});

var shopCar = (function() {
	let $bookInf, $shopBtn, currentBook;
	return {
		init() {
			$bookInf = document.querySelector(".book-inf");
			this.event()
		},
		event() {
			var _this = this;
			var url = window.location.href;
			var num = Number(url.split("?")[1].split("=")[1]);
			shop.forEach(x => {
				for(var attr in x) {
					if(x[attr] == num) {
						currentBook = x;
						_this.insertData(x);
					}
				}
			})
		},
		insertData(data) {
			// 检查商品是否已在购物车中
			const isInCart = window.cart ? window.cart.hasItem(data.id) : false;
			const buttonText = isInCart ? '已在购物车' : '加入购物车';
			const buttonClass = isInCart ? 'in-cart' : '';
			
			var htmlshop =`<div><a href=""><img src="${data.img}" alt=""></a>
                        	<div class="jianjie">
                            <h3>${data.title}
                                <span>${data.author}</span>
                            </h3>
                            <div class="description">
                            	${data.content}
							</div>
                            <div class="price">
                                <i class="iconfont icon-qian"></i>
                                <span>${data.price}元</span>
                                <em>6.6折!</em>
                                <a href="javascript:;" class="shopping-car ${buttonClass}">
                                    <i class="iconfont icon-gouwuche"></i>
                                    <span data-id="${data.id}" class="shop-btn">${buttonText}</span>
                                </a>
                            </div>
                            <div class="notice" style="padding-bottom: 6px;">
                                <i class="iconfont icon-damuzhizhaoxia"></i>
                                <span class="baoyou">3.22起，全国包邮！！！无论你在中国哪里，都能享受包邮服务</span>
                            </div>
                        </div>
                        </div>
                        `;
			$bookInf.innerHTML = htmlshop;
			this.bindCartEvents();
		},
		bindCartEvents() {
			$shopBtn = document.querySelector(".shop-btn");
			const $shoppingCar = document.querySelector(".shopping-car");
			
			if ($shopBtn) {
				$shopBtn.onclick = (e) => {
					e.preventDefault();
					
					// 检查是否已在购物车中
					if (window.cart && window.cart.hasItem(currentBook.id)) {
						// 已在购物车，跳转到购物车页面
						Utils.showMessage('商品已在购物车中，正在跳转...', 'info');
						setTimeout(() => {
							window.location.href = 'shopCar.html';
						}, 1000);
						return;
					}
					
					// 添加到购物车
					if (window.cart && currentBook) {
						window.cart.addItem(currentBook);
						
						// 更新按钮状态
						$shopBtn.textContent = '已在购物车';
						$shoppingCar.classList.add('in-cart');
						
						// 显示成功消息
						Utils.showMessage(`《${currentBook.title}》已成功加入购物车！`, 'success');
						
						// 3秒后提供跳转选项
						setTimeout(() => {
							const goToCart = confirm('是否立即查看购物车？');
							if (goToCart) {
								window.location.href = 'shopCar.html';
							}
						}, 1500);
					} else {
						Utils.showMessage('购物车系统未初始化，请刷新页面重试', 'error');
					}
				}
			}
		},
		// 更新按钮状态的方法
		updateButtonStatus() {
			if (currentBook && window.cart) {
				const isInCart = window.cart.hasItem(currentBook.id);
				const $shopBtn = document.querySelector(".shop-btn");
				const $shoppingCar = document.querySelector(".shopping-car");
				
				if ($shopBtn && $shoppingCar) {
					$shopBtn.textContent = isInCart ? '已在购物车' : '加入购物车';
					if (isInCart) {
						$shoppingCar.classList.add('in-cart');
					} else {
						$shoppingCar.classList.remove('in-cart');
					}
				}
			}
		}
	}
}());

var showContent = (function() {
	let $comment, $bottombar
	return {
		init() {
			$comment = $(".comment-list");
			$bottombar = $(".bottombar");
			this.event()
		},
		event() {
			var _this = this;
			$bottombar.on("click", "button", function() {
				var $li = $("<li></li>");
				$li.html(`
							<div class="head-pic">
                            <img src="img/img/tx.png" alt="">
                            </div>
                            <div class="info"><i></i></div>
							<blockquote>${$("textarea").val()}</blockquote>
                            <div class="opt"></div>`
				);
            	$comment.append($li);
			})
		}
	}
}())

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
	showContent.init();
	
	// 监听购物车变化，更新按钮状态
	if (window.cart) {
		// 定期检查购物车状态
		setInterval(() => {
			if (shopCar.updateButtonStatus) {
				shopCar.updateButtonStatus();
			}
		}, 1000);
	}
});
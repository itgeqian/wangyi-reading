var shopCar = (function() {
	let $bookInf, $shopBtn, currentBook;
	return {
		init() {
			$bookInf = document.querySelector(".book-inf");
			this.event();
			this.initAnimations();
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
			const buttonIcon = isInCart ? 'icon-check' : 'icon-gouwuche';
			
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
                                    <i class="iconfont ${buttonIcon}"></i>
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
			this.addBookAnimation();
		},
		bindCartEvents() {
			$shopBtn = document.querySelector(".shop-btn");
			const $shoppingCar = document.querySelector(".shopping-car");
			
			if ($shopBtn) {
				$shopBtn.onclick = (e) => {
					e.preventDefault();
					
					// 添加点击动画
					$shoppingCar.style.transform = 'scale(0.95)';
					setTimeout(() => {
						$shoppingCar.style.transform = '';
					}, 150);
					
					// 检查是否已在购物车中
					if (window.cart && window.cart.hasItem(currentBook.id)) {
						// 已在购物车，跳转到购物车页面
						this.showMessage('商品已在购物车中，正在跳转...', 'info');
						setTimeout(() => {
							window.location.href = 'shopCar.html';
						}, 1000);
						return;
					}
					
					// 添加到购物车
					if (window.cart && currentBook) {
						const addResult = window.cart.addItem(currentBook);
						
						// 只有成功添加到购物车才更新按钮状态
						if (addResult) {
							// 更新按钮状态
							this.updateButtonToInCart($shopBtn, $shoppingCar);
							
							// 购物车系统会自动显示美观的成功弹窗
							// 不需要额外的确认弹窗
						}
						// 如果addResult为false，说明用户未登录，购物车系统会自动显示登录提示
					} else {
						this.showMessage('购物车系统未初始化，请刷新页面重试', 'error');
					}
				}
			}
		},
		// 更新按钮到已在购物车状态
		updateButtonToInCart($shopBtn, $shoppingCar) {
			// 添加动画效果
			$shoppingCar.style.transition = 'all 0.5s ease';
			$shoppingCar.style.transform = 'scale(1.1)';
			
			setTimeout(() => {
				$shopBtn.textContent = '已在购物车';
				$shoppingCar.classList.add('in-cart');
				const icon = $shoppingCar.querySelector('i');
				if (icon) {
					icon.className = 'iconfont icon-check';
				}
				
				setTimeout(() => {
					$shoppingCar.style.transform = 'scale(1)';
				}, 200);
			}, 100);
		},
		// 更新按钮状态的方法
		updateButtonStatus() {
			if (currentBook && window.cart) {
				const isInCart = window.cart.hasItem(currentBook.id);
				const $shopBtn = document.querySelector(".shop-btn");
				const $shoppingCar = document.querySelector(".shopping-car");
				
				if ($shopBtn && $shoppingCar) {
					$shopBtn.textContent = isInCart ? '已在购物车' : '加入购物车';
					const icon = $shoppingCar.querySelector('i');
					if (icon) {
						icon.className = isInCart ? 'iconfont icon-check' : 'iconfont icon-gouwuche';
					}
					if (isInCart) {
						$shoppingCar.classList.add('in-cart');
					} else {
						$shoppingCar.classList.remove('in-cart');
					}
				}
			}
		},
		// 添加书籍信息动画
		addBookAnimation() {
			const bookImg = document.querySelector('.book-inf a img');
			const bookInfo = document.querySelector('.book-inf .jianjie');
			
			if (bookImg) {
				bookImg.style.opacity = '0';
				bookImg.style.transform = 'translateY(20px)';
				setTimeout(() => {
					bookImg.style.transition = 'all 0.6s ease';
					bookImg.style.opacity = '1';
					bookImg.style.transform = 'translateY(0)';
				}, 100);
			}
			
			if (bookInfo) {
				bookInfo.style.opacity = '0';
				bookInfo.style.transform = 'translateX(30px)';
				setTimeout(() => {
					bookInfo.style.transition = 'all 0.6s ease';
					bookInfo.style.opacity = '1';
					bookInfo.style.transform = 'translateX(0)';
				}, 200);
			}
		},
		// 初始化页面动画
		initAnimations() {
			// 为评分区域添加动画
			const pfBox = document.querySelector('.pf-box');
			if (pfBox) {
				pfBox.style.opacity = '0';
				pfBox.style.transform = 'translateX(20px)';
				setTimeout(() => {
					pfBox.style.transition = 'all 0.8s ease';
					pfBox.style.opacity = '1';
					pfBox.style.transform = 'translateX(0)';
				}, 300);
			}
			
			// 为导航标签添加点击效果
			this.initTabAnimation();
			
			// 为星星评分添加悬停效果
			this.initStarHover();
		},
		// 初始化标签页动画
		initTabAnimation() {
			const tabs = document.querySelectorAll('.more-nav a');
			tabs.forEach((tab, index) => {
				tab.addEventListener('click', (e) => {
					e.preventDefault();
					
					// 移除所有active类
					tabs.forEach(t => t.classList.remove('active'));
					
					// 添加active类到当前标签
					tab.classList.add('active');
					
					// 切换内容显示
					const isIntroduce = tab.classList.contains('introduce');
					const introContent = document.querySelector('.intro-cont');
					const sayContent = document.querySelector('.say-cont');
					
					if (introContent && sayContent) {
						if (isIntroduce) {
							introContent.style.display = 'block';
							sayContent.style.display = 'none';
						} else {
							introContent.style.display = 'none';
							sayContent.style.display = 'block';
						}
					}
				});
			});
			
			// 默认激活第一个标签
			if (tabs.length > 0) {
				tabs[0].classList.add('active');
			}
		},
		// 初始化星星悬停效果
		initStarHover() {
			const stars = document.querySelectorAll('.f-star span');
			stars.forEach((star, index) => {
				star.addEventListener('mouseenter', () => {
					// 高亮当前星星及之前的星星
					stars.forEach((s, i) => {
						if (i <= index) {
							s.style.filter = 'brightness(1.2) saturate(1.3)';
						} else {
							s.style.filter = '';
						}
					});
				});
				
				star.addEventListener('mouseleave', () => {
					// 恢复所有星星的原始状态
					stars.forEach(s => {
						s.style.filter = '';
					});
				});
			});
		},
		// 显示消息提示
		showMessage(message, type = 'info') {
			// 创建消息元素
			const messageEl = document.createElement('div');
			messageEl.className = `message-toast message-${type}`;
			messageEl.innerHTML = `
				<i class="iconfont ${type === 'error' ? 'icon-error' : 'icon-info'}"></i>
				<span>${message}</span>
			`;
			
			// 添加样式
			messageEl.style.cssText = `
				position: fixed;
				top: 20px;
				right: 20px;
				background: ${type === 'error' ? '#dc3545' : '#17a2b8'};
				color: white;
				padding: 15px 20px;
				border-radius: 8px;
				box-shadow: 0 4px 15px rgba(0,0,0,0.2);
				z-index: 10000;
				display: flex;
				align-items: center;
				gap: 10px;
				font-size: 14px;
				transform: translateX(100%);
				transition: transform 0.3s ease;
			`;
			
			document.body.appendChild(messageEl);
			
			// 显示动画
			setTimeout(() => {
				messageEl.style.transform = 'translateX(0)';
			}, 100);
			
			// 自动隐藏
			setTimeout(() => {
				messageEl.style.transform = 'translateX(100%)';
				setTimeout(() => {
					if (messageEl.parentNode) {
						messageEl.parentNode.removeChild(messageEl);
					}
				}, 300);
			}, 3000);
		}
	}
}());

var showContent = (function() {
	let $comment, $bottombar, commentCount = 0;
	return {
		init() {
			$comment = $(".comment-list");
			$bottombar = $(".bottombar");
			this.event();
			this.initCommentAnimations();
		},
		event() {
			var _this = this;
			$bottombar.on("click", "button", function() {
				const textarea = $("textarea");
				const content = textarea.val().trim();
				
				if (!content) {
					_this.showCommentMessage('请输入评论内容', 'warning');
					return;
				}
				
				if (content.length < 5) {
					_this.showCommentMessage('评论内容至少需要5个字符', 'warning');
					return;
				}
				
				// 添加按钮点击动画
				$(this).addClass('button-clicked');
				setTimeout(() => {
					$(this).removeClass('button-clicked');
				}, 200);
				
				commentCount++;
				const now = new Date();
				const timeStr = now.toLocaleString();
				
				var $li = $("<li></li>");
				$li.html(`
							<div class="head-pic">
                            <img src="img/img/tx.png" alt="">
                            </div>
					<div class="info">
						<i>用户${commentCount}</i>
						<span class="comment-time">${timeStr}</span>
					</div>
					<blockquote>${content}</blockquote>
					<div class="opt">
						<button class="like-btn" onclick="showContent.likeComment(this)">
							<i class="iconfont icon-like"></i>
							<span>0</span>
						</button>
						<button class="reply-btn" onclick="showContent.replyComment(this)">
							<i class="iconfont icon-reply"></i>
							回复
						</button>
					</div>
				`);
				
				// 添加新评论动画
				$li.css({
					opacity: 0,
					transform: 'translateY(20px)'
				});
				
				$comment.prepend($li);
				
				// 动画显示新评论
				setTimeout(() => {
					$li.css({
						transition: 'all 0.5s ease',
						opacity: 1,
						transform: 'translateY(0)'
					});
				}, 100);
				
				// 清空输入框
				textarea.val('');
				
				// 显示成功消息
				_this.showCommentMessage('评论发布成功！', 'success');
				
				// 滚动到新评论
				setTimeout(() => {
					$li[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
				}, 600);
			});
		},
		// 初始化评论区动画
		initCommentAnimations() {
			// 为评论输入框添加焦点效果
			const textarea = document.querySelector('textarea');
			if (textarea) {
				textarea.addEventListener('focus', () => {
					textarea.parentElement.style.boxShadow = '0 4px 15px rgba(201, 72, 60, 0.2)';
				});
				
				textarea.addEventListener('blur', () => {
					textarea.parentElement.style.boxShadow = '';
				});
				
				// 添加字符计数
				this.addCharacterCounter(textarea);
			}
			
			// 为现有评论添加动画
			const existingComments = document.querySelectorAll('.comment-list li');
			existingComments.forEach((comment, index) => {
				comment.style.opacity = '0';
				comment.style.transform = 'translateY(20px)';
				setTimeout(() => {
					comment.style.transition = 'all 0.5s ease';
					comment.style.opacity = '1';
					comment.style.transform = 'translateY(0)';
				}, index * 100);
			});
		},
		// 添加字符计数器
		addCharacterCounter(textarea) {
			const counter = document.createElement('div');
			counter.className = 'character-counter';
			counter.style.cssText = `
				position: absolute;
				bottom: 10px;
				right: 15px;
				font-size: 12px;
				color: #6c757d;
				background: rgba(255,255,255,0.9);
				padding: 2px 6px;
				border-radius: 4px;
			`;
			counter.textContent = '0/500';
			
			textarea.parentElement.style.position = 'relative';
			textarea.parentElement.appendChild(counter);
			
			textarea.addEventListener('input', () => {
				const length = textarea.value.length;
				counter.textContent = `${length}/500`;
				
				if (length > 450) {
					counter.style.color = '#dc3545';
				} else if (length > 300) {
					counter.style.color = '#ffc107';
				} else {
					counter.style.color = '#6c757d';
				}
				
				if (length > 500) {
					textarea.value = textarea.value.substring(0, 500);
					counter.textContent = '500/500';
				}
			});
		},
		// 点赞评论
		likeComment(btn) {
			const span = btn.querySelector('span');
			const currentLikes = parseInt(span.textContent);
			const icon = btn.querySelector('i');
			
			// 添加点击动画
			btn.style.transform = 'scale(0.9)';
			setTimeout(() => {
				btn.style.transform = 'scale(1)';
			}, 150);
			
			// 更新点赞数
			span.textContent = currentLikes + 1;
			
			// 改变按钮状态
			btn.classList.add('liked');
			icon.style.color = '#e74c3c';
			
			// 禁用按钮防止重复点击
			btn.disabled = true;
			btn.style.opacity = '0.7';
		},
		// 回复评论
		replyComment(btn) {
			const textarea = document.querySelector('textarea');
			const commentLi = btn.closest('li');
			const username = commentLi.querySelector('.info i').textContent;
			
			textarea.focus();
			textarea.value = `@${username} `;
			
			// 滚动到输入框
			textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
		},
		// 显示评论消息
		showCommentMessage(message, type = 'info') {
			const colors = {
				success: '#28a745',
				warning: '#ffc107',
				error: '#dc3545',
				info: '#17a2b8'
			};
			
			const messageEl = document.createElement('div');
			messageEl.style.cssText = `
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background: ${colors[type]};
				color: white;
				padding: 15px 25px;
				border-radius: 8px;
				box-shadow: 0 4px 20px rgba(0,0,0,0.3);
				z-index: 10000;
				font-size: 14px;
				font-weight: 600;
				opacity: 0;
				transition: opacity 0.3s ease;
			`;
			messageEl.textContent = message;
			
			document.body.appendChild(messageEl);
			
			setTimeout(() => {
				messageEl.style.opacity = '1';
			}, 100);
			
			setTimeout(() => {
				messageEl.style.opacity = '0';
				setTimeout(() => {
					if (messageEl.parentNode) {
						messageEl.parentNode.removeChild(messageEl);
					}
				}, 300);
			}, 2000);
		}
	}
}());

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
	console.log('详情页加载完成');
	
	// 更新用户登录状态显示
	if (typeof updateUserStatus !== 'undefined') {
		updateUserStatus();
		console.log('用户状态更新完成');
	}
	
	// 初始化商品详情
	if (typeof shopCar !== 'undefined') {
		shopCar.init();
		console.log('商品详情初始化完成');
	}
	
	// 初始化评论功能
	if (typeof showContent !== 'undefined') {
	showContent.init();
		console.log('评论功能初始化完成');
	}
	
	// 监听购物车变化，更新按钮状态
	if (window.cart) {
		// 定期检查购物车状态
		setInterval(() => {
			if (shopCar.updateButtonStatus) {
				shopCar.updateButtonStatus();
			}
		}, 1000);
	}
	
	// 添加页面滚动效果
	initScrollEffects();
	
	// 添加返回顶部功能
	initBackToTop();
});

// 初始化滚动效果
function initScrollEffects() {
	const elements = document.querySelectorAll('.book-nav, .user-like li, .publish-comm li');
	
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
			}
		});
	}, {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	});
	
	elements.forEach(el => {
		el.style.opacity = '0';
		el.style.transform = 'translateY(20px)';
		el.style.transition = 'all 0.6s ease';
		observer.observe(el);
	});
}

// 初始化返回顶部功能
function initBackToTop() {
	const backToTop = document.querySelector('.to-top');
	if (backToTop) {
		window.addEventListener('scroll', () => {
			if (window.pageYOffset > 300) {
				backToTop.style.visibility = 'visible';
				backToTop.style.opacity = '1';
			} else {
				backToTop.style.visibility = 'hidden';
				backToTop.style.opacity = '0';
			}
		});
		
		backToTop.addEventListener('click', () => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		});
	}
}

// 添加CSS样式到页面
const style = document.createElement('style');
style.textContent = `
	.button-clicked {
		transform: scale(0.95) !important;
	}
	
	.like-btn, .reply-btn {
		background: none;
		border: 1px solid #dee2e6;
		padding: 5px 10px;
		border-radius: 15px;
		font-size: 12px;
		color: #6c757d;
		cursor: pointer;
		transition: all 0.3s ease;
		margin-right: 10px;
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}
	
	.like-btn:hover, .reply-btn:hover {
		background: #f8f9fa;
		border-color: #c9483c;
		color: #c9483c;
	}
	
	.like-btn.liked {
		background: #ffe6e6;
		border-color: #e74c3c;
		color: #e74c3c;
	}
	
	.comment-time {
		margin-left: 10px;
		font-size: 11px;
		color: #adb5bd;
	}
	
	.character-counter {
		font-family: monospace;
	}
	
	.to-top {
		position: fixed;
		bottom: 30px;
		right: 30px;
		width: 50px;
		height: 50px;
		background: linear-gradient(135deg, #c9483c, #e74c3c);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 20px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(201, 72, 60, 0.3);
		z-index: 1000;
		opacity: 0;
		visibility: hidden;
	}
	
	.to-top:hover {
		transform: translateY(-3px);
		box-shadow: 0 6px 20px rgba(201, 72, 60, 0.4);
	}
`;
document.head.appendChild(style);
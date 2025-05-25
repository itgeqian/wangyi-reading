//搜索框
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
					.search-results-header {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 20px 25px;
						background: linear-gradient(135deg, #c9483c 0%, #b03d33 100%);
						color: white;
					}
					.search-results-header h3 {
						margin: 0;
						font-size: 20px;
					}
					.search-query {
						font-size: 14px;
						opacity: 0.9;
					}
					.close-search-btn {
						background: none;
						border: none;
						color: white;
						font-size: 24px;
						cursor: pointer;
						padding: 0;
						width: 30px;
						height: 30px;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 50%;
						transition: background 0.2s ease;
					}
					.close-search-btn:hover {
						background: rgba(255, 255, 255, 0.2);
					}
					.search-results-body {
						padding: 20px;
						max-height: 60vh;
						overflow-y: auto;
					}
					.no-results-message {
						text-align: center;
						padding: 40px;
						color: #666;
						font-size: 16px;
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
						box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
						transform: translateY(-2px);
					}
					.search-result-item img {
						width: 60px;
						height: 80px;
						object-fit: cover;
						border-radius: 6px;
						margin-right: 15px;
					}
					.book-details {
						flex: 1;
						margin-right: 15px;
					}
					.book-details h4 {
						margin: 0 0 5px;
						color: #333;
						font-size: 16px;
					}
					.book-details .author {
						margin: 0 0 5px;
						color: #666;
						font-size: 14px;
					}
					.book-details .price {
						margin: 0 0 5px;
						color: #c9483c;
						font-weight: 600;
						font-size: 16px;
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
						min-width: 100px;
					}
					.book-actions button {
						padding: 8px 12px;
						border: none;
						border-radius: 6px;
						cursor: pointer;
						font-size: 12px;
						font-weight: 600;
						transition: all 0.2s ease;
					}
					.btn-view-details {
						background: #f1f2f6;
						color: #666;
					}
					.btn-view-details:hover {
						background: #e8e9ed;
					}
					.btn-add-cart {
						background: #c9483c;
						color: white;
					}
					.btn-add-cart:hover {
						background: #b03d33;
					}
					.showBox li.search-book {
						padding: 8px 12px;
						border-bottom: 1px solid #eee;
					}
					.showBox li.search-suggestion {
						padding: 8px 12px;
						color: #666;
						font-style: italic;
					}
					.showBox li.no-results {
						padding: 8px 12px;
						color: #999;
						text-align: center;
					}
					.search-item {
						display: flex;
						align-items: center;
						gap: 10px;
					}
					.book-title {
						font-weight: 600;
						color: #333;
					}
					.book-author {
						color: #666;
						font-size: 12px;
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
var search = (function() {
	return {
		init() {
			this.event();
			this.getData()
				.then(data => {
					this.insertData(data.docType);
				})
		},
		event() {},
		getData() {
			let url = "http://yuedu.163.com/search.do";
			let data = {
				key: "我",
				type: 4
			}
			return sendAjax(url, data);
		},
		insertData(data) {
			console.log(data);
		}
	}

}())
//json渲染
var showContent = (function() {
	let $el, $showBox, $frag;
	return {
		init($ele) {
			$frag = document.createDocumentFragment();
			$el = document.querySelector($ele);
			$showBox = $el.childNodes[1];
			this.event()
		},
		event() {
			var _this = this;
			json.forEach(x => {
				for(var attr in x) {
					const $p = document.createElement("p");
					const $img = document.createElement("img");
					if(attr != "img") {
						$p.innerHTML += x[attr];
					}
					if(attr == "img") {
						$img.src = x[attr];
					}
					$frag.appendChild($p);
					$frag.appendChild($img);
				}
			})
			$showBox.appendChild($frag);
			this.clearNull();
		},
		clearNull() {
			for(let i = 0; i < $showBox.childNodes.length; i++) {
				if($showBox.childNodes[i].src == "") {
					$showBox.childNodes[i].remove();
				}
				if($showBox.childNodes[i].nodeName == "P") {
					if($showBox.childNodes[i].innerHTML == "") {
						$showBox.childNodes[i].remove();
					}
				}
			}
		}
	}
}())

var shufflingHuai = (function() {
	let $el
	return {
		init($ele) {
			$el = $($ele);
			this.event()
		},
		event() {
			var _this = this;
			$el.on("mouseenter", "li", function() {
				_this.hidden();
				$(this).children("p").addClass("hidden");
				$(this).children("div").addClass("show");
			})
		},
		hidden() {
			var $liAll = $el.children("li");
			for(let i = 0; i < $liAll.length; i++) {
				$liAll[i].children[0].className = "";
				$liAll[i].children[1].className = "hidden";
			}
		}
	}

}())

var shufflingIneu = (function() {
	let $el
	return {
		init($ele) {
			$el = $($ele);
			this.event()
		},
		event() {
			var _this = this;
			$el.on("mouseenter", "li", function() {
				_this.hidden();
				$(this).children("p").addClass("hidden");
				$(this).children("div").addClass("show");
			})
		},
		hidden() {
			var $liAll = $el.children("li");
			for(let i = 0; i < $liAll.length; i++) {
				$liAll[i].children[0].className = "";
				$liAll[i].children[1].className = "hidden";
			}
		}
	}

}())

var shufflingHigh = (function() {
	let $el
	return {
		init($ele) {
			$el = $($ele);
			this.event()
		},
		event() {
			var _this = this;
			$el.on("mouseenter", "li", function() {
				_this.hidden();
				$(this).children("p").addClass("hidden");
				$(this).children("div").addClass("show");
			})
		},
		hidden() {
			var $liAll = $el.children("li");
			for(let i = 0; i < $liAll.length; i++) {
				$liAll[i].children[0].className = "";
				$liAll[i].children[1].className = "hidden";
			}
		}
	}

}())


//滚轴事件
var toTop = (function() {
	let $tot;
	return {

		init() {
			$tot = document.querySelector(".to-top");
			this.event()
		},
		event() {
			var _this = this;
			window.onscroll = function(e) {
				e = e || event;
				var doc = document.documentElement;
				var scroll = parseInt(doc.scrollTop);
				var $herdFix = document.querySelector(".headerFix");
				if(scroll > 50) {
					$tot.style.visibility = "initial";
				} else {
					$tot.style.visibility = "hidden";
				}
				if(scroll > 177) {
					$herdFix.style.display = "block";
				} else {
					$herdFix.style.display = "none";
				}
			}
			$tot.onclick = function() {
				var doc = document.documentElement;
				var scroll = parseInt(doc.scrollTop);
				var timer = setInterval(function() {
					console.log(scroll)
					scroll -= 50
					doc.scrollTop = scroll;
					if(scroll < 0) {
						clearInterval(timer);
					}
				}, 10);
			}
		}
	}

}())

// 书籍点击事件处理
var bookClickHandler = (function() {
	return {
		init() {
			this.bindEvents();
		},
		bindEvents() {
			// 主编推荐区域
			document.addEventListener('click', function(e) {
				const bookItem = e.target.closest('.recommend-box ul li');
				if (bookItem) {
					const link = bookItem.querySelector('.huai-ready');
					if (link && e.target !== link) {
						e.preventDefault();
						window.location.href = link.href;
					}
				}
			});

			// 国风中文网区域
			document.addEventListener('click', function(e) {
				const bookItem = e.target.closest('.huai-introduce ul li');
				if (bookItem) {
					const link = bookItem.querySelector('.huai-ready');
					if (link && e.target !== link) {
						e.preventDefault();
						window.location.href = link.href;
					}
				}
			});

			// 采薇书院区域
			document.addEventListener('click', function(e) {
				const bookItem = e.target.closest('.Ineu-left ul li');
				if (bookItem) {
					const link = bookItem.querySelector('.huai-ready');
					if (link && e.target !== link) {
						e.preventDefault();
						window.location.href = link.href;
					}
				}
			});

			// 精品图书区域
			document.addEventListener('click', function(e) {
				const bookItem = e.target.closest('.quality-left .book li');
				if (bookItem) {
					// 为精品图书添加详情页链接（假设使用书名作为参数）
					const title = bookItem.querySelector('h3');
					if (title && e.target.tagName !== 'A') {
						e.preventDefault();
						// 这里可以根据实际需求修改跳转逻辑
						const bookId = Array.from(bookItem.parentNode.children).indexOf(bookItem) + 12; // 从12开始编号
						window.location.href = `details.html?id=${bookId}`;
					}
				}
			});
		}
	}
})();

// 在DOMContentLoaded中初始化
document.addEventListener('DOMContentLoaded', function() {
	console.log('页面加载完成，开始初始化...');
	
	// 初始化主搜索框
	if (typeof showText !== 'undefined') {
		showText.init(".search-box");
		console.log('主搜索框初始化完成');
		
		// 初始化固定头部的搜索框
		initHeaderFixSearch();
		console.log('固定头部搜索框初始化完成');
	}

	bookClickHandler.init();
});

// 初始化固定头部搜索框功能
function initHeaderFixSearch() {
	const headerFixSearchBox = document.querySelector('.headerFix .herdFix-search');
	if (!headerFixSearchBox) return;

	const searchInput = headerFixSearchBox.querySelector('.search');
	const searchBtn = headerFixSearchBox.querySelector('.btn-seach');
	const showBox = headerFixSearchBox.querySelector('.showBox');
	
	if (!searchInput || !searchBtn || !showBox) return;

	let timer;

	// 创建搜索功能对象
	const headerSearch = {
		// 显示搜索建议
		show() {
			showBox.style.display = 'block';
		},

		// 隐藏搜索建议
		hidden() {
			showBox.style.display = 'none';
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
			showBox.innerHTML = '';
			
			if (results.length === 0) {
				const li = document.createElement('li');
				li.className = 'no-results';
				li.innerHTML = '暂无相关结果';
				showBox.appendChild(li);
			} else {
				results.forEach(result => {
					const li = document.createElement('li');
					li.className = result.type === 'book' ? 'search-book' : 'search-suggestion';
					
					if (result.type === 'book') {
						li.innerHTML = `
							<div class="search-item">
								<span class="book-title">${result.title}</span>
								<span class="book-author">- ${result.author || '未知作者'}</span>
							</div>
						`;
						li.dataset.bookId = result.id;
					} else {
						li.innerHTML = result.title;
					}
					
					showBox.appendChild(li);
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

			// 显示搜索结果（复用主搜索框的显示逻辑）
			if (typeof showText !== 'undefined' && showText.showSearchResults) {
				showText.showSearchResults(query, results);
			}
		}
	};

	// 绑定事件
	searchInput.addEventListener('focus', function() {
		headerSearch.show();
	});

	searchInput.addEventListener('click', function(e) {
		e.stopPropagation();
	});

	searchInput.addEventListener('input', function() {
		clearTimeout(timer);
		timer = setTimeout(() => {
			headerSearch.searchBooks(this.value);
		}, 300);
	});

	// 搜索按钮点击事件
	searchBtn.addEventListener('click', function() {
		const searchValue = searchInput.value.trim();
		if (searchValue) {
			headerSearch.performSearch(searchValue);
		}
	});

	// 回车搜索
	searchInput.addEventListener('keypress', function(e) {
		if (e.which === 13) {
			const searchValue = this.value.trim();
			if (searchValue) {
				headerSearch.performSearch(searchValue);
			}
		}
	});

	// 点击搜索建议
	showBox.addEventListener('click', function(e) {
		const target = e.target;
		if (target.nodeName === 'LI') {
			const searchText = target.textContent;
			searchInput.value = searchText;
			headerSearch.hidden();
			headerSearch.performSearch(searchText);
		}
	});

	// 点击其他地方隐藏搜索建议
	document.addEventListener('click', function(e) {
		if (!headerFixSearchBox.contains(e.target)) {
			headerSearch.hidden();
		}
	});
}
function Page(options) {
    var pageInfo = {};
    this.options = pageInfo;
    this.options.allInfoNum = options.allInfoNum;
    this.options.onePageNum = options.onePageNum || 10;
    this.options.container = options.container;
    this.options.firstPage = options.firstPage || "首页";
    this.options.prePage = options.prePage || "上一页";
    this.options.nextPage = options.nextPage || "下一页";
    this.options.finaPage = options.finaPage || "尾页";
    this.options.tabNum = options.tabNum || 5;
    this.options.nowPage = options.nowPage || 8;

    this.show();
    this.bindEvent();
}
Page.prototype.show = function() {
    this.options.container.innerHTML = '';
    var flag1 = '';
    var flag2 = '';
    if (this.options.nowPage == 1) {
        flag1 = 'noshow'
    }
    if (this.options.nowPage == this.computer()) {
        flag2 = 'nomore'
    }
    this.createDom('first ' + flag1, this.options.firstPage);
    this.createDom('pre ' + flag1, this.options.prePage);
    this.createTab();
    this.createDom('next ' + flag2, this.options.nextPage);
    this.createDom('fina ' + flag2, this.options.finaPage);
    this.pageBar()
}
Page.prototype.createDom = function(className, info) {
    var a = document.createElement('a');
    a.className = "pages " + className;
    a.innerText = info;
    this.options.container.appendChild(a);
}
Page.prototype.pageBar = function() {
    var allPage = this.computer();
    var span = document.createElement('span');
    span.innerText = this.options.nowPage + '/' + allPage;
    this.options.container.appendChild(span);

}
Page.prototype.computer = function() {
    var allPage = Math.ceil(this.options.allInfoNum / this.options.onePageNum);
    return allPage
}
Page.prototype.bindEvent = function() {
    var container = this.options.container;
    var self = this;
    container.addEventListener('click', function(e) {

        self.bindTarget(e);
        self.show();
    })
}
Page.prototype.bindTarget = function(e) {
    var classList = e.target.className;
    var allPage = this.computer();
    if (classList.indexOf('first') != -1) {
        this.options.nowPage = 1;
    }
    if (classList.indexOf('pre') != -1) {
        this.options.nowPage--;
        if (this.options.nowPage < 1) {
            this.options.nowPage = 1;
        }
    }
    if (classList.indexOf('next') != -1) {
        this.options.nowPage++;
        if (this.options.nowPage > allPage) {
            this.options.nowPage = allPage;
        }
    }
    if (classList.indexOf('fina') != -1) {
        this.options.nowPage = allPage;
    }
    if (classList.indexOf('tab-num') != -1) {
        var turnPage = e.target.innerHTML;
        this.options.nowPage = turnPage;

    }
}
Page.prototype.createTab = function() {
    var allPage = this.computer();
    var minPage = this.options.nowPage - Math.floor(this.options.tabNum / 2);
    var maxPage = minPage + this.options.tabNum - 1;
    if (minPage < 1) {
        minPage = 1
    }
    if (maxPage > allPage) {
        maxPage = allPage
    }
    for (var i = minPage; i <= maxPage; i++) {
        if (i == this.options.nowPage) {
            this.createDom('tab-num active', i);
        } else {
            this.createDom('tab-num', i);
        }

    }
}

// 总数据allInfoNum：1000条；
// 一页展示的数据onePageNum:5条；
// 容器container；
// 显示首页：firstPage；
// 显示上一页:prePage;
// 显示下一页：nextPage;
// 显示尾页：finaPage；
// 显示中间标签数量：tabNum；
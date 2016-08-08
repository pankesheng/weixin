"use strict";

;(function(factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define(["jquery"], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
})(function($) {
    var defaults = {
        //按钮html
        pagingBtnHtml: '<a class="{{cls}}" data-type="{{type}}" href="{{link}}">{{text}}</a>\n',
        //页码输入框html
        pagingInputHtml: '<input class="{{cls}}" type="text" />\n',
        //按钮跳转
        linkTo: '#',
        //按钮样式
        pagingBtnCls: '',
        //前页后页按钮样式
        prevNextBtnCls: '',
        //当前页按钮样式
        pagingActiveCls: '',
        //按钮不可点击的样式
        btnDisabledCls: '',
        //启用跳转
        enablePageJump: true,
        //页码输入框样式
        pagingInputCls: '',
        //跳转按钮样式
        jumpBtnCls: '',
        //数据项
        store: {
            //总数
            total: 0,
            //偏移值
            offset: 0,
            //单页限制数
            limit: 0,
            //当前页数
            curPage: 0,
            //总页数
            totalPage: 0
        },
        event: {
            //跳转按钮点击
            onJumpBtnClicked: ''
        }
    };

    function Epaging($doms, config){
        //配置项
        this.settings = $.extend(true, defaults, config || {});
        //操作对象
        this.$doms = $doms;

        return this.init();
    };

    Epaging.prototype.init = function() {
        var me = this;

        if(!me.$doms.length){
            return false;
        }

        //总数存在
        if(me.settings.store.total && me.settings.store.total !== 0){
            //计算当前页
            me.settings.store.curPage = function(offset, limit){
                return parseInt(offset / limit) + 1;
            }(me.settings.store.offset, me.settings.store.limit);
            //计算总页数
            me.settings.store.totalPage = function(limit, total) {
                var rem = total % limit;

                if (rem > 0) {
                    return parseInt(total / limit) + 1;
                } else {
                    return parseInt(total / limit);
                }
            }(me.settings.store.limit, me.settings.store.total);

            if (!$.isNumeric(me.settings.store.totalPage)) {
                $.error('totalPage is a NaN, please check config');
            }

            //清空
            me.$doms.html('');

            me.$doms.each(function(index, el) {
                if(me.settings.store.totalPage <= 0){
                    return false;
                }
                var $this = $(this);
                var btnNums = 0;
                var i = 0;

                //当前页数小于等于4
                if(me.settings.store.curPage <= 4){
                    for(i = 1; i <= me.settings.store.totalPage && btnNums < 5; i++){
                        if (i === me.settings.store.curPage) {
                            //当前页
                            $this.append(me.getPageBtn({ text: i, cls: me.settings.pagingActiveCls, type: 'number', disabled: true }));
                        } else {
                            //其他页
                            $this.append(me.getPageBtn({ text: i, type: 'number' }));
                        }
                        btnNums++;
                    }
                }else{
                    //总页数小于当前页数+2
                    var lessNums =  me.settings.store.curPage + 2 - me.settings.store.totalPage;

                    if(lessNums < 0){
                        lessNums = 0;
                    }

                    for(i = me.settings.store.curPage - 2 - lessNums; i <= me.settings.store.totalPage && btnNums < 5; i++){
                        if (i === me.settings.store.curPage) {
                            //当前页
                            $this.append(me.getPageBtn({ text: i, cls: me.settings.pagingActiveCls, type: 'number' }));
                        } else {
                            //其他页
                            $this.append(me.getPageBtn({ text: i, type: 'number' }));
                        }
                        btnNums++;
                    }

                    //如果起始页大于1
                    if(i > 1){
                        $this.prepend(me.getPageBtn({ text: 1, type: 'number' })  + '<span>...</span>');
                    }
                }

                //如果当前页数小于总页数
                if(i < me.settings.store.totalPage){
                    $this.append('<span>...</span>' + me.getPageBtn({ text: me.settings.store.totalPage, type: 'number' }));
                }else if( i === me.settings.store.totalPage){
                    $this.append(me.getPageBtn({ text: i, type: 'number' }));
                }

                //加入上一页
                if (me.settings.store.curPage !== 1) {
                    $this.prepend(me.getPageBtn({ text: '上一页', type: 'prev' }));
                }else{
                    $this.prepend(me.getPageBtn({ text: '上一页', type: 'prev', cls: me.settings.btnDisabledCls, disabled: true }));
                }

                //加入下一页
                if (me.settings.store.curPage !== me.settings.store.totalPage) {
                    $this.append(me.getPageBtn({ text: '下一页', type: 'next' }));
                }else{
                    $this.append(me.getPageBtn({ text: '下一页', type: 'next', cls: me.settings.btnDisabledCls, disabled: true }));
                }

                //加入跳转控件
                if(me.settings.enablePageJump === true){
                    var $input = $(me.tpl(me.settings.pagingInputHtml, { cls: me.settings.pagingInputCls }));

                    $this.append($input);
                    $this.append(me.getPageBtn({ text: 'GO', type: 'jump' }));

                    me.addListeners('jump', $this.find('[data-type="jump"]'), $input);
                }
            });
        }
    };

    Epaging.prototype.addListeners = function(type) {
        var me = this;
        var listeners = {
            //基本事件
            jump: function($btn, $input){
                $btn.bind('click', function(){
                    var value = $input.val();

                    if($.isNumeric(value)){
                        value = parseInt($input.val());
                        value = value > me.settings.store.totalPage ? me.settings.store.totalPage : value;
                        value = value < 1 ? 1 : value;
                    }else{
                        $input.val('');
                        return false;
                    }

                    if(typeof me.settings.event.onJumpBtnClicked === 'function'){
                        me.settings.event.onJumpBtnClicked($input);
                    }else{
                        var offset = parseInt(me.settings.store.offset);
                        var limit = parseInt(me.settings.store.limit);

                        window.location.href = me.tpl(me.settings.linkTo, { offset: (value - 1) * limit, limit: limit });
                    }

                    return false;
                });
                $input.bind('keydown', function(event){
                    if(event.keyCode === 13){
                        $btn.trigger('click');
                    }
                });
            }
        };

        if(listeners[type]){
            listeners[type].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    };

    Epaging.prototype.getPageBtn = function(data) {
        var offset = parseInt(this.settings.store.offset);
        var limit = parseInt(this.settings.store.limit);

        if(data.disabled){
            data.link = 'javascript:void(0)';
        }else{
            switch(data.type){
                case 'number':
                    data.link = this.tpl(this.settings.linkTo, { offset: (parseInt(data.text) -1) * limit, limit: limit });
                    break;
                case 'prev':
                    data.link = this.tpl(this.settings.linkTo, { offset: offset - limit, limit: limit });
                    break;
                case 'next':
                    data.link = this.tpl(this.settings.linkTo, { offset: offset + limit, limit: limit });
                    break;
            }
        }
        return this.tpl(this.settings.pagingBtnHtml, data);
    };

    Epaging.prototype.tpl = function(tpl, data) {
        return tpl.replace(/{{(.*?)}}/g, function ($1, $2) {
            $2 = $.trim($2);

            if(data[$2] && data[$2] !== undefined && data[$2] !== null || data[$2] === 0){
                return data[$2];
            }else{
                return '';
            }
        });
    };
    
    $.fn.epaging = function(config){
        var epaging = new Epaging(this, config);

        return epaging;
    };
});

/**
 * @author Ezios
 * @class elist
 * @extends jquery-1.8.3
 * @markdown
 * #下拉框插件
 * 版本 0.0.1 日期 2015-7-13
 * 配置项详见Config options
 *
 * 示例：
 *
 *     @example
 *
 *
 *
 *
 *
 */
"use strict";

;
(function(factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define(["jquery"], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
})(function($) {
    var settings = {
        //下拉html
        selectHtml:
            '<div class="ui-selectbox select-multiply">'+
                '<ul class="ui-selectbox-label"></ul>'+
                '<div class="ui-selectbox-drop">'+
                    '<ul class="ui-selectbox-drop-ul"></ul>'+
                '</div>'+
            '</div>',
        //默认显示html
        placeholderHtml: '<li class="ui-selectbox-inner">{{placeholder}}</li>',
        //标签html
        labelHtml:
            '<li class="ui-selectbox-label-item" data-value="{{value}}">'+
                '<span>{{name}}</span>'+
                '<i class="iconfont remove-option">&#xe628;</i>'+
            '</li>',
        //选项html
        optionHtml:
            '<li class="ui-selectbox-drop-option" data-value="{{value}}" data-selected="{{isSelected}}">'+
                '<a href="javascript:void(0);">{{name}}</a>'+
            '</li>',
        //基础样式
        baseCls: 'ui-selectbox select-multiply',
        //额外样式
        extraCls: '',
        //默认提示
        placeholder: '请选择',
        //启用动画
        enableAnimation: true,
        //启用树形
        enableTreeList: false,
        //启用搜索
        enableSearch: false,
        //启用自动关闭下拉菜单
        enableCloseDropdownAfterClick: false
    };
    var methods = {
        //初始化
        init: function(options) {
            $.extend(true, settings, options);

            return this.each(function() {
                var $this = $(this);
                var data = $this.data('elist');

                if (!data) {
                    var $simulator = $(settings.selectHtml);
                    var $options = '';

                    //设置多选属性并隐藏
                    $this.prop('mutiple', true)
                        .hide();

                    if($this.data('placeholder')){
                        settings.placeholder = $this.data('placeholder');
                    }

                    $simulator.find('.ui-selectbox-label').append(tpl(settings.placeholderHtml, settings))
                        .end().find('.ui-selectbox-drop-ul').append(generateOptions($this));

                    //预处理
                    if(settings.extraCls){
                        $simulator.addClass(settings.extraCls);
                    }

                    //注册事件
                    addListeners($simulator, $this);

                    $this.after($simulator);

                    $(this).data({
                        settings: settings,
                        elist: $simulator
                    });
                    $simulator.data({
                        values: [],
                        isOpen: false
                    });

                    //默认选中
                    $options = $simulator.find('.ui-selectbox-drop-option');

                    for(var i = 0, len = $options.length; i < len; i++){
                        if($($options[i]).data('selected') === true){
                            $($options[i]).click();
                        }
                    }
                }
            });
        },
        //销毁
        destroy: function() {

            return this.each(function() {

                var $this = $(this),
                    data = $this.data('tooltip');

                // Namespacing FTW
                $(window).unbind('.tooltip');
                data.tooltip.remove();
                $this.removeData('tooltip');

            })

        },
        //获取数据
        getData: function(){
            var $simulator = $(this).data('elist');

            return $simulator.data('values');
        },
        //获取列表对象
        getElist: function() {
            var data = $(this).data('elist');

            if(data){
                return data.elist;
            }
        }
    };

    //Elist对象
    // var Elist = function($dom, options){
    //     var data = $this.data('elist');
    //
    //     //判断是否初始化
    //     if (!data) {
    //         //var $simulator = $(settings.selectHtml);
    //         var $options = '';
    //
    //         var $simulator = $(settings.selectHtml);
    //
    //         //设置多选属性并隐藏
    //         $this.prop('mutiple', true)
    //             .hide();
    //
    //         if($this.data('placeholder')){
    //             settings.placeholder = $this.data('placeholder');
    //         }
    //
    //         $simulator.find('.ui-selectbox-label').append(tpl(settings.placeholderHtml, settings))
    //             .end().find('.ui-selectbox-drop-ul').append(generateOptions($this));
    //
    //         //预处理
    //         if(settings.extraCls){
    //             $simulator.addClass(settings.extraCls);
    //         }
    //
    //         //注册事件
    //         addListeners($simulator, $this);
    //
    //         $this.after($simulator);
    //
    //         $(this).data({
    //             settings: settings,
    //             elist: $simulator
    //         });
    //         $simulator.data({
    //             values: [],
    //             isOpen: false
    //         });
    //
    //         //默认选中
    //         $options = $simulator.find('.ui-selectbox-drop-option');
    //
    //         for(var i = 0, len = $options.length; i < len; i++){
    //             if($($options[i]).data('selected') === true){
    //                 $($options[i]).click();
    //             }
    //         }
    //     }
    // };

    //模版
    function tpl(tpl, data) {
        return tpl.replace(/{{(.*?)}}/g, function ($1, $2) {
            return data[$2];
        });
    }

    //生成选项
    function generateOptions($dom) {
        var $options = $dom.find('option');
        var generate = '';

        if($options.length){
            for(var i = 0, len = $options.length; i < len; i++){
                var $option = $($options[i]);
                generate += tpl(settings.optionHtml, {
                    value: $option.attr('value'),
                    name: $option.text(),
                    isSelected: $option.data('selected')
                });
            }
        }

        return generate;
    }

    //更新数据
    function updateValue($simulator, $dom){
        var values = $simulator.data('values');

        $dom.val(values);
    }

    //侦听器
    function addListeners($simulator, $dom) {
        $(document).bind('click', function(event){
            $simulator.find('.ui-selectbox-drop').hide();
            $simulator.data('isOpen', false);
        });

        $simulator.find('.ui-selectbox-label').bind('click', function(event){
            var isOpen = $simulator.data('isOpen');

            if(!($(event.target).hasClass('ui-selectbox-label') || $(event.target).hasClass('ui-selectbox-inner'))){
                return false;
            }
            event.stopPropagation();

            if(isOpen){
                $(this).next('.ui-selectbox-drop').hide();
            }else{
                $(this).next('.ui-selectbox-drop').show();
            }

            $simulator.data('isOpen', !isOpen);
        });

        $simulator.on('click', '.ui-selectbox-drop-option', function(event){
            event.stopPropagation();

            if(!$(this).hasClass('selected')){
                addOption.apply(this, [$simulator, $dom]);
            }
        });

        $simulator.find('.ui-selectbox-label').on('click', '.remove-option', function(event){
            event.stopPropagation();

            removeOption.apply(this, [$simulator, $dom]);
        });
    }

    //添加选项
    function addOption($simulator, $dom) {
        var values = $simulator.data('values');
        var $this = $(this);

        values.push($this.data('value'));
        $simulator.data('values', values);
        updateValue.apply(this, [$simulator, $dom]);

        $this.addClass('selected');
        if($simulator.find('.ui-selectbox-inner').length){
            $simulator.find('.ui-selectbox-inner').remove();
        }

        $simulator.find('.ui-selectbox-label').append(tpl(settings.labelHtml, {
            value: $this.data('value'),
            name: $this.text()
        }));
    }

    //移除选项
    function removeOption($simulator, $dom) {
        var values = $simulator.data('values');
        var options = $simulator.find('.ui-selectbox-drop-option');
        var $this = $(this).parent('.ui-selectbox-label-item');

        for(var i = 0, len = values.length; i < len; i++){
            if($this.data('value') == values[i]){
                values.splice(i, 1);
                break;
            }
        }
        for(var i = 0, len = options.length; i < len; i++){
            if($this.data('value') == $(options[i]).data('value')){
                $(options[i]).removeClass('selected');
                if($simulator.find('.ui-selectbox-label-item').length === 1){
                    $simulator.find('.ui-selectbox-label').append(tpl(settings.placeholderHtml, settings));
                }
                break;
            }
        }
        $simulator.data('values', values);
        updateValue.apply(this, [$simulator, $dom]);

        $this.remove();
    }

    /**
     * @constructor elist初始化方法
     * @param  {Object} config 配置项
     */
    $.fn.elist = function(options) {
        if (this.length === 0) {
            return false;
        }

        if (methods[options]) {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) {
            return methods.init.apply(this, arguments);
        } else {
            $.error(options + ' does not exist on jQuery.elist');
        }
    };
});

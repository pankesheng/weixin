/**
 * @class Extension
 * @version 0.1.1
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 17/02/2016
 * @requires jquery-1.11.3
 * @name 功能插件封装
 * @markdown
 * 
 * ## 更新
 * - 2016.3.21
 * 		- 封装通用的视图查看器
 */

function Extension() {
    this.init = {
        type: "extension",
        version: "0.1.1",
        //参数接受对象形式的参数配置
        //视图查看器，单一层级
        //example:SearchFilter({trigger:触发器实例对象,viewer:视图器的选择器名称});
        Viewer: function (setting) {
            var trigger = setting.trigger;
            var viewer = setting.viewer;

            var $trigger = trigger.$me;
            var $viewer = viewer.$me;

            //初始化样式
            $viewer.parent().css({
                "position": "relative",
            });

            //重载配置参数
            var triggerSetting = {
                view: {
                    //根据插件的勾选模式，来决定是否更新配置（需要更新节点）
                    updateConfig: trigger.config.view.enabledCheckMode === true ? false : true,
                    //假如选中模式是启用的，同时开启了勾选模式，则启用选中即勾选模式
                    selectIsCheck: (trigger.config.view.selectIsCheck === true || trigger.config.view.checkIsSelect === true) || (trigger.config.view.enabledSelectMode === true && trigger.config.view.enabledCheckMode === true) ? true : false,
                    checkIsSelect: (trigger.config.view.selectIsCheck === true || trigger.config.view.checkIsSelect === true) || (trigger.config.view.enabledSelectMode === true && trigger.config.view.enabledCheckMode === true) ? true : false,

                    //只要开启了对应的模式，且是多选模式时就为true
                    checkedMultiple: (trigger.config.view.enabledSelectMode === true && trigger.config.view.selectedMultiple === true) || (trigger.config.view.enabledCheckMode === true && trigger.config.view.checkedMultiple === true) ? true : false,
                    selectedMultiple: (trigger.config.view.enabledSelectMode === true && trigger.config.view.selectedMultiple === true) || (trigger.config.view.enabledCheckMode === true && trigger.config.view.checkedMultiple === true) ? true : false
                },
                callback: {
                    selectNode: function ($node, nodeData, self) {
                        log(222)
                        //若开启了选中即勾选模式，同时支持选中模式时，退出该回调，只执行勾选回调即可
                        if ((self.config.view.selectIsCheck || self.config.view.checkIsSelect) && self.config.view.enabledSelectMode) {
                            return;
                        }
                        self.config.action.addViewerNode($node, nodeData, self);
                    },
                    checkNode: function ($node, nodeData, self) {
                            //选中事件，添加至视图器
                            self.config.action.addViewerNode($node, nodeData, self);
                        }
                        /*hidePopuper: function (self) {
                        	//弹出窗关闭后回调
                        }*/
                },
                action: {
                    addViewerNode: function ($node, nodeData, self) {
                        //节点选中后，若视图器里未存在当前节点ID的节点，则增加进支
                        //如已存在，则进行替换（更新）节点数据
                        if (nodeData.selected === true || nodeData.checked === true) {
                            var cloneData = viewer.cloneData(nodeData);
                            var $getViewerNode = viewer.getNodeById(nodeData.id);
                            if ($getViewerNode.length <= 0) {
                                //视图器不存在节点，则增加
                                //如果是单选模式，先清节点
                                if (!trigger.config.view.selectedMultiple) {
                                    viewer.cleanNode();
                                }

                                //增加节点
                                viewer.addNode(cloneData);
                            } else {
                                //视图器已存在这节点，则更新
                                var index = $getViewerNode.index();
                                viewer.addNode(cloneData, index);
                                viewer.removeNode($getViewerNode);
                            }
                        } else {
                            //取消选中时
                            var $getViewerNode = viewer.getNodeById(nodeData.id);
                            viewer.removeNode($getViewerNode);
                        }
                        //检测视图器的节点数量，呈现显示方式
                        _autoHide();
                    }
                }
            }

            //合并控制回调事件
		if (trigger.config.callback.selectNode) {
			triggerSetting.callback.selectNode = _mergeFunc(triggerSetting.callback.selectNode, trigger.config.callback.selectNode);
		}
            
            //重载
            trigger.load(triggerSetting);

            //重载面板配置
            var viewerSetting = {
                view: {
                    //当2个插件都设置为可用时，才可用
                    enabled: trigger.config.view.enabled,
                    //不重载数据
                    updateConfig: true,
                    selectedMultiple: trigger.config.view.selectedMultiple,
                    selectedSize: trigger.config.view.selectedSize,
                    checkedMultiple: trigger.config.view.checkedMultiple,
                    checkedSize: trigger.config.view.checkedSize,
                    disabledMultiple: trigger.config.view.disabledMultiple,
                    disabledSize: trigger.config.view.disabledSize,
                    //单选模式不开启移除按钮
                    showRemoveIcon: trigger.config.view.selectedMultiple === true ? true : false
                },
                callback: {
                    removeIconCallback: function ($node, self) {
                        viewer.config.action.removeTriggerNode($node);
                    }
                },
                action: {
                    //视图器移除按钮事件
                    removeTriggerNode: function ($node) {
                        var nodeData = viewer.getDataById($node)[0];
                        var $triggerNode = trigger.getNodeById(nodeData.id);
                        $triggerNode.trigger("click");
                        _autoHide();
                    }
                }
            };

            viewer.load(viewerSetting);

            trigger.ready(function () {
                //绑定视图面板点击弹出事件
                //插件禁用时不绑定事件
                if (trigger.config.view.enabled === true) {
                    $viewer.off("click._openPopuper");
                    $viewer.on("click._openPopuper", function (event) {
                        event.stopPropagation();
                        //当前弹出窗是否已显示
                        var visibleFlag = $trigger.is(":visible");
                        $(document).trigger("click._hidePopuper");
                        if (visibleFlag) {
                            //弹出窗若显示，则关闭
                            $viewer.removeClass("active");
                            $trigger.hide();
                        } else {
                            //未显示
                            $viewer.addClass("active");
                            $trigger.show();
                            //调整样式
                            $trigger.css({
                                "position": "absolute",
                                "width": $viewer.innerWidth() + "px",
                                "left": 0,
                                "zIndex": 1024,
                            });
                        }
                    });
                }

                //触发器关闭时触发绑定的回调事件
                $trigger.data("callback", {});
                var triggerCallback = $trigger.data("callback");
                triggerCallback.hidePopuper = function () {
                    if ($.type(trigger.config.callback.hidePopuper) == "function") {
                        trigger.config.callback.hidePopuper(trigger);
                    }
                }

                //初始化已选中数据
                if ($viewer.find(".placeholder").length <= 0) {
                    //已存在时则不再创建
                    $viewer.prepend('<div class="placeholder">请选择</div><i class="switch-icon"></i>');
                }

                var cloneSelectedData;
                if (trigger.config.view.enabledSelectMode) {
                    cloneSelectedData = viewer.cloneData(trigger.getSelectedData());
                } else if (trigger.config.view.enabledCheckMode) {
                    cloneSelectedData = viewer.cloneData(trigger.getCheckedData());
                }

                //初始化视图面板，根据目标显示已选中的数据
                var $initViewerNode = viewer.getAllNode();
                if ($initViewerNode.length <= 0) {
                    //初始化时如果视图器不存在节点，则根据触发者初始化节点
                    var $addNode = viewer.addNode(cloneSelectedData);
                    //若无增加项，则将placeholder显示出来
                    if ($addNode.length <= 0) {
                        $viewer.find(".placeholder").show();
                        viewer.$content.hide();
                    } else {
                        $viewer.find(".placeholder").hide();
                        viewer.$content.show();
                    }

                    //至少有1条以上数据时
                    if (!viewer.config.view.selectedMultiple) {
                        //单选模式时，增加single样式
                        viewer.$content.addClass("single");
                    } else {
                        viewer.$content.removeClass("single");
                    }
                }
            });
            //检测视图器的节点数量，呈现显示方式
            function _autoHide() {
                //检测视图器是否存在节点
                if (viewer.getAllNode().length <= 0) {
                    //不存在节点时，不主动关闭弹窗
                    $viewer.find(".placeholder").show();
                    viewer.$content.hide();
                } else {
                    $viewer.find(".placeholder").hide();
                    viewer.$content.show();
                    //满足条件后，主动关闭弹窗
                    //单选模式，选中后
                    if (!trigger.config.view.selectedMultiple) {
                        $trigger.hide();
                        $trigger.data("callback").hidePopuper();
                        $viewer.removeClass("active");
                    } else {
                        //多选模式时只有达到了条件才隐藏弹出框
                        if (trigger.config.view.selectedSize && (trigger.config.view.selectedSize <= trigger.getSelectedNode().length)) {
                            $trigger.hide();
                            $trigger.data("callback").hidePopuper();
                            $viewer.removeClass("active");
                        }
                    }
                }
            }



        },
        Viewer22: function (setting) {
            var filterArgs = _filterArguments(arguments, ["plainobject"], 1);

            //输出错误信息，快速定位错误
            if (filterArgs === false) {
                var errorText = "%cExtension.TreeViewer(settingObject)";
                log(errorText, "color:#f00");
                return false;
            }

            var trigger = setting.trigger;
            var viewer = setting.viewer;
            var ncO = setting.nicescroll;

            //判断各对象引用是否正确
            if (!trigger._type) {
                //输出错误信息，快速定位错误
                var errorText = "%cEXT.TreeViewer()方法中trigger值，需要是一个由LUIControler的扩展控件对象实例";
                log(errorText, "color:#f00");
                return false;
            }

            if (viewer._type != "panelview") {
                //输出错误信息，快速定位错误
                var errorText = "%cEXT.TreeViewer()方法中viewer值，需要Panelview对象，您将'" + viewer._trigger + "'实例化的" + viewer._type + "类型不正确";
                log(errorText, "color:#f00");
                return false;
            }

            var $trigger = trigger.$me;
            var $viewer = viewer.$me;
            var $nc = ncO ? ncO.me : null;

            //调整样式
            $viewer.parent().css({
                "position": "relative",
            });

            //重载选项配置
            var triggerSetting = {
                _isUserDefined: false,
                _updateConfig: true,
                callback: {
                    selectNode: function ($node, nodeData, self) {
                        self.config.action.addViewerNode($node, nodeData, self);
                    },
                },
                action: {
                    addViewerNode: function ($node, nodeData, self) {
                        //节点选中，且在视图器里未存在当前节点ID时，在面板里显示该数据
                        //如已存在，则进行替换（更新）节点数据
                        if (nodeData.selected === true) {
                            var cloneData = viewer.cloneData(nodeData);
                            var $addnode;
                            var $viewerNode = viewer.getNodeById(nodeData.id);
                            if ($viewerNode.length <= 0) {
                                //视图器不存在节点：增加
                                if (!trigger.config.view.selectedMultiple) {
                                    //单选
                                    $(".com-hidden").not($trigger).not($nc).hide();
                                    $viewer.removeClass("focus");
                                } else {
                                    //除自已以外的所有都关闭
                                    $(".com-hidden").not($trigger).not($nc).hide();
                                    //多选模式时只有达到了条件才隐藏弹出框
                                    if (trigger.config.view.selectedSize && (trigger.config.view.selectedSize <= trigger.getSelectedNode().length)) {
                                        $viewer.removeClass("focus");
                                    }
                                }

                                $addnode = viewer.addNode(cloneData);
                            } else {
                                //视图器存在节点：更新
                                //找到这个节点的位置
                                var index = $viewerNode.index();
                                $addnode = viewer.addNode(cloneData, index);
                            }

                        } else {
                            //取消选中时
                            viewer.removeNode(viewer.getNodeById(nodeData.id));
                            if (!trigger.config.view.selectedMultiple) {
                                $(".com-hidden").not($trigger).not($nc).hide();
                                $viewer.removeClass("focus");
                            }
                        }
                        _autoHide();
                    }
                }
            }

            //重载

            trigger.load(triggerSetting);

            //重载面板配置
            var viewerSetting = {
                _isUserDefined: false,
                _updateConfig: true,
                view: {
                    enabledSelectMode: false,
                    selectedMultiple: trigger.config.view.selectedMultiple,
                    checkedMultiple: trigger.config.view.checkedMultiple,
                    showRemoveIcon: true,
                },
                callback: {
                    removeIconCallback: function ($node, self) {
                        viewer.config.action.removeTriggerNode($node);
                    },
                },
                action: {
                    //视图器移除按钮事件
                    removeTriggerNode: function ($node) {
                        var nodeData = viewer.getDataById($node)[0];
                        var $triggerNode = trigger.getNodeById(nodeData.id);
                        $triggerNode.trigger("click");
                        _autoHide();
                    }
                }
            };

            viewer.load(viewerSetting);

            return
            //侦听事件
            //面板点击事件
            if (trigger.config.view.enabled) {
                $viewer.on("click", function (event) {
                    //删除其他同类控件焦点
                    //$(".ext-viewer").removeClass("focus");
                    $viewer.removeClass("focus");
                    event.stopPropagation();
                    if (ncO) {
                        if ($nc.is(":visible")) {
                            $nc.hide();
                        } else {
                            $(".com-hidden").hide();

                            $viewer.addClass("focus");
                            $nc.show();
                            $trigger.show();

                            $nc.css({
                                "position": "absolute",
                                "width": $viewer.outerWidth() + "px",
                                "left": 0,
                                "zIndex": 1024,
                            });

                            ncO.autohidedom.css({
                                "zIndex": 1030,
                            });
                        }
                    } else {
                        if ($trigger.is(":visible")) {
                            $trigger.hide();
                        } else {
                            $(".com-hidden").hide();

                            $viewer.addClass("focus");

                            $trigger.show();
                            $trigger.css({
                                "position": "absolute",
                                "width": $viewer.innerWidth() + "px",
                                "height": "288px",
                                "overflowY": "auto",
                                "left": 0,
                                "zIndex": 1024,
                            });
                        }
                    }
                });
            } else {
                $viewer.addClass("disabled");
            }

            if ($viewer.find(".placeholder").length <= 0) {
                //已存在时则不再创建
                $viewer.prepend('<div class="placeholder">请选择</div><i class="switch-icon"></i>');
            }
            var $placeholder = $viewer.find(".placeholder");

            var getSelectedData = viewer.cloneData(trigger.getSelectedData());

            //初始化视图面板，根据目标显示已选中的数据
            var $addNode = viewer.addNode(getSelectedData);

            //若无增加项，则将placeholder显示出来
            if ($addNode.length <= 0) {
                $placeholder.show();
                viewer.$content.hide();
            } else {
                //一项时增加single属性
                //单选模式时
                if (!viewer.config.view.selectedMultiple && viewer.getAllNode().length == 1) {
                    viewer.$content.addClass("single");
                } else {
                    viewer.$content.removeClass("single");
                }
                $placeholder.hide();
                viewer.$content.show();
            }

            //自动隐藏
            function _autoHide() {
                if (trigger.config.view.enabledAutoHide) {
                    //视图器无节点时
                    if (viewer.getAllNode().length <= 0) {
                        $viewer.find(".placeholder").show();
                        viewer.$content.hide();
                    } else {
                        //有节点时
                        if (!trigger.config.view.selectedMultiple) {
                            /*
                            							if (!trigger.config.view.selectedMultiple && viewer.getAllNode().length == 1) {
                            */
                            //单选模式
                            viewer.$content.addClass("single");
                        } else {
                            viewer.$content.removeClass("single");
                        }
                        $viewer.find(".placeholder").hide();
                        viewer.$content.show();
                    }
                }
            }

            //点击空白区域关闭选框事件
            $("html").undelegate("body", "click.hideViewer");

            $("html").delegate("body", "click.hideViewer", function () {
                $(".ext-viewer").removeClass("focus");
                $viewer.removeClass("focus");
                $(".com-hidden").hide();
            });
        },

        //检索过滤
        //example:SearchFilter({trigger:触发器实例对象,viewer:视图器的选择器名称});
        SearchFilter: function (setting) {
            var trigger = setting.trigger;
            var viewer = setting.viewer;

            var $trigger = trigger.$me;
            var $viewer = $(viewer).eq(0);

            //初始化样式
            $viewer.parent().css({
                "position": "relative",
            });

            //重载配置参数
            var triggerSetting = {
                view: {
                    //根据插件的勾选模式，来决定是否更新配置（需要更新节点）
                    splitSymbol: trigger.config.view.splitSymbol || ",", //分隔符号，默认为英文逗号
                    //输入字符类型
                    //number=3,中文chinese=1，英文english=2,字符symbol=4，所有all=0
                    valueType: 3,
                    updateConfig: trigger.config.view.enabledCheckMode === true ? false : true,
                    //假如选中模式是启用的，同时开启了勾选模式，则启用选中即勾选模式
                    selectIsCheck: (trigger.config.view.selectIsCheck === true || trigger.config.view.checkIsSelect === true) || (trigger.config.view.enabledSelectMode === true && trigger.config.view.enabledCheckMode === true) ? true : false,
                    checkIsSelect: (trigger.config.view.selectIsCheck === true || trigger.config.view.checkIsSelect === true) || (trigger.config.view.enabledSelectMode === true && trigger.config.view.enabledCheckMode === true) ? true : false,

                    //只要开启了对应的模式，且是多选模式时就为true
                    checkedMultiple: (trigger.config.view.enabledSelectMode === true && trigger.config.view.selectedMultiple === true) || (trigger.config.view.enabledCheckMode === true && trigger.config.view.checkedMultiple === true) ? true : false,
                    selectedMultiple: (trigger.config.view.enabledSelectMode === true && trigger.config.view.selectedMultiple === true) || (trigger.config.view.enabledCheckMode === true && trigger.config.view.checkedMultiple === true) ? true : false
                },
                callback: {
                    selectNode: function ($node, nodeData, self) {
                        //选中事件，添加至视图器
                        self.config.action.addViewerText($node, nodeData, self);
                    },
                    checkNode: function ($node, nodeData, self) {
                        //选中事件，添加至视图器
                        self.config.action.addViewerText($node, nodeData, self);
                    },
                },
                action: {
                    addViewerText: function ($node, nodeData, self) {
                        if (trigger.config.view.selectedMultiple === true) {
                            //多选
                            if (nodeData.selected === true) {
                                //选中
                                if ($.trim($viewer.val()) == "") {
                                    //当前视图区无内容
                                    $viewer.val(nodeData[self.config.key.nameKey]);
                                } else {
                                    var searchText = $viewer.val();
                                    var valArray = searchText.split(trigger.config.view.splitSymbol);
                                    if (nodeData[self.config.key.nameKey].search(eval("/" + valArray[valArray.length - 1] + "/")) >= 0) {
                                        //存在
                                        valArray.pop();
                                        if (valArray.length > 0) {
                                            //移除末尾数据后还存在值的话，
                                            $viewer.val(valArray.join(trigger.config.view.splitSymbol) + trigger.config.view.splitSymbol + nodeData[self.config.key.nameKey]);
                                        } else {
                                            $viewer.val(nodeData[self.config.key.nameKey]);
                                        }
                                    } else {
                                        $viewer.val($viewer.val() + trigger.config.view.splitSymbol + nodeData[self.config.key.nameKey]);
                                    }
                                }
                            } else {
                                //取消选中
                                var searchText = $viewer.val();
                                var regexp1 = "/" + nodeData[self.config.key.nameKey] + trigger.config.view.splitSymbol + "/";
                                var regexp2 = "/" + trigger.config.view.splitSymbol + nodeData[self.config.key.nameKey] + "/";
                                var regexp3 = "/" + nodeData[self.config.key.nameKey] + "/";
                                searchText = searchText.replace(eval(regexp1), "");
                                searchText = searchText.replace(eval(regexp2), "");
                                searchText = searchText.replace(eval(regexp3), "");
                                $viewer.val(searchText);
                            }
                            //视图依旧获得焦点
                            //$viewer.focus();
                        } else {
                            //单选
                            if (nodeData.selected === true) {
                                //选中
                                $viewer.val(nodeData[self.config.key.nameKey]);
                            } else {
                                //取消选中
                                $viewer.val("");
                            }
                        }

                        //检测视图器的节点数量，呈现显示方式
                        //_autoHide();
                    }
                }
            }

            
            //重载
            trigger.load(triggerSetting);

            trigger.ready(function () {
                //绑定视图面板点击弹出事件
                //插件禁用时不绑定事件
                if (trigger.config.view.enabled === true) {
                    //视图器获得焦点事件
                    $viewer.off("focus._openPopuper");
                    $viewer.on("focus._openPopupery", function () {
                        event.stopPropagation();
                        //当前弹出窗是否已显示
                        $(document).trigger("click._hidePopuper");
                        //每次获得焦点后，都重新显示出全部节点
                        trigger.filterNode();
                        //显示触发器
                        $trigger.show();
                        //调整样式
                        $trigger.css({
                            "position": "absolute",
                            "width": $viewer.innerWidth() + "px",
                            "left": 0,
                            "zIndex": 1024,
                        });
                    });

                    //绑定键盘keyup事件：实时搜索节点
                    //只过滤视图区最后一个内容（最后的分隔符逗号之后的内容
                    $viewer.off("keyup._filterNode");
                    $viewer.on("keyup._filterNode", function (event) {
                        /*						if (trigger._filterTimeStamp) {
                        							if (event.timeStamp - trigger.timeStamp > 1000) {

                        							} else {

                        							}
                        						}*/

                        clearTimeout(trigger._filterTimeout);

                        /*
                        						trigger.timeStamp = event.timeStamp;
                        */

                        var searchVal = $viewer.val();


                        //存在搜索内容时
                        if (searchVal.length > 0) {
                            //检索视图器的内容，查找与触发器中节点的文本内容，相等时，则显示，不相等时则消失

                            var valArray = searchVal.split(trigger.config.view.splitSymbol);

                            //先过滤最后一个内容
                            //初始化选中不延迟执行，后续的延迟执行
                            if (trigger.config.view.filterTimeout !== undefined) {
                                trigger._filterTimeout = setTimeout(function () {
                                    var $filterNode = trigger.filterNode(valArray[valArray.length - 1]);
                                }, trigger.config.view.filterTimeout);
                            } else {
                                var $filterNode = trigger.filterNode(valArray[valArray.length - 1]);
                            }


                            var $allNode = trigger.getAllNode();

                            //全部取消选中状态
                            trigger.cancelSelectedAllNode();

                            for (var i = 0; i < valArray.length; i++) {
                                //逐一过滤触发器是否已存在该内容
                                for (var j = 0; j < $allNode.length; j++) {
                                    var $currentNode = $allNode.eq(j);
                                    var currentData = $currentNode.text();
                                    if ($.trim(currentData) == $.trim(valArray[i])) {
                                        //内容相等则选中
                                        trigger.selectNode($currentNode);
                                        //直接退出本次循环，查找下一个
                                        break;
                                    }
                                }
                            }
                        } else {
                            //搜索区无内容时显示所有节点
                            trigger.filterNode();
                            //取消所有节点的选中状态
                            trigger.cancelSelectedAllNode();
                        }

                    });

                    //视图器点击事件：阻止冒泡
                    $viewer.off("click._stop");

                    $viewer.on("click._stop", function (event) {
                        event.stopPropagation();
                    });

                    //触发器关闭时触发绑定的回调事件
                    $trigger.data("callback", {});
                    var triggerCallback = $trigger.data("callback");
                    triggerCallback.hidePopuper = function () {
                        if ($.type(trigger.config.callback.hidePopuper) == "function") {
                            trigger.config.callback.hidePopuper(trigger);
                        }
                    }
                } else {
                    //禁用输入框
                    $viewer.attr("disabled", "disabled");
                }


                //假如视图器初始化无内容，并且触发器里存在已选中节点或已勾选节点，则初始化显示下拉列表中已选中的数据
                if (trigger.getSelectedNode().length > 0) {
                    //触发器存在已选中项
                    if (trigger.config.view.selectedMultiple) {
                        //多选
                        if ($.trim($viewer.val()) == "") {
                            //内容为空时
                            $viewer.val(_dataToArray(trigger.getSelectedData(trigger.config.key.nameKey)).join(trigger.config.view.splitSymbol));
                        } else {
                            //不为空时，判断末尾是否已有逗号，未有，则加上去
                            if ($viewer.val().charAt(-1) == trigger.config.view.splitSymbol) {
                                $viewer.val($viewer.val() + _dataToArray(trigger.getSelectedData(trigger.config.key.nameKey)).join(trigger.config.view.splitSymbol));
                            } else {
                                $viewer.val($viewer.val() + trigger.config.view.splitSymbol + _dataToArray(trigger.getSelectedData(trigger.config.key.nameKey)).join(trigger.config.view.splitSymbol));
                            }
                        }
                    } else {
                        //单选
                        $viewer.val(_dataToArray(trigger.getSelectedData(trigger.config.key.nameKey))[0]);
                    }
                    //触发一次脚本，让触发器内容出发视图器内容
                    $viewer.trigger("keyup");
                } else {
                    //视图器已有初始内容时
                    //单选
                    if (!trigger.config.view.selectedMultiple) {
                        $viewer.val($viewer.val().split(trigger.config.view.splitSymbol)[0]);
                    }
                }

                //当数据数量级超过100时，不实时搜索
                //延迟搜索时间filterTimeout=500,
                //检索长度filterLength=500条
                if (!trigger.config.view.filterLength) {
                    trigger.config.view.filterLength = 500;
                }

                if (!trigger.config.view.filterTimeout) {
                    //未设置时，取多少呢
                    if (trigger.getAllNode().length > trigger.config.view.filterLength) {
                        //大于500条数据时，则设置延迟加载，否则不延迟
                        trigger.config.view.filterTimeout = 250;
                    }
                };
            });
        }
    }

    //点击空白区域关闭弹窗事件
    $(document).on("click._hidePopuper", function () {
        //移除其他视图的焦点
        $(".com-viewer").removeClass("active");
        //隐藏其他弹出框（不包括自身）
        //得到当前展开的弹出窗对象
        var $popuper = $(".com-popuper").filter(":visible");
        $(".com-popuper").hide();

        if ($popuper.length > 0) {
            //触发绑定在他身上的回调
            $popuper.data("callback").hidePopuper();
        }
    });

    return this.init;
};

var EXT = Extension = new Extension();
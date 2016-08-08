/**
 * @class MenuManager
 * @version 0.2.0
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 03/23/2016
 * @requires jquery-1.11.3 tree.js luicontroller.js
 * @name 树列表插件扩展-菜单管理
 * 
 * ## 更新
 * - 2016.2.14
 * 		- 封装菜单管理
 
 */


"use strict";


function menuManger(selector, setting) {
	//自定义配置
	var config = {
		view: {
			enabledSelectMode: false, //关闭选中模式
			enabledDblClickExpand: true, //启用双击展开节点
			addMode: true,
			nodeFormater: function (nodeData) {
				return "<div><span class='name'>" + nodeData.name + "</span></div>";
			},
			nodeBtns: {
				remove: true,
				add: true,
				up: true,
				down: true
			}
		},
		callback: {
			loadCallback: function (self) {
				//阻止双击冒泡
				self.$content.off("dblclick._stopDblclik", "[data-role='remove'],[data-role='add'],[data-role='moveUper'],[data-role='moveDowner']");
				self.$content.on("dblclick._stopDblclik", "[data-role='remove'],[data-role='add'],[data-role='moveUper'],[data-role='moveDowner']", function (event) {
					event.stopPropagation();
				});

				self.$content.off("click.nodeMoveUp", "[data-role='moveUper']");
				self.$content.on("click.nodeMoveUp", "[data-role='moveUper']", function (event) {
					event.stopPropagation();
					var $node = $(this).closest("[data-role='node']");
					self.config.action.nodeMoveUp($node, self);
				});

				self.$content.off("click.nodeMoveDown", "[data-role='moveDowner']");
				self.$content.on("click.nodeMoveDown", "[data-role='moveDowner']", function (event) {
					event.stopPropagation();
					var $node = $(this).closest("[data-role='node']");
					self.config.action.nodeMoveDown($node, self);
				});

				self.$content.off("click.nodeRemove", "[data-role='remove']");
				self.$content.on("click.nodeRemove", "[data-role='remove']", function (event) {
					event.stopPropagation();
					var $node = $(this).closest("[data-role='node']");
					self.config.action.removeNode($node, self);
				});

				self.$content.off("click.nodeAdd", "[data-role='add']");
				self.$content.on("click.nodeAdd", "[data-role='add']", function (event) {
					event.stopPropagation();
					//这里填写增加处理函数
					//得到的数据
					var data = [];
					var $node = $(this).closest("[data-role='node']");
					self.config.action.addNode($node, data, self);
					if (self.config.callback.immediateAddNode && $.type(self.config.callback.immediateAddNode) == "function") {
						self.config.callback.immediateAddNode($node, self);
					}

				});
			},
			nodeCallback: function ($node, nodeData, self) {
				$node.addClass("clearfix");
				var $toolsContent = $("<span class='ext-move-tools right'></span>")

				var $remove = $("<span class='ext-remove action' data-role='remove' title='删除菜单'><i class='iconfont'>&#xe61d;</i></span>");
				var $add = $("<span class='ext-add action' data-role='add' title='新增子菜单'><i class='iconfont'>&#xe63f;</i></span>");
				var $moveUp = $("<span class='ext-move-up action' data-role='moveUper' title='上移'><i class='iconfont'>&#xe64b;</i></span>");
				var $moveDown = $("<span class='ext-move-down action' data-role='moveDowner' title='下移'><i class='iconfont'>&#xe64c;</i></span>");

				$node.prepend($toolsContent);

				if (self.config.callback.nodeBtnCallback && $.type(self.config.callback.nodeBtnCallback) == "function") {
					//存在回调时，无视nodeBtn的设置，全手动
					var $btns = {
						$remove: $remove,
						$add: $add,
						$up: $moveUp,
						$down: $moveDown,
					}
					self.config.callback.nodeBtnCallback($toolsContent, $btns, self);
				} else {
					//不存在回调时，默认生成
					if (self.config.view.nodeBtns.remove) {
						$toolsContent.append($remove);
					}

					if (self.config.view.nodeBtns.add) {
						if (nodeData.level == 0) {
							$toolsContent.append($add);
						}
					}

					if (self.config.view.nodeBtns.up) {
						$toolsContent.append($moveUp);
					}

					if (self.config.view.nodeBtns.down) {
						$toolsContent.append($moveDown);
					}
				}


			}/*,
			immediateAddNode: function ($node, self) {

			}*/

		},
		action: {
			//节点获得鼠标焦点
			focusNode: function ($node) {
				$node.addClass("active");
			},
			//节点失去鼠标焦点
			blurNode: function ($node) {
				$node.removeClass("active");
			},
			//移除节点（仅隐藏节点，及其子节点，为隐藏节点设置一个标记，以便重置使用）
			removeNode: function ($node, self) {
				$node.addClass("waiting-remove");
				self._noder._getParentNodeContainer($node).hide();
				//移除时还需查看是否还存在兄弟节点，如果不存在，则父节点的展开标记要关闭
				var $siblingsNode = self.getSiblingsNode($node);
				if ($siblingsNode.filter(":visible").length <= 0) {
					//不存在
					self._expander._getExpander(self.getParentNode($node)).hide();
				}
			},
			//增加节点(为增加的节点设置一个标记，以便重置使用)
			addNode: function ($node, data, self) {
				//模拟插入数据
				var $addNode = self.addNode(data, $node);

				if ($addNode.length > 0) {
					$addNode.addClass("waiting-reset");
					//目标节点存在时，展开这个节点
					if ($node) {
						//非根节点时，需要展开节点
						self.expandNode($node);
					}
					//若不需要实时排序，可以删除下行
					//self.sortNode("orderId", "asc");
				}
			},
			//节点上移
			nodeMoveUp: function ($node, self) {
				var nodeData = self.getDataById($node)[0];

				//取得同节点
				var $siblingsNode = self.getSiblingsNode($node, true);

				var currentIndex = $siblingsNode.index($node);

				//如果当前节点是首节点，则不执行事件
				if (currentIndex === 0) {
					return false;
				}

				//取得上一个兄弟元素节点和数据
				var $prevNode = $siblingsNode.eq(currentIndex - 1);
				var prevNodeData = self.getDataById($prevNode)[0];

				//将双方排序的序号数据交换
				var currentOrderId = nodeData.orderId;
				var prevOrderId = prevNodeData.orderId;
				self.replaceNodeData($node, "orderId", prevOrderId);
				self.replaceNodeData($prevNode, "orderId", currentOrderId);

				self.replaceNode($node, $prevNode, true);
			},
			//节点下移
			nodeMoveDown: function ($node, self) {
				var nodeData = self.getDataById($node)[0];

				//取得兄弟节点
				var $siblingsNode = self.getSiblingsNode($node, true);
				var currentIndex = $siblingsNode.index($node);
				//如果当前节点是首节点，则不执行事件
				if (currentIndex === $siblingsNode.length - 1) {
					return false;
				}

				//取得上一个兄弟元素节点和数据
				var $nextNode = $siblingsNode.eq(currentIndex + 1);
				var nextNodeData = self.getDataById($nextNode)[0];

				//将双方排序的序号数据交换暂存到自已新的newlyorderId字段里
				var currentOrderId = nodeData.orderId;
				var nextOrderId = nextNodeData.orderId;

				self.replaceNodeData($node, "orderId", nextOrderId);
				self.replaceNodeData($nextNode, "orderId", currentOrderId);
				self.replaceNode($node, $nextNode, true);
			},
			//还原节点
			restoreNode: function (self) {
				//让隐藏的节点显示
				var $allNode = self.getAllNode();
				self._noder._getParentNodeContainer($allNode).show();
				//标记为待移除标记的节点删除标记
				$allNode.removeClass("waiting-remove");

				//删除增加的节点
				var $resetNode = $allNode.filter(".waiting-reset");

				self.removeNode($resetNode);
				//删除标记
				//恢复默认排序，并重新复制数据
				self.sortNode();
				//克隆排序
				self.config.action.cloneCloneId(self.getAllNode(), self);
			},
			//点击“编辑”按钮时，都会复制一份当前的默认排序号_orderId为新字段orderId
			cloneCloneId: function ($node, self) {
				self.replaceNodeData($node, "orderId", function (index, data) {
					return data["_orderId"];
				});
			},

		}
	};

	//合并loadCallback
	if (setting.callback && setting.callback.loadCallback) {
		setting.callback.loadCallback = _mergeFunc(setting.callback.loadCallback, config.callback.loadCallback);
	}

	//合并nodeCallback
	if (setting.callback && setting.callback.nodeCallback) {
		setting.callback.nodeCallback = _mergeFunc(setting.callback.nodeCallback, config.callback.nodeCallback);
	}

	//覆盖配置
	config = $.extend(true, config, setting);


	config.selector = selector;

	var tree = $(selector).tree(config);

	return tree

}

//扩展为JQ方法
$.fn.menuManager = function (setting, callback) {
	//实例化
	var menuManager = menuManger(this.selector, setting, callback);
	//返回初始化对象
	return menuManager;
}

//扩展为window方法
window.menuManager = function (selector, setting, callback) {
	//实例化
	var menuManager = menuManger(selector, setting, callback);
	//返回初始化对象
	return menuManager;
};
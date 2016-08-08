define(['src/jquery-elist', 'mocha', 'chai', 'jquery'], function (elist, mocha, chai, jquery) {
	var expect = chai.expect;
	var $ = jquery;

	describe('test elist', function () {
		var $select = $(
			'<select data-placeholder="请选择" name="123sdf">'+
				'<option data-selected="true" value="1">选项1</option>'+
				'<option value="2">选项2</option>'+
				'<option value="3">选项3</option>'+
				'<option value="4">选项4</option>'+
			'</select>'
		);

		$select.elist({
			extraCls: 'extraCls'
		});

		//检查初始化
		it('should dom has been initialized', function () {
			expect($select.data('elist')).to.exist;
		});

		//检查配置项设置
		it('should options has been set', function () {
			var $simulator = $select.elist('getElist');

			expect($simulator.find('.ui-selectbox-inner').length).to.equals(1);
			expect($simulator.hasClass('extraCls')).to.equals(true);
		});

		//生成
		it('should generate dom', function(){
			var $simulator = $select.elist('getElist');

			expect($simulator.find('.ui-selectbox-drop-option').length).to.equals($select.find('option').length);
		});

	});
});

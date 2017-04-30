/*饼图组件对象*/
var H5ComponentPie=function (name,cfg) {

	var component=new H5ComponentBase(name,cfg);

	var w=cfg.width;
	var h=cfg.height;

	//加入一个画布（背景层）
	var cns=document.createElement('canvas');
	var ctx=cns.getContext('2d');
	$(cns).css('z-index',1);
	cns.width=ctx.width=w;
	cns.height=ctx.height=h;
	component.append(cns);

	var r=w/2;

	//加入一个底图层
	ctx.beginPath();
	ctx.fillStyle='#eee';
	ctx.strokeStyle='#eee';
	ctx.lineWidth=1;
	ctx.arc(r,r,r,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();

	//绘制一个数据层
	var cns=document.createElement('canvas');
	var ctx=cns.getContext('2d');
	$(cns).css('z-index',2);
	cns.width=ctx.width=w;
	cns.height=ctx.height=h;
	component.append(cns);

	var colors=['red','yellow','green','pink','blue'];
	var sAngel=1.5*Math.PI;
	var eAngel=0;
	var aAngel=2*Math.PI;

	var step=cfg.data.length;
	for (var i = 0; i < step; i++) {
		var item=cfg.data[i];
		var color=item[2]||(item[2]= colors.pop());

		eAngel=sAngel+aAngel*item[1];
		ctx.beginPath();
		ctx.fillStyle=color;
		ctx.strokeStyle=color;
		ctx.lineWidth=1;
		ctx.moveTo(r,r);
		ctx.arc(r,r,r,sAngel,eAngel);
		ctx.fill();
		ctx.stroke();

		sAngel=eAngel;

		//加入所有项目文本
		var text=$('<div class="text">');
		text.text(item[0]);

		var per=$('<div class="per">');
		per.text(item[1]*100+'%');

		text.append(per);

		var x=r+Math.sin(0.5*Math.PI- sAngel)*r;
		var y=r+Math.cos(0.5*Math.PI- sAngel)*r;

		if (x>w/2) {
			text.css('left',x/2);
		}else{
			text.css('right',(w-x)/2);
		}
		if (y>h/2) {
			text.css('top',y/2);
		}else{
			text.css('bottom',(h-y)/2);
		}
		if (cfg.data[i][2]) {
			text.css('color',cfg.data[i][2]);
		}
		text.css('opacity',0);

		component.append(text);
	}

	//加入一个蒙板层
	var cns=document.createElement('canvas');
	var ctx=cns.getContext('2d');
	$(cns).css('z-index',3);
	cns.width=ctx.width=w;
	cns.height=ctx.height=h;
	component.append(cns);

	var draw=function(per){
		ctx.clearRect(0,0,w,h);

		ctx.beginPath();
		ctx.fillStyle='#eee';
		ctx.strokeStyle='#eee';
		ctx.lineWidth=1;
		ctx.moveTo(r,r);
		if (per<=0) {
			component.find('.text').css('opacity',0);
			ctx.arc(r,r,r,0,2*Math.PI);
		}else{
			ctx.arc(r,r,r,sAngel,sAngel+2*Math.PI*per,true);
		}
		
		if (per>=1) {
			component.find('.text').css('opacity',1);
		}
		ctx.fill();
		ctx.stroke();
	}

	component.on('onLoad',function(){
		var s=0;
		for (var i = 0; i < 100; i++) {
			setTimeout(function(){
				s+=.01;
				draw(s);
			},i*10+500)
		}

	})

	component.on('onLeave',function(){
	var s=1;
	for (var i = 0; i < 100; i++) {
		setTimeout(function(){
			s-=.01;
			draw(s);
		},i*10)
	}

})

	return component;
}
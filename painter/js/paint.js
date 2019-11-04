window.onload = function(){
var canvas= document.getElementById("cans");
var cxt=canvas.getContext("2d");
var startX,startY,endX,endY;
var data;
var shapes = new Array();
var mousedown,mouseout;
var shape=1;

//创建图形对象，保存该图形的开始、结束坐标以及相关属性
function create_shape(Shape,startx,starty,endx,endy){
	shapes[shapes.length]={
		"Shape":Shape,
		"startx":startx,
		"endx":endx,
		"starty":starty,
		"endy":endy,
		"x":[],
		"y":[],
	};
}

//点击画布，获取起始坐标，由于加了标题栏，坐标存在一个偏移量
function StartPos(e){
	mousedown =0;
	mouseout = 0;	
	var rect = canvas.getBoundingClientRect();   
	startX=e.clientX - rect.left * (canvas.width / rect.width);  
	startY=e.clientY - rect.top * (canvas.height / rect.height) ;
	//如果是任意线，创建该对象
	if(shape==4){
		create_shape(4,startX,startY,endX,endY);
		shapes[shapes.length-1].x.push(startX);
		shapes[shapes.length-1].y.push(startY);
	}
	//保存当前画面
	data=cxt.getImageData(0, 0, canvas.width, canvas.height);
}

//获取终点坐标
function EndPos(e){
	if(startX!=null){
		var rect = canvas.getBoundingClientRect();   
		endX=e.clientX - rect.left * (canvas.width / rect.width);
		endY=e.clientY - rect.top * (canvas.height / rect.height) ;	
	}
}

//松开鼠标
function Mouseup(){
	if(startX!=null&&endX!=null&&shape!=4&&!(mousedown==1&&mouseout==1)){
		//创建该图形对象，并保存相关属性
			create_shape(shape,startX,startY,endX,endY);
			endX=null;		
	}	
	startX=null;
}

//按下鼠标
function Mousedown(){
	//如果鼠标是在画布外按下的，mousedown=1
	if(mouseout == 1)
		mousedown=1;
}

//鼠标移出了画布，mouseout=1
function MouseOut(){
	mouseout=1;
}

//选择画直线
function line(){
	shape=1;
}
//选择画圆
function circle(){
	shape=2
}
//选择画矩形
function rectangle(){
	shape=3;
}
//选择画自由线
function pencil(){
	shape=4;
}

//鼠标移动过程中画画
function draw(){
		// 如果起始坐标不为空
		if(startX!=null){
			//如果不是任意线状态，清空当前画布，展示上一个画布状态
			if(shape!=4){
				cxt.clearRect(0,0,canvas.width,canvas.height);
				cxt.putImageData(data,0,0);
			}
			//调用画图函数画图
			draw_picture(shape,startX,startY,endX,endY);
		}
}
 
// 画图
function draw_picture(Shape,startx,starty,endx,endy){
	switch(Shape){	
	case 1://直线
		cxt.beginPath();
		cxt.moveTo(startx,starty);
		cxt.lineTo(endx,endy);
		cxt.stroke();
		cxt.closePath();
		break;
	case 2://圆
		var temp=Math.sqrt(Math.pow((endx-startx),2)+Math.pow((endy-starty),2));
		cxt.beginPath();
		cxt.arc(startx,starty,temp,0,Math.PI*2,true);
		cxt.stroke();
		cxt.closePath();
		break;	
	case 3://矩形
		cxt.beginPath();
		cxt.rect(startx,starty,endx-startx,endy-starty);
		cxt.stroke();
		cxt.closePath();
		break;	
	case 4://任意线
		draw_pencil();
	}
}

//画任意线
function draw_pencil(){
	//画任意线
	cxt.beginPath();
	cxt.lineJoin="round";
	cxt.moveTo(startX,startY);	
	cxt.lineTo(endX,endY);	
	cxt.stroke();
	cxt.closePath();
	startX=endX;
	startY=endY;
}

//清除画布
function clear(){
	// 提示该操作不可逆
	var reminder=confirm("The operation is irreversible!");
	// 如果确认要清除，初始化界面
	if(reminder==true){
			cxt.clearRect(0,0,canvas.width,canvas.height);
			endX=null;
			shapes =[];
	}
}


//菜单栏的响应式设计
var x = document.getElementsByName("shape");
//用shape_click记录当前被选中的按钮，默认为直线，直线的背景设为pink
var shape_click=0;
x[0].style.background = "pink";
for(var j=0;j<x.length;j++){
	var select_shape = j;
	//当鼠标离开时，恢复原来的背景色
	x[j].onmouseout = (function(select_shape){
		var Select = select_shape;
		return function(){
			if(shape_click!=Select)
				this.style.background = "black";
		}
	})(select_shape);
	//当选中该图形选项时，背景色变为粉色	
	x[j].onclick = (function(select_shape){
		var Select = select_shape;
		return function(){
			recover(shape_click);
			shape_click = Select;
			this.style.background = "pink";
		}
	})(select_shape);
}

//当图形选项改变时，恢复上一个被选中选项的背景色
function recover(shape_num){
	document.getElementsByName("shape")[shape_num].style.background ="black";
}
Line.addEventListener("click",line,false);
Circle.addEventListener("click",circle,false);
Rectangle.addEventListener("click",rectangle,false);
Pencil.addEventListener("click",pencil,false);
Clear.addEventListener("click",clear,false);

canvas.addEventListener("mousedown",StartPos,false);
myCans.addEventListener("mousedown",Mousedown,false);
canvas.addEventListener("mouseout",MouseOut,false);
myCans.addEventListener("mouseup",Mouseup,false);
myCans.addEventListener("mousemove",EndPos,false);
myCans.addEventListener("mousemove",draw,false);

}

//定义一些常量
const n = 3, 
	  solidRadius = 20,
	  solidColor = 'rgba(0, 52, 63, 0.5)',
	  hollowRadius = 50,
	  hollowColor = 'rgb(241,124,103)',
	  touchRadius = 70;

/**********获取点*********/
function getCanvasPoint(canvas, x, y){
	let rect = canvas.getBoundingClientRect();
	return{
		x: 2 * (x - rect.left),
		y: 2 * (y - rect.top)
	};	
}

/***********计算距离***********/
function distance(p1, p2){
	let x = p2.x - p1.x, y = p2.y - p1.y;
	return Math.sqrt(x * x + y * y);
}

/************canvas画图（未选择时的圆）************
参数：ctx绘制的画布canvas对象，color实心圆的颜色
备注：fill表示填充，stroke作用于轨迹；
      arc()表示沿坐标点(x,y)为圆心，半径为r的圆逆时针方向绘制弧线
      fill()表示填充当前的路径
      (x1,y1)为绘制起点，(x2,y2)为绘制终点*****/
function drawSolidCircle(ctx, color, x, y, r) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2, true)
	ctx.closePath();
	ctx.fill();
}

function drawHollowCircle(ctx, color, x, y, r) {
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2, true)
	ctx.closePath();
	ctx.stroke();
}

function drawLine(ctx, color, x1, y1, x2, y2){
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

//确定画布的容器    
let container = document.getElementById('container');
let {width, height} = container.getBoundingClientRect();
//创建画布
let circleCanvas = document.createElement('canvas'); //画圆

circleCanvas.width = circleCanvas.height = 2 * Math.min(width, height);
// circleCanvas.style.position = 'absolute';
// circleCanvas.style.top = '50%';
// circleCanvas.style.left = '50%';
// circleCanvas.style.transform = 'translate(-50%, -50%) scale(0.5)';
Object.assign(circleCanvas.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(0.5)', 
      });

let lineCanvas = circleCanvas.cloneNode(true); //画固定的线
let moveCanvas = circleCanvas.cloneNode(true); //画不固定的线  

container.appendChild(lineCanvas);
container.appendChild(circleCanvas);
container.appendChild(moveCanvas);


let circleCtx = circleCanvas.getContext('2d'),
    lineCtx = lineCanvas.getContext('2d'),
    moveCtx = moveCanvas.getContext('2d');
    widthRight = circleCanvas.width;

//先清除画布
circleCtx.clearRect(0, 0, widthRight, widthRight);
lineCtx.clearRect(0, 0, widthRight, widthRight);
moveCtx.clearRect(0, 0, widthRight, widthRight);

//画实心圆点
let range = Math.round(widthRight / (n + 1));
let circles = []; 

for(let i = 1; i <= n; i++){
	for(let j = 1; j <= n; j++){
		let x = range * j, y = range * i;
		drawSolidCircle(circleCtx, solidColor, x, y, solidRadius);
		let circlePoint = {x, y};
		circlePoint.pos = [i, j];
		circles.push(circlePoint);
	}
}


//画线（先画点，再画线）
let records = [];
let realAction = evt => {
	let {clientX, clientY} = evt.changedTouches[0];
	touchPoint = getCanvasPoint(moveCanvas, clientX, clientY);
	for(let i = 0; i < circles.length; i++){
		let point = circles[i],
			x0 = point.x;
			y0 = point.y;

		if(distance(point, touchPoint) < touchRadius){
			// drawSolidCircle(circleCtx, hollowColor, x0, y0, hollowRadius);
			drawSolidCircle(circleCtx, hollowColor, x0, y0, solidRadius);
			drawHollowCircle(circleCtx, hollowColor, x0, y0, hollowRadius);
			if(records.length){
				let pLast = records[records.length - 1],
				x1 = pLast.x,
				y1 = pLast.y;
				drawLine(lineCtx, hollowColor, x0, y0, x1, y1);
			};
			let circle = circles.splice(i, 1)
			records.push(circle[0]);
			break;
		}
	}
	if(records.length){
        let point = records[records.length - 1],
            x0 = point.x,
            y0 = point.y,
            x1 = touchPoint.x,
            y1 = touchPoint.y;

        moveCtx.clearRect(0, 0, moveCanvas.width, moveCanvas.height);
        drawLine(moveCtx, hollowColor, x0, y0, x1, y1);        
      }
    };


moveCanvas.addEventListener('touchstart', realAction);
moveCanvas.addEventListener('touchmove', realAction);


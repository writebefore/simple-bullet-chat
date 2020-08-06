let data = [
  {
    value: "测试弹幕1",
    time: 5,
    color: "red",
    speed: 1,
    fontSize: 27,
  },
  {
    value: "测试弹幕1",
    time: 6,
    color: "red",
    speed: 1,
    fontSize: 27,
  },
  {
    value: "测试弹幕1",
    time: 7,
    color: "red",
    speed: 1,
    fontSize: 27,
  },
  {
    value: "测试弹幕1",
    time: 8,
    color: "red",
    speed: 1,
    fontSize: 27,
  },
  {
    value: "测试弹幕1",
    time: 9,
    color: "red",
    speed: 1,
    fontSize: 27,
  },

  {
    value: "测试弹幕1",
    time: 10,
    color: "red",
    speed: 1,
    fontSize: 27,
  },
  {
    value: "测试弹幕1",
    time: 11,
    color: "red",
    speed: 1,
    fontSize: 27,
  },
  {
    value: "测试弹幕1",
    time: 12,
    color: "red",
    speed: 1,
    fontSize: 27,
  },
  {
    value: "测试弹幕1",
    time: 13,
    color: "red",
    speed: 1,
    fontSize: 27,
  },
  {
    value: "测试弹幕2",
    time: 10,
    color: "#00a1f5",
    speed: 1,
    fontSize: 30,
  },
  { value: "测试弹幕3", time: 6 },
  {
    value: "测试弹幕4",
    time: 14,
    color: "#00a1f5",
    speed: 2,
    fontSize: 26,
  },
  { value: "测试弹幕5", time: 15 },
  {
    value: "测试弹幕6",
    time: 20,
    color: "#fff",
    speed: 4,
    fontSize: 30,
  },
];
const can = document.getElementById("mask");

// 获取DOM
let video = document.getElementById("video");
let $text = document.getElementById("text");
let $btn = document.getElementById("btn");
let $color = document.getElementById("color");
let $fontSize = document.getElementById("fontSize");


// 创建canvasBarrage类

//暂存 text,color='red',time,fontSize=20,speed=1
class CanvasBarrage {
  constructor(canvas, video, options = {}) {
    // options = {} 表示如果没有传值便默认为空

    if (!canvas || !video) {
      throw new Error("canvas or video can't be null");
    }

    this.canvas = canvas;
    this.canvas.width = video.width;
    this.canvas.height = video.height;
    this.video = video;
    this.options = options;

    // 创建画布
    this.ctx = canvas.getContext("2d");

    // 设置默认参数
    let defaultOptions = {
      color: "#e91e63",
      speed: 3,
      opacity: 0.5,
      fontSize: 20,
      data: [],
    };
    // 合并对象
    Object.assign(this, defaultOptions, options);
    // 添加属性，用来判断播放暂停,默认true为暂停
    this.isPaused = true;
    // 得到所有的弹幕消息
    this.barrages = this.data.map((item) => new Barrage(item, this));

    // 渲染操作
    this.render();
  }

  // 渲染canvas绘制的弹幕
  render() {
    // 清空画布
    this.clear();

    // 渲染弹幕
    this.renderBarrage();
    if (!this.isPaused) {
      // 递归进行渲染
      requestAnimationFrame(this.render.bind(this));
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderBarrage() {
    // 渲染拿到当前视频播放的时间
    // 要根据该事件和弹幕要展示的时间作对比就，来判断是否展示该弹幕
    let time = this.video.currentTime;

    // 遍历所有的弹幕，每一个barrage
    this.barrages.forEach((item) => {
      // 用一个flag来处理是否默认渲染，默认为false
      // 并且只有在视屏播放时间大于等于当前弹幕的展示时间时才处理它
      if (!item.flag && time >= item.time) {
        // 判断这条弹幕是否被初始化过了
        // 如果isInit是false，那么需要对当前的弹幕是否需要初始化
        if (!item.isInit) {
          item.init();
          item.isInit = true;
        }

        // 弹幕移动 右->左
        item.x -= item.speed;
        item.render();
        // 如果当前弹幕的x坐标比自身的宽度还要小，就表示出去屏幕
        if (item.x < -item.width) {
          item.flag = true;
        }
      }
    });
  }
  add(obj){
    // 实际上就是往barrages里添加一项Barrages实例
    this.barrages.push(new Barrage(obj,this))
  }
}

// 用来实例化每一条弹幕
class Barrage {
  constructor(obj, ctx) {
    this.value = obj.value; //弹幕的内容
    this.time = obj.time; // 弹幕的出现时间
    // 把obj和ctx都挂载到this上方便获取
    this.obj = obj;
    this.context = ctx;
  }

  // 初始化弹幕
  init() {
    // 默认值对比修改
    this.color = this.obj.color || this.context.color;
    this.speed = this.obj.speed || this.context.speed;
    this.opacity = this.obj.opacity || this.context.opacity;
    this.fontSize = this.obj.fontSize || this.context.fontSize;

    // 计算每一条弹幕的宽度
    let p = document.createElement("p");
    p.style.fontSize = this.fontSize + "px";
    p.innerHTML = this.value; // xss
    document.body.appendChild(p);

    //  把p标签添加到body里 这样就可以拿到宽度
    //  设置弹幕的宽度
    this.width = p.clientWidth;
    //  得到的弹幕宽度后 移除p标签
    document.body.removeChild(p);

    // 设置弹幕出现的位置
    this.x = this.context.canvas.width;
    this.y = Math.random() * this.context.canvas.height;

    // 超出范围的处理
    if (this.y < this.fontSize) {
      this.y = this.fontSize;
    } else if (this.y > this.context.canvas.height - this.fontSize) {
      this.y = this.context.canvas.height - this.fontSize;
    }
  }

  // 渲染每一条弹幕
  render() {
    // 设置画布文字的字体和字号
    this.context.ctx.font = `${this.fontSize}px Arial`;
    this.context.ctx.fillStyle = this.color;
    // 绘制文字
    this.context.ctx.fillText(this.value, this.x, this.y);
  }
}

let canvasBarrage = new CanvasBarrage(can, video, { data });
video.addEventListener("play", () => {
  canvasBarrage.isPaused = false;
  canvasBarrage.render();
});

const send = function(){
  let value = $text.value //内容
  let time = video.currentTime //当前视频时间
  let color = $color.value //颜色
  let fontSize = $fontSize.value //字体大小
  const obj = {
    value,
    time,
    color,
    fontSize
  }
  // 添加弹幕数据
  canvasBarrage.add(obj);
  clearInput();
}

const clearInput = function(){
  $text.value = "";
}

$btn.addEventListener('click',send);
$text.addEventListener("keyup",(event)=>{
  const e = event || window.event;
  console.log(e);
  if(e.keyCode === 13){
    send();
  }
})
(function() {
    var canvas = document.getElementById('sky'), //获取画布元素
        context = canvas.getContext('2d'), //获取画布元素上下文
        mousePos = [0, 0], //设置一个鼠标的位置坐标的数组
        nodes = [], //定一个存放所有节点的数组
        edges = [], //定义一个存放所有链接的数组
        backgroundColor = '#000', //定义背景色
        edgeColor = '#fff', //定义直线的颜色
        nodeColor = '#fff', //定义节点的颜色
        easingFactor = 5.0; //定义移动的速度
    //节点初始化函数
    function constructNodes() {
        for (var i = 0; i < 100; i++) {
            var node = {
                drivenByMouse: i == 0,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: Math.random() * 1 - 0.5,
                vy: Math.random() * 1 - 0.5,
                radius: Math.random() > 0.9 ? 3 + Math.random() * 3 : 1 + Math.random() * 3
            };
            nodes.push(node);
        }
        nodes.forEach(function(e) {
            nodes.forEach(function(e2) {
                if (e == e2) {
                    return
                }
                var edge = {
                    from: e,
                    to: e2
                };
                addEdge(edge);
            });
        });
    }
    //添加连接线的函数
    function addEdge(edge) {
        var ignore = false;
        edges.forEach(function(e) {
            if (e.from == edge.from & e.to == edge.to) {
                ignore = true;
            }
            if (e.to == edge.from && e.from == edge.to) {
                ignore = true;
            }
        });
        if (!ignore) {
            edges.push(edge);
        }
    }
    //使所有的星星动起来的函数
    function step() {
        nodes.forEach(function(e) {
            if (e.drivenByMouse) {
                return;
            }
            e.x += e.vx;
            e.y += e.vy;
            //返回屏幕的边界值
            function clamp(min, max, value) {
                if (value > max) {
                    return max;
                } else if (value < min) {
                    return min;
                } else {
                    return value;
                }
            }
            //边界处理  防止星星跑出去   
            //横向
            if (e.x <= 0 || e.x >= canvas.width) {
                e.vx *= -1; //反转
                e.x = clamp(0, canvas.width, e.x);
            }
            //纵向
            if (e.y <= 0 || e.y >= canvas.height) {
                e.vy *= -1;
                e.y = clamp(0, canvas.height, e.y);
            }
        });
        //调整鼠标拖动之后的节点的位置
        adjustNodeDrivenByMouse();
        render();
        window.requestAnimationFrame(step); //调用动画函数
    }
    //调整鼠标拖动之后的节点的位置
    function adjustNodeDrivenByMouse() {
        nodes[0].x += (mousePos[0] - nodes[0].x) / easingFactor;
        nodes[0].y += (mousePos[1] - nodes[0].y) / easingFactor;
    }
    //计算直线的距离的函数
    function lengthOfEdeg(edge) {　　　　
        return Math.sqrt(Math.pow((edge.from.x - edge.to.x), 2) + Math.pow((edge.from.y - edge.to.y), 2));
    }
    //页面渲染函数
    function render() {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        //画直线
        edges.forEach(function(e) {
            var length = lengthOfEdeg(e),
                threshold = canvas.width / 8;
            if (length > threshold) {
                return;
            }
            context.strokeStyle = edgeColor;
            context.lineWidth = (1.0 - length / threshold) * 2.5;
            context.globalAlpha = 1.0 - length / threshold;
            context.beginPath();
            context.moveTo(e.from.x, e.from.y);
            context.lineTo(e.to.x, e.to.y);
            context.stroke();
        });
        context.globalAlpha = 1.0;
        //画星星
        nodes.forEach(function(n) {
            if (n.drivenByMouse) {
                return;
            }
            context.fillStyle = nodeColor;
            context.beginPath();
            context.arc(n.x, n.y, n.radius, 0, 2 * Math.PI);
            context.fill();
        });
    }


    //定义一个窗口大小变化的监听事件
    window.onresize = function() {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
        if (nodes.length == 0) {
            constructNodes(); //当节点数量为0的时候  ，调用创建节点的函数
        }
        render(); //调用页面渲染函数
    };
    //监听鼠标移动事件
    window.onmousemove = function(e) {
        mousePos[0] = e.clientX;
        mousePos[1] = e.clientY;
    };
    window.onresize();
    window.requestAnimationFrame(step);
}).call(this);
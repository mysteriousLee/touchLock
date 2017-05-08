window.onload = function () {
	touchLock.bindBtnevent();
	touchLock.setTime();
	touchLock.init();
}
var touchLock = {
    init : function(){
	    	this.password = {};
		    this.ifTouch = false;
		    this.canvas = document.getElementById('canvas');
		    this.getWidHei(this.canvas);
		    this.ctx = this.canvas.getContext('2d');
		    this.createPoint();
		    this.touchEvent();
    },
    getWidHei : function(canvas){
            var width = document.body.clientWidth;
            canvas.width = 0.85 * width;
            canvas.height = 0.85 * width;
            canvas.style.marginLeft = -0.5 * canvas.width + 'px';
    },
    createPoint : function(){
	    	var count = 0;
	        this.r = this.ctx.canvas.width / 14;
	        this.passwordPath = [];
	        this.pointArr = [];
	        this.restPoint = [];
	        for (var i = 0 ; i < 3 ; i++) {
	            for (var j = 0 ; j < 3 ; j++) {
	                count++;
	                var obj = {
	                    x: j * 4 * this.r + 3 * this.r,
	                    y: i * 4 * this.r + 3 * this.r,
	                    index: count
	                };
	                this.pointArr.push(obj);
	                this.restPoint.push(obj);
	            }
	        }
	        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	        for (var i = 0 ; i < this.pointArr.length ; i++) {
	            this.drawBorder(this.pointArr[i].x, this.pointArr[i].y);
		        this.drawCircle(this.pointArr[i].x, this.pointArr[i].y);
		    }
	        
    },
    drawCircle : function(x,y){
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.r / 2, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.fill();
    },
    drawBorder : function(x,y){
	        this.ctx.strokeStyle = '#fff';
	        this.ctx.lineWidth = 2;
	        this.ctx.beginPath();
	        this.ctx.arc(x, y, this.r, 0, Math.PI * 2, true);
	        this.ctx.closePath();
	        this.ctx.stroke();
    },
    drawLine : function(localPos, passwordPath) {
            this.ctx.beginPath();
            this.ctx.lineWidth = 8;
            this.ctx.strokeStyle = '#fff';
            this.ctx.moveTo(this.passwordPath[0].x, this.passwordPath[0].y);
            for (var i = 1 ; i < this.passwordPath.length ; i++) {
                this.ctx.lineTo(this.passwordPath[i].x, this.passwordPath[i].y);
            }
            this.ctx.lineTo(localPos.x, localPos.y);
            this.ctx.stroke();
            this.ctx.closePath();
    },
    touchEvent : function(){
    	     var that = this;
             this.canvas.addEventListener("touchstart", function (e) {
	             e.preventDefault();
	             var localPos = that.getPosition(e);
	             for (var i = 0 ; i < that.pointArr.length ; i++) {
	                if (Math.abs(localPos.x - that.pointArr[i].x) < that.r && Math.abs(localPos.y - that.pointArr[i].y) < that.r) {
	                    that.ifTouch = true;
	                    that.passwordPath.push(that.pointArr[i]);
	                    that.restPoint.splice(i,1);
	                    break;
	                }
	             }
	         },  { passive: false });
	         this.canvas.addEventListener("touchmove", function (e) {
	            if (that.ifTouch) {
	                that.updatePancel(that.getPosition(e));
	            }
	         },  { passive: false });
	         this.canvas.addEventListener("touchend", function (e) {
	             if (that.ifTouch) {
	                 that.ifTouch = false;
	                 that.promptInfo(that.passwordPath);
	                 that.resetPanel();
	             }
	         },  { passive: false });
    },
    getPosition : function(e){
	         var rect = e.currentTarget.getBoundingClientRect();
	         var localPos = {
	             x: e.touches[0].clientX - rect.left,
	             y: e.touches[0].clientY - rect.top
	         };
	         return localPos;
    },
    getDistance : function(fromPoint,toPoint){
            return Math.sqrt(Math.pow(fromPoint.x - toPoint.x, 2) + Math.pow(fromPoint.y - toPoint.y, 2));
    },
    checkDistance : function(psw1, psw2){
            var p1 = '',p2 = '';
            for (var i = 0 ; i < psw1.length ; i++) {
                p1 += psw1[i].index;
            }
            for (var i = 0 ; i < psw2.length ; i++) {
                p2 += psw2[i].index;
            }
            return p1 === p2;
    },
    lastCheck : function(localstorage,psw){
    	 localstorage = eval("(" + localstorage + ")");
    	 return this.checkDistance(localstorage,psw);
    },
    updatePancel : function(localPos){
	         this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	         for (var i = 0 ; i < this.pointArr.length ; i++) { 
	            this.drawBorder(this.pointArr[i].x, this.pointArr[i].y);
	         	this.drawCircle(this.pointArr[i].x, this.pointArr[i].y);  
	         }                      
	         this.drawLine(localPos,this.passwordPath);
	         for (var i = 0 ; i < this.restPoint.length ; i++) {
	             var pt = this.restPoint[i];
	             if (Math.abs(localPos.x - pt.x) < this.r && Math.abs(localPos.y - pt.y) < this.r) {
	                 this.passwordPath.push(pt);
                     this.restPoint.splice(i, 1);
	                 break;
	             }
	         }
    },
    promptInfo : function(psw){
            var buttonBox = document.getElementsByTagName('button');
        	if(buttonBox[0].className == 'checked'){
        		 if (this.password.step == 1) {
	                if (this.checkDistance(this.password.firstPassword,psw)) {
	                    this.password.step = 2;
	                    this.password.secondPassword = psw;
	                    document.getElementById('title').innerHTML = '密码设置成功';
	                    window.localStorage.setItem('password', JSON.stringify(this.password.secondPassword));
	                } else {
	                    document.getElementById('title').innerHTML = '两次输入的不一致';
	                    delete this.password.step;
	                }
	            }
	            else{
                     if(psw.length < 5){
                	document.getElementById('title').innerHTML = '密码太短，至少需要5个点';
	                }
	                else{
	                	this.password.step = 1;
	                    this.password.firstPassword = psw; 
	                	document.getElementById('title').innerHTML = '请再次输入手势密码';
	                }
	            }
        	}
        	else{
        		if(this.password.step == 2){
        			//console.log(psw);
        			//console.log(window.localStorage.getItem('password'));
        			if (this.lastCheck(window.localStorage.getItem('password'),psw)) {
	                    document.getElementById('title').innerHTML = '密码正确！';
	                } else {
	                    document.getElementById('title').innerHTML = '输入的密码不正确';
	                }
        		}
        	}
    },
    resetPanel : function(){
    	var that = this;
    	setTimeout(function(){
          that.createPoint();
    	},200);
    },
    setTime : function(){
    	var date = new Date();
    	var that = this;
    	var weekday=new Array(7)
		weekday[0] = "星期天";
		weekday[1] = "星期一";
		weekday[2] = "星期二";
		weekday[3] = "星期三";
		weekday[4] = "星期四";
		weekday[5] = "星期五";
		weekday[6] = "星期六";
    	var localTime = document.getElementById('localTime');
    	var dateTime = document.getElementById('dateTime');
    	if(date.getMinutes() < 10){
    		localTime.innerHTML = date.getHours() + ' : 0' + date.getMinutes();
    	}
    	else{
            localTime.innerHTML = date.getHours() + ' : ' + date.getMinutes();
    	}
    	dateTime.innerHTML = date.getMonth() + 1 + '月' + date.getDate() + '日' + ' ' + weekday[date.getDay()];
    	setTimeout(function(){
            that.setTime();
    		},1000);
    },
    bindBtnevent : function(){
    	var setPsw = document.getElementsByTagName('button')[0];
    	var checkPsw = document.getElementsByTagName('button')[1];
    	setPsw.addEventListener('click',function(){
            setPsw.className = 'checked';
            checkPsw.className = 'unchecked';
    	},false);
    	checkPsw.addEventListener('click',function(){
            checkPsw.className = 'checked';
            setPsw.className = 'unchecked';
    	},false);
    }
};
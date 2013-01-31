// Copyright (c) 2009, Baidu Inc. All rights reserved.
// 
// Licensed under the BSD License
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http:// tangram.baidu.com/license.html
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
 /**
 * @namespace T Tangram七巧板
 * @name T
 * @version 1.5.2.1
*/

/**
 * 声明baidu包
 * @author: allstar, erik, meizz, berg
 */
var T,
    baidu = T = baidu || {version: "1.5.2.1"}; 

//提出guid，防止在与老版本Tangram混用时
//在下一行错误的修改window[undefined]
baidu.guid = "$BAIDU$";

//Tangram可能被放在闭包中
//一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
baidu.$$ = window[baidu.guid] = window[baidu.guid] || {global:{}};

/**
 * 各种页面的UI组件
 * @namespace baidu.ui
 */
baidu.ui = baidu.ui || { version: '1.3.9' };

/**
 * 通过uiType找到UI类
 * @function
 * @grammar baidu.ui.getUI(uiType)
 * @param  {String} uiType  查找规则：suggestion -> baidu.ui.Suggestion，toolbar-spacer -> baidu.ui.Toolbar.Spacer.
 * @return {object} UI类
 * @author berg
 */
baidu.ui.getUI = function(uiType){
    var uiType = uiType.split('-'),
        result = baidu.ui,
        len = uiType.length,
        i = 0;

    for (; i < len; i++) {
        result = result[uiType[i].charAt(0).toUpperCase() + uiType[i].slice(1)];
    }
    return result;
};

/**
 * 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
 * @namespace baidu.lang
 */
baidu.lang = baidu.lang || {};


/**
 * 判断目标参数是否string类型或String对象
 * @name baidu.lang.isString
 * @function
 * @grammar baidu.lang.isString(source)
 * @param {Any} source 目标参数
 * @shortcut isString
 * @meta standard
 * @see baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *             
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isString = function (source) {
    return '[object String]' == Object.prototype.toString.call(source);
};

// 声明快捷方法
baidu.isString = baidu.lang.isString;


/**
 * 创建一个ui控件
 * @function
 * @grammar baidu.ui.create(UI, options)
 * @param {object|String} UI控件类或者uiType
 * @param {object} options optional 控件的初始化属性
 * @config {Boolean} autoRender 是否自动render，默认true
 * @config {String|HTMLElement} render render到的元素
 * @config {Object} parent 父控件
 * @return {Object} 创建好的控件实例
 * @author berg
 */
baidu.ui.create = function(UI, options){
    if(baidu.lang.isString(UI)){
        UI = baidu.ui.getUI(UI);
    }
    return new UI(options);
};


/**
 * 操作dom的方法
 * @namespace baidu.dom 
 */
baidu.dom = baidu.dom || {};


/**
 * 从文档中获取指定的DOM元素
 * @name baidu.dom.g
 * @function
 * @grammar baidu.dom.g(id)
 * @param {string|HTMLElement} id 元素的id或DOM元素.
 * @shortcut g,T.G
 * @meta standard
 * @see baidu.dom.q
 *
 * @return {HTMLElement|null} 获取的元素，查找不到时返回null,如果参数不合法，直接返回参数.
 */
baidu.dom.g = function(id) {
    if (!id) return null; //修改IE下baidu.dom.g(baidu.dom.g('dose_not_exist_id'))报错的bug，by Meizz, dengping
    if ('string' == typeof id || id instanceof String) {
        return document.getElementById(id);
    } else if (id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
        return id;
    }
    return null;
};

// 声明快捷方法
baidu.g = baidu.G = baidu.dom.g;


/**
 * 返回一个当前页面的唯一标识字符串。
 * @name baidu.lang.guid
 * @function
 * @grammar baidu.lang.guid()
 * @version 1.1.1
 * @meta standard
 *             
 * @returns {String} 当前页面的唯一标识字符串
 */
baidu.lang.guid = function() {
    return "TANGRAM$" + baidu.$$._counter ++;
};

//不直接使用window，可以提高3倍左右性能
baidu.$$._counter = baidu.$$._counter || 1;


// 20111129	meizz	去除 _counter.toString(36) 这步运算，节约计算量

/**
 * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
 * @class
 * @name 	baidu.lang.Class
 * @grammar baidu.lang.Class(guid)
 * @param 	{string}	guid	对象的唯一标识
 * @meta standard
 * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
 * @meta standard
 * @see baidu.lang.inherits,baidu.lang.Event
 */
baidu.lang.Class = function() {
    this.guid = baidu.lang.guid();

    !this.__decontrolled && (baidu.$$._instances[this.guid] = this);
};

baidu.$$._instances = baidu.$$._instances || {};

/**
 * 释放对象所持有的资源，主要是自定义事件。
 * @name dispose
 * @grammar obj.dispose()
 * TODO: 将_listeners中绑定的事件剔除掉
 */
baidu.lang.Class.prototype.dispose = function(){
    delete baidu.$$._instances[this.guid];

    // this.__listeners && (for (var i in this.__listeners) delete this.__listeners[i]);

    for(var property in this){
        typeof this[property] != "function" && delete this[property];
    }
    this.disposed = true;   // 20100716
};

/**
 * 重载了默认的toString方法，使得返回信息更加准确一些。
 * 20111219 meizz 为支持老版本的className属性，以后统一改成 __type
 * @return {string} 对象的String表示形式
 */
baidu.lang.Class.prototype.toString = function(){
    return "[object " + (this.__type || this._className || "Object") + "]";
};

/**
 * 按唯一标识guid字符串取得实例对象
 *
 * @param   {String}    guid
 * @return  {object}            实例对象
 */
 window["baiduInstance"] = function(guid) {
     return baidu.$$._instances[guid];
 }

//  2011.11.23  meizz   添加 baiduInstance 这个全局方法，可以快速地通过guid得到实例对象
//  2011.11.22  meizz   废除创建类时指定guid的模式，guid只作为只读属性
//  2011.11.22  meizz   废除 baidu.lang._instances 模块，由统一的global机制完成；

/**
 * 自定义的事件对象。
 * @class
 * @name 	baidu.lang.Event
 * @grammar baidu.lang.Event(type[, target])
 * @param 	{string} type	 事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
 * @param 	{Object} [target]触发事件的对象
 * @meta standard
 * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
 * @meta standard
 * @see baidu.lang.Class
 */
baidu.lang.Event = function (type, target) {
    this.type = type;
    this.returnValue = true;
    this.target = target || null;
    this.currentTarget = null;
};
 
/**
 * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
 * @grammar obj.dispatchEvent(event, options)
 * @param {baidu.lang.Event|String} event 	Event对象，或事件名称(1.1.1起支持)
 * @param {Object} 					options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
 * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。例如：<br>
myobj.onMyEvent = function(){}<br>
myobj.addEventListener("onMyEvent", function(){});
 */
baidu.lang.Class.prototype.fire =
baidu.lang.Class.prototype.dispatchEvent = function (event, options) {
    baidu.lang.isString(event) && (event = new baidu.lang.Event(event));

    !this.__listeners && (this.__listeners = {});

    // 20100603 添加本方法的第二个参数，将 options extend到event中去传递
    options = options || {};
    for (var i in options) {
        event[i] = options[i];
    }

    var i, n, me = this, t = me.__listeners, p = event.type;
    event.target = event.target || (event.currentTarget = me);

    // 支持非 on 开头的事件名
    p.indexOf("on") && (p = "on" + p);

    typeof me[p] == "function" && me[p].apply(me, arguments);

    if (typeof t[p] == "object") {
        for (i=0, n=t[p].length; i<n; i++) {
            t[p][i] && t[p][i].apply(me, arguments);
        }
    }
    return event.returnValue;
};

/**
 * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
 * @grammar obj.addEventListener(type, handler[, key])
 * @param   {string}   type         自定义事件的名称
 * @param   {Function} handler      自定义事件被触发时应该调用的回调函数
 * @return  {Function}              将用户注入的监听函数返回，以便移除事件监听，特别适用于匿名函数。
 * @remark  事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
 */
baidu.lang.Class.prototype.on =
baidu.lang.Class.prototype.addEventListener = function (type, handler, key) {
    if (typeof handler != "function") {
        return;
    }

    !this.__listeners && (this.__listeners = {});

    var i, t = this.__listeners;

    type.indexOf("on") && (type = "on" + type);

    typeof t[type] != "object" && (t[type] = []);

    // 避免函数重复注册
    for (i = t[type].length - 1; i >= 0; i--) {
        if (t[type][i] === handler) return handler;
    };

    t[type].push(handler);

    // [TODO delete 2013] 2011.12.19 兼容老版本，2013删除此行
    key && typeof key == "string" && (t[type][key] = handler);

    return handler;
};

//  2011.12.19  meizz   很悲剧，第三个参数 key 还需要支持一段时间，以兼容老版本脚本
//  2011.11.24  meizz   事件添加监听方法 addEventListener 移除第三个参数 key，添加返回值 handler
//  2011.11.23  meizz   事件handler的存储对象由json改成array，以保证注册函数的执行顺序
//  2011.11.22  meizz   将 removeEventListener 方法分拆到 baidu.lang.Class.removeEventListener 中，以节约主程序代码
/**
 * 屏蔽浏览器差异性的事件封装
 * @namespace baidu.event
 * @property target 	事件的触发元素
 * @property pageX 		鼠标事件的鼠标x坐标
 * @property pageY 		鼠标事件的鼠标y坐标
 * @property keyCode 	键盘事件的键值
 */
baidu.event = baidu.event || {};


/**
 * 事件监听器的存储表
 * @private
 * @meta standard
 */
baidu.event._listeners = baidu.event._listeners || [];

/**
 * 从文档中获取指定的DOM元素
 * **内部方法**
 * 
 * @param {string|HTMLElement} id 元素的id或DOM元素
 * @meta standard
 * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
 */
baidu.dom._g = function (id) {
    if (baidu.lang.isString(id)) {
        return document.getElementById(id);
    }
    return id;
};

// 声明快捷方法
baidu._g = baidu.dom._g;


/**
 * 为目标元素添加事件监听器
 * @name baidu.event.on
 * @function
 * @grammar baidu.event.on(element, type, listener)
 * @param {HTMLElement|string|window} element 目标元素或目标元素id
 * @param {string} type 事件类型
 * @param {Function} listener 需要添加的监听器
 * @remark
 * 
1. 不支持跨浏览器的鼠标滚轮事件监听器添加<br>
2. 改方法不为监听器灌入事件对象，以防止跨iframe事件挂载的事件对象获取失败
    
 * @shortcut on
 * @meta standard
 * @see baidu.event.un
 * @returns {HTMLElement|window} 目标元素
 */
baidu.event.on = /**@function*/function (element, type, listener) {
    type = type.replace(/^on/i, '');
    element = baidu.dom._g(element);

    var realListener = function (ev) {
            // 1. 这里不支持EventArgument,  原因是跨frame的事件挂载
            // 2. element是为了修正this
            listener.call(element, ev);
        },
        lis = baidu.event._listeners,
        filter = baidu.event._eventFilter,
        afterFilter,
        realType = type;
    type = type.toLowerCase();
    // filter过滤
    if(filter && filter[type]){
        afterFilter = filter[type](element, type, realListener);
        realType = afterFilter.type;
        realListener = afterFilter.listener;
    }
    
    // 事件监听器挂载
    if (element.addEventListener) {
        element.addEventListener(realType, realListener, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + realType, realListener);
    }
  
    // 将监听器存储到数组中
    lis[lis.length] = [element, type, listener, realListener, realType];
    return element;
};

// 声明快捷方法
baidu.on = baidu.event.on;

/**
 * 为目标元素移除事件监听器
 * @name baidu.event.un
 * @function
 * @grammar baidu.event.un(element, type, listener)
 * @param {HTMLElement|string|window} element 目标元素或目标元素id
 * @param {string} type 事件类型
 * @param {Function} listener 需要移除的监听器
 * @shortcut un
 * @meta standard
 * @see baidu.event.on
 *             
 * @returns {HTMLElement|window} 目标元素
 */
baidu.event.un = function (element, type, listener) {
    element = baidu.dom._g(element);
    type = type.replace(/^on/i, '').toLowerCase();
    
    var lis = baidu.event._listeners, 
        len = lis.length,
        isRemoveAll = !listener,
        item,
        realType, realListener;
    
    //如果将listener的结构改成json
    //可以节省掉这个循环，优化性能
    //但是由于un的使用频率并不高，同时在listener不多的时候
    //遍历数组的性能消耗不会对代码产生影响
    //暂不考虑此优化
    while (len--) {
        item = lis[len];
        
        // listener存在时，移除element的所有以listener监听的type类型事件
        // listener不存在时，移除element的所有type类型事件
        if (item[1] === type
            && item[0] === element
            && (isRemoveAll || item[2] === listener)) {
           	realType = item[4];
           	realListener = item[3];
            if (element.removeEventListener) {
                element.removeEventListener(realType, realListener, false);
            } else if (element.detachEvent) {
                element.detachEvent('on' + realType, realListener);
            }
            lis.splice(len, 1);
        }
    }
    
    return element;
};

// 声明快捷方法
baidu.un = baidu.event.un;



/**
 * UI基类，所有的UI都应该从这个类中派生出去
 * @name baidu.ui.Base
 * @grammar baidu.ui.Base
 * @class
 * @return {baidu.ui.Base}
 * @author berg
 */
baidu.ui.Base = 
/**
 * @lends baidu.ui.Base.prototype
 */
{

    id : "",

    /**
     * 获得当前控件的id
     * @param {string} optional key 
     * @return {string} id
     */
    getId : function(key){
        var ui = this, idPrefix;
        //通过guid区别多实例
        idPrefix = "tangram-" + ui.uiType + '--' + (ui.id ? ui.id : ui.guid);
        return key ? idPrefix + "-" + key : idPrefix;
    },

    /**
     * 获得class，支持skin
     *
     * @param {string} optional key
     *
     * @return {string} className
     */
    getClass : function(key){
        var me = this,
            className = me.classPrefix,
            skinName = me.skin;
         if (key) {
             className += '-' + key;
             skinName += '-' + key;
         }
         if (me.skin) {
             className += ' ' + skinName;
         }
         return className;
    },

    getMain : function(){
        return baidu.g(this.mainId);
    },

    getBody : function(){
        return baidu.g(this.getId());
    },

    
    /**
     * 控件类型：如dialog
     */
    uiType : "",
    
    /**
     * 获取调用的字符串的引用前缀
     */
    getCallRef : function(){
        return "window['$BAIDU$']._instances['" + this.guid + "']";
    },

    /**
     * 获取调用的字符串
     */
    getCallString : function(fn){
        var i = 0,
            arg = Array.prototype.slice.call(arguments, 1),
            len = arg.length;
        for (; i < len; i++) {
            if (typeof arg[i] == 'string') {
                arg[i] = "'" + arg[i] +"'";
            }
        }
        //如果被闭包包起来了，用baidu.lang.instance会找到最外面的baidu函数，可能出错
        return this.getCallRef() 
                + '.' + fn + '('
                + arg.join(',') 
                + ');'; 
    },

    /**
     * 添加事件. 避免析构中漏掉注销事件.
     * @param {HTMLElement|string|window} element 目标元素或目标元素id
     * @param {string} type 事件类型
     * @param {Function} listener 需要添加的监听器
     */
    on : function(element, type, listener){
        baidu.on(element, type, listener);
        this.addEventListener("ondispose", function(){
            baidu.un(element, type, listener);
        });
    },

    /**
     * 渲染控件到指定的元素
     * @param {HTMLElement} main optional   要渲染到的元素，可选。
     *                                      如果不传此参数，则会在body下创建一个绝对定位的div做为main
     * @return  {HTMLElement} main 渲染到的元素
     */
    renderMain : function(main){
        var ui = this,
            i = 0,
            len;
        //如果被渲染过就不重复渲染
        if (ui.getMain()) {
            return ;
        }
        main = baidu.g(main);
        //如果没有main元素，创建一个在body下面的div当作main
        if(!main){
            main = document.createElement('div');
            document.body.appendChild(main);
            main.style.position = "absolute";
            //给这个元素创建一个class，方便用户控制
            main.className = ui.getClass("main");
        }
        if(!main.id){
            main.id = ui.getId("main");
        }
        ui.mainId = main.id;
        main.setAttribute('data-guid', ui.guid);

        return main;
    },

    /**
     * 销毁当前实例
     */
    dispose : function(){
        this.dispatchEvent("dispose");
        baidu.lang.Class.prototype.dispose.call(this);
    }
};


/**
 * 操作原生对象的方法
 * @namespace baidu.object
 */
baidu.object = baidu.object || {};


/**
 * 将源对象的所有属性拷贝到目标对象中
 * @author erik
 * @name baidu.object.extend
 * @function
 * @grammar baidu.object.extend(target, source)
 * @param {Object} target 目标对象
 * @param {Object} source 源对象
 * @see baidu.array.merge
 * @remark
 * 
1.目标对象中，与源对象key相同的成员将会被覆盖。<br>
2.源对象的prototype成员不会拷贝。
		
 * @shortcut extend
 * @meta standard
 *             
 * @returns {Object} 目标对象
 */
baidu.extend =
baidu.object.extend = function (target, source) {
    for (var p in source) {
        if (source.hasOwnProperty(p)) {
            target[p] = source[p];
        }
    }
    
    return target;
};

/**
 * 判断目标参数是否为function或Function实例
 * @name baidu.lang.isFunction
 * @function
 * @grammar baidu.lang.isFunction(source)
 * @param {Any} source 目标参数
 * @version 1.2
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 * @meta standard
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isFunction = function (source) {
    // chrome下,'function' == typeof /a/ 为true.
    return '[object Function]' == Object.prototype.toString.call(source);
};


/**
 * 创建一个UI控件类
 * @function
 * @grammar baidu.ui.createUI(constructor, options)
 * @param {Function} constructor ui控件构造器
 * @param {Object} options 选项
 * @return {Object} ui控件
 */
baidu.ui.createUI = function(constructor, options) {
    options = options || {};
    var superClass = options.superClass || baidu.lang.Class,
        lastInherit = superClass == baidu.lang.Class ? 1 : 0,
        i,
        n,
        ui = function(opt, _isInherits){// 创建新类的真构造器函数
            var me = this;
            opt = opt || {};
            // 继承父类的构造器，将isInherits设置成true，在后面不执行render操作
            superClass.call(me, !lastInherit ? opt : (opt.guid || ""), true);

            //扩展静态配置到this上
            baidu.object.extend(me, ui.options);
            //扩展当前options中的项到this上
            baidu.object.extend(me, opt);
            //baidu.object.merge(me, opt, {overwrite:true, recursive:true});

            me.classPrefix = me.classPrefix || "tangram-" + me.uiType.toLowerCase();

            //初始化行为
            //行为就是在控件实例上附加一些属性和方法
            for(i in baidu.ui.behavior){
                //添加行为到控件上
                if(typeof me[i] != 'undefined' && me[i]){
                    baidu.object.extend(me, baidu.ui.behavior[i]);
                    if(baidu.lang.isFunction(me[i])){
                        me.addEventListener("onload", function(){
                            baidu.ui.behavior[i].call(me[i].apply(me));
                        });
                    }else{
                        baidu.ui.behavior[i].call(me);
                    }
                }
            }

            //执行控件自己的构造器
            constructor.apply(me, arguments);

            //执行插件的构造器
            for (i=0, n=ui._addons.length; i<n; i++) {
                ui._addons[i](me);
            }
            if(opt.parent && me.setParent){
                me.setParent(opt.parent);
            }
            if(!_isInherits && opt.autoRender){ 
                me.render(opt.element);
            }
        },
        C = function(){};

    C.prototype = superClass.prototype;

    //继承父类的原型链
    var proto = ui.prototype = new C();

    //继承Base中的方法到prototype中
    for (i in baidu.ui.Base) {
        proto[i] = baidu.ui.Base[i];
    }

    /**
     * 扩展控件的prototype
     * 
     * @param {Object} json 要扩展进prototype的对象
     *
     * @return {Object} 扩展后的对象
     */
    ui.extend = function(json){
        for (i in json) {
            ui.prototype[i] = json[i];
        }
        return ui;  // 这个静态方法也返回类对象本身
    };

    //插件支持
    ui._addons = [];
    ui.register = function(f){
        if (typeof f == "function")
            ui._addons.push(f);
    };
    
    //静态配置支持
    ui.options = {};
    
    return ui;
};

/**
 * 判断目标参数是否为Object对象
 * @name baidu.lang.isObject
 * @function
 * @grammar baidu.lang.isObject(source)
 * @param {Any} source 目标参数
 * @shortcut isObject
 * @meta standard
 * @see baidu.lang.isString,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *             
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isObject = function (source) {
    return 'function' == typeof source || !!(source && 'object' == typeof source);
};

// 声明快捷方法
baidu.isObject = baidu.lang.isObject;


/*
 * 默认情况下，所有在源对象上的属性都会被非递归地合并到目标对象上
 * 并且如果目标对象上已有此属性，不会被覆盖
 */
/**
 * 合并源对象的属性到目标对象。
 *
 * @name baidu.object.merge
 * @function
 * @grammar baidu.object.merge(target, source[, opt_options])
 *
 * @param {Function} target 目标对象.
 * @param {Function} source 源对象.
 * @param {Object} opt_options optional merge选项.
 * @config {boolean} overwrite optional 如果为真，源对象属性会覆盖掉目标对象上的已有属性，默认为假.
 * @config {string[]} whiteList optional 白名单，默认为空，如果存在，只有在这里的属性才会被处理.
 * @config {boolean} recursive optional 是否递归合并对象里面的object，默认为否.
 * @return {object} merge后的object.
 * @see baidu.object.extend
 * @author berg
 */
(function() {
var isPlainObject = function(source) {
        return baidu.lang.isObject(source) && !baidu.lang.isFunction(source);
    };

function mergeItem(target, source, index, overwrite, recursive) {
    if (source.hasOwnProperty(index)) {
        if (recursive && isPlainObject(target[index])) {
            // 如果需要递归覆盖，就递归调用merge
            baidu.object.merge(
                target[index],
                source[index],
                {
                    'overwrite': overwrite,
                    'recursive': recursive
                }
            );
        } else if (overwrite || !(index in target)) {
            // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
            target[index] = source[index];
        }
    }
}

baidu.object.merge = function(target, source, opt_options) {
    var i = 0,
        options = opt_options || {},
        overwrite = options['overwrite'],
        whiteList = options['whiteList'],
        recursive = options['recursive'],
        len;

    // 只处理在白名单中的属性
    if (whiteList && whiteList.length) {
        len = whiteList.length;
        for (; i < len; ++i) {
            mergeItem(target, source, whiteList[i], overwrite, recursive);
        }
    } else {
        for (i in source) {
            mergeItem(target, source, i, overwrite, recursive);
        }
    }

    return target;
};
})();


/**
 * 对页面层面的封装，包括页面的高宽属性、以及外部css和js的动态添加
 * @namespace baidu.page
 */
baidu.page = baidu.page || {};


/**
 * 获取页面视觉区域宽度
 * @name baidu.page.getViewWidth
 * @function
 * @grammar baidu.page.getViewWidth()
 * @see baidu.page.getViewHeight
 *             
 * @returns {number} 页面视觉区域宽度
 */
baidu.page.getViewWidth = function () {
    var doc = document,
        client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

    return client.clientWidth;
};

/**
 * 获取页面视觉区域高度
 * @name baidu.page.getViewHeight
 * @function
 * @grammar baidu.page.getViewHeight()
 * @see baidu.page.getViewWidth
 * @meta standard
 * @returns {number} 页面视觉区域高度
 */
baidu.page.getViewHeight = function () {
    var doc = document,
        client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

    return client.clientHeight;
};

/**
 * 获取横向滚动量
 * @name baidu.page.getScrollLeft
 * @function
 * @grammar baidu.page.getScrollLeft()
 * @see baidu.page.getScrollTop
 *             
 * @returns {number} 横向滚动量
 */
/**
 * 获取横向滚动量
 * 
 * @return {number} 横向滚动量
 */
baidu.page.getScrollLeft = function () {
    var d = document;
    return window.pageXOffset || d.documentElement.scrollLeft || d.body.scrollLeft;
};

/**
 * 获取纵向滚动量
 * @name baidu.page.getScrollTop
 * @function
 * @grammar baidu.page.getScrollTop()
 * @see baidu.page.getScrollLeft
 * @meta standard
 * @returns {number} 纵向滚动量
 */
baidu.page.getScrollTop = function () {
    var d = document;
    return window.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop;
};







/**
 * 提供给setStyle与getStyle使用
 */
baidu.dom._styleFixer = baidu.dom._styleFixer || {};

/**
 * 提供给setStyle与getStyle使用
 */
baidu.dom._styleFilter = baidu.dom._styleFilter || [];



/**
 * 为获取和设置样式的过滤器
 * @private
 * @meta standard
 */
baidu.dom._styleFilter.filter = function (key, value, method) {
    for (var i = 0, filters = baidu.dom._styleFilter, filter; filter = filters[i]; i++) {
        if (filter = filter[method]) {
            value = filter(key, value);
        }
    }

    return value;
};

/**
 * 操作字符串的方法
 * @namespace baidu.string
 */
baidu.string = baidu.string || {};


/**
 * 将目标字符串进行驼峰化处理
 * @name baidu.string.toCamelCase
 * @function
 * @grammar baidu.string.toCamelCase(source)
 * @param {string} source 目标字符串
 * @remark
 * 支持单词以“-_”分隔
 * @meta standard
 *             
 * @returns {string} 驼峰化处理后的字符串
 */
 
 //todo:考虑以后去掉下划线支持？
baidu.string.toCamelCase = function (source) {
    //提前判断，提高getStyle等的效率 thanks xianwei
    if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
        return source;
    }
    return source.replace(/[-_][^-_]/g, function (match) {
        return match.charAt(1).toUpperCase();
    });
};


/**
 * 设置目标元素的style样式值
 * @name baidu.dom.setStyle
 * @function
 * @grammar baidu.dom.setStyle(element, key, value)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string} key 要设置的样式名
 * @param {string} value 要设置的样式值
 * @remark
 * 
            为了精简代码，本模块默认不对任何浏览器返回值进行归一化处理（如使用getStyle时，不同浏览器下可能返回rgb颜色或hex颜色），也不会修复浏览器的bug和差异性（如设置IE的float属性叫styleFloat，firefox则是cssFloat）。<br />
baidu.dom._styleFixer和baidu.dom._styleFilter可以为本模块提供支持。<br />
其中_styleFilter能对颜色和px进行归一化处理，_styleFixer能对display，float，opacity，textOverflow的浏览器兼容性bug进行处理。
		
 * @shortcut setStyle
 * @meta standard
 * @see baidu.dom.getStyle,baidu.dom.setStyles
 *             
 * @returns {HTMLElement} 目标元素
 */
baidu.dom.setStyle = function (element, key, value) {
    var dom = baidu.dom, fixer;
    
    // 放弃了对firefox 0.9的opacity的支持
    element = dom.g(element);
    key = baidu.string.toCamelCase(key);

    if (fixer = dom._styleFilter) {
        value = fixer.filter(key, value, 'set');
    }

    fixer = dom._styleFixer[key];
    (fixer && fixer.set) ? fixer.set(element, value, key) : (element.style[fixer || key] = value);

    return element;
};

// 声明快捷方法
baidu.setStyle = baidu.dom.setStyle;


/**
 * 批量设置目标元素的style样式值
 * @name baidu.dom.setStyles
 * @function
 * @grammar baidu.dom.setStyles(element, styles)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {Object} styles 要设置的样式集合
 * @shortcut setStyles
 * @meta standard
 * @see baidu.dom.setStyle,baidu.dom.getStyle
 *             
 * @returns {HTMLElement} 目标元素
 */
baidu.dom.setStyles = function (element, styles) {
    element = baidu.dom.g(element);

    for (var key in styles) {
        baidu.dom.setStyle(element, key, styles[key]);
    }

    return element;
};

// 声明快捷方法
baidu.setStyles = baidu.dom.setStyles;
/**
 * 提供给setStyle与getStyle使用
 * @meta standard
 */
baidu.dom._styleFilter[baidu.dom._styleFilter.length] = {
    set: function (key, value) {
        if (value.constructor == Number 
            && !/zIndex|fontWeight|opacity|zoom|lineHeight/i.test(key)){
            value = value + "px";
        }

        return value;
    }
};

/**
 * 判断浏览器类型和特性的属性
 * @namespace baidu.browser
 */
baidu.browser = baidu.browser || {};


/**
 * 判断是否为opera浏览器
 * @property opera opera版本号
 * @grammar baidu.browser.opera
 * @meta standard
 * @see baidu.browser.ie,baidu.browser.firefox,baidu.browser.safari,baidu.browser.chrome
 * @returns {Number} opera版本号
 */

/**
 * opera 从10开始不是用opera后面的字符串进行版本的判断
 * 在Browser identification最后添加Version + 数字进行版本标识
 * opera后面的数字保持在9.80不变
 */
baidu.browser.opera = /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(navigator.userAgent) ?  + ( RegExp["\x246"] || RegExp["\x242"] ) : undefined;


/**
 * 在目标元素的指定位置插入HTML代码
 * @name baidu.dom.insertHTML
 * @function
 * @grammar baidu.dom.insertHTML(element, position, html)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string} position 插入html的位置信息，取值为beforeBegin,afterBegin,beforeEnd,afterEnd
 * @param {string} html 要插入的html
 * @remark
 * 
 * 对于position参数，大小写不敏感<br>
 * 参数的意思：beforeBegin&lt;span&gt;afterBegin   this is span! beforeEnd&lt;/span&gt; afterEnd <br />
 * 此外，如果使用本函数插入带有script标签的HTML字符串，script标签对应的脚本将不会被执行。
 * 
 * @shortcut insertHTML
 * @meta standard
 *             
 * @returns {HTMLElement} 目标元素
 */
baidu.dom.insertHTML = function (element, position, html) {
    element = baidu.dom.g(element);
    var range,begin;

    //在opera中insertAdjacentHTML方法实现不标准，如果DOMNodeInserted方法被监听则无法一次插入多element
    //by lixiaopeng @ 2011-8-19
    if (element.insertAdjacentHTML && !baidu.browser.opera) {
        element.insertAdjacentHTML(position, html);
    } else {
        // 这里不做"undefined" != typeof(HTMLElement) && !window.opera判断，其它浏览器将出错？！
        // 但是其实做了判断，其它浏览器下等于这个函数就不能执行了
        range = element.ownerDocument.createRange();
        // FF下range的位置设置错误可能导致创建出来的fragment在插入dom树之后html结构乱掉
        // 改用range.insertNode来插入html, by wenyuxiang @ 2010-12-14.
        position = position.toUpperCase();
        if (position == 'AFTERBEGIN' || position == 'BEFOREEND') {
            range.selectNodeContents(element);
            range.collapse(position == 'AFTERBEGIN');
        } else {
            begin = position == 'BEFOREBEGIN';
            range[begin ? 'setStartBefore' : 'setEndAfter'](element);
            range.collapse(begin);
        }
        range.insertNode(range.createContextualFragment(html));
    }
    return element;
};

baidu.insertHTML = baidu.dom.insertHTML;

//IE 8下，以documentMode为准
//在百度模板中，可能会有$，防止冲突，将$1 写成 \x241
/**
 * 判断是否为ie浏览器
 * @name baidu.browser.ie
 * @field
 * @grammar baidu.browser.ie
 * @returns {Number} IE版本号
 */
baidu.browser.ie = baidu.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;



/**
 * 从DOM树上移除目标元素
 * @name baidu.dom.remove
 * @function
 * @grammar baidu.dom.remove(element)
 * @param {HTMLElement|string} element 需要移除的元素或元素的id
 * @remark
 * <b>注意：</b>对于移除的dom元素，IE下会释放该元素的空间，继续使用该元素的引用进行操作将会引发不可预料的问题。
 * @meta standard
 */
baidu.dom.remove = function (element) {
    element = baidu.dom._g(element);
	var tmpEl = element.parentNode;
    //去掉了对ie下的特殊处理：创建一个div，appendChild，然后div.innerHTML = ""
    tmpEl && tmpEl.removeChild(element);
};


/**
 * 对目标字符串进行格式化
 * @name baidu.string.format
 * @function
 * @grammar baidu.string.format(source, opts)
 * @param {string} source 目标字符串
 * @param {Object|string...} opts 提供相应数据的对象或多个字符串
 * @remark
 * 
opts参数为“Object”时，替换目标字符串中的#{property name}部分。<br>
opts为“string...”时，替换目标字符串中的#{0}、#{1}...部分。
		
 * @shortcut format
 * @meta standard
 *             
 * @returns {string} 格式化后的字符串
 */
baidu.string.format = function (source, opts) {
    source = String(source);
    var data = Array.prototype.slice.call(arguments,1), toString = Object.prototype.toString;
    if(data.length){
	    data = data.length == 1 ? 
	    	/* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
	    	(opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) 
	    	: data;
    	return source.replace(/#\{(.+?)\}/g, function (match, key){
	    	var replacer = data[key];
	    	// chrome 下 typeof /a/ == 'function'
	    	if('[object Function]' == toString.call(replacer)){
	    		replacer = replacer(key);
	    	}
	    	return ('undefined' == typeof replacer ? '' : replacer);
    	});
    }
    return source;
};

// 声明快捷方法
baidu.format = baidu.string.format;


/*
 * popup基类，建立一个popup实例，这个类原则上不对外暴露
 * reference: http://docs.jquery.com/UI/Popup (Popup in jquery)
 */

 /**
 * popup 基类，建立一个popup实例
 * @class
 * @grammar new baidu.ui.Popup(options)
 * @param     {Object}             options               选项
 * @config    {DOMElement}         content               要放到popup中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config    {String}             contentText           popup中的内容
 * @config    {String|Number}      width                 内容区域的宽度。注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config    {String|Number}      height                内容区域的高度
 * @config    {String|Number}      top                   popup距离页面上方的距离
 * @config    {String|Number}      left                  popup距离页面左方的距离
 * @config    {String}             classPrefix           popup样式的前缀
 * @config    {Number}             zIndex                popup的zIndex值
 * @config    {Function}           onopen                popup打开时触发
 * @config    {Function}           onclose               popup关闭时触发
 * @config    {Function}           onbeforeclose         popup关闭前触发，如果此函数返回false，则组织popup关闭。
 * @config    {Function}           onupdate              popup更新内容时触发
 * @config    {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭popup
 * @config    {String}             closeText             closeButton模块提供支持，关闭按钮上的文字
 * @config    {Boolean}            modal                 modal模块支持，是否显示遮罩
 * @config    {String}             modalColor            modal模块支持，遮罩的颜色
 * @config    {Number}             modalOpacity          modal模块支持，遮罩的透明度
 * @config    {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
 * @config    {Boolean}            draggable             draggable模块支持，是否支持拖拽
 * @config    {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
 * @config    {Function}           ondrag                draggable模块支持，拖拽过程中触发
 * @config    {Function}           ondragend             draggable模块支持，拖拽结束时触发
 * @plugin 	  coverable 		   支持背景遮罩
 * @remark
 * @return {baidu.ui.Popup}                                    Popup类
 */

baidu.ui.Popup = baidu.ui.createUI(function (options){
}).extend(
/**
 *  @lends baidu.ui.Popup.prototype
 */
{
    //ui控件的类型，传入给UIBase **必须**
    uiType            : "popup",
   //ui控件的class样式前缀 可选
    //classPrefix     : "tangram-popup-",

    width           : '',
    height          : '',

    top             : 'auto',
    left            : 'auto',
    zIndex          : 1200,//没有做层管理
    //content         : null,//dom节点
    contentText     : '',

    //onopen          : function(){},
    /**
     * @private
     */
    onbeforeclose   : function(){ return true},
    //onclose         : function(){},
    //onupdate        : function(){},


    tplBody          : "<div id='#{id}' class='#{class}' style='position:relative; top:0px; left:0px;'></div>",

    /**
     * 查询当前窗口是否处于显示状态
     * @public
     * @return    {Boolean}       是否处于显示状态
     */
    isShown : function(){
        return baidu.ui.Popup.instances[this.guid] == 'show';
    },

    /**
     * @private
     */
    getString : function(){
        var me = this;
        return baidu.format(
                me.tplBody, {
                    id      : me.getId(),
                    "class" : me.getClass()
                }
            );
    },

    /**
     * render popup到DOM树
     * @private
     */
    render : function(){
        var me = this,
            main;

        //避免重复render
        if(me.getMain()){
            return ;
        }

        main = me.renderMain();
        
        main.innerHTML = me.getString();

        me._update(me);

        baidu.dom.setStyles(me.getMain(), {
            position    : "absolute",
            zIndex      : me.zIndex,
            marginLeft  : "-100000px"
        });
        
        me.dispatchEvent("onload");

        return main;
    },

    /**
     * 显示当前popup
     * @public
     * @param  {Object}             options               选项参数
     * @config {DOMElement}         content               要放到popup中的元素，如果传此参数时同时传contentText，则忽略contentText。
     * @config {String}             contentText           popup中的内容
     * @config {String|Number}      width                 内容区域的宽度。注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
     * @config {String|Number}      height                内容区域的高度
     * @config {String|Number}      top                   popup距离页面上方的距离
     * @config {String|Number}      left                  popup距离页面左方的距离
     * @config {String}             classPrefix           popup样式的前缀
     * @config {Number}             zIndex                popup的zIndex值
     * @config {Function}           onopen                popup打开时触发
     * @config {Function}           onclose               popup关闭时触发
     * @config {Function}           onbeforeclose         popup关闭前触发，如果此函数返回false，则组织popup关闭。
     * @config {Function}           onupdate              popup更新内容时触发
     * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭popup
     * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的文字
     * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
     * @config {String}             modalColor            modal模块支持，遮罩的颜色
     * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
     * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
     * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
     * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
     * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
     * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
     */
    open : function(options){
        var me = this;

        me._update(options);

        me.getMain().style.marginLeft = "auto";
        
        baidu.ui.Popup.instances[me.guid] = "show";

        me.dispatchEvent("onopen");
    },

    /**
     * 隐藏当前popup
     * @public
     */
    close : function(){
        var me = this;
        if(me.dispatchEvent("onbeforeclose")){
            me.getMain().style.marginLeft = "-100000px";
            baidu.ui.Popup.instances[me.guid] = "hide";
            me.dispatchEvent("onclose");
        }
    },
    
    /**
     * 更新popup状态 
     * @public
     * @param  {Object}             options               选项参数
     * @config {DOMElement}         content               要放到popup中的元素，如果传此参数时同时传contentText，则忽略contentText。
     * @config {String}             contentText           popup中的内容
     * @config {String|Number}      width                 内容区域的宽度。注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
     * @config {String|Number}      height                内容区域的高度
     * @config {String|Number}      top                   popup距离页面上方的距离
     * @config {String|Number}      left                  popup距离页面左方的距离
     * @config {String}             classPrefix           popup样式的前缀
     * @config {Number}             zIndex                popup的zIndex值
     * @config {Function}           onopen                popup打开时触发
     * @config {Function}           onclose               popup关闭时触发
     * @config {Function}           onbeforeclose         popup关闭前触发，如果此函数返回false，则组织popup关闭。
     * @config {Function}           onupdate              popup更新内容时触发
     * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭popup
     * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的文字
     * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
     * @config {String}             modalColor            modal模块支持，遮罩的颜色
     * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
     * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
     * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
     * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
     * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
     * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
     *
     */
    update : function(options){
        var me = this;
        me._update(options);
        me.dispatchEvent("onupdate");
    },
   
    _update: function(options){
         options = options || {};                                                                                                                          
         var me = this, contentWrapper = me.getBody();                                                                                                     
                                                                                                                                                           
         //扩展options属性                                                                                                                                 
         baidu.object.extend(me, options);                                                                                                                 
                                                                                                                                                           
         //更新内容                                                                                                                                        
         if(options.content){                                                                                                                              
             //content优先                                                                                                                                 
             if(contentWrapper.firstChild != options.content){                                                                                             
                 contentWrapper.innerHTML = "";                                                                                                            
                 contentWrapper.appendChild(options.content);                                                                                              
             }                                                                                                                                             
         }else if(options.contentText){                                                                                                                    
             //建议popup不要支持text                                                                                                                       
             contentWrapper.innerHTML = options.contentText;                                                                                               
         }                                                                                                                                                 
         me._updateSize();                                                                                                                                 
         me._updatePosition();                                                                                                                             
    },

    /**
     * 更新大小,子类可以通过同名方法覆盖;
     * 默认实现为使用参数的width和height赋值
     */
    //[Interface]
    _updateSize : function(){
        var me = this;
        baidu.dom.setStyles(me.getMain(), { width : me.width, height : me.height});
    },
    /**
     * 更新位置,子类可以通过同名方法覆盖;
     * 默认实现为使用参数的top和left赋值
     */
    //[Interface]
    _updatePosition : function(){
        var me = this;
        baidu.dom.setStyles(me.getMain(), { top : me.top, left : me.left});
    },
    /**
     * 销毁控件
     * @public
     */
    dispose : function(){
        var me = this;
        me.dispatchEvent("ondispose");
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

baidu.ui.Popup.instances = baidu.ui.Popup.instances || [];


/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */


/**
 * @namespace baidu.ui.behavior 为各个控件增加装饰器
 */
baidu.ui.behavior = baidu.ui.behavior || {};

/**
 * 获取目标元素的直接子元素列表
 * @name baidu.dom.children
 * @function
 * @grammar baidu.dom.children(element)
 * @param {HTMLElement|String} element 目标元素或目标元素的id
 * @meta standard
 *             
 * @returns {Array} 目标元素的子元素列表，没有子元素时返回空数组
 */
baidu.dom.children = function (element) {
    element = baidu.dom.g(element);

    for (var children = [], tmpEl = element.firstChild; tmpEl; tmpEl = tmpEl.nextSibling) {
        if (tmpEl.nodeType == 1) {
            children.push(tmpEl);
        }
    }
    
    return children;    
};

/**
 * 将目标元素添加到基准元素之前
 * @name baidu.dom.insertBefore
 * @function
 * @grammar baidu.dom.insertBefore(newElement, existElement)
 * @param {HTMLElement|string} newElement 被添加的目标元素
 * @param {HTMLElement|string} existElement 基准元素
 * @meta standard
 * @see baidu.dom.insertAfter
 *             
 * @returns {HTMLElement} 被添加的目标元素
 */
baidu.dom.insertBefore = function (newElement, existElement) {
    var g, existParent;
    g = baidu.dom._g;
    newElement = g(newElement);
    existElement = g(existElement);
    existParent = existElement.parentNode;

    if (existParent) {
        existParent.insertBefore(newElement, existElement);
    }

    return newElement;
};




/**
 * 获取目标元素所属的document对象
 * @name baidu.dom.getDocument
 * @function
 * @grammar baidu.dom.getDocument(element)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @meta standard
 * @see baidu.dom.getWindow
 *             
 * @returns {HTMLDocument} 目标元素所属的document对象
 */
baidu.dom.getDocument = function (element) {
    element = baidu.dom.g(element);
    return element.nodeType == 9 ? element : element.ownerDocument || element.document;
};


/**
 * 获取目标元素的computed style值。如果元素的样式值不能被浏览器计算，则会返回空字符串（IE）
 *
 * @author berg
 * @name baidu.dom.getComputedStyle
 * @function
 * @grammar baidu.dom.getComputedStyle(element, key)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string} key 要获取的样式名
 *
 * @see baidu.dom.getStyle
 *             
 * @returns {string} 目标元素的computed style值
 */

baidu.dom.getComputedStyle = function(element, key){
    element = baidu.dom._g(element);
    var doc = baidu.dom.getDocument(element),
        styles;
    if (doc.defaultView && doc.defaultView.getComputedStyle) {
        styles = doc.defaultView.getComputedStyle(element, null);
        if (styles) {
            return styles[key] || styles.getPropertyValue(key);
        }
    }
    return ''; 
};

// 20111204 meizz   去掉一个无用的import baidu.browser.ie




/**
 * 获取目标元素的样式值
 * @name baidu.dom.getStyle
 * @function
 * @grammar baidu.dom.getStyle(element, key)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string} key 要获取的样式名
 * @remark
 * 
 * 为了精简代码，本模块默认不对任何浏览器返回值进行归一化处理（如使用getStyle时，不同浏览器下可能返回rgb颜色或hex颜色），也不会修复浏览器的bug和差异性（如设置IE的float属性叫styleFloat，firefox则是cssFloat）。<br />
 * baidu.dom._styleFixer和baidu.dom._styleFilter可以为本模块提供支持。<br />
 * 其中_styleFilter能对颜色和px进行归一化处理，_styleFixer能对display，float，opacity，textOverflow的浏览器兼容性bug进行处理。	
 * @shortcut getStyle
 * @meta standard
 * @see baidu.dom.setStyle,baidu.dom.setStyles, baidu.dom.getComputedStyle
 *             
 * @returns {string} 目标元素的样式值
 */
// TODO
// 1. 无法解决px/em单位统一的问题（IE）
// 2. 无法解决样式值为非数字值的情况（medium等 IE）
baidu.dom.getStyle = function (element, key) {
    var dom = baidu.dom;

    element = dom.g(element);
    key = baidu.string.toCamelCase(key);
    //computed style, then cascaded style, then explicitly set style.
    var value = element.style[key] ||
                (element.currentStyle ? element.currentStyle[key] : "") || 
                dom.getComputedStyle(element, key);

    // 在取不到值的时候，用fixer进行修正
    if (!value || value == 'auto') {
        var fixer = dom._styleFixer[key];
        if(fixer){
            value = fixer.get ? fixer.get(element, key, value) : baidu.dom.getStyle(element, fixer);
        }
    }
    
    /* 检查结果过滤器 */
    if (fixer = dom._styleFilter) {
        value = fixer.filter(key, value, 'get');
    }

    return value;
};

// 声明快捷方法
baidu.getStyle = baidu.dom.getStyle;



/**
 * 判断是否严格标准的渲染模式
 * @property isStrict 
 * @grammar baidu.browser.isStrict
 * @meta standard
 * @returns {Boolean} 布尔值
 */
baidu.browser.isStrict = document.compatMode == "CSS1Compat";



/**
 * 按照border-box模型设置元素的height和width值。只支持元素的padding/border/height/width使用同一种计量单位的情况。<br/> 不支持：<br/> 1. 非数字值(medium)<br/> 2. em/px在不同的属性中混用
 * @name baidu.dom.setBorderBoxSize
 * @author berg
 * @function
 * @grammar baidu.dom.setBorderBoxSize(element, size)
 * @param {HTMLElement|string} element 元素或DOM元素的id
 * @param {object} size 包含height和width键名的对象
 *
 * @see baidu.dom.setBorderBoxWidth, baidu.dom.setBorderBoxHeight
 *
 * @return {HTMLElement}  设置好的元素
 */
baidu.dom.setBorderBoxSize = /**@function*/function (element, size) {
    var result = {};
    size.width && (result.width = parseFloat(size.width));
    size.height && (result.height = parseFloat(size.height));

    function getNumericalStyle(element, name){
        return parseFloat(baidu.getStyle(element, name)) || 0;
    }
    
    if(baidu.browser.isStrict){
        if(size.width){
            result.width = parseFloat(size.width)  -
                           getNumericalStyle(element, 'paddingLeft') - 
                           getNumericalStyle(element, 'paddingRight') - 
                           getNumericalStyle(element, 'borderLeftWidth') -
                           getNumericalStyle(element, 'borderRightWidth');
            result.width < 0 && (result.width = 0);
        }
        if(size.height){
            result.height = parseFloat(size.height) -
                            getNumericalStyle(element, 'paddingTop') - 
                            getNumericalStyle(element, 'paddingBottom') - 
                            getNumericalStyle(element, 'borderTopWidth') - 
                            getNumericalStyle(element, 'borderBottomWidth');
            result.height < 0 && (result.height = 0);
        }
    }
    return baidu.dom.setStyles(element, result);
};


(function(){
    var Coverable = baidu.ui.behavior.coverable = function() {};
    
    Coverable.Coverable_isShowing = false;
    Coverable.Coverable_iframe;
    Coverable.Coverable_container;
    Coverable.Coverable_iframeContainer;

    /**
     * 显示遮罩，当遮罩不存在时创建遮罩
     * @public
     * @return {NULL}
     */
    Coverable.Coverable_show = function(){
        var me = this;
        if(me.Coverable_iframe){
            me.Coverable_update();
            baidu.setStyle(me.Coverable_iframe, 'display', 'block'); 
            return;
        }
        
        var opt = me.coverableOptions || {},
            container = me.Coverable_container = opt.container || me.getMain(),
            opacity = opt.opacity || '0',
            color = opt.color || '',
            iframe = me.Coverable_iframe = document.createElement('iframe'),
            iframeContainer = me.Coverable_iframeContainer = document.createElement('div');

        //append iframe container
        baidu.dom.children(container).length > 0 ?
            baidu.dom.insertBefore(iframeContainer, container.firstChild):
            container.appendChild(iframeContainer);
       
        //setup iframeContainer styles
        baidu.setStyles(iframeContainer, {
            position: 'absolute',
            top: '0px',
            left: '0px'
        });
        baidu.dom.setBorderBoxSize(iframeContainer,{
            width: container.offsetWidth,
            height: container.offsetHeight
        });

        baidu.dom.setBorderBoxSize(iframe,{
            width: iframeContainer.offsetWidth
        });

        baidu.dom.setStyles(iframe,{
            zIndex  : -1,
            display  : "block",
            border: 0,
            backgroundColor: color,
            filter : 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=' + opacity + ')'
        });
        iframeContainer.appendChild(iframe);
        
        iframe.src = "javascript:void(0)";
        iframe.frameBorder = '0';
        iframe.scrolling = 'no';
        iframe.height = '97%';
        me.Coverable_isShowing = true;
    };

    /**
     * 隐藏遮罩
     * @public
     * @return {NULL}
     */
    Coverable.Coverable_hide = function(){
        var me = this,
            iframe = me.Coverable_iframe;
        
        if(!me.Coverable_isShowing){
            return;
        }
        
        baidu.setStyle(iframe, 'display', 'none');
        me.Coverable_isShowing = false;
    };

    /**
     * 更新遮罩
     * @public
     * @param {Object} options
     * @config {Number|String} opacity 透明度
     * @config {String} backgroundColor 背景色
     */
    Coverable.Coverable_update = function(options){
        var me = this,
            options = options || {},
            container = me.Coverable_container,
            iframeContainer = me.Coverable_iframeContainer,
            iframe = me.Coverable_iframe;
  
        baidu.dom.setBorderBoxSize(iframeContainer,{
            width: container.offsetWidth,
            height: container.offsetHeight
        });

        baidu.dom.setBorderBoxSize(iframe,baidu.extend({
            width: baidu.getStyle(iframeContainer, 'width')
        },options));
    };
})();

/**
 * 删除目标字符串两端的空白字符
 * @name baidu.string.trim
 * @function
 * @grammar baidu.string.trim(source)
 * @param {string} source 目标字符串
 * @remark
 * 不支持删除单侧空白字符
 * @shortcut trim
 * @meta standard
 *             
 * @returns {string} 删除两端空白字符后的字符串
 */

(function () {
    var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
    
    baidu.string.trim = function (source) {
        return String(source)
                .replace(trimer, "");
    };
})();

// 声明快捷方法
baidu.trim = baidu.string.trim;


/**
 * 添加多个自定义事件。
 * @grammar obj.addEventListeners(events, fn)
 * @param 	{object}   events       json对象，key为事件名称，value为事件被触发时应该调用的回调函数
 * @param 	{Function} fn	        要挂载的函数
 * @version 1.3
 */
/* addEventListeners("onmyevent,onmyotherevent", fn);
 * addEventListeners({
 *      "onmyevent"         : fn,
 *      "onmyotherevent"    : fn1
 * });
 */
baidu.lang.Class.prototype.addEventListeners = function (events, fn) {
    if(typeof fn == 'undefined'){
        for(var i in events){
            this.addEventListener(i, events[i]);
        }
    }else{
        events = events.split(',');
        var i = 0, len = events.length, event;
        for(; i < len; i++){
            this.addEventListener(baidu.trim(events[i]), fn);
        }
    }
};

/**
 * 支持背景遮罩掩盖select、flash、iframe元素
 * @name baidu.ui.Popup.Popup$coverable
 * @addon baidu.ui.Popup
 */
baidu.extend(baidu.ui.Popup.prototype,{
    coverable: true,
    coverableOptions: {}
});

baidu.ui.Popup.register(function(me){

    if(me.coverable){

        me.addEventListeners("onopen,onload", function(){
            me.Coverable_show();
        });

        me.addEventListener("onclose", function(){
            me.Coverable_hide();
        });

        me.addEventListener("onupdate",function(){
            me.Coverable_update();
        });
    }
});



/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/behavior/statable.js
 * author: berg, lingyu
 * version: 1.0.0
 * date: 2010/09/04
 */

/**
 * 为目标元素添加className
 * @name baidu.dom.addClass
 * @function
 * @grammar baidu.dom.addClass(element, className)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string} className 要添加的className，允许同时添加多个class，中间使用空白符分隔
 * @remark
 * 使用者应保证提供的className合法性，不应包含不合法字符，className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html。
 * @shortcut addClass
 * @meta standard
 * @see baidu.dom.removeClass
 * 	
 * 	            
 * @returns {HTMLElement} 目标元素
 */
baidu.dom.addClass = function (element, className) {
    element = baidu.dom.g(element);
    var classArray = className.split(/\s+/),
        result = element.className,
        classMatch = " " + result + " ",
        i = 0,
        l = classArray.length;

    for (; i < l; i++){
         if ( classMatch.indexOf( " " + classArray[i] + " " ) < 0 ) {
             result += (result ? ' ' : '') + classArray[i];
         }
    }

    element.className = result;
    return element;
};

// 声明快捷方法
baidu.addClass = baidu.dom.addClass;

/**
 * 移除目标元素的className
 * @name baidu.dom.removeClass
 * @function
 * @grammar baidu.dom.removeClass(element, className)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string} className 要移除的className，允许同时移除多个class，中间使用空白符分隔
 * @remark
 * 使用者应保证提供的className合法性，不应包含不合法字符，className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html。
 * @shortcut removeClass
 * @meta standard
 * @see baidu.dom.addClass
 *             
 * @returns {HTMLElement} 目标元素
 */
baidu.dom.removeClass = function (element, className) {
    element = baidu.dom.g(element);

    var oldClasses = element.className.split(/\s+/),
        newClasses = className.split(/\s+/),
        lenOld,
        lenDel = newClasses.length,
        j,
        i = 0;
    //考虑到同时删除多个className的应用场景概率较低,故放弃进一步性能优化 
    // by rocy @1.3.4
    for (; i < lenDel; ++i){
        for(j = 0, lenOld = oldClasses.length; j < lenOld; ++j){
            if(oldClasses[j] == newClasses[i]){
            	oldClasses.splice(j, 1);
            	break;
            }
        }
    }
    element.className = oldClasses.join(' ');
    return element;
};

// 声明快捷方法
baidu.removeClass = baidu.dom.removeClass;

/**
 * 判断元素是否拥有指定的className
 * @name baidu.dom.hasClass
 * @function
 * @grammar baidu.dom.hasClass(element, className)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string} className 要判断的className，可以是用空格拼接的多个className
 * @version 1.2
 * @remark
 * 对于参数className，支持空格分隔的多个className
 * @see baidu.dom.addClass, baidu.dom.removeClass
 * @meta standard
 * @returns {Boolean} 是否拥有指定的className，如果要查询的classname有一个或多个不在元素的className中，返回false
 */
baidu.dom.hasClass = function (element, className) {
    element = baidu.dom.g(element);

    // 对于 textNode 节点来说没有 className
    if(!element || !element.className) return false;

    var classArray = baidu.string.trim(className).split(/\s+/), 
        len = classArray.length;

    className = element.className.split(/\s+/).join(" ");

    while (len--) {
        if(!(new RegExp("(^| )" + classArray[len] + "( |\x24)")).test(className)){
            return false;
        }
    }
    return true;
};

/**
 * 获取事件的触发元素
 * @name baidu.event.getTarget
 * @function
 * @grammar baidu.event.getTarget(event)
 * @param {Event} event 事件对象
 * @meta standard
 * @returns {HTMLElement} 事件的触发元素
 */
 
baidu.event.getTarget = function (event) {
    return event.target || event.srcElement;
};




/**
 * 操作数组的方法
 * @namespace baidu.array
 */

baidu.array = baidu.array || {};


/**
 * 遍历数组中所有元素
 * @name baidu.array.each
 * @function
 * @grammar baidu.array.each(source, iterator[, thisObject])
 * @param {Array} source 需要遍历的数组
 * @param {Function} iterator 对每个数组元素进行调用的函数，该函数有两个参数，第一个为数组元素，第二个为数组索引值，function (item, index)。
 * @param {Object} [thisObject] 函数调用时的this指针，如果没有此参数，默认是当前遍历的数组
 * @remark
 * each方法不支持对Object的遍历,对Object的遍历使用baidu.object.each 。
 * @shortcut each
 * @meta standard
 *             
 * @returns {Array} 遍历的数组
 */
 
baidu.each = baidu.array.forEach = baidu.array.each = function (source, iterator, thisObject) {
    var returnValue, item, i, len = source.length;
    
    if ('function' == typeof iterator) {
        for (i = 0; i < len; i++) {
            item = source[i];
            //TODO
            //此处实现和标准不符合，标准中是这样说的：
            //If a thisObject parameter is provided to forEach, it will be used as the this for each invocation of the callback. If it is not provided, or is null, the global object associated with callback is used instead.
            returnValue = iterator.call(thisObject || source, item, i);
    
            if (returnValue === false) {
                break;
            }
        }
    }
    return source;
};

/**
 * 遍历Object中所有元素，1.1.1增加
 * @name baidu.object.each
 * @function
 * @grammar baidu.object.each(source, iterator)
 * @param {Object} source 需要遍历的Object
 * @param {Function} iterator 对每个Object元素进行调用的函数，function (item, key)
 * @version 1.1.1
 *             
 * @returns {Object} 遍历的Object
 */
baidu.object.each = function (source, iterator) {
    var returnValue, key, item; 
    if ('function' == typeof iterator) {
        for (key in source) {
            if (source.hasOwnProperty(key)) {
                item = source[key];
                returnValue = iterator.call(source, item, key);
        
                if (returnValue === false) {
                    break;
                }
            }
        }
    }
    return source;
};

/**
 * 对方法的操作，解决内存泄露问题
 * @namespace baidu.fn
 */
baidu.fn = baidu.fn || {};




/** 
 * 为对象绑定方法和作用域
 * @name baidu.fn.bind
 * @function
 * @grammar baidu.fn.bind(handler[, obj, args])
 * @param {Function|String} handler 要绑定的函数，或者一个在作用域下可用的函数名
 * @param {Object} obj 执行运行时this，如果不传入则运行时this为函数本身
 * @param {args* 0..n} args 函数执行时附加到执行时函数前面的参数
 * @version 1.3
 *
 * @returns {Function} 封装后的函数
 */
baidu.fn.bind = function(func, scope) {
    var xargs = arguments.length > 2 ? [].slice.call(arguments, 2) : null;
    return function () {
        var fn = baidu.lang.isString(func) ? scope[func] : func,
            args = (xargs) ? xargs.concat([].slice.call(arguments, 0)) : arguments;
        return fn.apply(scope || fn, args);
    };
};



/**
 * 为ui控件添加状态管理行为
 */
(function() {
    var Statable = baidu.ui.behavior.statable = function() {
        var me = this;

        me.addEventListeners('ondisable,onenable', function(event,options) {
            var element, group;
            options = options || {};
            elementId = (options.element || me.getMain()).id;
            group = options.group;

            if (event.type == 'ondisable' && !me.getState(elementId, group)['disabled']) {
        	    me.removeState('press', elementId, group);
        	    me.removeState('hover', elementId, group);
        	    me.setState('disabled', elementId, group);
            }else if (event.type == 'onenable' && me.getState(elementId, group)['disabled']) {
                me.removeState('disabled', elementId, group);
        	}
        });
    };

    //保存实例中所有的状态，格式：group+elementId : {stateA : 1, stateB : 1}
    Statable._states = {};
    //所有可用的状态，调用者通过addState添加
    Statable._allStates = ['hover', 'press', 'disabled'];
    Statable._allEventsName = ['mouseover', 'mouseout', 'mousedown', 'mouseup'];
    Statable._eventsHandler = {
        'mouseover' : function(id, group) {
            var me = this;
            if (!me.getState(id, group)['disabled']) {
                me.setState('hover', id, group);
                return true;
            }
        },
        'mouseout' : function(id, group) {
            var me = this;
            if (!me.getState(id, group)['disabled']) {
                me.removeState('hover', id, group);
                me.removeState('press', id, group);
                return true;
            }
        },
        'mousedown' : function(id, group) {
            var me = this;
            if (!me.getState(id, group)['disabled']) {
                me.setState('press', id, group);
                return true;
            }
        },
        'mouseup' : function(id, group) {
            var me = this;
            if (!me.getState(id, group)['disabled']) {
                me.removeState('press', id, group);
                return true;
            }
        }
    };

    /**
     * 获得状态管理方法的字符串，用于插入元素的HTML字符串的属性部分
     *
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css.
     * @param {string} key optional 索引，在同一类中的索引.
     *
     * @return {string} 元素属性字符串.
     */
    Statable._getStateHandlerString = function(group, key) {
        var me = this,
            i = 0,
            len = me._allEventsName.length,
            ret = [],
            eventType;
        if (typeof group == 'undefined') {
            group = key = '';
        }
        for (; i < len; i++) {
            eventType = me._allEventsName[i];
            ret[i] = 'on' + eventType + '=\"' + me.getCallRef() + "._fireEvent('" + eventType + "', '" + group + "', '" + key + "', event)\"";
        }

        return ret.join(' ');
    };

    /**
     * 触发指定类型的事件
     * @param {string} eventType  事件类型.
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css.
     * @param {string} key 索引，在同一类中的索引.
     * @param {DOMEvent} e DOM原始事件.
     */
    Statable._fireEvent = function(eventType, group, key, e) {
        var me = this,
        	id = me.getId(group + key);
        if (me._eventsHandler[eventType].call(me, id, group)) {
            me.dispatchEvent(eventType, {
                element: id,
                group: group,
                key: key,
                DOMEvent: e
            });
        }
    };

    /**
     * 添加一个可用的状态
     * @param {string} state 要添加的状态.
     * @param {string} eventNam optional DOM事件名称.
     * @param {string} eventHandler optional DOM事件处理函数.
     */
    Statable.addState = function(state, eventName, eventHandler) {
        var me = this;
        me._allStates.push(state);
        if (eventName) {
            me._allEventsName.push(eventName);
            if (!eventHandler) {
                eventHandler = function() {return true;};
            }
            me._eventsHandler[eventName] = eventHandler;
        }
    };

    /**
     * 获得指定索引的元素的状态
     * @param {string} elementId 元素id，默认是main元素id.
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css.
     */
    Statable.getState = function(elementId, group) {
        var me = this,
            _states;
        group = group ? group + '-' : '';
        elementId = elementId ? elementId : me.getId();
        _states = me._states[group + elementId];
        return _states ? _states : {};
    };

    /**
     * 设置指定索的元素的状态
     * @param {string} state 枚举量 in ui._allStates.
     * @param {string} elementId optional 元素id，默认是main元素id.
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css.
     */
    Statable.setState = function(state, elementId, group) {
        var me = this,
            stateId,
            currentState;

        group = group ? group + '-' : '';
        elementId = elementId ? elementId : me.getId();
        stateId = group + elementId;

        me._states[stateId] = me._states[stateId] || {};
        currentState = me._states[stateId][state];
        if (!currentState) {
            me._states[stateId][state] = 1;
            baidu.addClass(elementId, me.getClass(group + state));
        }
    };

    /**
     * 移除指定索引的元素的状态
     * @param {string} state 枚举量 in ui._allStates.
     * @param {string} element optional 元素id，默认是main元素id.
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css.
     */
    Statable.removeState = function(state, elementId, group) {
        var me = this,
            stateId;

        group = group ? group + '-' : '';
        elementId = elementId ? elementId : me.getId();
        stateId = group + elementId;

        if (me._states[stateId]) {
            me._states[stateId][state] = 0;
            baidu.removeClass(elementId, me.getClass(group + state));
        }
    };
})();



//依赖包

/**
 * 设置UI控件的父控件
 * @memberOf baidu.ui.Base.prototype
 * @param {UI} 父控件
 */
baidu.ui.Base.setParent = function(parent){
    var me = this,
        oldParent = me._parent;
    oldParent && oldParent.dispatchEvent("removechild");
    if(parent.dispatchEvent("appendchild", { child : me })){
        me._parent = parent;

        /* 
         * childName名字没有确定，暂时先不加这段代码
         * //如果有childName，skin和classPrefix以父元素为准
         *if(me.childName){
         *    if(parent.skin){
         *        me.skin = parent.skin + '-' + me.childName;
         *    }
         *    if(parent.classPrefix){
         *        me.classPrefix = parent.classPrefix + '-' + me.childName;
         *    }
         *}
         */
    }
};

/**
 * 获取UI控件的父控件
 * @memberOf baidu.ui.Base.prototype
 * @return {UI} 父控件
 */
baidu.ui.Base.getParent = function(){
    return this._parent || null;
};








//声明包


/**
 * button基类，创建一个button实例
 * @name baidu.ui.Button
 * @class
 * @grammar new baidu.ui.Button(options)
 * @param {Object} [options] 选项
 * @config {String}             content     按钮文本信息
 * @config {Boolean}            disabled    按钮是否有效，默认为false（有效）。
 * @config {Function}           onmouseover 鼠标悬停在按钮上时触发
 * @config {Function}           onmousedown 鼠标按下按钮时触发
 * @config {Function}           onmouseup   按钮弹起时触发
 * @config {Function}           onmouseout  鼠标移出按钮时触发
 * @config {Function}           onclick		鼠标点击按钮时触发
 * @config {Function}           onupdate	更新按钮时触发
 * @config {Function}           onload		页面加载时触发
 * @config {Function}           ondisable   当调用button的实例方法disable，使得按钮失效时触发。
 * @config {Function}           onenable    当调用button的实例方法enable，使得按钮有效时触发。
 * @returns {Button}                        Button类
 * @plugin  capture            使按钮支持capture
 * @plugin  poll               使按钮支持poll轮询
 * @remark  创建按钮控件时，会自动为控件加上四种状态的style class，分别为正常情况(tangram-button)、鼠标悬停在按钮上(tangram-button-hover)、鼠标按下按钮时(tangram-button-press)、按钮失效时(tangram-button-disable)，用户可自定义样式。
 */
baidu.ui.Button = baidu.ui.createUI(new Function).extend(
    /**
     *  @lends baidu.ui.Button.prototype
     */
    {
       
    //ui控件的类型，传入给UIBase **必须**
    uiType: 'button',
    //ui控件的class样式前缀 可选
    //classPrefix     : "tangram-button-",
    tplBody: '<div id="#{id}" #{statable} class="#{class}">#{content}</div>',
    disabled: false,
    statable: true,

    /**
     *  获得button的HTML字符串
     *  @private
     *  @return {String} 拼接的字符串
     */
    _getString: function() {
        var me = this;
        return baidu.format(me.tplBody, {
            id: me.getId(),
            statable: me._getStateHandlerString(),
            'class' : me.getClass(),
            content: me.content
        });
    },

    /**
     *  将button绘制到DOM树中。
     *  @param {HTMLElement|String} target  需要渲染到的元素
     */	
    render: function(target) {
        var me = this,
            body;
        me.addState('click', 'click', function(id, group) {
            var me = this;
            if (!me.getState(id, group)['disabled']) {
                return true;
            }
        });
        baidu.dom.insertHTML(me.renderMain(target), 'beforeEnd', me._getString());

        body = baidu.g(target).lastChild;
        if (me.title) {
            body.title = me.title;
        }

        me.disabled && me.setState('disabled');
        me.dispatchEvent('onload');
    },

    /**
     *  判断按钮是否处于失效状态。
     *  @return {Boolean} 是否失效的状态
     */
    isDisabled: function() {
        var me = this,
        	id = me.getId();
        return me.getState()['disabled'];
    },

    /**
     *  销毁实例。
     */
	dispose : function(){
		var me = this,
            body = me.getBody();
        me.dispatchEvent('dispose');
       //删除当前实例上的方法
        baidu.each(me._allEventsName, function(item,index) {
            body['on' + item] = null;
        });
        baidu.dom.remove(body);
		
        me.dispatchEvent('ondispose');
        baidu.lang.Class.prototype.dispose.call(me);
	},

    /**
     * 设置disabled属性
	 */
    disable: function() {
        var me = this,
        body = me.getBody();
        me.dispatchEvent('ondisable', {element: body});
    },

    /**
     * 删除disabled属性
	 */
    enable: function() {
        var me = this;
        body = me.getBody();
        me.dispatchEvent('onenable', {element: body});
    },

    /**
     * 触发button事件
     * @param {String} eventName   要触发的事件名称
     * @param {Object} e           事件event
     */
    fire: function(eventType,e) {
        var me = this, eventType = eventType.toLowerCase();
        if (me.getState()['disabled']) {
            return;
        }
        me._fireEvent(eventType, null, null, e);
    },

    /**
     * 更新button的属性
     * @param {Object}              options     更新button的属性
	 * @config {String}             content     按钮文本信息
	 * @config {Boolean}            disabled    按钮是否有效，默认为false（有效）。
	 * @config {Function}           onmouseover 鼠标悬停在按钮上时触发
	 * @config {Function}           onmousedown 鼠标按下按钮时触发
	 * @config {Function}           onmouseup   按钮弹起时触发
	 * @config {Function}           onmouseout  鼠标移出按钮时触发
	 * @config {Function}           onclick		鼠标点击按钮时触发
	 * @config {Function}           onupdate	更新按钮时触发
	 * @config {Function}           onload		页面加载时触发
	 * @config {Function}           ondisable   当调用button的实例方法disable，使得按钮失效时触发。
	 * @config {Function}           onenable    当调用button的实例方法enable，使得按钮有效时触发。
     * 
     */
    update: function(options) {
        var me = this;
        baidu.extend(me, options);
        options.content && (me.getBody().innerHTML = options.content);

        me.dispatchEvent('onupdate');
    }
});

/**
 * 判断目标参数是否Boolean对象
 * @name baidu.lang.isBoolean
 * @function
 * @grammar baidu.lang.isBoolean(source)
 * @param {Any} source 目标参数
 * @version 1.3
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isElement,baidu.lang.isArray,baidu.lang.isDate
 *             
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isBoolean = function(o) {
    return typeof o === 'boolean';
};

/**
 * 使按钮支持poll轮询，实现在按钮上点击并保持鼠标按着状态时连续激活事件侦听器
 * @name baidu.ui.Button.Button$poll
 * @addon baidu.ui.Button
 * @param   {Object}    options config参数.
 * @config  {Object}    poll 当为true时表示需要使按钮是一个poll的按钮，如果是一个json的描述，可以有两个可选参数：{interval: 100, time: 4}，interval表示轮询的时间间隔，time表示第一次执行和第二执行之间的时间间隔是time*interval毫秒 
 * @author linlingyu
 */
baidu.ui.Button.register(function(me) {
    if (!me.poll) {return;}
    baidu.lang.isBoolean(me.poll) && (me.poll = {});
    me.addEventListener('mousedown', function(evt) {
        var pollIdent = 0,
            interval = me.poll.interval || 100,
            timer = me.poll.time || 0;
        (function() {
            if (me.getState()['press']) {
                pollIdent++ > timer && me.onmousedown && me.onmousedown();
                me.poll.timeOut = setTimeout(arguments.callee, interval);
            }
        })();
    });
    me.addEventListener('dispose', function(){
        if(me.poll.timeOut){
            me.disable();
            window.clearTimeout(me.poll.timeOut);
        }
    });
});

/**
 * 操作日期的方法
 * @namespace baidu.date
 */
baidu.date = baidu.date || {};

/**
 * 操作number的方法
 * @namespace baidu.number
 */
baidu.number = baidu.number || {};


/**
 * 对目标数字进行0补齐处理
 * @name baidu.number.pad
 * @function
 * @grammar baidu.number.pad(source, length)
 * @param {number} source 需要处理的数字
 * @param {number} length 需要输出的长度
 *             
 * @returns {string} 对目标数字进行0补齐处理后的结果
 */
baidu.number.pad = function (source, length) {
    var pre = "",
        negative = (source < 0),
        string = String(Math.abs(source));

    if (string.length < length) {
        pre = (new Array(length - string.length + 1)).join('0');
    }

    return (negative ?  "-" : "") + pre + string;
};


/**
 * 对目标日期对象进行格式化
 * @name baidu.date.format
 * @function
 * @grammar baidu.date.format(source, pattern)
 * @param {Date} source 目标日期对象
 * @param {string} pattern 日期格式化规则
 * @remark
 * 
<b>格式表达式，变量含义：</b><br><br>
hh: 带 0 补齐的两位 12 进制时表示<br>
h: 不带 0 补齐的 12 进制时表示<br>
HH: 带 0 补齐的两位 24 进制时表示<br>
H: 不带 0 补齐的 24 进制时表示<br>
mm: 带 0 补齐两位分表示<br>
m: 不带 0 补齐分表示<br>
ss: 带 0 补齐两位秒表示<br>
s: 不带 0 补齐秒表示<br>
yyyy: 带 0 补齐的四位年表示<br>
yy: 带 0 补齐的两位年表示<br>
MM: 带 0 补齐的两位月表示<br>
M: 不带 0 补齐的月表示<br>
dd: 带 0 补齐的两位日表示<br>
d: 不带 0 补齐的日表示
		
 *             
 * @returns {string} 格式化后的字符串
 */

baidu.date.format = function (source, pattern) {
    if ('string' != typeof pattern) {
        return source.toString();
    }

    function replacer(patternPart, result) {
        pattern = pattern.replace(patternPart, result);
    }
    
    var pad     = baidu.number.pad,
        year    = source.getFullYear(),
        month   = source.getMonth() + 1,
        date2   = source.getDate(),
        hours   = source.getHours(),
        minutes = source.getMinutes(),
        seconds = source.getSeconds();

    replacer(/yyyy/g, pad(year, 4));
    replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
    replacer(/MM/g, pad(month, 2));
    replacer(/M/g, month);
    replacer(/dd/g, pad(date2, 2));
    replacer(/d/g, date2);

    replacer(/HH/g, pad(hours, 2));
    replacer(/H/g, hours);
    replacer(/hh/g, pad(hours % 12, 2));
    replacer(/h/g, hours % 12);
    replacer(/mm/g, pad(minutes, 2));
    replacer(/m/g, minutes);
    replacer(/ss/g, pad(seconds, 2));
    replacer(/s/g, seconds);

    return pattern;
};



/**
 * 查询数组中指定元素的索引位置
 * @name baidu.array.indexOf
 * @function
 * @grammar baidu.array.indexOf(source, match[, fromIndex])
 * @param {Array} source 需要查询的数组
 * @param {Any} match 查询项
 * @param {number} [fromIndex] 查询的起始位索引位置，如果为负数，则从source.length+fromIndex往后开始查找
 * @see baidu.array.find,baidu.array.lastIndexOf
 *             
 * @returns {number} 指定元素的索引位置，查询不到时返回-1
 */
baidu.array.indexOf = function (source, match, fromIndex) {
    var len = source.length,
        iterator = match;
        
    fromIndex = fromIndex | 0;
    if(fromIndex < 0){//小于0
        fromIndex = Math.max(0, len + fromIndex)
    }
    for ( ; fromIndex < len; fromIndex++) {
        if(fromIndex in source && source[fromIndex] === match) {
            return fromIndex;
        }
    }
    
    return -1;
};

/**
 * 判断一个数组中是否有部分元素满足给定条件
 * @name baidu.array.some
 * @function
 * @grammar baidu.array.some(source, iterator[,thisObject])
 * @param {Array} source 需要判断的数组.
 * @param {Function} iterator 判断函数.
 * @param {Object} [thisObject] 函数调用时的this指针，如果没有此参数，默认是当前遍历的数组
 * @return {boolean} 判断结果.
 * @see baidu.array.every
 */
baidu.array.some = function(source, iterator, thisObject) {
    var i = 0,
        len = source.length;
    for (; i < len; i++) {
        if (i in source && iterator.call(thisObject || source, source[i], i)) {
            return true;
        }
    }
    return false;
};

/**
 * 判断目标参数是否为Date对象
 * @name baidu.lang.isDate
 * @function
 * @grammar baidu.lang.isDate(source)
 * @param {Any} source 目标参数
 * @version 1.3
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isBoolean,baidu.lang.isElement
 *             
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isDate = function(o) {
    // return o instanceof Date;
    return {}.toString.call(o) === "[object Date]" && o.toString() !== 'Invalid Date' && !isNaN(o);
};





/**
 * 判断目标参数是否number类型或Number对象
 * @name baidu.lang.isNumber
 * @function
 * @grammar baidu.lang.isNumber(source)
 * @param {Any} source 目标参数
 * @meta standard
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *             
 * @returns {boolean} 类型判断结果
 * @remark 用本函数判断NaN会返回false，尽管在Javascript中是Number类型。
 */
baidu.lang.isNumber = function (source) {
    return '[object Number]' == Object.prototype.toString.call(source) && isFinite(source);
};


/**
 * 提供国际的一些接口
 * @namespace baidu.i18n
 */
baidu.i18n = baidu.i18n || {};
baidu.i18n.cultures = baidu.i18n.cultures || {};


baidu.i18n.cultures['zh-CN'] = baidu.object.extend(baidu.i18n.cultures['zh-CN'] || {}, {
    calendar: {
        dateFormat: 'yyyy-MM-dd',
        titleNames: '#{yyyy}年&nbsp;#{MM}月',
        monthNames: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        dayNames: {mon: '一', tue: '二', wed: '三', thu: '四', fri: '五', sat: '六', sun: '日'}
    },
    
    timeZone: 8,
    whitespace: new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g"),
    
    number: {
        group: ",",
        groupLength: 3,
        decimal: ".",
        positive: "",
        negative: "-",

        _format: function(number, isNegative){
            return baidu.i18n.number._format(number, {
                group: this.group,
                groupLength: this.groupLength,
                decimal: this.decimal,
                symbol: isNegative ? this.negative : this.positive 
            });
        }
    },

    currency: {
        symbol: '￥'  
    },

    language: {
        ok: '确定',
        cancel: '取消',
        signin: '注册',
        signup: '登录'
    }
});

baidu.i18n.currentLocale = baidu.i18n.currentLocale || 'zh-CN';

/**
 * date
 * @name baidu.i18n.date
 * @Object
 * @grammar baidu.i18n.date
 */
baidu.i18n.date = baidu.i18n.date || /**@lends baidu.i18n.date.prototype*/{

    /**
     * 获取某年某个月的天数
     * @grammar baidu.i18n.date.getDaysInMonth(year, month)
     * @param {Number} year 年份.
     * @param {Number} month 月份.
     * @return {Number}
     */
    getDaysInMonth: function(year, month) {
        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (month == 1 && baidu.i18n.date.isLeapYear(year)) {
            return 29;
        }
        return days[month];
    },

    /**
     * 判断传入年份是否时润年
     * @grammar baidu.i18n.date.isLeapYear(year)
     * @param {Number} year 年份.
     * @return {Boolean}
     */
    isLeapYear: function(year) {
        return !(year % 400) || (!(year % 4) && !!(year % 100));
    },

    /**
     * 将传入的date对象转换成指定地区的date对象
     * @grammar baidu.i18n.date.toLocaleDate(dateObject, sLocale, tLocale)
     * @param {Date} dateObject
     * @param {String} sLocale dateObject 的地区标识，可选参数，传则以dateObject中获取的为准
     * @param {String} tLocale 地区名称简写字符.
     * @return {Date}
     */
    toLocaleDate: function(dateObject, sLocale, tLocale) {
        return this._basicDate(dateObject, sLocale, tLocale || baidu.i18n.currentLocale);
    },

    /**
     * 本地日历和格力高利公历相互转换的基础函数
     * @private
     * @param {Date} dateObject 需要转换的日期函数.
     * @param {String} sLocale dateObject 的地区标识，可选参数，否则以dateObject中获取的为准
     * @param {string} tlocale 传入date的地区名称简写字符，不传入则从date中计算得出.
     */
    _basicDate: function(dateObject, sLocale, tLocale) {
        var tTimeZone = baidu.i18n.cultures[tLocale || baidu.i18n.currentLocale].timeZone,
            tTimeOffset = tTimeZone * 60,
            sTimeZone,sTimeOffset,
            millisecond = dateObject.getTime();

        if(sLocale){
            sTimeZone = baidu.i18n.cultures[sLocale].timeZone;
            sTimeOffset = sTimeZone * 60;
        }else{
            sTimeOffset = -1 * dateObject.getTimezoneOffset();
            sTimeZone = sTimeZone / 60;
        }

        return new Date(sTimeZone != tTimeZone ? (millisecond  + (tTimeOffset - sTimeOffset) * 60000) : millisecond);
    }
};


/**
 * 创建一个简单的日历对象
 * @name baidu.ui.Calendar
 * @class
 * @grammar new baidu.ui.Calendar(options)
 * @param {Object} options config参数
 * @config {String} weekStart 定义周的第一天，取值:'Mon'|'Tue'|'Web'|'Thu'|'Fri'|'Sat'|'Sun'，默认值'Sun'
 * @config {Date} initDate 以某个本地日期打开日历，默认值是当前日期
 * @config {Array} highlightDates 设定需要高亮显示的某几个日期或日期区间，格式:[date, {start:date, end:date}, date, date...]
 * @config {Array} disableDates 设定不可使用的某几个日期或日期区间，格式:[date, {start:date, end:date}, date, date...]
 * @config {Object} flipContent 设置翻转月份按钮的内容，格式{prev: '', next: ''}
 * @config {string} language 日历显示的语言，默认为中文 
 * @config {function} onclickdate 当点击某个日期的某天时触发该事件
 * @author linlingyu
 */
baidu.ui.Calendar = baidu.ui.createUI(function(options){
    var me = this;
    me.flipContent = baidu.object.extend({prev: '&lt;', next: '&gt;'},
        me.flipContent);
    me.addEventListener('mouseup', function(evt){
        var ele = evt.element,
            date = me._dates[ele],
            beforeElement = baidu.dom.g(me._currElementId);
        //移除之前的样子
        beforeElement && baidu.dom.removeClass(beforeElement, me.getClass('date-current'));
        me._currElementId = ele;
        me._initDate = date;
        //添加现在的样式
        baidu.dom.addClass(baidu.dom.g(ele), me.getClass('date-current'));
        me.dispatchEvent('clickdate', {date: date});
    });
}).extend(
/**
 *  @lends baidu.ui.Calendar.prototype
 */
{
    uiType: 'calendar',
    weekStart: 'Sun',//定义周的第一天
    statable: true,
    language: 'zh-CN',
    
    tplDOM: '<div id="#{id}" class="#{class}">#{content}</div>',
    tplTable: '<table border="0" cellpadding="0" cellspacing="1" class="#{class}"><thead class="#{headClass}">#{head}</thead><tbody class="#{bodyClass}">#{body}</tbody></table>',
    tplDateCell: '<td id="#{id}" class="#{class}" #{handler}>#{content}</td>',
    tplTitle: '<div id="#{id}" class="#{class}"><div id="#{labelId}" class="#{labelClass}">#{text}</div><div id="#{prevId}" class="#{prevClass}"></div><div id="#{nextId}" class="#{nextClass}"></div></div>',
    
    /**
     * 对initDate, highlight, disableDates, weekStart等参数进行初始化为本地时间
     * @private
     */
    _initialize: function(){
        var me = this;
        function initDate(array){
            var arr = [];
            //格式:[date, {start:date, end:date}, date, date...]
            baidu.array.each(array, function(item){
                arr.push(baidu.lang.isDate(item) ? me._toLocalDate(item)
                    : {start: me._toLocalDate(item.start), end: me._toLocalDate(item.end)});
            });
            return arr;
        }
        me._highlightDates = initDate(me.highlightDates || []);
        me._disableDates = initDate(me.disableDates || []);
        me._initDate = me._toLocalDate(me.initDate || new Date());//这个就是css中的current
        me._currDate = new Date(me._initDate.getTime());//这个是用于随时跳转的决定页面显示什么日历的重要date
        me.weekStart = me.weekStart.toLowerCase();
    },
    
    /**
     * 根据参数取得单个日子的json
     * @param {Date} date 一个日期对象
     * @return 返回格式{id:'', 'class': '', handler:'', date: '', disable:''}
     * @private
     */
    _getDateJson: function(date){
        var me = this,
            guid = baidu.lang.guid(),
            curr = me._currDate,
            css = [],
            disabled;
        function compare(srcDate, compDate){//比较是否同一天
            //不能用毫秒数除以一天毫秒数来比较(2011/1/1 0:0:0 2011/1/1 23:59:59)
            //不能用compDate - srcDate和一天的毫秒数来比较(2011/1/1 12:0:0 2011/1/2/ 0:0:0)
            return srcDate.getDate() == compDate.getDate()
                && Math.abs(srcDate.getTime() - compDate.getTime()) < 24 * 60 * 60 * 1000;
        }
        function contains(array, date){
            var time = date.getTime();
            return baidu.array.some(array, function(item){
                if(baidu.lang.isDate(item)){
                    return compare(item, date);
                }else{
                    return compare(item.start, date)
                        || time > item.start.getTime()
                        && time <= item.end.getTime();
                }
            });
        }
        //设置非本月的日期的css
        date.getMonth() != curr.getMonth() && css.push(me.getClass('date-other'));
        //设置highlight的css
        contains(me._highlightDates, date) && css.push(me.getClass('date-highlight'));
        //设置初始化日期的css
        if(compare(me._initDate, date)){
            css.push(me.getClass('date-current'));
            me._currElementId = me.getId(guid);
        }
        //设置当天的css
        compare(me._toLocalDate(new Date()), date) && css.push(me.getClass('date-today'));
        //设置disabled disabled优先级最高，出现disable将清除上面所有的css运算
        disabled = contains(me._disableDates, date) && (css = []);
        return {
            id: me.getId(guid),
            'class': css.join('\x20'),//\x20－space
            handler: me._getStateHandlerString('', guid),
            date: date,
            disabled: disabled
        };
    },
    
    /**
     * 取得参数日期对象所对月份的天数
     * @param {Number} year 年份
     * @param {Number} month 月份
     * @private
     */
    _getMonthCount: function(year, month){
        var invoke = baidu.i18n.date.getDaysInMonth,
            monthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            count;
        invoke && (count = invoke(year, month));
        if(!baidu.lang.isNumber(count)){
            count = 1 == month && (year % 4)
                && (year % 100 != 0 || year % 400 == 0) ? 29 : monthArr[month];
        }
        return count;
    },
    
    /**
     * 生成日期表格的字符串用于渲染日期表
     * @private
     */
    _getDateTableString: function(){
        var me = this,
            calendar = baidu.i18n.cultures[me.language].calendar,
            dayArr = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],//day index
//            curr = me._currLocalDate,//_currentLocalDate
            curr = me._currDate,
            year = curr.getFullYear(),
            month = curr.getMonth(),
            day = new Date(year, month, 1).getDay(),//取得当前第一天用来计算第一天是星期几，这里不需要转化为本地时间
            weekIndex = 0,//记录wekStart在day数组中的索引
            headArr = [],
            bodyArr = [],
            weekArray = [],
            disabledIds = me._disabledIds = [],
            i = 0,
            j = 0,
            len = dayArr.length,
            count,
            date;
        
        //运算星期标题
        for(; i < len; i++){
            dayArr[i] == me.weekStart && (weekIndex = i);
            (weekIndex > 0 ? headArr : weekArray).push('<td>', calendar.dayNames[dayArr[i]], '</td>');
        }
        headArr = headArr.concat(weekArray);
        headArr.unshift('<tr>');
        headArr.push('</tr>');
        //运算日期
        day = (day < weekIndex ? day + 7 : day) - weekIndex;//当月月初的填补天数
        count = Math.ceil((me._getMonthCount(year, month) + day) / len);
        me._dates = {};//用来存入td对象和date的对应关系在click时通过id取出date对象
        for(i = 0; i < count; i++){
            bodyArr.push('<tr>');
            for(j = 0; j < len; j++){
                date = me._getDateJson(new Date(year, month, i * len + j + 1 - day));//这里也不需要转化为本地时间
                //把被列为disable的日期先存到me._disabledIds中是为了在渲染后调用setState来管理
                me._dates[date.id] = date.date;
                date.disabled && disabledIds.push(date['id']);
                bodyArr.push(baidu.string.format(me.tplDateCell, {
                    id: date['id'],
                    'class': date['class'],
                    handler: date['handler'],
                    content: date['date'].getDate()
                }));
            }
            bodyArr.push('</tr>');
        }
        return baidu.string.format(me.tplTable, {
            'class': me.getClass('table'),
            headClass: me.getClass('week'),
            bodyClass: me.getClass('date'),
            head: headArr.join(''),
            body: bodyArr.join('')
        });
    },
    
    /**
     * 生成日期容器的字符串
     * @private
     */
    getString: function(){
        var me = this;
        return baidu.string.format(me.tplDOM, {
            id: me.getId(),
            'class': me.getClass(),
            content: baidu.string.format(me.tplDOM, {
                id: me.getId('content'),
                'class': me.getClass('content')
            })
        });
    },
    
    /**
     * 将一个非本地化的日期转化为本地化的日期对象
     * @param {Date} date 一个非本地化的日期对象
     * @private
     */
    _toLocalDate: function(date){//很多地方都需要使用到转化，为避免总是需要写一长串i18n特地做成方法吧
        return date ? baidu.i18n.date.toLocaleDate(date, null, this.language)
            : date;
    },
    
    /**
     * 渲染日期表到容器中
     * @private
     */
    _renderDate: function(){
        var me = this;
        baidu.dom.g(me.getId('content')).innerHTML = me._getDateTableString();
        //渲染后对disabled的日期进行setState管理
        baidu.array.each(me._disabledIds, function(item){
            me.setState('disabled', item);
        });
    },
    
    /**
     * 左右翻页跳转月份的基础函数
     * @param {String} pos 方向 prev || next
     * @private
     */
    _basicFlipMonth: function(pos){
        var me = this,
            curr = me._currDate,
            month = curr.getMonth() + (pos == 'prev' ? -1 : 1),
            year = curr.getFullYear() + (month < 0 ? -1 : (month > 11 ? 1 : 0));
        month = month < 0 ? 12 : (month > 11 ? 0 : month);
        curr.setYear(year);
        me.gotoMonth(month);
        me.dispatchEvent(pos + 'month', {date: new Date(curr.getTime())});
    },
    
    /**
     * 渲染日历表的标题说明，如果对标题说明有特列要求，可以覆盖方法来实现
     */
    renderTitle: function(){
        var me = this, prev, next,
            curr = me._currDate,
            calendar = baidu.i18n.cultures[me.language].calendar,
            ele = baidu.dom.g(me.getId('label')),
            txt = baidu.string.format(calendar.titleNames, {
                yyyy: curr.getFullYear(),
                MM: calendar.monthNames[curr.getMonth()],
                dd: curr.getDate()
            });
        if(ele){
            ele.innerHTML = txt;
            return;
        }
        baidu.dom.insertHTML(me.getBody(),
            'afterBegin',
            baidu.string.format(me.tplTitle, {
                id: me.getId('title'),
                'class': me.getClass('title'),
                labelId: me.getId('label'),
                labelClass: me.getClass('label'),
                text: txt,
                prevId: me.getId('prev'),
                prevClass: me.getClass('prev'),
                nextId: me.getId('next'),
                nextClass: me.getClass('next')
            })
        );
        function getOptions(pos){
            return {
                classPrefix: me.classPrefix + '-' + pos + 'btn',
                skin: me.skin ? me.skin + '-' + pos : '',
                content: me.flipContent[pos],
                poll: {time: 4},
                element: me.getId(pos),
                autoRender: true,
                onmousedown: function(){
                    me._basicFlipMonth(pos);
                }
            };
        }
        prev = new baidu.ui.Button(getOptions('prev'));
        next = new baidu.ui.Button(getOptions('next'));
        me.addEventListener('ondispose', function(){
            prev.dispose();
            next.dispose();
        });
    },
    
    /**
     * 渲染日期组件到参数指定的容器中
     * @param {HTMLElement} target 一个用来存放组件的容器对象
     */
    render: function(target){
        var me = this,
            skin = me.skin;
        if(!target || me.getMain()){return;}
        baidu.dom.insertHTML(me.renderMain(target), 'beforeEnd', me.getString());
        me._initialize();
        me.renderTitle();
        me._renderDate();
        baidu.dom.g(me.getId('content')).style.height = 
            (me.getBody().clientHeight || me.getBody().offsetHeight)
            - baidu.dom.g(me.getId('title')).offsetHeight + 'px';
        me.dispatchEvent('onload');
    },
    
    /**
     * 更新日期的参数
     * @param {Object} options 参数，具体请参照构造中的options
     */
    update: function(options){
        var me = this;
        baidu.object.extend(me, options || {});
        me._initialize();
        me.renderTitle();
        me._renderDate();
        me.dispatchEvent('onupdate');
    },
    
    /**
     * 跳转到某一天
     * @param {Date} date 一个非本地化的日期对象
     */
    gotoDate: function(date){
        var me = this;
        me._currDate = me._toLocalDate(date);
        me._initDate = me._toLocalDate(date);
        me.renderTitle();
        me._renderDate();
        me.dispatchEvent('ongotodate');
    },
    
    /**
     * 跳转到某一年
     * @param {Number} year 年份
     */
    gotoYear: function(year){
        var me = this,
            curr = me._currDate,
            month = curr.getMonth(),
            date = curr.getDate(),
            count;
        if(1 == month){//如果是二月份
            count = me._getMonthCount(year, month);
            date > count && curr.setDate(count);
        }
        curr.setFullYear(year);
        me.renderTitle();
        me._renderDate();
        me.dispatchEvent('ongotoyear');
    },
    
    /**
     * 跳转到当前年份的某个月份
     * @param {Number} month 月份，取值(0, 11)
     */
    gotoMonth: function(month){
        var me = this,
            curr = me._currDate,
            month = Math.min(Math.max(month, 0), 11),
            date = curr.getDate(),
            count = me._getMonthCount(curr.getFullYear(), month);
        date > count && curr.setDate(count);
        curr.setMonth(month);
        me.renderTitle();
        me._renderDate();
        me.dispatchEvent('ongotomonth');
    },
    
    /**
     * 取得一个本地化的当天的日期
     * @return {Date} 返回一个本地当天的时间
     */
    getToday: function(){
        return this._toLocalDate(new Date());
    },
    
    /**
     * 返回一个当前选中的当地日期对象
     * @return {Date} 返回一个本地日期对象
     */
    getDate: function(){
        return new Date(this._initDate.getTime());
    },
    
    /**
     * 用一个本地化的日期设置当前的显示日期
     * @param {Date} date 一个当地的日期对象
     */
    setDate: function(date){
        if(baidu.lang.isDate(date)){
            var me = this;
            me._initDate = date;
            me._currDate = date;
        }
    },
    
    /**
     * 翻页到上一个月份，当在年初时会翻到上一年的最后一个月份
     */
    prevMonth: function(){
        this._basicFlipMonth('prev');
    },
    
    /**
     * 翻页到下一个月份，当在年末时会翻到下一年的第一个月份
     */
    nextMonth: function(){
        this._basicFlipMonth('next');
    },
        
    /**
     * 析构函数
     */
    dispose: function(){
        var me = this;
        me.dispatchEvent('dispose');
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});


/**
 * 判断一个元素是否包含另一个元素
 * @name baidu.dom.contains
 * @function
 * @grammar baidu.dom.contains(container, contained)
 * @param {HTMLElement|string} container 包含元素或元素的id
 * @param {HTMLElement|string} contained 被包含元素或元素的id
 * @meta standard
 * @see baidu.dom.intersect
 *             
 * @returns {boolean} contained元素是否被包含于container元素的DOM节点上
 */
baidu.dom.contains = function (container, contained) {

    var g = baidu.dom._g;
    container = g(container);
    contained = g(contained);

    //fixme: 无法处理文本节点的情况(IE)
    return container.contains
        ? container != contained && container.contains(contained)
        : !!(container.compareDocumentPosition(contained) & 16);
};




/**
 * 判断是否为webkit内核
 * @property isWebkit 
 * @grammar baidu.browser.isWebkit
 * @meta standard
 * @see baidu.browser.isGecko
 * @returns {Boolean} 布尔值
 */
baidu.browser.isWebkit = /webkit/i.test(navigator.userAgent);

/**
 * 判断是否为gecko内核
 * @property isGecko 
 * @grammar baidu.browser.isGecko
 * @meta standard
 * @see baidu.browser.isWebkit
 * @returns {Boolean} 布尔值
 */
baidu.browser.isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);



/**
 * 获取目标元素相对于整个文档左上角的位置
 * @name baidu.dom.getPosition
 * @function
 * @grammar baidu.dom.getPosition(element)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @meta standard
 *             
 * @returns {Object} 目标元素的位置，键值为top和left的Object。
 */
baidu.dom.getPosition = function (element) {
    element = baidu.dom.g(element);
    var doc = baidu.dom.getDocument(element), 
        browser = baidu.browser,
        getStyle = baidu.dom.getStyle,
    // Gecko 1.9版本以下用getBoxObjectFor计算位置
    // 但是某些情况下是有bug的
    // 对于这些有bug的情况
    // 使用递归查找的方式
        BUGGY_GECKO_BOX_OBJECT = browser.isGecko > 0 && 
                                 doc.getBoxObjectFor &&
                                 getStyle(element, 'position') == 'absolute' &&
                                 (element.style.top === '' || element.style.left === ''),
        pos = {"left":0,"top":0},
        viewport = (browser.ie && !browser.isStrict) ? doc.body : doc.documentElement,
        parent,
        box;
    
    if(element == viewport){
        return pos;
    }


    if(element.getBoundingClientRect){ // IE and Gecko 1.9+
        
    	//当HTML或者BODY有border width时, 原生的getBoundingClientRect返回值是不符合预期的
    	//考虑到通常情况下 HTML和BODY的border只会设成0px,所以忽略该问题.
        box = element.getBoundingClientRect();

        pos.left = Math.floor(box.left) + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
        pos.top  = Math.floor(box.top)  + Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop);
	    
        // IE会给HTML元素添加一个border，默认是medium（2px）
        // 但是在IE 6 7 的怪异模式下，可以被html { border: 0; } 这条css规则覆盖
        // 在IE7的标准模式下，border永远是2px，这个值通过clientLeft 和 clientTop取得
        // 但是。。。在IE 6 7的怪异模式，如果用户使用css覆盖了默认的medium
        // clientTop和clientLeft不会更新
        pos.left -= doc.documentElement.clientLeft;
        pos.top  -= doc.documentElement.clientTop;
        
        var htmlDom = doc.body,
            // 在这里，不使用element.style.borderLeftWidth，只有computedStyle是可信的
            htmlBorderLeftWidth = parseInt(getStyle(htmlDom, 'borderLeftWidth')),
            htmlBorderTopWidth = parseInt(getStyle(htmlDom, 'borderTopWidth'));
        if(browser.ie && !browser.isStrict){
            pos.left -= isNaN(htmlBorderLeftWidth) ? 2 : htmlBorderLeftWidth;
            pos.top  -= isNaN(htmlBorderTopWidth) ? 2 : htmlBorderTopWidth;
        }
    /*
     * 因为firefox 3.6和4.0在特定页面下(场景待补充)都会出现1px偏移,所以暂时移除该逻辑分支
     * 如果 2.0版本时firefox仍存在问题,该逻辑分支将彻底移除. by rocy 2011-01-20
    } else if (doc.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT){ // gecko 1.9-

        // 1.9以下的Gecko，会忽略ancestors的scroll值
        // https://bugzilla.mozilla.org/show_bug.cgi?id=328881 and
        // https://bugzilla.mozilla.org/show_bug.cgi?id=330619

        box = doc.getBoxObjectFor(element);
        var vpBox = doc.getBoxObjectFor(viewport);
        pos.left = box.screenX - vpBox.screenX;
        pos.top  = box.screenY - vpBox.screenY;
        */
    } else { // safari/opera/firefox
        parent = element;

        do {
            pos.left += parent.offsetLeft;
            pos.top  += parent.offsetTop;
      
            // safari里面，如果遍历到了一个fixed的元素，后面的offset都不准了
            if (browser.isWebkit > 0 && getStyle(parent, 'position') == 'fixed') {
                pos.left += doc.body.scrollLeft;
                pos.top  += doc.body.scrollTop;
                break;
            }
            
            parent = parent.offsetParent;
        } while (parent && parent != element);

        // 对body offsetTop的修正
        if(browser.opera > 0 || (browser.isWebkit > 0 && getStyle(element, 'position') == 'absolute')){
            pos.top  -= doc.body.offsetTop;
        }

        // 计算除了body的scroll
        parent = element.offsetParent;
        while (parent && parent != doc.body) {
            pos.left -= parent.scrollLeft;
            // see https://bugs.opera.com/show_bug.cgi?id=249965
//            if (!b.opera || parent.tagName != 'TR') {
            if (!browser.opera || parent.tagName != 'TR') {
                pos.top -= parent.scrollTop;
            }
            parent = parent.offsetParent;
        }
    }

    return pos;
};






/**
 * 创建一个日历对象绑定于一个input输入域
 * @name baidu.ui.DatePicker
 * @class
 * @grammar new baidu.ui.DatePicker(options)
 * @param {Object} options config参数
 * @config {Number} width 日历组件的宽度
 * @config {Number} height 日历组件的高度
 * @config {String} format 日历组件格式化日历的格式，默认：yyyy-MM-dd
 * @config {Object} popupOptions Picker组件的浮动层由Popup组件渲染，该参数用来设置Popup的属性，具体参考Popup
 * @config {Object} calendarOptions Picker组件的日历由Calendar组件渲染，该参数来用设置Calendar的属性，具体参考Calendar
 * @config {Function} onpick 当选中某个日期时的触发事件
 * @config {String} language 当前语言，默认为中文
 */
baidu.ui.DatePicker = baidu.ui.createUI(function(options){
    var me = this;
    me.format = me.format || baidu.i18n.cultures[me.language].calendar.dateFormat || 'yyyy-MM-dd';
    me.popupOptions = baidu.object.merge(me.popupOptions || {},
        options,
        {overwrite: true, whiteList: ['width', 'height']});
    me.calendarOptions = baidu.object.merge(me.calendarOptions || {},
        options,
        {overwrite: true, whiteList: ['weekStart']});
    me._popup = new baidu.ui.Popup(me.popupOptions);
    me._calendar = new baidu.ui.Calendar(me.calendarOptions);
    me._calendar.addEventListener('clickdate', function(evt){
        me.pick(evt.date);
    });
}).extend(
/**
 *  @lends baidu.ui.DatePicker.prototype
 */
{
    uiType: 'datePicker',

    language: 'zh-CN',
    
    /**
     * 取得从input到得字符按format分析得到的日期对象
     * @private
     */
    _getInputDate: function(){
        var me = this,
            patrn = [/yyyy|yy/, /M{1,2}/, /d{1,2}/],//只支持到年月日的格式化，需要时分秒的请扩展此数组
            key = [],
            val = {},
            count = patrn.length,
            i = 0,
            regExp;
        for(; i < count; i++){
            regExp = patrn[i].exec(me.format);
            key[i] = regExp ? regExp.index : null;
        }
        me.input.value.replace(/\d{1,4}/g, function(mc, index){
            val[index] = mc;
        });
        for(i = 0; i < key.length; i++){
            key[i] = val[key[i]];
            if(!key[i]){return;}
        }
        return new Date(key[0], key[1] - 1, key[2]);//需要时分秒的则扩展参数
    },
    
    /**
     * 鼠标点击的事件侦听器，主要用来隐藏日历
     * @private
     */
    _onMouseDown: function(evt){
        var me = this,
            popup = me._popup,
            target = baidu.event.getTarget(evt);
        if(target.id != me.input.id
            && !baidu.dom.contains(popup.getBody(), target)){
            me.hide();
        }
    },
    
    /**
     * 渲染日期组件到body中并绑定input
     * @param {HTMLElement} target 一个input对象，该input和组件绑定
     */
    render: function(target){
        var me = this,
            focusHandler = baidu.fn.bind('show', me),
            mouseHandler = baidu.fn.bind('_onMouseDown', me),
            keyHandler = baidu.fn.bind('hide', me),
            input = me.input = baidu.dom.g(target),
            popup = me._popup;
        if(me.getMain() || !input){
            return;
        }
        popup.render();
        me._calendar.render(popup.getBody());
        me.on(input, 'focus', focusHandler);
        me.on(input, 'keyup', keyHandler);
        me.on(document, 'click', mouseHandler);
    },
    
    /**
     * 当点击某个日期时执行pick方法来向input写入日期
     * @param {Date} date 将日期写到input中
     */
    pick: function(date){
        var me = this;
        me.input.value = baidu.date.format(date, me.format);
        me.hide();
        me.dispatchEvent('pick');
    },
    
    /**
     * 显示日历
     */
    show: function(){
        var me = this,
            pos = me.input && baidu.dom.getPosition(me.input),
            popup = me._popup,
            calendar = me._calendar,
            doc = document[baidu.browser.isStrict ? 'documentElement' : 'body'],
            inputHeight = me.input.offsetHeight,
            popupHeight = me._popup.getBody().offsetHeight;
        me._calendar.setDate(me._getInputDate() || calendar._toLocalDate(new Date()));
        me._calendar.renderTitle();
        me._calendar._renderDate();
//        me._calendar.update({initDate: me._getInputDate() || calendar._toLocalDate(new Date())});
        pos.top += (pos.top + inputHeight + popupHeight - doc.scrollTop > doc.clientHeight) ? -popupHeight
            : inputHeight;
        me._popup.open(pos);
    },
    
    /**
     * 隐藏日历
     */
    hide: function(){
        this._popup.close();
    },
    
    /**
     * 析构函数
     */
    dispose: function(){
        var me = this;
        me.dispatchEvent('dispose');
        me._calendar.dispose();
        me._popup.dispose();
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
;T.undope=true;
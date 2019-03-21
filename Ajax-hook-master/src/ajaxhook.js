/*
 * author: wendu
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 **/

function hookAjax(proxy) {
    // 保存真正的XMLHttpRequest对象
    window._ahrealxhr = window._ahrealxhr || XMLHttpRequest
    XMLHttpRequest = function() {
        var xhr = new window._ahrealxhr;
        // 直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象
        Object.defineProperty(this, 'xhr', {
            value: xhr
        })
    }

    // 获取 XMLHttpRequest 对象的属性
    var prototype = window._ahrealxhr.prototype;
    for (var attr in prototype) {
        var type = "";
        try {
            type = typeof prototype[attr]
        } catch (e) {}
        if (type === "function") {
            XMLHttpRequest.prototype[attr] = hookfun(attr);
        } else {
            // 给属性提供 getter、setter 方法
            Object.defineProperty(XMLHttpRequest.prototype, attr, {
                get: getFactory(attr),
                set: setFactory(attr),
                enumerable: true
            })
        }
    }

    function getFactory(attr) {
        return function() {
            // 判断对象是否包含特定的自身（非继承）属性
            var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];
            var attrGetterHook = (proxy[attr] || {})["getter"]
            return attrGetterHook && attrGetterHook(v, this) || v
        }
    }

    function setFactory(attr) {
        return function(v) {
            var xhr = this.xhr;
            var that = this;
            var hook = proxy[attr];
            if (typeof hook === "function") {
                xhr[attr] = function() {
                    proxy[attr](that) || v.apply(xhr, arguments);
                }
            } else {
                //If the attribute isn't writeable, generate proxy attribute
                var attrSetterHook = (hook || {})["setter"];
                v = attrSetterHook && attrSetterHook(v, that) || v
                try {
                    xhr[attr] = v;
                } catch (e) {
                    this[attr + "_"] = v;
                }
            }
        }
    }

    function hookfun(fun) {
        return function() {
            var args = [].slice.call(arguments)

            // call() 方法调用一个函数, 其具有一个指定的this值和分别地提供的参数
            // 该方法的作用和 apply() 方法类似，只有一个区别，就是call()方法接受的是若干个参数的列表，而apply()方法接受的是一个包含多个参数的数组
            if (proxy[fun] && proxy[fun].call(this, args, this.xhr)) {
                console.log(1111);
                return;
            }
            return this.xhr[fun].apply(this.xhr, args);
        }
    }
    return window._ahrealxhr;
}


// module.exports = function(ob) {
//     ob.hookAjax = function(proxy) {
//         // 保存真正的XMLHttpRequest对象
//         window._ahrealxhr = window._ahrealxhr || XMLHttpRequest
//         XMLHttpRequest = function() {
//             var xhr = new window._ahrealxhr;
//             // 直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象
//             Object.defineProperty(this, 'xhr', {
//                 value: xhr
//             })
//         }
//
//         // 获取 XMLHttpRequest 对象的属性
//         var prototype = window._ahrealxhr.prototype;
//         for (var attr in prototype) {
//             var type = "";
//             try {
//                 type = typeof prototype[attr]
//             } catch (e) {}
//             if (type === "function") {
//                 XMLHttpRequest.prototype[attr] = hookfun(attr);
//             } else {
//                 // 给属性提供 getter、setter 方法
//                 Object.defineProperty(XMLHttpRequest.prototype, attr, {
//                     get: getFactory(attr),
//                     set: setFactory(attr),
//                     enumerable: true
//                 })
//             }
//         }
//
//         function getFactory(attr) {
//             return function() {
//                 // 判断对象是否包含特定的自身（非继承）属性
//                 var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];
//                 var attrGetterHook = (proxy[attr] || {})["getter"]
//                 return attrGetterHook && attrGetterHook(v, this) || v
//             }
//         }
//
//         function setFactory(attr) {
//             return function(v) {
//                 var xhr = this.xhr;
//                 var that = this;
//                 var hook = proxy[attr];
//                 if (typeof hook === "function") {
//                     xhr[attr] = function() {
//                         proxy[attr](that) || v.apply(xhr, arguments);
//                     }
//                 } else {
//                     //If the attribute isn't writeable, generate proxy attribute
//                     var attrSetterHook = (hook || {})["setter"];
//                     v = attrSetterHook && attrSetterHook(v, that) || v
//                     try {
//                         xhr[attr] = v;
//                     } catch (e) {
//                         this[attr + "_"] = v;
//                     }
//                 }
//             }
//         }
//
//         function hookfun(fun) {
//             return function() {
//                 var args = [].slice.call(arguments)
//                 if (proxy[fun] && proxy[fun].call(this, args, this.xhr)) {
//                     console.log(22222);
//                     return;
//                 }
//                 console.log(33333);
//                 return this.xhr[fun].apply(this.xhr, args);
//             }
//         }
//         return window._ahrealxhr;
//     }
//     ob.unHookAjax = function() {
//         if (window._ahrealxhr) XMLHttpRequest = window._ahrealxhr;
//         window._ahrealxhr = undefined;
//     }
//     //for typescript
//     ob["default"] = ob;
// }

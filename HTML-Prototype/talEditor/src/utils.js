/**
 * Created by Administrator on 2014/10/26.
 */
define([], function () {
    return {
        throttle: function (method, delay, context) {
            clearTimeout(method.tId);
            method.tId = setTimeout(function () {
                context ? method.call(context) : method();
            }, delay);
        },
        trimAll: function (str) {
            return (str || '').replace(/\s/g, '');
        },
        isSpace: function (str) {
            return /^\s*$/.test(str || '')
        }
    };
});

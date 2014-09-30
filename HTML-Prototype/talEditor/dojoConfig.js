//首先，baseUrl用来存储dojo.js存放的跟目录，
//例如dojo.js的路径是“/web/scripts/dojo-1.3/dojo /dojo.js”
//则baseUrl为“/web/scripts/dojo-1.3/dojo/”   
//其次，dojo认为所有不以dojo开始的包都存放在和dojo文件夹相同的目录中，
//因此dojo.require(“some.module”)，是dojo加载文件“/web/scripts/dojo-1.3/some/module.js”，
//也就是说packages的路径设置是相对于dojo.js文件来定位的
(function () {
    var global = this;
    this.dojoConfig = {
        baseUrl: "/talEditor/lib/dojo/",//生产环境时，配置为从域名根路径开始“/”
        locale: "zh",//设置默认语言环境
        modulePaths: {
            "jquery":"../jquery.min",
            "ko": "../ko",
            "doT":"../doT"
        },
        packages: [
            {
                name: "dojo",
                location: "."
            },
            {
                name: "dijit",
                location: "../dijit"
            },
            {
                name: "dojox",
                location: "../dojox"
            },
            {
                name: "doh",
                location: "../util/doh"
            },
            {
                name: "tal",
                location: "../../src"
            }
        ],
        has: {
            "touch": 0
        },
        waitSeconds: 3, //timeout seconds
        cacheBust: 0, //false:use cache
        parseOnLoad: 0,
        //async:1,
        deps: ["dojo/parser"],
        //关于deps中的模块加载完成之后执行
        callback: function (parse) {

        }
    };
})();
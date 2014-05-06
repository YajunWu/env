var express = require('express');
var router = express.Router();
var api = require('../api/index');
//console.log(api);
var httpd = new api.httpd();
httpd.init();

var host = new api.host();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
    console.log(req.body);
    res.jsonp(req.body);
})

//host
router.get('/api/host', function(req, res) {
    host.read(function(err, data) {
        var jsonp = {
            success: !err,
            err: err,
            data: data
        };
        res.jsonp(jsonp);
    })
});
router.post('/api/host', function(req, res) {
    var content = req.body.content;
    host.write(content, function(err) {
        var jsonp = {
            success: !err,
            err: err
        };
    });
});


//vhost

//列表
router.get('/api/vhost', function(req, res) {
    var conf = httpd.getData();
    var objs = [];
    var list = httpd.getList(conf);
    list.forEach(function(item) {
        var obj = httpd.getObj(item);
        objs.push(obj);
    });
    var jsonp = {
        success: true,
        data: objs
    };
    res.jsonp(jsonp);
});



//单个
router.get('/api/vhost/:name', function(req, res) {
    var name = req.params.name;
    var obj = httpd.getItem(name);
    var jsonp = {
        success: true,
        data: obj
    };
    res.jsonp(jsonp);
});

//删除
router.delete('/api/vhost/:name', function(req, res) {
    var name = req.params.name;
    var result = httpd.removeItem(name);
    var jsonp = {
        success: !result,
        data: result
    };
});

//新增
router.post('/api/vhost/', function(req, res) {
    var name = req.body.name;
    var root = req.body.root;
    var proxy = req.body.proxy;
    if(!name) {
        console.log('');
        return;
    }
    if(!root) {
        console.log('');
        return;
    }
    var obj = {
        name: name,
        root: root
    };

    if(proxy) {
        proxy = JSON.parse(proxy);
        obj.proxy = proxy;
    }
    var result = httpd.createVhost(obj);
    var jsonp = {
        success: !result,
        data: result
    };
    res.jsonp(jsonp);
});

//更新
router.put('/api/vhost/:name', function(req, res) {
    var name = req.params.name;
    var conf = httpd.updateItem(name, {
        name: 'laiwang.com',
        root: '/etc/host/',
        proxy: [{
            path: '/',
            proxy: 'http://127.0.0.1:3000/'
        }, {
            path: '/js',
            proxy: 'http://127.0.0.1:3000/js'
        }]
    });
    //TODO:写入文件
    var jsonp = {
        success: true,
        data: conf
    };
    res.jsonp(jsonp);
});

module.exports = router;

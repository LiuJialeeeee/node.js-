// 搭建服务器,与服务端进行通讯
// 导入http模块
const http = require('http');
// 导入数据库模块
const mongoose = require('mongoose');
// 导入系统功能模块url模块
const url = require('url');
// 导入字符串方法
const querystring = require('querystring');

// 创建web服务器
const app = http.createServer();
//连接数据库, 创建用户集合, 向集合中插入文档
//  数据库连接 27017是MongoDB的默认端口
mongoose.connect('mongodb://localhost:27017/playground', { useNewUrlParser: true })
    .then((result) => {
        console.log('数据库连接成功')
    })
    .catch((result) => {
        console.log('数据库连接失败')
    });

//  用户集合规则的创建(集合类的创建)
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    age: {
        type: Number,
        min: 18,
        max: 80
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 18
    },
    email: {
        type: String,
        required: true
    },
    hobbies: [String]
});

//  集合的实例创建
const User = mongoose.model('User', userSchema);
//  创建事件请求,要对服务器的请求有所响应
app.on('request', async(req, res) => {
        //      创建路由器
        //          获取请求方式
        const method = req.method;
        //请求地址
        const { pathname, query } = url.parse(req.url, true);
        if (method == 'GET') {
            //呈现用户列表页面
            if (pathname == '/list') {
                let users = await User.find();

                let list = `<!DOCTYPE html>
            <html lang="cn-">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                <link rel="stylesheet" href="E:\AAAWork_place\github代码&笔记\node.js\node.js-\Node入门笔记\text-demo\css\list.css">
                <style>
                    .list {
                        width: 800px;
                        margin: 40px auto;
                    }
                    
                    .table th,
                    .table td {
                        text-align: center;
                    }
                    
                    .btn-success,
                    .btn-danger {
                        padding: 0 2px;
                        overflow: hidden;
                        width: 40px!important;
                        height: 20px!important;
                        font-size: 3px!important;
                        text-align: center;
                        line-height: 10px!important;
                    }
                    .btn-primary {
                        margin-bottum: 10px!important;
                    }
                    .btden {
                        display: inline-block!important;
                    }
                </style>
            </head>
            
            <body>
                <div class="list">
                <a href="/add" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">添加用户</a>

                    <table>
                        <table class="table">
                            <thead class="thead-dark">
                                <tr>
                                    <th scope="col">用户名</th>
                                    <th scope="col">年龄</th>
                                    <th scope="col">爱好</th>
                                    <th scope="col">邮箱</th>
                                    <th scope="col">操作</th>
                                </tr>
                            </thead>
                            <tbody>`;
                users.forEach(item => {
                    list += `<tr>
                        <th scope="row">${item.name}</th>
                        <td>${item.age}</td>
                        <td>`
                    item.hobbies.forEach(hob => {
                        list += `<span>${hob}</span>`

                    })
                    list += `
                        </td>
                        <td>${item.email}</td>
                        <td>
                            <a class = "btden" href = "/modify?id=${item._id}" ><button type="button" class="btn btn-success">修改</button></a>
                            <a class = "btden" href = "/remove?id=${item._id}" ><button type="button" class="btn btn-danger">删除</button></a>
                        </td>
                    </tr>`;
                });
                list += `</tbody>
                        </table>
                    </table>
                    </div>
                </body>

                </html>`;
                res.end(list);
            } else if (pathname == '/add') {
                let add = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <style>
        main {
            width: 500px;
            margin: 20px auto;
        }
        
        .hobby {
            display: inline-block;
            padding: 2px 20px 2px 0;
            line-height: 22px;
        }
    </style>
</head>

<body>
    <main>
        <form method ="post" action = "/add">
            <div class="form-group">
                <label for="exampleInputEmail1">用户名</label>
                <input name ="name" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="请填写用户名">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">密码</label>
                <input name ="password"type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">年龄</label>
                <input name ="age"type="text" class="form-control" id="exampleInputPassword1">
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">邮箱</label>
                <input name ="email" type="email" class="form-control" id="exampleInputPassword1" placeholder="User@163.com">
            </div> 
            <div class="form-group form-check">
                    <label class="form-check-label" for="exampleCheck1"><input name ="hobbies" value = "足球" type="checkbox" class="form-check-input">足球</label>
                    <label class="form-check-label" for="exampleCheck1"><input name ="hobbies" value = "篮球" type="checkbox" class="form-check-input">篮球</label></div>
                    <label class="form-check-label" for="exampleCheck1"><input name ="hobbies" value = "橄榄球" type="checkbox" class="form-check-input">橄榄球</label>
                    <label class="form-check-label" for="exampleCheck1"><input name ="hobbies" value = "抽烟" type="checkbox" class="form-check-input">抽烟</label>
                    <label class="form-check-label" for="exampleCheck1"><input name ="hobbies" value = "烫头" type="checkbox" class="form-check-input">喝酒</label> 
                    <label class="form-check-label" for="exampleCheck1"><input name ="hobbies" value = "烫头" type="checkbox" class="form-check-input">烫头</label>
                    <label class="form-check-label" for="exampleCheck1"><input name ="hobbies" value = "敲代码" type="checkbox" class="form-check-input">敲代码</label>
                    <label class="form-check-label" for="exampleCheck1"><input name ="hobbies" value = "放屁" type="checkbox" class="form-check-input" >放屁</label>
            </div> 
            <button type="submit" class="btn btn-primary">添加用户</button>
        </form>
    </main>
</body>

</html>`
                res.end(add);
            } else if (pathname == '/modify') {
                let user = await User.findOne({ _id: query.id });
                let hobbies = ['足球', '篮球', '橄榄球', '抽烟', '喝酒', '烫头', '敲代码', '放屁']
                let modify = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <style>
        main {
            width: 500px;
            margin: 20px auto;
        }
        
        .hobby {
            display: inline-block;
            padding: 2px 20px 2px 0;
            line-height: 22px;
        }
    </style>
</head>

<body>
    <main>
        <form method ="post" action = "/modify?id=${user._id}">
            <div class="form-group">
                <label for="exampleInputEmail1">用户名</label>
                <input value = '${user.name}' name ="name" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="请填写用户名">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">密码</label>
                <input value = '${user.password}' name ="password"type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">年龄</label>
                <input value = '${user.age}' name ="age"type="text" class="form-control" id="exampleInputPassword1">
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">邮箱</label>
                <input value = '${user.email}' name ="email" type="email" class="form-control" id="exampleInputPassword1" placeholder="User@163.com">
            </div> 
            <div class="form-group form-check">`

                for (let i = 0; i < (hobbies.length - 1); i++) {

                    if (hobbies[i] == user.hobbies[i]) {
                        modify += `<label class="form-check-label" for="exampleCheck1"><input checked="checked" name ="hobbies" value = '${hobbies[i]}' type="checkbox" class="form-check-input">${hobbies[i]}</label>`;
                    } else {
                        modify += `<label class="form-check-label" for="exampleCheck1"><input name ="hobbies" value = '${hobbies[i]}' type="checkbox" class="form-check-input">${hobbies[i]}</label>`;
                    }
                }
                modify += ` 
                                    </div>
                                    <button type="submit" class="btn btn-primary">修改用户</button>
                                    </form>
                                    </main>
    </body>

</html>`;
                res.end(modify);


            } else if (pathname == '/remove') {
                await User.findOneAndDelete({ _id: query.id });
                res.writeHead(301, {
                    'Location': '/list'
                })

                res.end();
            }
        } else if (method == 'POST') {
            // 用户添加功能
            if (pathname == '/add') {
                // 接收用户提交的信息
                let formData = '';
                req.on('data', param => {
                    formData += param;

                });
                req.on('end', async() => {
                    let user = querystring.parse(formData);
                    await User.create(user);
                    // 301代表重定向
                    // location代表跳转的地址
                    res.writeHead(301, {
                        'Location': '/list'
                    });
                    res.end();
                })
            } else if (pathname == '/modify') {
                // 接收用户提交的信息
                let formData = '';
                req.on('data', param => {
                    formData += param;
                });
                req.on('end', async() => {
                    let user = querystring.parse(formData);
                    await User.updateOne({ _id: query.id }, user);
                    // 301代表重定向
                    // location代表跳转的地址
                    res.writeHead(301, {
                        'Location': '/list'
                    });
                    res.end();
                })
            }
        }
    })
    //  监听端口
app.listen(3000);

// 当用户访问/list时, 将所有用户信息查询出来


//  呈现用户列表页面
//  从数据库中查询数据返回给用户

// 将用户信息和表格HTML进行拼接并将拼接结果响应回客户端
// 当用户访问/add时, 呈现表单页面,并实现添加用户信息功能
// 当用户访问/modify时,呈现修改页面, 并实现修改用户信息功能
// 当用户访问/delete时,实现用户删除功能
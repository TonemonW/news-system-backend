const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// 中间件：解析 JSON 请求体
app.use(express.json());

// 函数：从 db.json 中读取数据
function getData() {
    const data = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf-8');
    return JSON.parse(data);
}

// 函数：写入数据到 db.json
function writeData(newData) {
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(newData, null, 2));
}

// 通用的 GET 路由处理函数
function createGetRoute(resource) {
    return (req, res) => {
        const data = getData();
        res.json(data[resource]);
    };
}

// 通用的 POST 路由处理函数
function createPostRoute(resource) {
    return (req, res) => {
        const data = getData();
        const newItem = req.body;
        data[resource].push(newItem);
        writeData(data);
        res.json({ message: `${resource} added successfully` });
    };
}

// 定义需要处理的资源列表
const resources = ['categories', 'children', 'news', 'regions', 'rights', 'roles', 'users'];

// 为每个资源动态创建 GET 和 POST 路由
resources.forEach(resource => {
    app.get(`/${resource}`, createGetRoute(resource));
    app.post(`/${resource}`, createPostRoute(resource));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

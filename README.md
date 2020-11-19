# MongoDB

## [MongoDB下载、安装、配置、使用，系列文档](https://blog.csdn.net/muguli2008/article/details/80591256)



#### 启动指定的MongoDB服务

```dos
mongod --dbpath D:\node\mydb
```

注：--dbpath 是指定数据库存放目录，要注意dbpath前有两个英文状态的中划线 -！

启动后在浏览器中打开 http://localhost:27017

出现如下提示，就表示mongodb服务已成功启动啦！ 

It looks like you are trying to access MongoDB over HTTP on the native driver port. 

看起来您正在尝试通过本机驱动程序端口上的HTTP访问MongoDB。



## MongoDB原⽣驱动

#### 安装

```dos
npm install mongodb
```

#### 连接mongodb实例：

```js
(async () => {
    const { MongoClient } = require('mongodb');

    // 创建客户端
    const client = new MongoClient('mongodb://localhost:27017', {
        userNewUrlParser: true//userNewUrlParser这个属性会在url⾥识别验证⽤户所需的db
    });

    // 创建连接
    let ret = await client.connect();
    console.log('ret:', ret);

    const db = client.db('test');

    const fruits = db.collection('fruits');

    // 添加⽂档
    ret = await fruits.insertOne({
        name: '芒果',
        price: 20.1
    });

    console.log('插⼊成功', JSON.stringify(ret));

    // 查询⽂档
    ret = await fruits.findOne();
    console.log('查询⽂档:', ret);

    // 更新⽂档 (更新的操作符 $set)
    ret = await fruits.updateOne({ name: '芒果' }, { $set: { name: '苹果' } });

    console.log('更新⽂档', JSON.stringify(ret.result));

    // 删除⽂档
    ret = await fruits.deleteOne({ name: '苹果' });

    await fruits.deleteMany();

    client.close();

})();
```



# ODM - Mongoose 

> 概述：优雅的NodeJS对象⽂档模型object document model。
>
> Mongoose有两个特点： 通过关系型数据库的思想来设计⾮关系型数据库 基于mongodb驱动，简化操作。

#### 安装

```dos
npm install mongoose
```



# MongoDB管理界面

## MongoDB Compass 

> MongoDB Compass 是一个图形界面管理工具，我们可以在后面自己到官网下载安装。

#### 下载

下载地址：[https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)

#### 安装

下载完成后根据安装提示安装即可

## mongo-express

> mongo-express 是使用Node.js，Express和Bootstrap3编写的**基于Web的MongoDB管理界面**！

Npm地址：[https://www.npmjs.com/package/mongo-express](https://www.npmjs.com/package/mongo-express)

GitHub地址：[https://github.com/mongo-express/mongo-express](https://github.com/mongo-express/mongo-express)

#### 下载和安装

```dos
npm install -g mongo-express
```



## adminMongo

> 也是MongoDB的Admin Web管理界面，使用NodeJS编写。adminMongo同时可以通过Electron构建为Windows、macOS、Linux下的本地应用。
>
> adminMongo是一个跨平台用户界面（GUI），用于处理您的所有MongoDB连接/数据库需求。 adminMongo具有完全响应能力，应该可以在多种设备上运行。
>
> 注：adminMongo连接信息（包括用户名/密码）未加密地存储在配置文件中，不建议在没有适当安全性考虑的情况下在生产或面向公众的服务器上运行此应用程序。

Npm地址：[https://www.npmjs.com/package/admin-mongo](https://www.npmjs.com/package/admin-mongo)

GitHub地址：[https://github.com/mrvautin/adminMongo](https://github.com/mrvautin/adminMongo)


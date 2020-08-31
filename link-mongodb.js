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
# MongoDB复制集

## [MongoDB下载、安装、配置、使用，系列文档](https://blog.csdn.net/muguli2008/article/details/80591256)

### 为什么要用复制集

> 为了保证数据的安全，推荐使用复制集的方式来存储数据，一般复制集节点数至少要有3个，就相当于有3个MongoDB数据库，一主两从，这样一来，即便是当主节点宕机了，其他的从节点通过投票选举（所以，一般复制集节点数量不能是偶数，不然就会出现评局的状态），选出一个新的主节点出来继续工作，而且数据也不会丢失！！



### 在windows系统下搭建MongoDB复制集

#### 1、新建MongoDB复制集节点目录，如：在D盘下的MongoDB目录下，新建3个文件夹，分别命名为：db1，db2，db3 用于存放复制集节点

#### 2、分别在db1，db2，db3这3个文件夹中新建一个文件命名为：mongod.conf 内容如下：

```python
# mongod.conf 文件
systemLog:
    destination: file
    path: D:\MongoDB\db1\mongod.log   # 设置日志文件存放路径
    logAppend: true

storage:
    dbPath: D:\MongoDB\db1   # 数据存储目录

net:
    bindIp: 0.0.0.0     # 数据库地址：0.0.0.0 表示所有
    port: 28017     # 数据库端口号

replication:
    replSetName: rs0    # 复制集节点名称
```

注： 

	* path 和 dbPath 配置项中的路径一定要和当前所有的目录名对应！如：db1，db2，db3
	* port 数据库端口号也不能重复！如：28017，28018，28019

如：db2目录下的mongod.conf 内容如下

```python
# mongod.conf 文件
systemLog:
    destination: file
    path: D:\MongoDB\db2\mongod.log   # 设置日志文件存放路径
    logAppend: true

storage:
    dbPath: D:\MongoDB\db2   # 数据存储目录

net:
    bindIp: 0.0.0.0     # 数据库地址：0.0.0.0 表示所有
    port: 28018     # 数据库端口号

replication:
    replSetName: rs0    # 复制集节点名称
```



#### 3、启动复制集节点

注：由于windows系统不支持fork，以所要分别用不同的命令窗口来启动，如这里有3个复制集节点，所有就要开3个命令窗口来打开，这样就会启动3个mongodb进程，并且启动后不能关闭该命令窗口，否则进程也会随之结束！！

``` js
# 命令窗口1
mongod -f D:\MongoDB\db1\mongod.conf

# 命令窗口2
mongod -f D:\MongoDB\db2\mongod.conf

# 命令窗口3
mongod -f D:\MongoDB\db3\mongod.conf
```

通过以上命令启动好3个复制集节点后，可以在命令窗口中查看，mongodb的进程情况

```javascript
ps mongo
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

#### 4、关联复制集节点

​		上面虽然创建了3个复制集节点，但它们之间还没有任何关系，还是相互独立的，所以要将们关联起来，当有数据入后3个节点都会有数据，这样一来，即便是当主节点宕机了，其他的从节点通过投票选举（所以，一般复制集节点数量不能是偶数，不然就会出现评局的状态），选出一个新的主节点出来继续工作，而且数据也不会丢失！！

1. 再新开一个命令窗口操作，在windows系统中查看当前hostname 主机名

   ```js
   hostname
   
   # MuGuiLin //这是我在windows系统中查看当前hostname 主机名
   ```

   注：如果各个复制集节点之间不是在同一台服务器上(当然推荐分开部署，这里为了演示所以就在一台电脑上)，就需要对应的服务器IP 或域名

   

2. 然后进入28017节点

   ```js
   mongo localhost:28017
   ```

   

3. 设置复制集主节点，在没有设置复制集主节点之前，各个节点都是一样平级的，但一般情况下，我们都将第1个端口号的节点做为主节点！

   ```js
   rs.initiate()
   
   # 执行以上命令后就进入复制集节点状态了
   rs0:SECONDARY> 回车 // 默认是从节点状态，按回车键可切换到主节点状态
   
   rs0:PRIMARY>
   
   ```

   

4. 查看复制集节点

   ```js
   rs0:PRIMARY>rs.status()
   
   # 通过以上命令可以查看复制集节点的相关信息，其中"members"：[...] 数组中就是各个节点的信息，由于还没有关联其他的节点，所以现在只有一个
   ```

   

5. 分别关联端口为28018 和 28019 的这两个复制集节点

   ```js
   rs0:PRIMARY>rs.add("MuGuiLin:28018")
   rs0:PRIMARY>rs.add("MuGuiLin:28019")
   
   # 执行以上命令后，再查看复制集节点，在"members"：[] 数组中应该就有3个节点信息了
   rs0:PRIMARY>rs.status()
   ```

到此复制集节点的关联工作就完成了，



#### 5、查看从节点是否正常

1. 先在**28017主节点**上插入一条数据

   ```js
   # 进入28017节点
   mongo localhost:28017
   
   # 查看所以数据库
   rs0:SECONDARY>show dbs
   
   # 向test数据库中的test集合插一个条数据
   rs0:SECONDARY>db.test.insert({name: "OK 666 MongoDB 数据库 复制集"})
   
   # 查看当前数据库下的所有集合
   rs0:SECONDARY>show collections
   
   # 查看test集合中的所有数据
   rs0:SECONDARY>db.test.find().pretty()
   ```

   

2. 在从节点28018 或 28019中查看是否有数据同步过来

   ```js
   # 进入28019节点
   mongo localhost:28019
   
   # 开启从节点读的权限，默认情况下，从节点是不能读取的，所以要开启读的权限rs.slaveOk()
   rs0:SECONDARY> rs.slaveOk()
   
   # 查看test集合中的所有数据
   rs0:SECONDARY>db.test.find().pretty()
   
   // 如果能够正常显示在主节点28017上插入的数据，就表示数据已经同步过来啦！！！
   # 由于所有点节点都是在同一个电脑上或在同一个局域网内的，节点之间的数据同步速度是非常快的，一般在10ms内就能同步完成，如果是跨区域的、或是在不同的数据中心的，会受物理条件的影响，同频时间可能会延时长一点！！
   ```

   
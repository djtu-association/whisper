# Whispers 自述文件
## 目录

## Whispers是什么？
Whispers是[iCollege](https://42.96.195.83/guanggu/icollege)项目的即时通信模块。  
她通过已有的RESTful API与服务器响应，同时保证与相应移动端应用（App）保持即时通信连接，  
目的则是允许用户在信赖的网络环境中进行安全流畅的单/多人即时通信。
## 更新日志

**警告：目前项目处于早期版本。这意味着该程序可能无法按照您的预期工作。  
  如果有任何问题，请在[这里](https://42.96.195.83/association/whispers/issues)提出。**
  
***

* 2015/5/14 盘古开天  
    > 天气蒙鸿，萌芽兹始，遂分天地，肇立乾坤，启阴感阳，分布元气，乃孕中和，是为人也。首生盘古。  
      垂死化身。气成风云。声为雷霆。左眼为日。右眼为月。四肢五体为四极五岳。血液为江河。筋脉为地里。  
      肌肉为田土。发为星辰。皮肤为草木。齿骨为金石。精髓为珠玉。汗流为雨泽。身之诸虫。因风所感。化为黎甿。  
      -- 《三五历纪》 徐整
      
    * **由于项目仍然处于早期版本，使用过程中会出现大量的调试输出。**
    * 项目结构及基本启动代码完成。([01d10efd](https://42.96.195.83/association/whispers/commit/01d10efdaec7724b394b8ad3d297db547bbe0eed))  

## 即将到来
**警告：在这里出现的内容将在以后版本中出现。  
但是我们无法承诺每一个特性的可用时间。  
您可以通过每一条信息末尾的commit编号来找到具体的实现版本。**  

* 去除多余的调试信息。  
* 建立完整的错误/提示回报机制  
* 由于本项目不再需要某些机制，我们正在考虑放弃使用express而改用dnode。  

## 我该怎样……
### 安装
#### 首先
本项目需要0.12版本的Node.js引擎。  
为了您的服务器安全，我们建议您从[Node.js](http://www.nodejs.org/)官方网站下载对应版本。  

本项目的一些依赖需要使用Python 2.7（或以上版本）和Microsoft Visual C++ 2012（或以上版本，Windows环境下）。  
为了您的服务器安全，同样建议您从Python官方网站下载对应版本。

根据您所在国家/地区的网络或政策限制，您可能需要使用镜像NPM和/或特殊网络环境来安装相关依赖。  
#### 作为依赖
本项目暂时还没有提交至NPM。
#### 独立安装
在项目目录下执行  
```npm install```
## 鸣谢

> 如果我比别人看得更远，那是因为我站在巨人的肩膀上。  
  -- 艾萨克·牛顿

### 项目所用技术及依赖开发者

#### 技术与依赖（NPM依赖名，按字母表顺序）
[bluebird](https://github.com/bluebird), 
[bower](http://bower.io/), 
[bytes](https://github.com/visionmedia/bytes.js), 
[colors](https://github.com/Marak/colors.js), 
[express](http://expressjs.com/), 
[grunt](http://gruntjs.com/), 
[lodash](https://lodash.com/), 
[method-override](https://github.com/expressjs/method-override), 
[morgan](https://github.com/expressjs/morgan), 
[node.js](https://nodejs.org/), 
[nodestalker](https://github.com/pascalopitz/nodestalker), 
[semver](https://github.com/npm/node-semver), 
[serve-favicon](https://github.com/expressjs/serve-favicon), 
[socket.io](http://socket.io/), 
[unidecode](https://github.com/FGRibreau/node-unidecode), 
[validator](https://github.com/chriso/validator.js)    
#### 曾经使用的技术与依赖
### 项目团队以外的贡献者
### 以及积极提供反馈的各位用户
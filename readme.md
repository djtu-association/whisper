# whisper 自述文件
[English](#2)
## 目录

## whisper是什么？
whisper是[iCollege](https://42.96.195.83/guanggu/icollege)项目的即时通信模块。  
她通过已有的RESTful API与服务器响应，同时保证与相应移动端应用（App）保持即时通信连接，  
目的则是允许用户在信赖的网络环境中进行安全流畅的单/多人即时通信。
## 更新日志

**警告：目前项目处于早期版本。这意味着该程序可能无法按照您的预期工作。  
  如果有任何问题，请在[这里](https://42.96.195.83/association/whisper/issues)提出。**
  
***

* 2015/5/14 盘古开天  
    > 天气蒙鸿，萌芽兹始，遂分天地，肇立乾坤，启阴感阳，分布元气，乃孕中和，是为人也。首生盘古。  
      垂死化身。气成风云。声为雷霆。左眼为日。右眼为月。四肢五体为四极五岳。血液为江河。筋脉为地里。  
      肌肉为田土。发为星辰。皮肤为草木。齿骨为金石。精髓为珠玉。汗流为雨泽。身之诸虫。因风所感。化为黎甿。  
      -- 《三五历纪》 徐整
      
    * 项目结构及基本启动代码完成。([01d10efd](https://42.96.195.83/association/whisper/commit/01d10efdaec7724b394b8ad3d297db547bbe0eed))  
    * 去除多余的调试信息。（[0f056d2](https://42.96.195.83/association/whisper/commit/0f056d23d45b96fe54e6fb5723393f1997fb095f)）
    * 基本的错误/提示回报机制完成。（[0f056d2](https://42.96.195.83/association/whisper/commit/0f056d23d45b96fe54e6fb5723393f1997fb095f)）
    * 自述文件整理
    
## 即将到来
**警告：在这里出现的内容将在以后版本中出现。  
但是我们无法承诺每一个特性的可用时间。**  

* （重要）修正导致0.12版本node.js引擎上进行独立安装时出现的V8引擎解析错误。
* 中间件和IM模块完善。
* 建立基于grunt的早期测试框架。  
* 基于markdown语法的代码自文档化。

## 我该怎样……
### 安装
#### 首先
本项目需要0.12版本的Node.js引擎。  
为了您的服务器安全，我们建议您从[Node.js](http://www.nodejs.org/)官方网站下载对应版本。  

**（可能）由于目前使用的某（几）个依赖的版本问题，在0.12版本的Node.js引擎环境中进行独立安装可能出现V8引擎解析错误。
我们已经知晓这一问题，并将在近期修复。
目前已知的解决办法是使用0.10版本的Node.js引擎环境中进行安装。欢迎在[这里](https://42.96.195.83/association/whisper/issues/1)讨论**

本项目的一些依赖需要使用Python 2.7（或以上版本）和Microsoft Visual C++ 2012（或以上版本，Windows环境下）或对应环境下的C++编译器。  
为了您的服务器安全，同样建议您从官方网站和/或可信赖的源下载对应版本。

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

# whisper Readme
[中文](#1)
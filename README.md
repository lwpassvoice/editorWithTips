# Editor With Tips

### 实现思路：
根据要求输入区域可能有样式：textarea是纯文本输入，不能包含有样式，而contenteditable element可以包含标签，也就是可以有样式。需要兼容这两种情况，tips就只能定位在输入框中。

### 实现步骤：
1. 自定义外层容器，用于包裹textarea\contenteditable element
2. 重置textarea\contenteditable element的样式，使其与自定义外层容器一致
3. 监听textarea\contenteditable element的input事件，获取输入内容，获取光标位置
4. 实现自动补全功能，根据输入内容，动态生成补全文本，并将其定位在光标后面
5. 处理不同 corner cases

### 遇到的问题：
1. 光标位置需要分别处理，并且还没找到合适的方案
2. 光标位置依靠文本宽度来决定，中英文字符宽度不一致，需要处理
3. 光标位置需要考虑文本换行情况

### 运行方式
1. 安装依赖：npm install
2. 运行：npm run dev
3. 访问：http://localhost:3000/
4. 打包：npm run build
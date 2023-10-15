let CompilerUtil = {
    /**
     * 处理 model 指令
     * @param node 当前元素
     * @param value 指令的值
     * @param vm Nue 的实例对象
     */
    model: function (node, value, vm) {
        node.value = vm.$data[value];
    },
    html: function () {

    },
    text: function () {

    }
}

class Nue {
    constructor(options) {
        // 1.保存创建时候传递过来的数据
        if (this.isElement(options.el)) {
            this.$el = options.el;
        } else {
            this.$el = document.querySelector(options.el);
        }
        this.$data = options.data;

        // 2.根据指定的区域和数据去编译渲染界面
        if (this.$el) {
            new Compiler(this);
        }
    }

    /**
     * 判断是否是一个元素
     * @param node  传入的节点
     * @returns {boolean}  返回是否是一个元素
     */
    isElement(node) {
        return node.nodeType === 1;
    }
}

class Compiler {
    constructor(vm) {
        this.vm = vm;

        // 1.将网页上的元素放到内存中
        let fragment = this.node2fragment(this.vm.$el);

        // 2.利用指定的数据编译内存中的元素
        this.buildTemplate(fragment);

        // 3.将编译好的内容重新渲染会网页上
        this.vm.$el.appendChild(fragment);
    }

    node2fragment(app) {
        // 1.创建一个空的文档碎片对象
        let fragment = document.createDocumentFragment();

        // 2.编译循环取到每一个元素
        let node = app.firstChild;
        while (node) {
            fragment.appendChild(node);
            node = app.firstChild;
        }

        // 3.返回存储了所有元素的文档碎片对象
        return fragment;
    }

    buildTemplate(fragment) {
        let nodeList = [...fragment.childNodes];

        // 1.遍历所有的节点
        nodeList.forEach(node => {
            // 2.需要判断当前遍历到的节点是一个元素还是一个文本
            if (this.vm.isElement(node)) {
                // 是一个元素
                this.buildElement(node);
                // 处理子元素(处理后代)
                this.buildTemplate(node);
            } else {
                // 不是一个元素
                this.buildText(node);
            }
        });
    }

    buildElement(node) {
        // 可以通过 node.attributes 获取到当前元素上所有的属性
        let attrs = [...node.attributes];

        // 1.遍历所有的属性
        attrs.forEach(attr => {
            let {name, value} = attr;
            // name, value : v-model name
            // name=v-model
            // value=name
            // 后续的指令可能还有 v-html v-text v-on 等等
            if (name.startsWith('v-')) {
                // console.log('是Vue的指令, 需要我们处理', name, value);
                // 解构 name
                let [, directive] = name.split('-');
                // v-model -> [v, model]

                // 2.根据指令名称, 调用不同的处理函数
                CompilerUtil[directive](node, value, this.vm);
            }
        });
    }

    buildText(node) {
        // 可以通过 node.textContent 获取到当前文本节点的内容
        let content = node.textContent;

        // 编写一个正则表达式, 用来匹配 {{}}
        let reg = /\{\{.+?\}\}/gi;
        if (reg.test(content)) {
            console.log('是一个文本节点, 需要我们处理', content);
        }
    }
}

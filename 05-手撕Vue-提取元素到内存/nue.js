class Nue {
    constructor(options){
        // 1.保存创建时候传递过来的数据
        if(this.isElement(options.el)){
            this.$el = options.el;
        }else{
            this.$el = document.querySelector(options.el);
        }
        this.$data = options.data;
        // 2.根据指定的区域和数据去编译渲染界面
        if(this.$el){
            new Compiler(this);
        }
    }
    // 判断是否是一个元素
    isElement(node){
        return node.nodeType === 1;
    }
}
class Compiler {
    constructor(vm){
        this.vm = vm;
        // 1.将网页上的元素放到内存中
        let fragment = this.node2fragment(this.vm.$el);
        console.log(fragment);
        // 2.利用指定的数据编译内存中的元素
        // 3.将编译好的内容重新渲染会网页上
    }
    node2fragment(app){
        // 1.创建一个空的文档碎片对象
        let fragment = document.createDocumentFragment();
        // 2.编译循环取到每一个元素
        let node = app.firstChild;
        while (node){
            // 注意点: 只要将元素添加到了文档碎片对象中, 那么这个元素就会自动从网页上消失
            fragment.appendChild(node);
            node = app.firstChild;
        }
        // 3.返回存储了所有元素的文档碎片对象
        return fragment;
    }
}
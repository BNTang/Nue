let CompilerUtil = {
    getValue(vm, value){
        // time.h --> [time, h]
       return value.split('.').reduce((data, currentKey) => {
            // 第一次执行: data=$data, currentKey=time
            // 第二次执行: data=time, currentKey=h
            return data[currentKey];
        }, vm.$data);
    },
    model: function (node, value, vm) { // value=time.h
        /*node.value = vm.$data[value]; // vm.$data[time.h] --> vm.$data[time] --> time[h]*/
        let val = this.getValue(vm, value);
        node.value = val;
    },
    html: function (node, value, vm) {
        let val = this.getValue(vm, value);
        node.innerHTML = val;
    },
    text: function (node, value, vm) {
        let val = this.getValue(vm, value);
        node.innerText = val;
    }
}
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
        // 2.利用指定的数据编译内存中的元素
        this.buildTemplate(fragment);
        // 3.将编译好的内容重新渲染会网页上
        this.vm.$el.appendChild(fragment);
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
    buildTemplate(fragment){
        let nodeList = [...fragment.childNodes];
        nodeList.forEach(node=>{
            // 需要判断当前遍历到的节点是一个元素还是一个文本
            // 如果是一个元素, 我们需要判断有没有v-model属性
            // 如果是一个文本, 我们需要判断有没有{{}}的内容
            if(this.vm.isElement(node)){
                // 是一个元素
                this.buildElement(node);
                // 处理子元素(处理后代)
                this.buildTemplate(node);
            }else{
                // 不是一个元素
                this.buildText(node);
            }
        })
    }
    buildElement(node){
        let attrs = [...node.attributes];
        attrs.forEach(attr => {
            let {name, value} = attr; // v-model="name" / name:v-model / value:name
            if(name.startsWith('v-')){ // v-model / v-html / v-text / v-xxx
                let [_, directive] = name.split('-'); // v-model -> [v, model]
                CompilerUtil[directive](node, value, this.vm);
            }
        })
    }
    buildText(node){
        let content = node.textContent;
        let reg = /\{\{.+?\}\}/gi;
        if(reg.test(content)){
            console.log('是{{}}的文本, 需要我们处理', content);
        }
    }
}
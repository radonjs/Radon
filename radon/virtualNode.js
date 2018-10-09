import * as types from './constants'

class VirtualNode {
    constructor (node, modifiers) {
        this.parent = null;
        this.parents = {};
        if(node.parent){
            
            this.parent = node.parent.virtualNode;
            this.parents[this.parent.name] = this.parent;
            
            let ancestor = this.parent;
            
            while(ancestor.parent !== null){
                ancestor = ancestor.parent;
                this.parents[ancestor.name] = ancestor;
            }
        } 

        
        this.name = node.name;
        this.type = node.type;
        this.id = node.id;


        if(this.type === types.PRIMITIVE){
            //value should just be an empty object.
            //when your children are being made
            //they'll just put themselves into your value.
            this.val = node.value;
        } else {
            this.val = {};
            if(this.type === types.ARRAY){ this.val = [] } 
        } 

        if(node.type !== types.CONTAINER){
            let name = node.name;
            if(name.includes('_')) name = name.split('_')[name.split('_').length - 1];
            node.parent.virtualNode.val[name] = this;
        }

        if(node.modifiers){
            let modifierKeys = Object.keys(modifiers);
            
            modifierKeys.forEach(modifierKey => {
                this[modifierKey] = modifiers[modifierKey];
            })
        }

        
        

        //set this.parent
        //set this.value
        //set each modifier
        
    //     this.parent;

    //     if(node.type === types.CONTAINER){
    //         const parentHolder = node.parent;
    //         node.parent = null;
    //         let value = node.unsheatheChildren();
    //         node.parent = parentHolder;
    //         Object.keys(value).forEach(key => {
    //         this[key] = value[key];
    //         this.getData = () => {
    //             return this;
    //         }
    //       })
    //     } else {
    //         this.getData = () => {
    //             let pointer = node;
    //         while(pointer.type !== types.CONTAINER){
    //             pointer = pointer.parent;
    //         }
    //         const route = node.id.split(pointer.name)[1].split('.');
    //         route.splice(0, 1);
            
    //         pointer = pointer.VirtualNode;
    //         let final = route[route.length -1];
    //         route.splice(route.length-1, 1);
    //         if(final.includes('_')){
    //             final = final.split('_');
    //             final = final[final.length - 1];
    //         }
            
    //         route.forEach(name => {
    //             if(name.includes('_')){
    //                 name = name.split('_');
    //                 name = name[name.length -1];
    //             }
    //             pointer = pointer[name]
    //         })
            
    //         return pointer[final];
    //     }
        
    //     this.updateTo = (data) => {
    //         let pointer = node;
    //         while(pointer.type !== types.CONTAINER){
    //             pointer = pointer.parent;
    //         }
    //         const route = node.id.split(pointer.name)[1].split('.');
    //         route.splice(0, 1);
            
    //         pointer = pointer.VirtualNode;
    //         let final = route[route.length -1];
    //         route.splice(route.length-1, 1);
    //         if(final.includes('_')){
    //             final = final.split('_');
    //             final = final[final.length - 1];
    //         }
            
    //         route.forEach(name => {
    //             if(name.includes('_')){
    //                 name = name.split('_');
    //                 name = name[name.length -1];
    //             }
    //             pointer = pointer[name]
    //         })
            
    //         pointer[final] = data;
    //     }
    // }

    //the modifiers need to be put in dynamically,
    //as does keySubscribe
    }   
    updateTo(data){
        this.val = data;
    }
}

export default VirtualNode;

/*
vNode.updateTo = (data) => {
            const route = node.id.split(context.name)[1].split('.')
            route.splice(0, 1);
            
            // const route = node.id.split(context.name)[1].join().split('.'); //all the shit after the route to the context 
            let pointer = context.virtualNode;
            let final = route[route.length-1];
            if(final.includes('_')) final = final.split('_')[1]
            route.splice(route.length-1, 1);

            route.forEach(item => {
              if(item.includes('_')){
                pointer = pointer[item.split('_')[1]];
              } else {
                pointer = pointer[item];
              }
            })

            pointer[final] = data;
          };
*/
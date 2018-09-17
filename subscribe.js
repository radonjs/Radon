const silo = require('./combineNodes.js').silo;

const subscribe = (component, name) => {
    if(!name && !component.prototype){
        throw Error('you cant use an anonymous function in subscribe without a name argument');
    } else if (!name && !!component.prototype){
        name = component.prototype.constructor.name + 'State'
    }
    
    const searchSilo = (head, name) => {
        
        let children;
        if(typeof head.value !== 'object') return null;
        else children = head.value;
        console.log('keys: ', Object.keys(children));

        for(let i in children){
          console.log(i, name);
            if(i === name){
                console.log('found it!');
                return children[i]
            } else {
                let foundNode = searchSilo(children[i], name);
                console.log('coming back up. foundNode is: ', foundNode);
                if(!!foundNode){return foundNode};
            }
        }
    }

    let foundNode = searchSilo(silo, name);
    foundNode._subscribers.push(component)
    return foundNode;
    
    //if there's no name assume the name is component name + 'State'
    //recursively search through silo from headnode
    //find something with name === name;
    //add to its subscribers the component;
}

module.exports = {subscribe};
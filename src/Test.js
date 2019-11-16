import React, { Component } from 'react';

class Test extends Component {

    state = {
        items: [],
        currentItem: '',
        val: false
    }

    add = () => {

        const newList = [...this.state.items];

        newList.push({ id: newList.length, value: this.state.currentItem });

        this.setState({
            items: newList
        })

    }

    changeHandler = (event) => {

        const newItem = event.target.value;
        console.log(newItem);

        this.setState({
            currentItem: newItem
        })

    }

    lineCross = (index) => {

        const targetedIndex = this.state.items.findIndex((data) => {
            return data.id === index
        });

        const targetedPerson = {
            ...this.state.items[targetedIndex]
        };

        targetedPerson.val = !targetedPerson.val;
        const newList = [...this.state.items];

        newList[targetedIndex] = targetedPerson;
        this.setState({
            items: newList
        })

    }

    render() {
        console.log('Final list is', this.state.items)
        return (
            <div>
                <input type="text" onChange={(event) => this.changeHandler(event)}></input>
                <button onClick={this.add}>AddName</button>


                <ul>
                    {this.state.items.map((item, index) => {

                        if(item.val){

                            return (
                                <li key={index} className="crossLine" onClick={() => this.lineCross(index)}>
                                    {item.value}
                                </li>
                            )

                        }else{

                            return (
                                <li key={index} className="" onClick={() => this.lineCross(index)}>
                                    {item.value}
                                </li>
                            )

                        }

                     
                    })}
                </ul>

                <style>{`\
                .crossLine{\
                        text-decoration-line: line-through ;\
                    }\
                `}
              </style>


            </div>
        )
    }

}

export default Test;
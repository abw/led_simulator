import React from 'react';
import DefaultLogic from './Logic';
import DefaultLayout from './Layout';
import DefaultInput from './Input';

function Controller(props={}) {
    let Logic  = props.Logic  || DefaultLogic,
        Layout = props.Layout || DefaultLayout,
        Input  = props.Input  || DefaultInput;

    return class ControlWrapper extends React.Component {
        constructor(props) {
            super(props);
            this.logic = new Logic({
                ...props,
                onDragOn:  (e) => this.setState({ dragging: true  }),
                onDragOff: (e) => this.setState({ dragging: false  }),
            });
            this.state = {
                dragging: false
            };
            this.reportSize = this.reportSize.bind(this);
            //console.log("controller props: ", props);
        }
        reportSize(element) {
            let size = element.getBoundingClientRect();
            //console.log("reported size: ", size);
            this.setState({ width: size.width, height: size.height });
        }
        render() {
            let props = { ...this.state, ...this.props, logic: this.logic };
            return <Layout {...props} hardwareRef={this.reportSize}>
                <Input {...props}/>
            </Layout>
        }
    }
}

export default Controller;

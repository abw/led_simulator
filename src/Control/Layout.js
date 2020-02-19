import React from 'react';

class Layout extends React.Component {
    render() {
        let {children, value, units, caption, hardwareRef} = this.props;
        //console.log("Layout props: ", this.props);
        return <div className="vert control">
          <div className="hardware" ref={hardwareRef}>
            {children}
          </div>
          <div className="value">
            {value}
            {units && <span className="units">{units}</span>}
          </div>
          {caption && <div className="caption">{caption}</div>}
        </div>
    }
}

export default Layout;

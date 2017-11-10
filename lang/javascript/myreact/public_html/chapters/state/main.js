const TextAreaCounter = React.createClass({
    propTypes: {
        defaultValue: React.PropTypes.string
    },
    getDefaultProps: () => {
        return {
            text: ""
        };
    },
    getInitialState: function() {
        return {
            text: this.props.defaultValue
        };
    },
    _textChange: function(event) {
        this.setState({
            text: event.target.value
        });
    },
    render: function() {
        return React.DOM.div(null, 
            React.DOM.textarea({
                value: this.state.text,
                onChange: this._textChange
            }),
            React.DOM.h3(null, this.state.text.length)
        );
    }
});

const newCounter = ReactDOM.render(
    React.createElement(TextAreaCounter, {
        defaultValue: "hogehoge"
    }),
    document.getElementById("app")
);

document.querySelector(".outsider").addEventListener("click", () => {
    newCounter.setState({
        text: "outside change"
    });
});

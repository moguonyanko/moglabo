var MyComponent = React.createClass({
    propTypes: {
        firstname: React.PropTypes.string.isRequired,
        lastname: React.PropTypes.string.isRequired,
        nickname: React.PropTypes.string
    },
    getDefaultProps: () => {
        return {
            nickname: "なし"
        };
    },
    render: function() {
        // arrow functionで記述するとthis経由でプロパティを参照できずエラーになる。
        return React.DOM.span(null, 
            `私は${this.props.firstname} ${this.props.lastname}, あだ名は${this.props.nickname}です`);
    }
});

ReactDOM.render(
    React.createElement(MyComponent, {
        firstname: "HogeHoge",
        lastname: "ForBar"
    }),
    document.getElementById("app")    
);

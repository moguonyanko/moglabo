((window, document) => {
"use strict";    
    
const logMixin = {
    _methodLog: function(methodName, arg) {
        const content = `${this.name}::${methodName}`;
        console.log(content, arg);
        document.querySelector(".log").innerHTML += `${content}<br />`;
    },
    componentWillUpdate: function() {
        this._methodLog("componentWillUpdate", arguments);
    },
    componentDidUpdate: function(oldProps, oldState) {
        this._methodLog("componentDidUpdate", arguments);
    },
    componentWillMount: function() {
        this._methodLog("componentWillMount", arguments);
    },
    componentDidMount: function() {
        this._methodLog("componentDidMount", arguments);
        const mountedElement = ReactDOM.findDOMNode(this);
        console.log(mountedElement);
    },
    componentWillUnmount: function() {
        this._methodLog("componentWillUnmount", arguments);
    }
};    
    

const Counter = React.createClass({
    name: "Counter", 
    mixins: [logMixin, React.addons.PureRenderMixin],
    propTypes: {
        count: React.PropTypes.number.isRequired
    },
    // React.addons.PureRenderMixinをmixinsプロパティに追加していれば
    // 以下のコードと同じことをミックスイン側で行ってくれる。
//    shouldComponentUpdate: function(nextProps, nextState) {
//        // shouldComponentUpdateはcomponentWillUpdateの前に呼び出される。
//        // 文字数に変化がない時はCounterのrenderが呼び出されないようにする。
//        // 不要なレンダリングを減らすことでパフォーマンスの向上につながる。
//        if (nextProps.count !== this.props.count) {
//            console.log("Should component update");
//            return true;
//        } else {
//            console.log("Should NOT component update");
//            return false;
//        }
//    },
    render: function() {
        console.log(`${this.name}::render()`);
        return React.DOM.span(null, this.props.count);
    }
});

const TextAreaCounter = React.createClass({
    name: "TextAreaCounter",
    // componentWillReceivePropsでのsetStateがなければ外部でのプロパティ変更は反映されない。
    componentWillReceiveProps: function(newProps) {
        this.setState({
            text: newProps.defaultValue
        });
    },
    // 他のコンポーネントのライフサイクルメソッドと同じ名前のメソッドを定義しても問題ない。
    // componentDidUpdateはCounterのもTextAreaCounterのもどちらも実行される。
    componentDidUpdate: function(oldProps, oldState) {
        // 更新内容に問題がある場合は古い状態に戻す。
        const maxTextLength = 30;
        if (this.state.text.length > maxTextLength) {
            this.replaceState(oldState);
        }
    },
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
        // ConuterのshouldComponentUpdateがfalseを返す時は
        // TextAreaCounterのrenderしか呼び出されない。
        console.log(`${this.name}::render()`);
        let resultComponent;
        if (this.state.text.length > 0) {
            resultComponent = React.DOM.h3(null, 
                React.createElement(Counter, {
                    count: this.state.text.length
                }));
        }
        return React.DOM.div(null, 
            React.DOM.textarea({
                value: this.state.text,
                onChange: this._textChange
            }),
            resultComponent
        );
    }
});

// 描画したコンポーネントを返す。
const doRender = () => {
    return ReactDOM.render(
        React.createElement(TextAreaCounter, {
            defaultValue: ""
        }),
        document.getElementById("app")
    );    
};

const counterListeners = {
    // コンポーネント外部で状態を変更
    statesetter: newCounter => {
        newCounter.setState({
            text: "outside state change"
        });
        // setStateしてもコンポーネントのプロパティは変更されない。
        console.log(newCounter.props);
    },
    // コンポーネント外部でプロパティを変更
    propsetter: () => {
        const counter = ReactDOM.render(
            React.createElement(TextAreaCounter, {
                defaultValue: "outside property change"
            }),
            document.getElementById("app")
        );
        console.log(counter.props);
    },
    logclear: () => document.querySelector(".log").innerHTML = ""
};

const init = () => {
    const newCounter = doRender();
    document.querySelector(".control").addEventListener("click", event => {
        const eleClass = event.target.getAttribute("class");
        if (eleClass in counterListeners) {
            counterListeners[eleClass](newCounter);
        }
    });
};

window.addEventListener("DOMContentLoaded", init);

})(window, document);
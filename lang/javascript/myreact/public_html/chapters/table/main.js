//((window, document) => {
//    "use strict";

const headers = [
    "企業名", "代表取締役", "所在地", "設立年", "売上(百万円)"
];

const data = [
    ["A", "foo", "北海道", "1999", "300"],
    ["B", "bar", "長崎県", "1998", "100"],
    ["C", "baz", "島根県", "2004", "200"],
    ["D", "fuga", "群馬県", "1979", "500"],
    ["E", "hoge", "愛媛県", "2010", "400"]
];

const createTableHead = tableContext => {
    const getTh = tr => tr.props.headers.map((title, index) => {
            if (tr.state.sortby === index) {
                title += `${tr.state.descending ? "▲" : "▼"}`;
            }
            return React.DOM.th({key: index}, title);
        });
    const getTr = th => React.DOM.tr(null, getTh(th));
    const getThead = table => React.DOM.thead({
            onClick: table._sort
        }, getTr(table));

    return getThead(tableContext);
};

const createtableBody = tableContext => {
    const tBody = React.DOM.tbody({
        onDoubleClick: tableContext._showEditor
    }, tableContext.state.data.map((row, rowIdx) => {
        const tr = React.DOM.tr({key: rowIdx}, row.map((cell, cellIdx) => {
            let content = cell;
            const edit = tableContext.state.edit;
            if (edit && edit.row === rowIdx && edit.cell === cellIdx) {
                content = React.DOM.form({
                    onSubmit: tableContext._save
                },
                React.DOM.input({
                    type: "text",
                    defaultValue: content
                }));
            }
            const attr = {
                key: cellIdx,
                "data-row": rowIdx
            };
            return React.DOM.td(attr, content);
        }));
        return tr;
    }));
    
    return tBody;
};

const createTable = tableContext => {
    const table = React.DOM.table(null,
        createTableHead(tableContext), createtableBody(tableContext));
        
    return table;
};

const Table = React.createClass({
    displayName: "Table",
    propTypes: {
        headers: React.PropTypes.arrayOf(React.PropTypes.string),
        initialData: React.PropTypes.arrayOf(
            React.PropTypes.arrayOf(React.PropTypes.string))
    },
    getInitialState() {
        return {
            data: this.props.initialData,
            sortby: null,
            descending: false,
            edit: null // { row: 行番号, cell: 列番号 }
        };
    },
    _sort(event) {
        const column = event.target.cellIndex;
        const descending = this.state.sortby === column && !this.state.descending;
        const data = Array.from(this.state.data);
        data.sort((r1, r2) => {
            const descend = r1[column] < r2[column] ? 1 : -1;
            const ascend = r1[column] > r2[column] ? 1 : -1;
            return descending ? descend : ascend;
        });
        this.setState({ 
            data,
            sortby: column,
            descending
        });
    },
    _showEditor(event) {
        const edit = {
            row: parseInt(event.target.dataset.row),
            cell: event.target.cellIndex
        };
        this.setState({ edit });
    },
    _save(event) {
        event.preventDefault();
        const input = event.target.firstChild;
        const data = Array.from(this.state.data);
        data[this.state.edit.row][this.state.edit.cell] = input.value;
        this.setState({
            edit: null, // 編集完了を示すnull
            data
        });    
    },
    render() {
        return createTable(this);
    }
}); 

ReactDOM.render(
    React.createElement(Table, {
        headers: headers,
        initialData: data
    }),
    document.getElementById("app")
);

//})(window, document);

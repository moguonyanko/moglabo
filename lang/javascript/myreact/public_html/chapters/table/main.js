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
    }, 
    tableContext._renderSearch(),
    tableContext.state.data.map((row, rowIdx) => {
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

const createBlob = (tebleContext, format) => {
    if (!format) {
        throw new Error("Format is not found");
    }
    let contents;
    if (format.toLowerCase() === "json") {
        // 二次元配列はJSONとして妥当である。
        contents = JSON.stringify(tebleContext.state.data);
    } else {
        contents = tebleContext.state.data.reduce((result, row) => {
            const line = row.reduce((rowResult, cell, idx) => {
                const tmp = [
                    rowResult,
                    `"${cell.replace(/"/g, `""`)}"`,
                    (idx < (row.length - 1) ? "," : "")
                ];
                return tmp.join("");
            }, "");
            return result + line + "\n";
        }, "");
    }
    const type = `text/${format}`;
    const blob = new Blob([contents], {type});
    return blob;
};

/**
 * saveElementはa要素のみ対応
 */
const saveBlob = ({saveElement, blob, format}) => {
    if (saveElement.nodeName !== "A") {
        throw new Error(`Unsupported save element: ${saveElement.nodeName}`);
    }
    saveElement.href = URL.createObjectURL(blob);
    saveElement.download = `data.${format}`;
};

const Table = React.createClass({
    displayName: "Table",
    propTypes: {
        headers: React.PropTypes.arrayOf(React.PropTypes.string),
        initialData: React.PropTypes.arrayOf(
            React.PropTypes.arrayOf(React.PropTypes.string))
    },
    _preSearchData: null,
    _log: [],
    getInitialState() {
        return {
            data: this.props.initialData,
            sortby: null,
            descending: false,
            edit: null, // { row: 行番号, cell: 列番号 }
            search: false
        };
    },
    _logSetState(newState) {
        const clonedState = Object.assign({}, 
            this._log.length === 0 ? this.state : newState);
        this._log.push(clonedState);
        this.setState(newState);
    },
    _replay() {
        if (this._log.length <= 0) {
            console.warn("ステートが保存されていません。");
            return;
        }
        let idx = -1;
        const intervalId = setInterval(() => {
            idx++;
            if (idx === (this._log.length - 1)) {
                console.log("保存済みステートはもうありません。");
                clearInterval(intervalId);
            }
            this.setState(this._log[idx]);
        }, 1000);
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
        this._logSetState({ 
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
        this._logSetState({ edit });
    },
    _save(event) {
        event.preventDefault();
        const input = event.target.firstChild;
        const data = Array.from(this.state.data);
        data[this.state.edit.row][this.state.edit.cell] = input.value;
        this._logSetState({
            edit: null, // 編集完了を示すnull
            data
        });    
    },
    _search(event) {
        const searchText = event.target.value;
        if (!searchText) {
            this._logSetState({
                data: this._preSearchData
            });
            return;
        }
        const searchColumnIdx = event.target.dataset.idx;
        const searchData = this._preSearchData.filter(row => {
            const cellText = row[searchColumnIdx].toString();
            const found = cellText.indexOf(searchText) > -1;
            return found;
        });
        this._logSetState({
            data: searchData
        });
    },
    _renderSearch() {
        if (!this.state.search) {
            return null;
        }
        const tr = React.DOM.tr({
            onChange: this._search
        }, this.props.headers.map((header, headerIdx) => {
            const td = React.DOM.td({key: headerIdx}, 
                React.DOM.input({
                    type: "text",
                    "data-idx": headerIdx,
                    className: "search-text"
                }));
            return td;
        }));
        return tr;
    },
    _toggleSearch(event) {
        if (this.state.search) {
            // TOOD: ReactのAPIを介してinnerTextを変更する方法があるのではないか。
            //event.target.innerText = "検索";
            this._logSetState({
                data: this._preSearchData,
                search: false
            });
            this._preSearchData = null;
        } else {
            //event.target.innerText = "検索完了";
            this._preSearchData = this.state.data;
            this._logSetState({
                search: true
            });
        }
    },
    _renderTable() {
        return createTable(this);
    },
    _renderToolBar() {
        const context = this;
        return React.DOM.div({
                className: "toolbar"
            }, 
            React.DOM.button({
                onClick: this._toggleSearch,
                className: "toolbutton"
            }, "検索"),
            React.DOM.a({
                onClick: event => {
                    const format = "json";
                    const blob = createBlob(context, format);
                    saveBlob({
                        saveElement: event.target,
                        blob,
                        format
                    });
                },
                href: "data.json",
                className: "toolbutton"
            }, "JSONで保存"),
            React.DOM.a({
                onClick: event => {
                    const format = "csv";
                    const blob = createBlob(context, format);
                    saveBlob({
                        saveElement: event.target,
                        blob,
                        format
                    });
                },
                href: "data.csv",
                className: "toolbutton"
            }, "CSVで保存")
        );
    },
    componentDidMount() {
        document.onkeydown = event => {
            const downedAltShiftR = event.altKey && event.shiftKey && 
                event.keyCode === 82;
            if (downedAltShiftR) {
                this._replay();
            }
        };
    },
    render() {
        return React.DOM.div(null, 
            this._renderToolBar(),
            this._renderTable());
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

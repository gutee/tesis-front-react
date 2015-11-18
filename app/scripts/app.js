var React = window.React = require('react'),
    ReactDOM = require('react-dom'),
    TreeView = require('./ui/react-bootstrap-treeview.jsx'),
    mountNode = document.getElementById('app'),
    $ = require('jquery');

var CodeContainer = React.createClass({
    componentDidMount: function(){
        function handleFileSelect(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var files = evt.dataTransfer.files;
            var reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('code').value = event.target.result;
            };
            reader.readAsText(files[0],"UTF-8");
        }

        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy';
        }

        var dropZone = document.getElementById('code');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
    },
    sendCode: function(){
        var content = {content: document.getElementById('code').value};
        var props = this.props;
        console.log(content);
        $.ajax({
            url: 'http://localhost:8081/parse',
            crossDomain: true,
            data: JSON.stringify(content),
            type: 'POST',
            dataType: 'json',
            success: function (resp) {
                console.log(resp);
                props.changeTree(JSON.parse(resp));
            },
            error: function (resp) {
                console.log("Some error");
                console.log(resp);
            }
        });
        //this.props.changeTree([{text: "One", nodes: [{text: "Two"}, {text: "Threeeeee"}, {text: "Four"}]}, {text: "Four"}]);
    },
    render: function(){
        return (
            <div className="form-group">
                <label htmlFor="code">Write some C or drag a code file to the textarea</label>
                <textarea className="form-control" rows="30" id="code"></textarea>

                <button className="btn btn-default" onClick={this.sendCode}>Send</button>
            </div>
        )
    }
});

var Container = React.createClass({
    getInitialState: function(){
        return {content: []};
    },
    onTreeChange: function(data){
        this.setState({
            content: [data]
        });
    },
    render: function(){
        return (
            <div id="content" className="row marketing">
                <div className="col-lg-6">
                    <CodeContainer changeTree={this.onTreeChange}/>
                </div>
                <div className="col-lg-6">
                    <TreeView data={this.state.content}/>
                </div>
            </div>
        )
    }
});

ReactDOM.render(<Container/>, mountNode);

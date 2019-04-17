import React from 'react';

import FsAccess from '../utils/FsAccess';
import GridImage from './GridImage';

import { remote } from 'electron';
const dialog = remote.dialog;
const app = remote.app;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    console.log('[Top#constructor]');

    this.state = {
      path: app.getPath('home'),
      photos: [],
      selected: [],
      list1: [],
      list2: [],
    };

    this.handleOnCheckFile = this.handleOnCheckFile.bind(this);

    this.refFavorites = React.createRef();
    this.refChecked = React.createRef();
  }

  handleCheckDragging(target, e){

      const rect = target.getBoundingClientRect();

      let checkX = e.pageX <= rect.x || e.pageX >= (rect.x + rect.width);
      let checkY = e.pageY <= rect.y || e.pageY >= (rect.y + rect.height);
      if(checkX || checkY){
        target.classList.remove('dragging');
      }else{
        target.classList.add('dragging');
      }
  }

  componentDidMount() {
    console.log('[Home#componentDidMount]');

    this.setState({
      photos: FsAccess.searchByPath(this.state.path)
    });

    var self = this;

    // DragEnter/DragLeave control
    this.refFavorites.current.ondragenter = function(e) {
      e.preventDefault();
      self.handleCheckDragging(self.refFavorites.current, e);
    };
    this.refChecked.current.ondragenter = function(e) {
      e.preventDefault();
      self.handleCheckDragging(self.refChecked.current, e);
    };

    this.refFavorites.current.ondragleave = function(e) {
      e.preventDefault();
      self.handleCheckDragging(self.refFavorites.current, e);
    };

    this.refChecked.current.ondragleave = function(e) {
      e.preventDefault();
      self.handleCheckDragging(self.refChecked.current, e);
    };    

    // Drop control
    this.refFavorites.current.ondragover = function(e) {
      e.preventDefault();
    };

    this.refFavorites.current.ondrop = function(e) {
      e.preventDefault();
      self.refFavorites.current.classList.remove('dragging');

      const target = e.dataTransfer.getData('text/plain');
      if (self.state.list1.indexOf(target) == -1) {
        self.setState({
          list1: self.state.list1.concat([target]),
        });
      }
    };

    this.refChecked.current.ondragover = function(e) {
      e.preventDefault();
    };

    this.refChecked.current.ondrop = function(e) {
      e.preventDefault();
      self.refChecked.current.classList.remove('dragging');

      const target = e.dataTransfer.getData('text/plain');
      if (self.state.list2.indexOf(target) == -1) {
        self.setState({
          list2: self.state.list2.concat([target]),
        });
      }
    };
  }

  handleOpen() {
    const win = remote.getCurrentWindow();
    const options = {
      properties: ['openDirectory'],
      title: 'Choose folder',
      defaultPath: app.getPath('home')
    };

    const decided = dialog.showOpenDialog(win, options);
    if (decided) {
      //console.dir(decided);

      this.setState({
        path: decided[0],
        photos: FsAccess.searchByPath(decided[0])
      });
    }
  }

  handleOnCheckFile(name) {
    console.log(name);
    let nowSelected = this.state.selected;

    if (nowSelected.indexOf(name) == -1) {
      nowSelected.push(name);
    } else {
      nowSelected.splice(nowSelected.indexOf(name), 1);
    }

    this.setState({
      selected: nowSelected
    });
  }

  render() {
    console.log('[Home#render]');
    console.dir(this.state);

    const GalleryContents = this.state.photos.map((file, index) => (
      <GridImage
        key={'img' + index}
        file={file}
        selected={this.state.selected.indexOf(file.name) > -1}
        onCheckFile={name => this.handleOnCheckFile(name)}
      />
    ));

    const List1 = this.state.list1.map((item, index) => (
      <span key={`f-${index}`} className="nav-group-item">
        {item}
      </span>
    ));

    const List2 = this.state.list2.map((item, index) => (
      <span key={`c-${index}`} className="nav-group-item">
        {item}
      </span>
    ));

    return (
      <div className="window">
        <header className="toolbar toolbar-header">
          <h1 className="title">Header</h1>
          <div
            className="btn-group pull-left"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <button
              className="btn btn-default"
              style={{ width: '65px', float: 'left' }}
              onClick={() => this.handleOpen()}
            >
              <span className="icon icon-folder" /> Open
            </button>
            <span style={{ marginLeft: '10px' }}>{this.state.path}</span>
          </div>
        </header>
        <div className="window-content">
          <div className="pane-group">
            <div className="pane" style={{ minWidth: '400px' }}>
              <ul className="gallery">{GalleryContents}</ul>
            </div>
            <div className="pane-sm sidebar">
              <h5>Drag and drop in here.</h5>
              <nav
                ref={this.refFavorites}
                className={`nav-group area-drop ${this.state.dragging1}`}
              >
                <h5
                  className="nav-group-title"
                  style={{ pointerEvents: 'none' }}
                >
                  Favorites
                </h5>
                {List1}
              </nav>
              <nav
                ref={this.refChecked}
                className={`nav-group area-drop ${this.state.dragging2}`}
              >
                <h5
                  className="nav-group-title"
                  style={{ pointerEvents: 'none' }}
                >
                  Checked
                </h5>
                {List2}
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

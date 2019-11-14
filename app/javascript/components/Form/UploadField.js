//
//  UploadField.js
//  LayerKeep
// 
//  Created by Wess Cope (wess@frenzylabs.com) on 07/02/19
//  Copyright 2019 FrenzyLabs,llc.
//

import React from 'react';

export default class UploadField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }


  fileList() {
    return this.fileInputRef.files;
  }

  clearFiles(files) {
    this.fileInputRef.value = "";
  }

  onFileChange(e) {
    console.log("ON FILE CHANGE")
    console.log(e.target.files)
    // console.log(e.dataTransfer.items)
    // var res = this.getAllFileEntries(e.target)
    // console.log(res)
    // window.ef = e.target
    
    if (e.target.files && this.props.onFiles) this.props.onFiles(e.target.files);
    if (this.props.onChange) onChange(e);
  }

  async getFile(fileEntry) {
    try {
      return await new Promise((resolve, reject) => fileEntry.file(resolve, reject));
    } catch (err) {
      console.log(err);
    }
  }

  async getAllFileEntries(dataTransferItemList) {
    let fileEntries = [];
    // Use BFS to traverse entire directory/file structure
    let queue = [];
    // Unfortunately dataTransferItemList is not iterable i.e. no forEach
    for (let i = 0; i < dataTransferItemList.length; i++) {
      queue.push(dataTransferItemList[i].webkitGetAsEntry());
    }
    while (queue.length > 0) {
      let entry = queue.shift();
      if (entry.isFile) {
        var file = await this.getFile(entry);
        console.log(file)
        fileEntries.push(file);
        this.props.onFiles([file]);
      } else if (entry.isDirectory) {
        queue.push(...await this.readAllDirectoryEntries(entry.createReader()));
      }
    }
    return fileEntries;
  }
  
  // Get all the entries (files or sub-directories) in a directory 
  // by calling readEntries until it returns empty array
  async readAllDirectoryEntries(directoryReader) {
    let entries = [];
    let readEntries = await this.readEntriesPromise(directoryReader);
    while (readEntries.length > 0) {
      entries.push(...readEntries);
      readEntries = await this.readEntriesPromise(directoryReader);
    }
    return entries;
  }
  
  // Wrap readEntries in a promise to make working with readEntries easier
  // readEntries will return only some of the entries in a directory
  // e.g. Chrome returns at most 100 entries at a time
  async readEntriesPromise(directoryReader) {
    try {
      return await new Promise((resolve, reject) => {
        directoryReader.readEntries(resolve, reject);
      });
    } catch (err) {
      console.log(err);
    }
  }

  handleDrop(e) {
    console.log("HANDLE DROP")
    console.log(e)
    console.log(e.dataTransfer.items)
    var res = this.getAllFileEntries(e.dataTransfer.items)
    console.log(res)
    window.res = res
    window.ef = e.target
    
    // if (e.target.files && onFiles) onFiles(e.target.files);
    // if (onChange) onChange(e);
  }

  render() {
    let { hover } = this.state;
    let {
      children,
      uploadProps,
      containerProps,
      onFiles,
      onChange,
    } = this.props;

    let handleHover = typeof children === 'function';

    return (
      <div
        style={styles.container}
        {...containerProps}
        onMouseEnter={() => handleHover ? this.setState({ hover: true }) : null}
        onMouseLeave={() =>
          handleHover ? this.setState({ hover: false }) : null}
        onDrop={this.handleDrop.bind(this)}
      >
        {handleHover ? children(hover) : children}
        <input
          ref={(el) => { this.fileInputRef = el }}
          type="file"
          style={styles.input}
          onChange={this.onFileChange.bind(this)}
          {...uploadProps}
        />
      </div>
    );
  }
}

var styles = {
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  input: {
    top: 0,
    right: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    position: 'absolute',
  },
};

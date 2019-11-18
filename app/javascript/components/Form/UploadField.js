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
    var files = Array.from(e.target.files).map((f) => { return {name: f.name, file: f} })
    if (e.target.files && this.props.onFiles) this.props.onFiles(files);
  }

  async getFile(fileEntry) {
    try {
      return await new Promise((resolve, reject) => fileEntry.file(resolve, reject));
    } catch (err) {
      console.log(err);
      return null
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
        if (file) {
          var name = entry.fullPath
          if (!name)
            name = file.name

          var fhash = {name: name, file: file}
          fileEntries.push(fhash);
        }
        // if (this.props.onChange) this.props.onChange(e);

        // this.props.onFiles([fhash]);
      } else if (entry.isDirectory) {        
        queue.push(...await this.readAllDirectoryEntries(entry.createReader()));
        
      }
    }
    if (this.props.onFiles) this.props.onFiles(fileEntries);
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
    if (this.props.uploadProps.multiple) {
      var res = this.getAllFileEntries(e.dataTransfer.items)
      e.stopPropagation()
      e.preventDefault()
    }
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

/*
 *  SearchDropdown.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 05/7/19
 *  Copyright 2018 FrenzyLabs
 */

import React                      from 'react';
import { Button, Icon, Dropdown, DropdownContent, DropdownItem, DropdownDivider, DropdownMenu, DropdownTrigger } from 'bloomer';

import Spinner from '../Modal/spinner';

let lastId = 0;

export function newID(prefix='id') {
    lastId++;
    return `${prefix}${lastId}`;
}

export class SearchDropdown extends React.Component {
  constructor(props) {
    super(props);


    var selectedOption = this.props.selected 
    this.state = { prompText: "Select", 
      isActive: false, 
      dropdownOptions: this.props.options, 
      selected: selectedOption,
      localFilter: "" 
    }

    this.id = props.id || newID();

    this.searchInput     = React.createRef(); 
    this.toggleIsActive  = this.toggleIsActive.bind(this);
    this.onBlur          = this.onBlur.bind(this)
    this.onMouseDown     = this.onMouseDown.bind(this)
    this.onMouseUp       = this.onMouseUp.bind(this)
    this.handleKeyEvent  = this.handleKeyEvent.bind(this)
    this.localFilter     = this.localFilter.bind(this)
    this.renderOptionItem = this.renderOptionItem.bind(this)
    window.sd = this
  }

  componentDidUpdate(prevProps) {
    if (this.props.selected != prevProps.selected || this.props.options != prevProps.options) {
      var selectedOption = this.props.selected 
      var localFilter = ""
      if (this.props.meta && this.props.meta.last_page == 1) {
        localFilter = this.searchInput.current.value
      }
      this.setState({dropdownOptions: this.props.options, selected: selectedOption, localFilter: localFilter })
    }
  }
  

  onChange = (e) => {
    const searchQuery = e.target.value
    var tryInitialFilter = true
    if (searchQuery == '' || (!searchQuery.startsWith(this.state.localFilter)))
      tryInitialFilter = false

    if (this.props.meta && tryInitialFilter) {
      if (this.props.meta.last_page == 1) {
        return this.localFilter(searchQuery)
      }
    }
    if (this.props.onFilter) {
      this.props.onFilter(searchQuery)
    } else {
      return this.localFilter(searchQuery)
    }
    
  }

  localFilter(searchQuery) {
    // if (this.state.localFilter.length == 0)
    //   this.state.localFilter = searchQuery
    if(searchQuery == '') {
      this.setState({dropdownOptions: this.props.options})
      return
    }
    var r = this.props.options.filter((opt, index, opts) => {
      if (typeof(opt) == "string") {
        name = opt;
      } else {
        name = opt.name
      }
      return name.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0;
    })
    this.setState({dropdownOptions: r})
  }

  setSelected(item) {
    this.setState( {selected: item, isActive: false})
    if (this.props.onSelected) {
      this.props.onSelected(item, this.id)
    }
  }

  toggleIsActive() {
    this.noBlur = false;
    this.setState({ isActive: !this.state.isActive})
  }

  onBlur(e) {
    var currentTarget = e.currentTarget;
    if (this.noBlur == true) {
      return;
    }
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
          this.noBlur = false;
          this.setState({ isActive: false})
      }
    }, 0);
  }

  onMouseDown(e) {
    this.noBlur = true;
  }

  onMouseUp(e, item) {
    this.noBlur = false;
    this.setSelected(item)
  }

  handleKeyEvent(e) {
    var preventDefault = false
    if (e.keyCode == 13) {
      preventDefault = true
      if (this.state.dropdownOptions.length == 1) {
        this.setSelected(this.state.dropdownOptions[0])
      } else {
        var searchTerm = this.searchInput.current.value;
        if (searchTerm.length > 2){
          this.setSelected({name: searchTerm, value: searchTerm})
        }
      }
    } else if(e.keyCode == 40) {  // Down Arrow
      preventDefault = true

    } else if(e.keyCode == 38) { // Up Arrow
      preventDefault = true
    }
    if (preventDefault) {
      if (this.state.isActive) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }

  optionNameByValue(item) {
    if (item == null) {
      return this.optionName(item)
    }
    else {
      let optValue = this.optionValue(item)
      let option = this.state.dropdownOptions ? this.state.dropdownOptions.find((x) => this.optionValue(x) == optValue) : optValue
      if (!option) {
        option = optValue
      }
      
      return this.optionName(option)
    }
  }

  optionName(item) {
    if (item == null) {
      return this.props.promptText || this.state.promptText;
    }
    else if (typeof(item) == "string") {
      return item || this.props.promptText || this.state.promptText;
    } else {
      return item.name || this.props.promptText || this.state.promptText;
    }
  }

  optionValue(item) {
    if (typeof(item) == "string") {
      return item;
    } else {
      return item.value || item.name
    }
  }

  renderOptionItem(item) {
    if (this.props.renderOptionItem) {
      return this.props.renderOptionItem(item)
    } 
    return this.optionName(item)
  }

  renderOptions() {
    if (this.props.loading) {
      return (
        <Spinner /> 
      )
    }
    if (this.state.dropdownOptions.length > 0) {

      return this.state.dropdownOptions.map((item) => {
        return (
          <DropdownItem tag="a" isActive={(this.state.selected && this.state.selected.id == item.id)} onMouseDown={this.onMouseDown} onMouseUp={(e) => this.onMouseUp(e, item)} key={this.optionValue(item)}>
            {this.renderOptionItem(item)}
          </DropdownItem>)
      });
    }
  }

  renderSearchField() {
    if (!this.props.hideSearch) {
      return (
        <DropdownItem>
            <input ref={this.searchInput} type="text" placeholder={this.props.placeholder || "Revision"} className="input is-transparent" />
        </DropdownItem>
      );
    }
  }

  render() {
    return (
      <Dropdown key={this.id} onChange={this.onChange} onKeyDown={this.handleKeyEvent} onBlur={this.onBlur} isActive={this.state.isActive}>
        <DropdownTrigger onClick={this.toggleIsActive}>
          <Button isOutlined aria-haspopup="true" aria-controls="dropdown-menu" isSize="small">
            <span>{this.optionNameByValue(this.state.selected)}</span>
            <Icon icon="angle-down" className="fas fa-angle-down" isSize="small" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu >
          <DropdownContent>
            {this.renderSearchField()}
            <DropdownDivider />
            {this.renderOptions()}
          </DropdownContent>          
        </DropdownMenu>
      </Dropdown>
    );
  }
}


export default SearchDropdown;

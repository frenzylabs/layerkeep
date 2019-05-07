/*
 *  SearchDropdown.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 05/7/19
 *  Copyright 2018 FrenzyLabs
 */

import React                      from 'react';
import { Button, Icon, Dropdown, DropdownContent, DropdownItem, DropdownDivider, DropdownMenu, DropdownTrigger } from 'bloomer';


 export class SearchDropdown extends React.Component {
  constructor(props) {
    super(props);


    var selectedOption = this.props.selected || {name: "Master", value: "master"}
    this.state = {isActive: false, dropdownOptions: this.props.options, selected: selectedOption }

    this.searchInput     = React.createRef(); 
    this.toggleIsActive  = this.toggleIsActive.bind(this);
    this.onBlur          = this.onBlur.bind(this)
    this.onMouseDown     = this.onMouseDown.bind(this)
    this.onMouseUp       = this.onMouseUp.bind(this)
    this.handleKeyEvent  = this.handleKeyEvent.bind(this)
    
  }

  componentDidUpdate(prevProps) {
    if (this.props != prevProps) {
      var selectedOption = this.props.selected || {name: "Master", value: "master"}
      this.setState({isActive: false, dropdownOptions: this.props.options, selected: selectedOption })
    }
  }
  

  onChange = (e) => {
    const searchQuery = e.target.value
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
      this.props.onSelected(item)
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
    if (e.keyCode == 13) {
      if (this.state.dropdownOptions.length == 1) {
        this.setSelected(this.state.dropdownOptions[0])
      } else {
        var searchTerm = this.searchInput.current.value;
        if (searchTerm.length > 2){
          this.setSelected({name: searchTerm, value: searchTerm})
        }
      }
    } else if(e.keyCode == 40) {


    } else if(e.keyCode == 38) {

    }
  }

  optionName(item) {
    if (typeof(item) == "string") {
      return item;        
    } else {
      return item.name
    }
  }

  optionValue(item) {
    if (typeof(item) == "string") {
      return item;        
    } else {
      return item.value
    }
  }

  renderOptions() {
    if (this.state.dropdownOptions.length > 0) {
      return this.state.dropdownOptions.map((item) => {
        return (<DropdownItem tag="a" onMouseDown={this.onMouseDown} onMouseUp={(e) => this.onMouseUp(e, item)} key={this.optionValue(item)}>{this.optionName(item)}</DropdownItem>)
      });
    }
  }

  render() {
    return (
      <Dropdown onChange={this.onChange} onBlur={this.onBlur} isActive={this.state.isActive}>
        <DropdownTrigger onClick={this.toggleIsActive}>
          <Button isOutlined aria-haspopup="true" aria-controls="dropdown-menu">
            <span>{this.optionName(this.state.selected)}</span>
            <Icon icon="angle-down" className="fas fa-angle-down" isSize="small" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu >
          <DropdownContent>
            <DropdownItem>
                <input ref={this.searchInput} onKeyDown={this.handleKeyEvent} type="text" placeholder="Revision" className="input is-transparent" />
            </DropdownItem>
            <DropdownDivider />
            {this.renderOptions()}            
          </DropdownContent>          
        </DropdownMenu>
      </Dropdown>
    );
  }
}


export default SearchDropdown;

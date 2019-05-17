/*
 *  InputField.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/29/19
 *  Copyright 2018 WessCope
 */

import React                      from 'react';
import { propTypes, withFormsy }  from 'formsy-react';
import { Field }                  from 'bloomer/lib/elements/Form/Field/Field';
import { Label }                  from 'bloomer/lib/elements/Form/Label';
import { Control }                from 'bloomer/lib/elements/Form/Control';
import { Input }                  from 'bloomer/lib/elements/Form/Input';

 class InputField extends React.Component {
  constructor(props) {
    super(props);

    this.changeValue = this.changeValue.bind(this);
  }

  changeValue(e) {
    this.props.setValue(e.currentTarget.value);
  }

  render() {
    const error         = this.props.getErrorMessage();
    const label         = this.props.label || "";
    const placeholder   = this.props.placeholder || label || "";
    const className     = this.props.required ? 'required' : this.error ? 'is-danger' : null;

    return (
      <Field>
        <Label>{label}</Label>
        <Control>
          <Input 
            type="text" 
            placeholder={placeholder} 
            className={className} 
            onChange={this.changeValue}
            value={this.props.getValue() || ''}
          />

          {null && 
            <span className="has-text-danger">{error}</span>
          }
        </Control>
      </Field>
    );
  }
 }

 InputField.propTypes = {
  ...propTypes,
 };

export default withFormsy(InputField);

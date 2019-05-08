/*
 *  index.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/07/19
 *  Copyright 2018 WessCope
 */

import React                                        from 'react';
import { Modal as BulmaModal }                      from 'bloomer/lib/components/Modal/Modal';
import { ModalBackground as BulmaModalBackground }  from 'bloomer/lib/components/Modal/ModalBackground';
import { ModalContent as BulmaModalContent }        from 'bloomer/lib/components/Modal/ModalContent';
import { ModalClose as BulmaModalClose }            from 'bloomer/lib/components/Modal/ModalClose';
import { Box }                                      from 'bloomer/lib/elements/Box';

import UploadModal from './upload';

export default class Modal extends React.Component {
  static upload = UploadModal;

  render() {
    return (
      <BulmaModal isActive={this.props.isActive}>
        <BulmaModalBackground onClick={this.props.dismissAction}/>
        <BulmaModalContent>
          <Box>
            {React.createElement(this.props.component, {dismissAction: this.props.dismissAction, project: this.props.project})}
          </Box>
        </BulmaModalContent>
        <BulmaModalClose onClick={this.props.dismissAction}/>
      </BulmaModal>
    )
  }
}
 
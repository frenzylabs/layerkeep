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
import SpinnerModal from './spinner';

export default class Modal extends React.Component {
  static upload   = UploadModal;
  static spinner  = SpinnerModal;

  render() {
    return (
      <BulmaModal isActive={this.props.isActive}>
        <BulmaModalBackground onClick={this.props.dismissAction}/>
        <BulmaModalContent>
          <Box>
            <this.props.component dismissAction={this.props.dismissAction} {...this.props} />
          </Box>
        </BulmaModalContent>
        <BulmaModalClose onClick={this.props.dismissAction}/>
      </BulmaModal>
    )
  }
}
 
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const Dialog = ({
  buttonLabel = 'Move',
  title,
  modal,
  handleCancel,
  handleMove,
  children,
}) => {
  return (
    <Modal isOpen={modal} toggle={handleCancel}>
      <ModalHeader toggle={handleCancel}>{title || 'xxx'}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleMove}>
          {buttonLabel}
        </Button>{' '}
        <Button color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default Dialog;

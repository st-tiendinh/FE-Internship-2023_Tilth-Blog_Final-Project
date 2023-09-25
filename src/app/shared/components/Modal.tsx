import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ConfirmModal } from './ConfirmModal';

import { RootState } from '../../app.reducers';
import {
  setHideModal,
} from '../../../redux/actions/modal';

export enum ModalType {
  DANGER = 'DANGER',
  WARNING = 'WARNING',
  INFO = 'INFO',
}


export const Modal = () => {
  const isShow = useSelector((state: RootState) => state.modalReducer.isShow);
  const dispatch = useDispatch();
  const type = useSelector((state: RootState) => state.modalReducer.type);
  const message = useSelector((state: RootState) => state.modalReducer.message);


  const handleClose = () => {
    dispatch(setHideModal());
  };

  return (
    <div className={`modal-wrapper ${isShow ? 'd-block' : 'd-none'}`}>
      <div className="modal">
        <div className="modal-header">
          {type === ModalType.DANGER && <i className="icon icon-danger"></i>}
          <h4 className="modal-title">{message}</h4>

          <span className="modal-close" onClick={handleClose}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <ConfirmModal />
        </div>
      </div>
    </div>
  );
};

import React, { PropTypes } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Dialog from 'react-toolbox/lib/dialog';
import classNames from 'classnames/bind';
import styles from './DefectsDialog.scss';
import DefectListItem from '../DefectListItem';

const cx = classNames.bind(styles);

const DefectsDialog = ({active, hideDialog, title, defects}) => (
    <Dialog
        active={active}
        onEscKeyDown={hideDialog}
        onOverlayClick={hideDialog}
        title={title}
        actions={[
            { label: 'Close', onClick: hideDialog }
        ]}
        className={cx('dialog')}
    >
        <Scrollbars className={cx('dialog_content')}>
            { defects && defects.map(defect => <DefectListItem key={defect._id} defect={defect} className={cx('defect')}/>) }
        </Scrollbars>
    </Dialog>
)

DefectsDialog.propTypes = {
    active: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    hideDialog: PropTypes.func.isRequired,
    defects: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default DefectsDialog;
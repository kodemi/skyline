import React, { PropTypes } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import styles from './ConfirmDeleteDialog.scss';

const ConfirmDeleteDialog = ({active, onYes, onNo, title}) => {
    const actions = [
        { label: 'Yes', onClick: onYes },
        { label: 'No', onClick: onNo }
    ];
    return (
        <Dialog 
            active={active} 
            actions={actions} 
            title={title}
            className={styles.dialog}
        >Are you shure?</Dialog>
    )
}

ConfirmDeleteDialog.propTypes = {
    active: PropTypes.bool.isRequired,
    onYes: PropTypes.func.isRequired,
    onNo: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
}

export default ConfirmDeleteDialog;
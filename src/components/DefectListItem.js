import React, { PropTypes } from 'react';
import moment from 'moment';
import FontIcon from 'react-toolbox/lib/font_icon';
import styles from './DefectListItem.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);


const DefectListItem = ({defect, className}) => (
    <div className={cx('defect', className)}>
        <div className={cx('item_row')}>
            {/*<span className={cx('defectDate_label')}>Defect Date:</span>*/}
            <FontIcon value='schedule' />
            <span className={cx('defectDate_value')}>{ moment.utc(defect.defectDate).format('DD.MM.YYYY') }</span>
        </div>
        <div className={cx('item_row')}>
            <span className={cx('defectType_label')}>Type:</span>
            <span className={cx('defectType_value')}>{ defect.defectType }</span>
        </div>
        <div className={cx('item_row')}>
            <span className={cx('defectStatus_label')}>Status:</span>
            <span className={cx('defectStatus_value', `defectStatus__${defect.status}`)}>{ defect.status + (defect.status === 'resolved' ? ` (${moment.utc(defect.resolveDate).format('DD.MM.YYYY')})` : '') }</span>
        </div>
        <div className={cx('item_row')}>
            <span className={cx('defectDescription_label')}>Description: {!defect.description && '-'}</span>
            <span className={cx('defectDescription_value')}>{ defect.description }</span>
        </div>
    </div>
);

DefectListItem.propTypes = {
    defect: PropTypes.object.isRequired,
    className: PropTypes.string
};

export default DefectListItem;
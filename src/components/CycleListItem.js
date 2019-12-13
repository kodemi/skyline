import React, { PropTypes } from 'react';
import styles from './CycleListItem.scss';
import FontIcon from 'react-toolbox/lib/font_icon';
import classNames from 'classnames/bind';
import moment from 'moment';

const cx = classNames.bind(styles);

const CycleListItem = ({cycle}) => (
    <div className={cx('cycle')}>
        <div className={cx('item_row')}>
            {/*<span className={cx('takeoff_label')}>Takeoff:</span>*/}
            <FontIcon value='flight_takeoff' />
            <span className={cx('takeoff_value')}>{ moment.utc(cycle.takeoff).format('DD.MM.YYYY HH:mm') }</span>
        </div>
        <div className={cx('item_row')}>
            {/*<span className={cx('flightTime_label')}>Flight Time:</span>*/}
            <FontIcon value='schedule' />
            <span className={cx('flightTime_value')}>{ formatTime(cycle.flightTime) }h</span>
        </div>
    </div>
)

CycleListItem.propTypes = {
    cycle: PropTypes.object.isRequired
}

const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    return minutes !== 0 ? `${hours}:${minutes < 9 ? '0' + minutes : minutes}` : `${hours}`;
}

export default CycleListItem;
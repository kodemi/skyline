import React, { PropTypes } from 'react';
import { ListItem } from 'react-toolbox/lib/list';
import classNames from 'classnames/bind';

import styles from './AircraftsListItem.scss';

const cx = classNames.bind(styles);

const itemContent = (aircraft) => {
    return (
        <div>
            <h3 className={cx('tailNumber')}>{aircraft.tailNumber}</h3>
            <h4 className={cx('acType')}>{aircraft.acType}</h4>
        </div>
    );
};

const AircraftsListItem = ({ aircraft, locale, onAircraftClick }) => (
    <ListItem
        theme={styles}
        onClick={onAircraftClick.bind(this, aircraft)}
        itemContent={itemContent(aircraft, locale)}
    />
);

AircraftsListItem.propTypes = {
    aircraft: PropTypes.object.isRequired,
    locale: PropTypes.string,
    onAircraftClick: PropTypes.func.isRequired
};

export default AircraftsListItem;

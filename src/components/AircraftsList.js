import React, { PropTypes } from 'react';
import { List } from 'react-toolbox/lib/list';

import AircraftsListItem from './AircraftsListItem';
import styles from './AircraftsList.scss';

const AircraftsList = ({ aircrafts, locale, onAircraftClick }) => (
    <List ripple theme={styles}>
        {aircrafts.map(aircraft => (
            <AircraftsListItem key={aircraft.tailNumber} aircraft={aircraft} locale={locale} onAircraftClick={onAircraftClick} />                       
        ))}
    </List>
);

AircraftsList.propTypes = {
    aircrafts: PropTypes.arrayOf(PropTypes.object).isRequired,
    locale: PropTypes.string,
    onAircraftClick: PropTypes.func.isRequired
};

export default AircraftsList;


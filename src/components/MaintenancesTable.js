import React, { PropTypes } from 'react';
import styles from './MaintenancesTable.scss';
import classNames from 'classnames/bind';
import MaintenananceRow from './MaintenanceRow';

const cx = classNames.bind(styles);

const MaintenanceTable = ({ onRowClick, aircraft, className }) => (
    <table className={cx('table', className)}>
        <thead>
            <tr>
                <th />
                <th>FH remaining</th>
                <th>Cycles</th>
                <th>Calendar</th>
            </tr>
        </thead>
        <tbody>
            {aircraft.maintenances
                .sort((a, b) => a.order - b.order)
                .map((maintenance) => (
                    <MaintenananceRow
                        key={maintenance._id}
                        maintenance={maintenance}
                        tsn={aircraft.tsn}
                        csn={aircraft.csn}
                        onClick={onRowClick}
                    />
                ))}
        </tbody>
    </table>
);

MaintenanceTable.propTypes = {
    aircraft: PropTypes.object.isRequired,
    className: PropTypes.string,
    onRowClick: PropTypes.func.isRequired
};

export default MaintenanceTable;

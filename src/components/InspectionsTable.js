import React, { PropTypes } from 'react';
import styles from './InspectionsTable.scss';
import classNames from 'classnames/bind';
import InspectionRow from './InspectionRow';

const cx = classNames.bind(styles);

const InspectionsTable = ({inspections, onRowClick}) => (
    <table className={cx('table')}>
        <thead>
            <tr>
                <th rowSpan={2}>Inspections</th>
                <th colSpan={3}>Required Every</th>
                <th colSpan={3}>Last Compliance</th>
                <th colSpan={3}>Next Due</th>
                <th colSpan={3}>Remaining</th>
            </tr>
            <tr>
                <th>Hours</th>
                <th>LDGS</th>
                <th>MOS</th>
                <th>Hours</th>
                <th>LDGS</th>
                <th>Date</th>
                <th>Hours</th>
                <th>LDGS</th>
                <th>Date</th>
                <th>Hours</th>
                <th>LDGS</th>
                <th>MOS</th>
            </tr>
        </thead>
        <tbody>
            {inspections && inspections.map(inspection => <InspectionRow key={inspection._id} inspection={inspection} onClick={onRowClick} />)}
        </tbody>
    </table>
);

InspectionsTable.propTypes = {
    inspections: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRowClick: PropTypes.func.isRequired
};

export default InspectionsTable;

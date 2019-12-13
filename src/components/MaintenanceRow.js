import React, { PropTypes } from 'react';
import moment from 'moment';
const dateFormat = 'DD.MM.YYYY';

const MaintenanceRow = ({maintenance, tsn, csn, onClick}) => (
    <tr onClick={() => onClick && onClick(maintenance)}>
        <td>{maintenance && maintenance.name}</td>
        <td>{ maintenance && maintenance.fh && ((maintenance.fh - tsn).toFixed(2) || '0') || '-' }</td>
        <td>{ maintenance && maintenance.cycles && ((maintenance.cycles - csn) || '0') || '-' }</td>
        <td>{ maintenance && maintenance.calendar && maintenance.calendar && moment(maintenance.calendar).format(dateFormat) || '-' }</td>
    </tr>
);

MaintenanceRow.propTypes = {
    maintenance: PropTypes.object.isRequired,
    tsn: PropTypes.number.isRequired,
    csn: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
};

export default MaintenanceRow;
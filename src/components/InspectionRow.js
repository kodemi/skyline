import React, { PropTypes } from 'react';
import moment from 'moment';

const InspectionRow = ({inspection, onClick}) => (
    <tr onClick={() => onClick(inspection)}>
        <td>{inspection.name}</td>
        <td>{inspection.requiredEvery.hours}</td>
        <td>{inspection.requiredEvery.ldgs}</td>
        <td>{inspection.requiredEvery.mos}</td>
        
        <td>{inspection.lastCompliance.hours}</td>        
        <td>{inspection.lastCompliance.ldgs}</td>   
        <td>{inspection.lastCompliance.date && moment(inspection.lastCompliance.date).format('DD.MM.YYYY')}</td>

        <td>{inspection.nextDue.hours}</td>
        <td>{inspection.nextDue.ldgs}</td>
        <td>{inspection.nextDue.date && moment(inspection.nextDue.date).format('DD.MM.YYYY')}</td>

        <td>{inspection.remaining.hours && inspection.remaining.hours.toFixed(2)}</td>
        <td>{inspection.remaining.ldgs}</td>
        <td>{inspection.remaining.mos}</td>       
    </tr>
);

InspectionRow.propTypes = {
    inspection: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
};

export default InspectionRow;
import React, { PropTypes } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'react-toolbox/lib/card';
import MaintenancesTable from './MaintenancesTable';
import { acImages } from '../images';
import styles from './AircraftCard.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Badge = ({className, type, children, onClick}) => (
    <a className={cx('badge', `badge__${type}`, className)} onClick={onClick} style={{position: 'relative'}}>{ children }</a>
);

const AircraftCard = ({aircraft, showNewDefects, showWorkDefects, className}) => {
    const newDefects = aircraft.defects && aircraft.defects.filter(defect => defect.status === 'new') || [];
    const workDefects = aircraft.defects && aircraft.defects.filter(defect => defect.status === 'work') || [];
    
    return (
        <Card className={cx(className, 'card')}>
            <CardTitle title={aircraft.tailNumber} subtitle={aircraft.acType} theme={styles}>
                <div className={cx('badges')}>
                    { newDefects.length && <Badge type='new' onClick={showNewDefects}>{ newDefects.length }</Badge> || null }
                    { workDefects.length && <Badge type='work' onClick={showWorkDefects}>{ workDefects.length }</Badge> || null }
                </div>
            </CardTitle>
            <CardMedia aspectRatio='wide'>
                <img src={ acImages[aircraft.tailNumber] } />
            </CardMedia>
            <CardText theme={styles}>
                <MaintenancesTable aircraft={aircraft} className={cx('maintenances')} />
            </CardText>
        </Card>
    )
};

AircraftCard.propTypes = {
    aircraft: PropTypes.object.isRequired,
    showNewDefects: PropTypes.func.isRequired,
    showWorkDefects: PropTypes.func.isRequired,
    className: PropTypes.string
};

export default AircraftCard;
import React from 'react';
import styles from './Spinner.scss';

export default class Spinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: true
        }
        this.show = this.show.bind(this);
    } 

    componentDidMount() {
        this.showTimeoutId = setTimeout(this.show, this.props.wait || 0);
    }

    componentWillUnmount() {
        clearTimeout(this.showTimeoutId);
    }

    show() {
        this.setState({hidden: false});
    }

    render() {
        return (
            <div className={`${styles.wrapper} ${this.state.hidden ? styles.hidden : ''}`}>
                <svg className={styles.spinner} width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                    <circle className={styles.path} fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
                </svg>
            </div>
        );
    }
} 
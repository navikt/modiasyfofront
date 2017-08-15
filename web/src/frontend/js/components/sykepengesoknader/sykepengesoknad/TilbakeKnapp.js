import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const TilbakeKnapp = ({ fnr, clazz }) => {
    return (<div className={`knapperad ${clazz}`}>
        <Link to={`/sykefravaer/${fnr}/sykepengesoknader`} className="rammeknapp rammeknapp--mini">Tilbake</Link>
    </div>);
};

TilbakeKnapp.propTypes = {
    fnr: PropTypes.string,
    clazz: PropTypes.string,
};

export default TilbakeKnapp;
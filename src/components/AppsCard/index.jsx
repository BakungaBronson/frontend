import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppStatus from '../AppStatus';
import LineChartComponent from '../LineChart';
import './AppsCard.css';
import getAppMemory from '../../redux/actions/appMemory';


class AppsCard extends React.Component {
  componentDidMount() {
    const { cardID, getAppMemory, match } = this.props;
    const { projectID, appID } = match.params;

    clearAppMemory();
    getAppMemory(projectID, appID, {});
  }
  const {
    name, appStatus, url, appId, otherData
  } = props;

  return (
    <Link
      to={{
        pathname: `/users/${otherData.userID}/projects/${otherData.projectID}/apps/${appId}/metrics`, state: { appName: name, liveAppStatus: appStatus, appUrl: url
      }}}
      key={otherData.projectID}
      className="AppName"
    >
      <div className="AppCard">
        <div className="AppCardHeader">
          <div className="AppNameSection">
            {name}
          </div>
          <div className="AppIconsSection">
            <div className="StatusData">
              <AppStatus appStatus={appStatus} />
            </div>
          </div>
        </div>
        <div className="AppCardBottomSection">
          <div className="AppGraphSummaryLabel">Memory (1d)</div>
          <div className="AppGraphSummary">
            <LineChartComponent lineDataKey="uv" preview  />
          </div>
        </div>
      </div>
    </Link>
  );
};

// inititate props
AppsCard.propTypes = {
  name: PropTypes.string.isRequired,
  appStatus: PropTypes.string.isRequired, // this is static
  url: PropTypes.string.isRequired,
  appId: PropTypes.string.isRequired,
  otherData: PropTypes.shape({
    userID: PropTypes.string.isRequired,
    projectID: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = (state) => {
  const { data } = state.user;
  const { 
    appMemoryMetrics,
    isFetchingAppMemory,
    appMemoryMessage } = state.appMemoryReducer;
  return {
    data,
    appMemoryMetrics,
    isFetchingAppMemory,
    appMemoryMessage
  };
};

const mapDispatchToProps = {
  getAppMemory
};

export default connect(mapStateToProps, mapDispatchToProps)(AppsCard);

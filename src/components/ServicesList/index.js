import React, { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./ServicesList.css";
import Header from "../Header";
import InformationBar from "../InformationBar";
import Spinner from "../Spinner";
import SideNav from "../SideNav";
import getServices from "../../redux/actions/services";

const ServicesListPage = () => {
  const { clusterID } = useParams();
  const dispatch = useDispatch();

  const serviceResources = useCallback(
    () => dispatch(getServices(clusterID)),
    [dispatch, clusterID]
  );

  useEffect(() => {
    serviceResources();
  }, [serviceResources]);

  const { isRetrieving, services, isFetched } = useSelector(
    (state) => state.servicesReducer
  );

  const clusterName = localStorage.getItem("clusterName");

  const showPorts = (ports) => {
    let portValue = "";
    ports.map((port) => {
      if (portValue !== "") {
        portValue += ", ";
      }
      portValue += `${port.port}`;
      if (port.nodePort !== undefined) {
        portValue += `:${port.nodePort}`;
      }
      portValue += `/${port.protocol}`;
      return portValue;
    });
    return portValue;
  };

  return (
    <div className="MainPage">
      <div className="TopBarSection">
        <Header />
      </div>
      <div className="MainSection">
        <div className="SideBarSection">
          <SideNav clusterName={clusterName} clusterId={clusterID} />
        </div>
        <div className="MainContentSection">
          <div className="InformationBarSection">
            <InformationBar header="Services" showBtn={false} />
          </div>
          <div className="ContentSection">
            <div
              className={
                isRetrieving
                  ? "ResourcesTable LoadingResourcesTable"
                  : "ResourcesTable"
              }
            >
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Cluster IP</th>
                    <th>Ports</th>
                  </tr>
                </thead>
                {isRetrieving ? (
                  <tbody>
                    <tr className="TableLoading">
                      <td>
                        <div className="SpinnerWrapper">
                          <Spinner size="big" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {isFetched &&
                      services !== undefined &&
                      services.map((service) => (
                        <tr key={services.indexOf(service)}>
                          <td>{service.metadata.name}</td>
                          <td>{service.spec.type}</td>
                          <td>{service.spec.clusterIP}</td>
                          <td>{showPorts(service.spec.ports)}</td>
                        </tr>
                      ))}
                  </tbody>
                )}
              </table>

              {isFetched && services.length === 0 && (
                <div className="NoResourcesMessage">
                  <p>No Services Available</p>
                </div>
              )}
              {!isRetrieving && !isFetched && (
                <div className="NoResourcesMessage">
                  <p>
                    Oops! Something went wrong! Failed to retrieve Services.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesListPage;

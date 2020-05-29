import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PrimaryButton from '../PrimaryButton';
import DotsImg from '../../assets/images/3dots.svg';
import deleteProject, { clearDeleteProjectState } from '../../redux/actions/deleteProject';
import updateProject from '../../redux/actions/updateProject';
import Spinner from '../SpinnerComponent';
import TextArea from '../TextArea';
import Feedback from '../Feedback';
import DeleteWarning from '../DeleteWarning';
import Tooltip from '../Tooltip';
import BlackInputText from '../BlackInputText';
import Modal from '../Modal';
import './ProjectCard.css';

class ProjectCard extends React.Component {
  constructor(props) {
    super(props);
    const { name, description } = props;
    this.state = {
      openUpdateModal: false,
      openDeleteAlert: false,
      openDropDown: false,
      projectName: name ? props.name : '',
      projectDescription: description ? props.description : '',
      error: ''
    };

    this.showUpdateForm = this.showUpdateForm.bind(this);
    this.hideUpdateForm = this.hideUpdateForm.bind(this);
    this.handleDeleteProject = this.handleDeleteProject.bind(this);
    this.showDeleteAlert = this.showDeleteAlert.bind(this);
    this.hideDeleteAlert = this.hideDeleteAlert.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.hideDropDown = this.hideDropDown.bind(this);
    this.showDropDown = this.showDropDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateProjectName = this.validateProjectName.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { isDeleted } = this.props;

    if (isDeleted !== prevProps.isDeleted) {
      this.hideDeleteAlert();
    }
  }

  showDropDown() {
    this.setState({
      openDropDown: true,
    });
  }

  toggleDropDown() {
    const { openDropDown } = this.state;

    if (openDropDown) {
      this.hideDropDown();
    } else {
      this.showDropDown();
    }
  }

  hideDropDown() {
    this.setState({
      openDropDown: false
    });
  }

  showUpdateForm() {
    this.setState({ openUpdateModal: true });
  }

  hideUpdateForm() {
    const { name, description } = this.props;
    this.setState({
      openUpdateModal: false,
      projectName: name,
      projectDescription: description
    });
  }

  validateProjectName(name) {
    if (/^[a-z]/i.test(name)) {
      if (name.match(/[^-a-zA-Z]/)) {
        return 'false_convention';
      }
      return true;
    }
    return false;
  }

  handleChange(e) {
    const { error } = this.state;
    this.setState({
      [e.target.name]: e.target.value
    });

    if (error) {
      this.setState({
        error: ''
      });
    }
  }

  handleSubmit() {
    const { projectName, projectDescription } = this.state;
    const {
      updateProject, cardID, name, description
    } = this.props;

    if (projectName !== name || projectDescription !== description) {
      if (!projectName || !projectDescription) {
        this.setState({
          error: 'please provide either a new name or description'
        });
      } else {
        if (projectName !== name && projectDescription === description) {
          if (!this.validateProjectName(projectName)) {
            this.setState({
              error: 'name should start with a letter'
            });
          } else if (this.validateProjectName(projectName) === 'false_convention') {
            this.setState({
              error: 'name may only contain letters and a hypen -'
            });
          } else {
            const newProject = { name: projectName };
            updateProject(cardID, newProject);
          }
        }

        if (projectName === name && projectDescription !== description) {
          const newProject = { description: projectDescription };
          updateProject(cardID, newProject);
        }

        if (projectName !== name && projectDescription !== description) {
          if (!this.validateProjectName(projectName)) {
            this.setState({
              error: 'name should start with a letter'
            });
          } else if (this.validateProjectName(projectName) === 'false_convention') {
            this.setState({
              error: 'name may only contain letters and a hypen -'
            });
          } else {
            const newProject = { name: projectName, description: projectDescription };
            updateProject(cardID, newProject);
          }
        }
      }
    }
  }


  handleDeleteProject(e, projectID) {
    const { deleteProject } = this.props;
    e.preventDefault();
    deleteProject(projectID);
  }


  showDeleteAlert() {
    this.setState({ openDeleteAlert: true });
  }

  hideDeleteAlert() {
    const { clearDeleteProjectState } = this.props;
    clearDeleteProjectState();
    this.setState({ openDeleteAlert: false });
  }

  render() {
    const {
      name, isDeleting, data, description, icon, cardID, isUpdating, message, isFailed
    } = this.props;
    const userId = data.id;
    const {
      openDeleteAlert,
      openDropDown,
      projectName,
      projectDescription,
      openUpdateModal,
      error
    } = this.state;

    return (
      <div>
        <div className="ProjectsCard">
          <Link to={{ pathname: `/users/${userId}/projects/${cardID}/apps` }} key={cardID}>
            <div className="ProjectImageDiv" style={{ backgroundImage: `url(${icon})` }} />
          </Link>
          <div className="BottomContainer">
            <Link to={{ pathname: `/users/${userId}/projects/${cardID}/apps` }} key={cardID}>
              <div className="ProjectsCardName">{name}</div>
            </Link>
            <div className="ProjectsCardDesc">
              <table className="ProjectTab">
                <tbody>
                  <tr>
                    <td className="ProjectName">{description}</td>
                    <td className="OtherData">
                      <div className="DropDownData">
                        <div
                          className="ProjectDropDown"
                          onClick={this.toggleDropDown}
                          role="presentation"
                        >
                          <div className="DropDownIcon">
                            <img src={DotsImg} alt="three dots" className="DropDownImg" />
                          </div>
                          {openDropDown && (
                            <div className="ProjectDropDownContent">
                              <div
                                onClick={this.showUpdateForm}
                                role="presentation"
                              >
                                Update
                              </div>
                              <div
                                onClick={this.showDeleteAlert}
                                role="presentation"
                              >
                                Delete
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {(openDeleteAlert && (
          <div className="ProjectDeleteModel">
            <Modal showModal={openDeleteAlert}>
              <div className="DeleteProjectModel">
                <div className="DeleteDescription">
                  Sure you want to delete project
                  <span>
                    <b>
                      {' '}
                      {name}
                      {' '}
                    </b>
                  </span>
                  ?
                  <DeleteWarning />
                </div>
                <div className="DeleteProjectModelResponses Extended">
                  <PrimaryButton label="cancel" className="CancelBtn" onClick={this.hideDeleteAlert} />
                  <PrimaryButton label={isDeleting ? <Spinner /> : 'Delete'} onClick={(e) => this.handleDeleteProject(e, cardID)} />
                </div>

                {(isFailed && message) && (
                  <Feedback
                    message={message}
                    type="error"
                  />
                )}
              </div>

            </Modal>
          </div>
        ))}

        {(openUpdateModal && (
          <div className="ProjectDeleteModel">
            <Modal showModal={openUpdateModal}>
              <div className="ModalUpdateForm">
                <div className="ModalFormHeading">
                  <div className="HeadingWithTooltip">
                    <h2>
                      Update your project
                      <b>
                        {' '}
                        {name}
                      </b>
                    </h2>
                    <div className="UpdateToolTip">
                      <Tooltip
                        showIcon
                        message="You can update either project name or description or both."
                      />
                    </div>
                  </div>
                </div>
                <div className="ModalFormInputs">
                  <BlackInputText
                    placeholder="Project Name"
                    name="projectName"
                    value={projectName}
                    onChange={(e) => {
                      this.handleChange(e);
                    }}
                  />
                  <TextArea
                    placeholder="Description"
                    name="projectDescription"
                    value={projectDescription}
                    onChange={(e) => {
                      this.handleChange(e);
                    }}
                  />

                  {error && (
                    <Feedback
                      type="error"
                      message={error}
                    />
                  )}

                </div>

                <div className="ModalFormButtons">
                  <PrimaryButton label="Cancel" className="CancelBtn" onClick={this.hideUpdateForm} />
                  <PrimaryButton label={isUpdating ? <Spinner /> : 'Proceed'} onClick={this.handleSubmit} />
                </div>

              </div>
            </Modal>
          </div>
        ))}

      </div>

    );
  }
}

ProjectCard.propTypes = {
  isDeleted: PropTypes.bool,
  isDeleting: PropTypes.bool,
  isFailed: PropTypes.bool,
  clearDeleteProjectState: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  cardID: PropTypes.string.isRequired,
  name: PropTypes.string,
  isUpdating: PropTypes.bool,
  description: PropTypes.string,
  data: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  icon: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

ProjectCard.defaultProps = {
  isDeleted: false,
  isDeleting: false,
  isFailed: false,
  name: '',
  description: '',
  isUpdating: false
};

const mapStateToProps = (state) => {
  const { data } = state.user;
  const {
    isDeleting, isDeleted, isFailed, clearDeleteProjectState, message
  } = state.deleteProjectReducer;
  const { isUpdating, isUpdated } = state.updateProjectReducer;

  return {
    data,
    isDeleting,
    isDeleted,
    isFailed,
    isUpdating,
    isUpdated,
    clearDeleteProjectState,
    message
  };
};

const mapDispatchToProps = {
  deleteProject, updateProject, clearDeleteProjectState
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCard);

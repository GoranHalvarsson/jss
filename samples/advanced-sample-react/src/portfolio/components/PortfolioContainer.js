import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { commonContainer } from 'enhancers';
import * as actions from '../actions';

import Portfolio from './Portfolio';

const mapStateToProps = (state, ownProps) => ({
  loading: state.portfolio.loading,
  ...ownProps,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
});

const mergeProps = (stateProps, dispatchProps) => {
  const { actions: stateActions, ...otherStateProps } = stateProps;
  const { actions: dispatchActions, ...otherDispatchProps } = dispatchProps;
  const mergedActions = Object.assign({}, stateActions, dispatchActions);
  const mergedProps = { ...otherStateProps, ...otherDispatchProps, actions: mergedActions };
  return mergedProps;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(commonContainer(Portfolio));

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';

import SiteNavigation from './SiteNavigation';
import Footer from './Footer';
import LogInModal from './LogInModal';
import SignUpModal from './SignUpModal';

import './SiteLayout.less';

export function SiteLayoutView({ children, modalId, modalProps }) {
  let modal;
  if (modalId) {
    switch (modalId) {
      case 'login':
        modal = <LogInModal {...modalProps} />;
        break;
      case 'signup':
        modal = <SignUpModal {...modalProps} />;
        break;
      default:
        console.error(`Invalid modal id: ${modalId}`); // eslint-disable-line no-console
    }
  }
  return (
    <div className="SiteLayout">
      <SiteNavigation />
      <div className="SiteLayout--wrapper">
        <main className="SiteLayout--content">
          {children}
        </main>
        <Footer />
      </div>
      {modal}
    </div>
  );
}

SiteLayoutView.propTypes = {
  children: PropTypes.node,
  modalId: PropTypes.node,
  modalProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

function mapStateToProps(state) {
  return {
    modalId: state.modal.modalId,
    modalProps: state.modal.props,
  };
}

const SiteLayout = connect(mapStateToProps)(SiteLayoutView);
export default SiteLayout;

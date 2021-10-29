import {MemoryRouter, Route} from "react-router-dom";
import React from "react";
import AppContext from "../../../contexts/AppContext";
import PropTypes from "prop-types";
import ChangeUserSecurityToken from "./ChangeUserSecurityToken";


export default {
  title: 'Passbolt/UserSetting/ChangeUserSecurityToken',
  component: ChangeUserSecurityToken
};

const context = {
  userSettings: {
    getSecurityTokenBackgroundColor: () => '#8bc34a',
    getSecurityTokenCode: () => "ABC"
  }
};


const Template = args =>
  <AppContext.Provider value={context}>
    <MemoryRouter initialEntries={['/']}>
      <Route component={routerProps => <ChangeUserSecurityToken {...args} {...routerProps}/>}></Route>
    </MemoryRouter>
  </AppContext.Provider>;

Template.propTypes = {
  context: PropTypes.object,
};

export const Initial = Template.bind({});

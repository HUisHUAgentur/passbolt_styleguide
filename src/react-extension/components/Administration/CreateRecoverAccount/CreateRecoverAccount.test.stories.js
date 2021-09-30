import {MemoryRouter, Route} from "react-router-dom";
import React from "react";
import CreateRecoverAccount from "./CreateRecoverAccount";
import "../../../../css/themes/default/api_main.css";
import AppContext from "../../../contexts/AppContext";
import UserSettings from "../../../../shared/lib/Settings/UserSettings";
import userSettingsFixture from "../../../test/fixture/Settings/userSettings";


export default {
  title: 'Passbolt/Administration/CreateRecoverAccount',
  component: CreateRecoverAccount
};

const context = {
  userSettings: new UserSettings(userSettingsFixture),
};

const Template = args =>
  <AppContext.Provider value={context}>
    <MemoryRouter initialEntries={['/']}>
      <div className="panel main">
        <div className="panel middle">
          <div className="workspace-main">
            <div className="grid grid-responsive-12">
              <Route component={routerProps => <CreateRecoverAccount {...args} {...routerProps}/>}></Route>
            </div>
          </div>
        </div>
      </div>
    </MemoryRouter>
  </AppContext.Provider>;

export const Default = Template.bind({});
Default.args = {
};

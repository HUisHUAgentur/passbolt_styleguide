import MockPort from "../../../test/mock/MockPort";
import {TEST_ROLE_USER_ID} from "../../../../shared/models/entity/role/role.test.data";

/**
 * Returns the default app context for the unit test
 * @param appContext An existing app context
 * @returns {any}
 */
export function defaultAppContext(appContext) {
  const defaultAppContext = {
    port: new MockPort(),
    roles: [
      {
        id: "c4870358-e32f-41ce-999b-8f80c9b0d17f",
        name: "admin"
      },
      {
        id: TEST_ROLE_USER_ID,
        name: "user"
      }
    ],
    users: [
      {
        id: "8e3874ae-4b40-590b-968a-418f704b9d9a",
        profile: {
          first_name: "firstname",
          last_name: "lastname",
        },
        username: "firstname@passbolt.com",
        role_id: TEST_ROLE_USER_ID
      }
    ],
    setContext: function(newContext) {
      // In this scope this reference the object context.
      Object.assign(this, newContext);
    },
  };
  return Object.assign(defaultAppContext, appContext || {});
}

/**
 * Default props
 * @returns {{resource: {id: string, name: string}}}
 */
export function defaultProps() {
  return {
    onClose: jest.fn()
  };
}

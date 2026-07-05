import { idmObject } from "@pearj/am-idm-ts-types/lib/idm-ts";
import { equals } from "@pearj/am-idm-ts-types/lib/query-filter";
import { idm, ManagedPendingRelationships, ManagedPendingRelationshipsDefaults, ManagedSubTypeTest, ManagedSubTypeTestDefaults } from "lib/idm";
import _ from "lib/lodash";

export const findOrCreateUserRelationship = (userName: string) => {
  logger.info(`Linking to ${userName}`);
  return { _ref: `managed/managedUser/${userName}` };
};

export const sonartsFailure = () => {
  const test = ["first", "second", "third"];

  var curTest;
  // tslint:disable-next-line: no-conditional-assignment
  while ((curTest = test.pop())) {
    logger.info(`Current Test Value ${curTest}`);
  }

  const test2 = idmObject<ManagedSubTypeTest, ManagedSubTypeTestDefaults>("managed/SubTypeTest");
  test2.query({ filter: equals("firstType", "sd") });

  const test3 = idmObject<ManagedPendingRelationships, ManagedPendingRelationshipsDefaults>("managed/pendingRelationships");
  test3.query({ filter: equals("actionTime", "bob") });

  idm.managed.pendingRelationships.query({ filter: equals("sourceQueryFilter", "bob") });
};

/**
 * Count the number of users who directly and indirectly report to the given user.
 *
 * @param {string} userId The managed user id to count the number of reports on.
 */
export const countReports = function (userId) {
  const searchQueue: string[] = [];
  // Initialise the search with the given user
  searchQueue.push(userId);

  var reports = 0;
  var curUserId;

  // tslint:disable-next-line: no-conditional-assignment
  while ((curUserId = searchQueue.pop())) {
    const curUser = idm.managed.user.read(curUserId, {
      fields: ["_id", "reports"],
    });

    if (curUser && curUser.reports) {
      _.each(curUser.reports, (reportsUser) => {
        if (reportsUser._refResourceId) {
          // Count each user who report to the current user
          reports++;

          // Lets search that user too
          searchQueue.push(reportsUser._refResourceId);
        }
      });
    }
  }
  return reports;
};

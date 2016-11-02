import _ from 'lodash';

import usersDb, { VALID_LIST_FILTERS } from '../db/users';
import { ApplicationError } from '../errors';
import { hashPassword, validatePassword } from './passwords';

const VALID_ROLES = [
  'student',
  'teacher',
  'admin',
];

const NOT_YET_IMPLEMENTED = (req, res) => {
  res.status(501);
  res.send('Not yet implemented!');
};

export default {
  list: (req, res) => {
    const filters = req.body.filters ? _.pick(req.body.filters, VALID_LIST_FILTERS) : {};
    usersDb.list(filters).then((users) => {
      res.send({ data: users });
    });
  },
  find: NOT_YET_IMPLEMENTED,
  setInterests: NOT_YET_IMPLEMENTED,
  create: (req, res, next) => {
    const { username, password, name, role } = req.body;
    if ([username, password, name, role].includes(undefined)) {
      res.status(400).send({
        message: 'Field is missing',
        data: { requiredFields: ['username', 'password', 'name', 'role'] },
      });
      return;
    }

    if ([username, password, name, role].map(val => val.length).includes(0)) {
      res.status(400).send({
        message: 'Field is empty',
        data: { requiredFields: ['username', 'password', 'name', 'role'] },
      });
      return;
    }

    const passwordValidation = validatePassword(req.body.password);
    if (!passwordValidation.valid) {
      res.status(400).send({ message: passwordValidation.message });
      return;
    }

    if (!VALID_ROLES.includes(role)) {
      res.status(400).send({
        message: 'Invalid role',
        data: { validRoles: VALID_ROLES },
      });
      return;
    }

    // Only admins can create non-admin accounts
    if (role !== 'student') {
      if (!res.locals.authData || res.locals.authData.role !== 'admin') {
        throw new ApplicationError(401);
      }
    }

    hashPassword(password).then(hash => usersDb.create(username, hash, name, role))
    .then(id => res.send({ data: { id, username, name, role } }))
    .catch(next);
  },
};

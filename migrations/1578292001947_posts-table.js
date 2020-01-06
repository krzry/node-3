/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('posts', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    userId: {
      type: 'integer',
      notNull: true,
      references: '"users"', // this is how we associate a profile with a specific user.
    },
    content: {
      type: 'text',
    },
  });
};

exports.down = (pgm) => {

};

import knex from 'knex';

export const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './debate.db'
  },
  useNullAsDefault: true
});

// 初始化数据库表
export const initDB = async () => {
  await db.schema.createTableIfNotExists('debates', (table:any) => {
    table.increments('id').primary();
    table.string('title');
    table.json('left');
    table.json('right');
    table.string('center_image');
    table.timestamps();
  });
};

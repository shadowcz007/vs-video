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
    table.string('center_image').nullable();
    table.timestamps(true, true);
  });

  // 检查是否已有数据
  const existingDebates = await db('debates').first();
  
  // 如果没有数据，插入默认数据
  if (!existingDebates) {
    await db('debates').insert({
      title: "知识工作重塑与人机协同的未来",
      left: JSON.stringify([
        "增强智能 成为新标准",
        "知识生产从 线性 到 网络化",
        "创造性任务 回归人类核心价值"
      ]),
      right: JSON.stringify([
        "认知过载 信息焦虑",
        "技能快速迭代 持续学习压力",
        "人机伦理边界 身份认同危机"
      ]),
      center_image: 'debate-center.png'
    });
  }
};

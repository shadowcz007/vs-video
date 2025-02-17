import express from 'express';
import cors from 'cors';
import { db, initDB } from './db';
import  renderVideo from '../../scripts/render';
const app = express();
app.use(cors());
app.use(express.json());

// 初始化数据库
initDB();

// 获取最新辩论数据
app.get('/api/debates/latest', async (req:any, res:any) => {
  const debate = await db('debates').orderBy('created_at', 'desc').first();
  res.json(debate);
});

// 保存新辩论数据
app.post('/api/debates', async (req:any, res:any) => {
  const { title, left, right, centerImage } = req.body;
  const [id] = await db('debates').insert({
    title,
    left: JSON.stringify(left),
    right: JSON.stringify(right),
    center_image: centerImage
  });
  res.json({ id });
});

// 启动服务器
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post('/api/render', async (req:any, res:any) => {
  const { debateId } = req.body;
  const debate = await db('debates').where({ id: debateId }).first();
  
  // 调用原有渲染逻辑
  const outputPath = await renderVideo(debate);
  res.json({ videoUrl: `/videos/${outputPath}` });
});

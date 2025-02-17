import express from 'express'
import cors from 'cors'
import { db, initDB } from './db'
import renderVideo from '../../scripts/render'
import path from 'path'
import fs from 'fs'

const app = express()

// 1. 添加请求日志中间件
app.use((req, res, next) => {
  console.log('收到请求:', req.method, req.url)
  next()
})

// 2. 启用 CORS
app.use(cors())
app.use(express.json({ limit: '50mb' }))

// 3. 初始化数据库
initDB()

// 4. 移除静态文件服务，先测试 API
// app.use(express.static(path.join(__dirname, '../../dist')));

// 5. API 路由
app.get('/api/debates/latest', async (req: any, res: any) => {
  try {
    const debate = await db('debates')
      .select('*')
      .orderBy('created_at', 'desc')
      .first()

    if (!debate) {
      return res.status(404).json({ error: '未找到辩论数据' })
    }

    const response = {
      ...debate,
      left: JSON.parse(debate.left),
      right: JSON.parse(debate.right),
      centerImage: debate.center_image
    }

    return res.json(response)
  } catch (error: any) {
    console.error('处理请求时出错:', error)
    return res.status(500).json({ error: '发生错误', details: error.message })
  }
})

// 添加新接口：获取所有辩论
app.get('/api/debates', async (req: any, res: any) => {
  try {
    const debates = await db('debates')
      .select('*')
      .orderBy('created_at', 'desc')

    // 即使没有数据也返回空数组
    const response = debates.map(debate => ({
      ...debate,
      left: JSON.parse(debate.left),
      right: JSON.parse(debate.right),
      centerImage: debate.center_image
    }))

    return res.json(response)
  } catch (error: any) {
    console.error('获取所有辩论数据时出错:', error)
    return res.status(500).json({ error: '发生错误', details: error.message })
  }
})

// 6. 其他 API 路由
app.post('/api/debates', async (req: any, res: any) => {
  try {
    const { title, left, right, centerImage } = req.body

    // 检查所有必需字段
    if (!title || !left || !right || !centerImage) {
      return res.status(400).json({ 
        error: '缺少必要字段',
        details: {
          title: !title ? '标题不能为空' : null,
          left: !left ? '左方观点不能为空' : null,
          right: !right ? '右方观点不能为空' : null,
          centerImage: !centerImage ? '中心图片不能为空' : null
        }
      })
    }

    let imagePath = null
    
    if (centerImage) {
      // 从 Base64 提取图片数据
      const base64Data = centerImage.replace(/^data:image\/\w+;base64,/, '')
      const imageBuffer = Buffer.from(base64Data, 'base64')
      
      // 生成文件名和保存路径
      const fileName = `debate-center-${Date.now()}.png`
      const publicPath = path.join(__dirname, '../../public')
      
      // 确保目录存在
      if (!fs.existsSync(publicPath)) {
        fs.mkdirSync(publicPath, { recursive: true })
      }
      
      // 保存图片文件
      fs.writeFileSync(path.join(publicPath, fileName), imageBuffer)
      
      // 设置数据库中存储的路径
      imagePath =fileName
    }

    const [id] = await db('debates').insert({
      title,
      left: JSON.stringify(left),
      right: JSON.stringify(right),
      center_image: imagePath || 'debate-center.png'
    })

    res.json({ id, message: '辩论创建成功' })
  } catch (error: any) {
    console.error('创建辩论时出错:', error)
    res.status(500).json({ error: '创建失败', details: error.message })
  }
})

app.post('/api/render', async (req: any, res: any) => {
  try {
    const { debateId } = req.body

    // 从数据库获取辩论数据
    const debate = await db('debates').where({ id: debateId }).first()
    if (!debate) {
      return res.status(404).json({ error: '未找到辩论数据' })
    }

    // 处理数据格式
    const debateData = {
      title: debate.title,
      left: JSON.parse(debate.left),
      right: JSON.parse(debate.right),
      centerImage: debate.center_image
    };

    // 调用渲染函数
    const outputFileName = await renderVideo(debateData)

    res.json({
      success: true,
      videoUrl: `/videos/${outputFileName}`
    })
  } catch (error: any) {
    console.error('渲染视频时出错:', error)
    res.status(500).json({
      error: '视频渲染失败',
      details: error.message
    })
  }
})

// 7. 视频文件服务
app.use('/videos', express.static(path.join(__dirname, '../../out')))

// 9. 保留原有的静态文件服务
app.use(express.static(path.join(__dirname, '../../dist')));

// 9. 通配符路由放在最后
app.get('*', (req, res) => {
  console.log('通配符路由被触发:', req.path)
  res.sendFile(path.join(__dirname, '../../dist/index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
  console.log(`API 地址: http://localhost:${PORT}/api/debates/latest`)
})

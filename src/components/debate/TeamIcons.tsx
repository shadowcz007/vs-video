import React from 'react';

export const TeamIcons: React.FC = () => {
    return (
        <div style={{
            position: 'absolute',
            bottom:0,
            height:280,
            left: -3,
            display: 'flex',
            width:' 101%',
            justifyContent: 'space-around',
            padding: '12px 24px',
            backgroundColor: 'black'
        }}>
            <span style={{ color: 'white', fontSize: 44,marginRight:24,fontWeight:800 }} >
                你支持哪一方？点击下方对应图标投票<br></br>
                <span style={{fontSize:32,fontWeight:200}}>Mixlab AI编程训练营 出品</span>

            </span>
            {/* 蓝方点赞图标和文字 */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginRight: 44
            }}>
                <div style={{
                    width: 80,
                    height: 80,
                    background: 'black',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                </div>
                <span style={{ color: 'white', fontSize: 32,fontWeight:800 }}>蓝方</span>
            </div>
            
            {/* 红方爱心图标和文字 */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginRight: 24
            }}>
                <div style={{
                    width: 80,
                    height: 80,
                    background: 'black',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </div>
                <span style={{ color: 'white', fontSize: 32,fontWeight:800 }}>红方</span>
            </div>
        </div>
    );
}; 
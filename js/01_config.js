// -------------------------- 全局配置（所有文件可共用） --------------------------
const EXPERIMENT_CONFIG = {
    imageFolder: "artpic/", // 图片文件夹相对路径（根目录下的artpic）
    totalTrials: 50,       // 总试次数（50张图）
    fixationDuration: 1000, // 注视点时长（ms）
    blankDuration: 500      // 空屏时长（ms）
};

// -------------------------- 生成图片列表 --------------------------
let IMAGE_LIST = [];
for (let i = 1; i <= EXPERIMENT_CONFIG.totalTrials; i++) {
    IMAGE_LIST.push({
        imageId: i,                          // 图片序号（对应1.png~100.png）
        imageUrl: EXPERIMENT_CONFIG.imageFolder + i + ".png", // 图片完整相对路径
        imageViewTime: 0,                    // 图片观看时长（后续记录）
        beautyScore: 0,                      // 美观度评分（后续记录）
    });
}

// 注意：图片顺序将在 04_main.js 中初始化 jsPsych 后打乱

// -------------------------- 全局数据存储（所有文件可修改） --------------------------
const GLOBAL_DATA = {
    subjectName: "",        // 被试姓名（录入后赋值）
    subjectGender: "",      // 被试性别（录入后赋值）
    experimentLog: [        // 实验数据日志（最终导出为TXT）
        "被试信息：待录入",   // 这一行将被实际的被试信息替换
        "图片序号\t美观度(0-1)\t观看时长(ms)"
    ]
};

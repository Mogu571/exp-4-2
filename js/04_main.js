// -------------------------- 实验启动核心逻辑 --------------------------
let jsPsych;

document.addEventListener("DOMContentLoaded", () => {
    // 检查 IMAGE_LIST 是否正确初始化
    if (!IMAGE_LIST || IMAGE_LIST.length === 0) {
        console.error("IMAGE_LIST 未正确初始化！");
        alert("实验材料加载失败，请刷新页面重试。");
        return;
    }

    console.log(`图片总数: ${IMAGE_LIST.length}`);

    // 1. 先初始化 jsPsych（必须在使用 jsPsych 的任何功能之前）
    jsPsych = initJsPsych({
        on_finish: () => {
            console.log("实验完全结束！");
            console.log("被试姓名：", GLOBAL_DATA.subjectName);
            console.log("实验数据预览：", GLOBAL_DATA.experimentLog.slice(0, 5));
        }
    });

    // 2. 使用 jsPsych 打乱图片顺序
    IMAGE_LIST = jsPsych.randomization.shuffle(IMAGE_LIST);
    console.log("图片顺序已随机打乱");

    // 3. 收集所有需要预加载的图片路径
    const imagesToPreload = IMAGE_LIST.map(item => item.imageUrl);
    console.log("待预加载图片数量:", imagesToPreload.length);

    // 4. 创建预加载 trial
    const preloadTrial = {
        type: jsPsychPreload,
        images: imagesToPreload,
        message: '正在加载实验材料，请稍候...',
        show_progress_bar: true,
        continue_after_error: false,
        error_message: '部分图片加载失败，请检查网络连接后刷新页面重试。',
        on_success: () => {
            console.log('✓ 所有图片预加载完成！');
        },
        on_error: (file) => {
            console.error('✗ 图片加载失败:', file);
        }
    };

    // 5. 构建实验时间线
    const experimentTimeline = buildTimeline();

    // 6. 组合完整时间线：预加载 + 实验内容
    const fullTimeline = [preloadTrial, ...experimentTimeline];

    console.log("时间线构建完成，总步骤数:", fullTimeline.length);

    // 7. 运行实验
    jsPsych.run(fullTimeline);
});

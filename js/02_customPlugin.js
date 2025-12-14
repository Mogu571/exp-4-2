// -------------------------- 自定义评分插件：custom-rating --------------------------
// 功能：提供"左标签-控制杆-右标签"的评分界面,支持鼠标拖动标记
class CustomRatingPlugin {
    // 插件参数定义（外部调用时需传入的参数）
    static info = {
        name: "custom-rating",
        parameters: {
            labelLeft: { 
                type: 'string',
                default: "非常差"
            },
            labelRight: { 
                type: 'string',
                default: "非常好"
            },
            prompt: { 
                type: 'string',
                default: "请评价"
            }
        }
    };

    constructor(jsPsych) {
        this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
        // 1. 构建评分界面HTML - 使用CSS类
        const ratingHtml = `
            <div style="text-align: center; margin-top: 50px;">
                <h2 class="rating-prompt">${trial.prompt}</h2>
                <div class="rating-slider" id="js-rating-slider">
                    <div class="slider-marker" id="js-slider-marker" style="left: 50%;"></div>
                </div>
                <div class="rating-labels">
                    <span>${trial.labelLeft}</span>
                    <span>${trial.labelRight}</span>
                </div>
                <div class="confirm-button" id="js-confirm-btn">确认</div>
            </div>
        `;
        display_element.innerHTML = ratingHtml;

        // 2. 初始化变量
        const slider = document.getElementById("js-rating-slider");
        const marker = document.getElementById("js-slider-marker");
        const confirmBtn = document.getElementById("js-confirm-btn");
        let isDragging = false;
        let ratingValue = 0.5;

        // 更新标记位置的函数
        const updateMarkerPosition = (clientX) => {
            const sliderRect = slider.getBoundingClientRect();
            let markerX = clientX - sliderRect.left;
            markerX = Math.max(0, Math.min(markerX, sliderRect.width));
            ratingValue = markerX / sliderRect.width;
            marker.style.left = `${markerX}px`;
        };

        // 3. 鼠标事件监听：开始拖动（按下标记）
        const handleMouseDown = (e) => {
            isDragging = true;
            e.preventDefault();
        };

        // 4. 鼠标事件监听：拖动标记（移动鼠标）
        const handleMouseMove = (e) => {
            if (isDragging) {
                updateMarkerPosition(e.clientX);
            }
        };

        // 5. 鼠标事件监听：停止拖动（松开鼠标）
        const handleMouseUp = () => {
            if (isDragging) isDragging = false;
        };

        // 6. 点击滑动条移动标记
        const handleSliderClick = (e) => {
            if (e.target === slider) {  // 确保点击的是滑动条而不是标记
                updateMarkerPosition(e.clientX);
            }
        };

        // ✅ 添加触摸事件支持（移动设备兼容）
        const handleTouchStart = (e) => {
            isDragging = true;
            e.preventDefault();
        };

        const handleTouchMove = (e) => {
            if (isDragging) {
                const touch = e.touches[0];
                updateMarkerPosition(touch.clientX);
            }
        };

        const handleTouchEnd = () => {
            if (isDragging) isDragging = false;
        };

        // 添加事件监听
        marker.addEventListener("mousedown", handleMouseDown);
        marker.addEventListener("touchstart", handleTouchStart);
        slider.addEventListener("click", handleSliderClick);  // 点击滑动条
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);

        // 7. 点击确定按钮：结束评分，返回数据
        confirmBtn.addEventListener("click", () => {
            // 清理事件监听
            marker.removeEventListener("mousedown", handleMouseDown);
            marker.removeEventListener("touchstart", handleTouchStart);
            slider.removeEventListener("click", handleSliderClick);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
            
            // 清空当前界面
            display_element.innerHTML = "";
            
            // 使用全局 jsPsych 变量
            jsPsych.finishTrial({
                rating: parseFloat(ratingValue.toFixed(4))
            });
        });

        // 添加键盘支持：回车键确认
        const handleKeyPress = (e) => {
            if (e.key === "Enter") {
                confirmBtn.click();
            }
        };
        document.addEventListener("keypress", handleKeyPress);

        // 清理键盘事件监听
        const originalFinishTrial = jsPsych.finishTrial;
        jsPsych.finishTrial = (data) => {
            document.removeEventListener("keypress", handleKeyPress);
            jsPsych.finishTrial = originalFinishTrial;
            originalFinishTrial.call(jsPsych, data);
        };
    }
}

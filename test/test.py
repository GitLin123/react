import rembg
from PIL import Image

# 打开图像
input_path = "input.png"
output_path = "output.png"
input_image = Image.open(input_path)

# 移除背景
output_image = rembg.remove(input_image)

# 保存结果
output_image.save(output_path)
print("背景移除成功！")

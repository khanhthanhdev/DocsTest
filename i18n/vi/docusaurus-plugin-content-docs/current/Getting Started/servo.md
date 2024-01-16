---
sidebar_position: 5
---
 
# Servos

Thông thường trong FTC, Servo được sử dụng khi không cần nhiều năng lượng để di chuyển cơ chế. Servo được sử dụng để di chuyển những thứ nhỏ hơn hoặc để quay liên tục các cơ chế nhất định. Nó dẫn đến chuyển động tốt hơn khi nó có thể di chuyển giữa các vị trí từ 0-1.
## Khởi tạo Servo

Cũng giống như đối với Motors, khởi tạo servo tham chiếu đến đối tượng hardwareMap để khởi tạo Servo. Sự khác biệt chính trong việc khởi tạo servo là việc sử dụng đối tượng Servo khi tạo biến servo cũng như sử dụng Servo.class trong cấu hình hardwareMap.
```java
Servo claw;
claw = hardwareMap.get(Servo.class, "claw");
```
## CR Servos

CR Servos, hay Continuous Rotation Servos là một chế độ dành cho servo trong đó servo liên tục quay, tương tự như chuyển động của động cơ. Điều này có thể được sử dụng trong nhiều tình huống như quay bánh xe nhỏ. Ví dụ, nhiều đội đã sử dụng CR Servos để quay bánh xe băng chuyền trong Freight Frenzy.

### Khởi tạo CR Servo
CR Servos có một chút khác biệt khi khởi tạo
```java 
CRservo wheel;
wheel = hardwareMap.get(CRServo.class, "wheel");
```
## Đặt vị trí Servo
Phương thức `setPosition` nhận giá trị kép 0-1 và đặt servo đến một vị trí cụ thể được cung cấp cho nó. Nó được sử dụng cho các servo không phải CR bình thường.
```java
claw.setPosition(0.5);
```
## Đặt điện áp cho CR Servo
Đối với, sử dụng CR Servo, bạn phải đặt nó ở một công suất nhất định. Đó là phương pháp setPower, trông rất giống với cài đặt công suất cho động cơ. 
```java 
wheel.setPower(0.5);
```
:::info
Để tìm hiểu thêm các phương thức của Servo, bạn có thể đọc thêm [tại đây](https://ftctechnh.github.io/ftc_app/doc/javadoc/com/qualcomm/robotcore/hardware/Servo.html)
:::

:::caution
Servo có một phương thức gọi là get position. Tuy nhiên, do cách servo nhận dữ liệu này, nó không phải là vị trí hiện tại thực tế của servo. Đó là vị trí mà servo được thiết lập để sẽ đến. Do đó, không có cách sử dụng lớn cho phương pháp này trong chương trình của bạn. 
:::

## Bài tập

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

```mdx-code-block
<Tabs>
<TabItem value="Task">
```
Tạo một đối tượng servo mới và đặt tên nó là "claw". Để phạm vi của nó để đặt giới hạn mới của nó nằm giữa giá trị 0,2 và 0,8 ban đầu. Sau đó, với các giới hạn mới của nó, đặt nó ở vị trí 0,4;

Gợi ý: Nhìn tất cả các phương pháp servo.

Tiếp theo, khởi tạo một servo cho một bánh xe nạp bạn sẽ quay để nạp các đối tượng. Khởi tạo servo với biến và tên cấu hình là "intake". Sau đó đặt nó chạy ở 75% tốc độ của nó.
```mdx-code-block
</TabItem>
<TabItem value="Solution">
```

```java
Servo claw;
CRservo intake;

claw = hardwareMap.get(Servo.class,"claw");
intake = hardwareMap.get(CRServo.class, "intake");

claw.scaleRange(0.2, 0.8);

claw.setPosition(0.4);
intake.setPower(0.75);
```

```mdx-code-block
</TabItem>
</Tabs>
```
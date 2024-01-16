---
sidebar_position: 4
---
# Động cơ và bộ mã hóa
Động cơ DC trong FTC được sử dụng cho các cơ cấu cơ khí lớn như drivebase, cánh tay robot, shooter bắn bóng. Rất quan trọng để học các sử dụng động cơ một cách hiệu quả.


## Khởi tạo động cơ
Bước đầu tiên trong việc sử dụng một động cơ là khởi tạo nó như một biến trong mã. Điều này được thực hiện thông qua việc sử dụng một đối tượng có tên **hardwareMap** được sử dụng để dễ dàng khởi tạo các đối tượng FTC.
```java 
DcMotor driveMotor;       
driveMotor = hardwareMap.get(DcMotor.class, "Drive Motor");  
```
Trong ví dụ này, đầu tiên biến `driveMotor` được tạo thông qua việc sử dụng đối tượng `DcMotor`. Sau đó, hardwareMap được sử dụng để khởi tạo và đặt tên cho động cơ, đây phải là cùng tên được sử dụng trong cấu hình của động cơ trên Control hub.

## Sử dụng động cơ
Có nhiều phương thức điều khiển động cơ, điện áp đầu vào, ...

## Chọn hướng

```java
driveMotor.setDirection(DcMotor.Direction.Forward);
driveMotor.setDirection(DcMotor.Direction.Reverse);
```
`setDirection` được sử dụng để thay đổi cách động cơ quay khi nó được đặt điện áp đầu vào. `setDirection` nên được sử dụng trên động cơ truyền động để đảm bảo rằng tất cả các động cơ đều quay cùng một hướng khi được gửi đến một công suất như nhau.

## Bộ mã hóa động cơ
Trong lĩnh vực robot FTC, động cơ được kết nối với bộ mã hóa với khả năng bổ sung: chúng có thể cho biết động cơ đã quay với tốc độ bao nhiều, và được bao nhiêu vòng. Hãy tưởng tượng bạn đang lái một chiếc xe điều khiển từ xa và bạn muốn nó di chuyển một khoảng cách cụ thể hoặc rẽ một góc cụ thể. Động cơ thông thường có thể đến gần, nhưng chúng không thể cung cấp cho bạn điều khiển chính xác. Mặt khác, động cơ mã hóa cung cấp độ chính xác.

Một bộ mã hóa thường được kết nối thông qua một dây đặc biệt được kết nối với động cơ. Thiết bị này theo dõi các vòng quay và mỗi vòng quay hoàn chỉnh được chia thành các phần nhỏ hơn gọi là ticks. Hãy nghĩ về một dấu tích như một dấu nhỏ trên thước đo lượng động cơ đã quay. Ví dụ, một động cơ có thể đo 100 ticks cho mỗi vòng quay. 

Các nhóm FTC khai thác sức mạnh của các động cơ mã hóa này để lập trình robot của họ với các chuyển động chính xác. Khi bánh xe của robot quay, bộ mã hóa sẽ đếm ticks. Vì vậy, nếu bánh xe của robot quay 100 ticks, robot biết nó đã di chuyển một khoảng cách cụ thể. Nó giống như robot đọc bản đồ nhỏ của riêng nó cho thấy chính xác vị trí của nó.

Mặt khác, vận tốc của động cơ cũng được bộ mã hóa đo thông qua số ticks mỗi giây mà động cơ đang di chuyển. 

### Các chế độ chạy
```java 
driveMotor.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
driveMotor.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
driveMotor.setMode(DcMotor.RunMode.STOP_AND_RESET_ENCODER);
driveMotor.setMode(DcMotor.RunMode.RUN_TO_POSITION);
```

### RUN WITHOUT ENCODER
Chế độ này khiến động cơ không sử dụng các giá trị bộ mã hóa đã cắm để thực hiện những việc như điều khiển vị trí hoặc tốc độ của nó.
### RUN USING ENCODER
Điều này làm cho động cơ sử dụng bộ mã hóa động cơ (nếu được cắm), để giúp kiểm soát vị trí hoặc tốc độ của nó. Khi động cơ được đặt thành `RUN_USING_ENCODER`, nó sẽ tự động sử dụng bộ mã hóa để giúp giữ cho động cơ chạy liên tục ở bất kỳ tốc độ nào được đặt cho động cơ. 

### STOP AND RESET ENCODER
Thao tác này sẽ đặt lại giá trị đánh dấu của bộ mã hóa mà động cơ phải về 0. Nó sẽ đảm bảo rằng ticks của bộ mã hóa nhất quán cho mỗi lần chạy và làm cho động cơ hoạt động như mong đợi mỗi lần chạy. Nếu sử dụng ticks của bộ mã hóa làm phép đo, bạn nên sử dụng `STOP_AND_RESET_ENCODER` ở đầu mã của mình. 

### RUN TO POSITION
Run To Position là một chế độ rất hữu ích cho động cơ. Nó cho phép một động cơ chạy đến một giá trị đánh dấu mục tiêu cụ thể được đặt và động cơ sẽ đi đến vị trí đó và giữ nó. Nó sử dụng một vòng điều khiển PID tích hợp để thực hiện điều này.


:::info 

Khi sử dụng RUN_TO_POSITION, công suất không bao giờ bị âm vì động cơ sẽ đi về bất kỳ hướng nào. Nếu động cơ cần đi theo hướng ngược lại, hãy sử dụng dấu âm.

:::

### Xác định vị trí của động cơ
Khi sử dụng bộ mã hóa, có một phương pháp hữu ích có thể được sử dụng để tìm vị trí động cơ trong ticks.
```java 
int position;
position = motor.getCurrentPosition();
```
### Di chuyển động cơ đến vị trí bằng bộ mã hóa
Để di chuyển động cơ đến vị trí bộ mã hóa mục tiêu (được đưa ra bằng ticks), trước tiên chúng tôi sẽ giới thiệu thêm hai lệnh. `setTargetPosition()` nhận giá trị tick cho động cơ trở thành vị trí mục tiêu của nó. `setPower()` đặt giá trị [-1,1] cho tốc độ động cơ chạy. Công suất dưới 0 chạy động cơ theo hướng ngược lại.  
 

```java 
TARGET_TICK_VALUE = 600;      
driveMotor.setTargetPosition(TARGET_TICK_VALUE);    //Sets Target Tick Position
driveMotor.setMode(DcMotor.RunMode.RUN_TO_POSITION); 
driveMotor.setPower(1);           //Sets Motor to go to position at 1 power.
```
Trong ví dụ động cơ được đặt để chạy đến vị trí mục tiêu là 600 tick, số vòng quay này sẽ phụ thuộc vào số ticks trên mỗi vòng quay của động cơ cụ thể đó. Sau khi đặt vị trí mục tiêu, động cơ được đặt ở chế độ `RUN_TO_POSITION`, sau đó đặt thành công suất 1 hoặc toàn bộ công suất để chạy đến vị trí mục tiêu.

:::info

Chúng tôi khuyên bạn nên tra cứu trang web của bất kỳ động cơ nào bạn đang sử dụng và tìm ticks trên mỗi vòng quay, giá trị được tính bởi bộ mã hóa trên mỗi vòng quay. Điều này có thể giúp bạn về mặt tính toán.
:::

## Kiểm soát vận tốc
Khi đặt động cơ ở chế độ `RUN_USING_ENCODER`, đặt nguồn cho động cơ khiến nó di chuyển với vận tốc không đổi thay vì công suất thực tế, điều này có nghĩa là động cơ được kết nối với bộ mã hóa sẽ kém khả năng chống dao động pin hơn khi so sánh với động cơ không được kết nối với bộ mã hóa. 

Ngoài ra, bạn có thể chỉ định ticks chính xác mỗi giây mà động cơ sẽ quay tại:
```java
((DcMotorEx)motor).setVelocity(ticksPerSecond); 
```

## Khởi tạo lớp động cơ
Dưới đây là một lớp động cơ thuận tiện có chứa các phím tắt cho hầu hết các phương pháp được liệt kê ở trên.
```java 
package org.firstinspires.ftc.teamcode.Utils;

import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.DcMotorEx;
import com.qualcomm.robotcore.hardware.DcMotorSimple;
import com.qualcomm.robotcore.hardware.HardwareMap;
import com.qualcomm.robotcore.hardware.PIDFCoefficients;

public class Motor {
  DcMotor motor;
  int multiplier = 1;

  public Motor(HardwareMap hardwareMap, String name) {
    this.motor = hardwareMap.dcMotor.get(name);
    motor.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);

    try {
      resetEncoder(true);
    } catch (Exception e) {
      noEncoder();
    }
  }

  public Motor(HardwareMap hardwareMap, String name, boolean useEncoder) {
    this.motor = hardwareMap.dcMotor.get(name);
    motor.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);

    try {
      resetEncoder(useEncoder);
    } catch (Exception e) {

    }
  }

  public void setDirection(DcMotorSimple.Direction d) {
    motor.setDirection(d);
  }

  public DcMotorSimple.Direction getDir() {
    return motor.getDirection();
  }

  public void coast() {
    motor.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.FLOAT);
  }

  public void negateEncoder() {
    multiplier = -1;
  }

  public int encoderReading() {
    return motor.getCurrentPosition() * multiplier;
  }

  public void setPower(double power) {
    this.motor.setPower(power);
  }

  public double getPower() {
    return this.motor.getPower();
  }

  public void resetEncoder(boolean useEncoder) {
    this.motor.setMode(DcMotor.RunMode.STOP_AND_RESET_ENCODER);

    if (useEncoder) {
      useEncoder();
    } else {
      noEncoder();
    }
  }

  public void setFloat() {
    this.motor.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.FLOAT);
  }

  public void noEncoder() {
    this.motor.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
  }

  public void flip() {
    this.motor.setDirection(DcMotorSimple.Direction.REVERSE);
  }

  public void useEncoder() {
    this.motor.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
  }

  public void setTarget(double target) {
    this.motor.setTargetPosition((int) target);
  }

  public void setPid(double p, double i, double d, double f) {
    this.retMotorEx()
        .setPIDFCoefficients(DcMotor.RunMode.RUN_USING_ENCODER, new PIDFCoefficients(p, i, d, f));
  }

  public void toPosition() {
    this.motor.setMode(DcMotor.RunMode.RUN_TO_POSITION);
  }

  public boolean isBusy() {
    return this.motor.isBusy();
  }

  public DcMotorEx retMotorEx() {
    return (DcMotorEx) motor;
  }
}```
---
sidebar_position: 3
---
# Tạo một OpMode
:::note Resources

* [Hướng dẫn tạo OpMide](https://www.youtube.com/watch?v=UmsXnZxoDmI)
:::

Trong FTC, code được viết trong OpMode, bạn sử dụng OpMode cho cả TeleOp và Autonomous. Bạn sẽ tìm hiểu một số khái niệm cơ bản và cài đặt OpMode

## 2 loại OpMode
Có 2 loại OpMode, là OpMode và LinearOpMode, cả 2 có 1 chút khác biệt, nhưng đều có cùng mục đích.


## OpMode
lớp OpMode bao gồm 5 phương thức khác nhau mà bạn có thể viết code trong đó. Code sẽ được chạy theo 5 cách khác nhau.

* `init()` - Code sẽ chạy 1 lần khi chương trình được khởi tạo.
* `init_loop()` - Code sẽ được chạy lặp lại trong suốt quá trình ngay khi chương trình được khởi tạo.
* `start()` - Code sẽ được chạy ngay khi chương trình được bắt đầu chạy.
* `loop()` - Code sẽ được chạy lặp lại trong suốt quá trình. 
* `stop()` - Code sẽ được chạy ngay sau khi chương trình được dừng.

Khơi tạo các phương thức sẽ có dạng tương tự như sau.

```java
import com.qualcomm.robotcore.eventloop.opmode.OpMode;

@TeleOp(name = "NonLinearTeleop")
public class FirstTeleop extends OpMode {  //Đảm bảo lớp này kế thừa OpMode
    @Override             //Ghi đè cho mỗi phương thức
    public void init() {
        //Chạy 1 lần khi khởi tạo
    }

    @Override
    public void init_loop() {
        //Lặp lại trong quá trình khởi tạo
    }

    @Override
    public void start() {
        //Chạy sau khi chương trình bắt đầu
    }

    @Override
    public void loop() {
        //Chạy lặp lại trong quá trình
    }

    @Override
    public void stop() {
        //Chạy 1 lần sau khi dừng
    }
}

```

## LinearOpMode
Một opmode khác là LinearOpMode. Nó có một số hàm và cấu trúc code khác
## Một số phương thức quan trọng trong LinearOpMode
* `waitForStart()` - Đợi cho chương trình chạy sau khi khởi tạo.
* `opModeIsActive()` - Kiểm tra OpMode có chạy hay không, trả về True/False.
* `runOpMode()` - Bao gồm tất cả code, chạy 1 lần sau khi bắt đầu chương trình.
## Tele-op LinearOpMode
```java 
@TeleOp(name = "LinearTeleop")
public class LinearTeleop extends LinearOpMode{
    @Override
    public void runOpMode() throws InterruptedException {
        //Khởi tạo tại đây
        waitForStart();
        while(opModeIsActive()){ //Vòng lặp while khi OpMode chạy
            //Code được chạy lặp lại
            //Tương tự như loop() trong OpMode
        }

    }
}
```
## LinearOpMode Autonomous
Code tự động trong LinearOpMode khá giống với cách thiết lập TeleOp, tuy nhiêu while(opModeIsActive) là không cần thiết cho hầu hết các trường hợp. while(opModeIsActive) vẫn có thể sử dụng cho một số tác vụ như đọc giá trị telemetry 

```java 
@Autonomous(name = "LinearAuto")
public class LinearAuto extends LinearOpMode{
    @Override
    public void runOpMode() throws InterruptedException {
        //Khởi tạo
        waitForStart();
        //Code auto

    }
}
```

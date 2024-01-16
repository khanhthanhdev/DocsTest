---
sidebar_position: 6
---
# Gamepad Controls

Trong giai đoạn do người lái điều khiển của FTC phù hợp, trình điều khiển của bạn sử dụng bộ điều khiển để lái xe và điều khiển robot
### Bộ điều khiển
Hiện tại, có 4 loại được cho phép sử dụng trong FTC
* [XBOX 360 Wired Controller](https://www.amazon.com/Microsoft-Wired-Controller-Windows-Console/dp/B004QRKWLA)
* [Logitech F310 Wired Controller](https://www.amazon.com/Logitech-940-000110-Gamepad-F310/dp/B003VAHYQY/ref=asc_df_B003VAHYQY/?tag=hyprod-20&linkCode=df0&hvadid=385267839105&hvpos=&hvnetw=g&hvrand=10943927897885031362&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1015153&hvtargid=pla-329121721635&psc=1&tag=&ref=&adgrpid=77420502894&hvpone=&hvptwo=&hvadid=385267839105&hvpos=&hvnetw=g&hvrand=10943927897885031362&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1015153&hvtargid=pla-329121721635)
* [ETPark Ps4 Wired Controller](https://www.amazon.com/Controller-Etpark-Playstation-Vibration-Anti-Slip/dp/B086QZ1Z67/ref=asc_df_B086QZ1Z67/?tag=hyprod-20&linkCode=df0&hvadid=642173926262&hvpos=&hvnetw=g&hvrand=15950086324327018534&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1015153&hvtargid=pla-949390119106&psc=1&gclid=Cj0KCQjw98ujBhCgARIsAD7QeAgZ6yP5Fku1masZEQLRXgWx2b4PIxxOQOPODWaCC19tnuYka_DMPX4aAsIEEALw_wcB)
* [Dual Shock Ps4 Controller](https://www.amazon.com/DualShock-Wireless-Controller-PlayStation-Black-4/dp/B01LWVX2RG/ref=sr_1_3?hvadid=557328939520&hvdev=c&hvlocphy=1015153&hvnetw=g&hvqmt=e&hvrand=1941213234762459107&hvtargid=kwd-317071107017&hydadcr=22934_13472370&keywords=ps4+dualshock+controller&qid=1685318366&sr=8-3)

:::caution
Mặc dù Bộ điều khiển Dual Shock 4 có khả năng không dây, nhưng phải sử dụng USB để kết nối nó với trạm điều khiển. Kết nối bộ điều khiển không dây không được phép cho FTC.
:::

### Nên sử dụng loại nào
Sự đồng thuận thông thường cho bộ điều khiển tốt nhất hiện có là Dual Shock 4. Cần điều khiển, bộ kích hoạt và nút cảm thấy tốt hơn so với các phím điều khiển khác, cũng như thực tế là nó có bàn di chuột. Nó cũng cung cấp phản hồi xúc giác với khả năng rung để nói với trình điều khiển của bạn điều gì đó, tuy nhiên bộ điều khiển này cũng đi kèm với thẻ giá cao nhất. Nếu tìm kiếm một lựa chọn hiệu quả về chi phí, nhóm của chúng tôi khuyên bạn nên sử dụng bộ điều khiển Logitech F310 vì nó được tìm thấy ở hầu hết các cửa hàng với giá khoảng 200k và nó là một bộ điều khiển đáng tin cậy.

### Điều khiển tay cầm
Gamepad có hai loại đầu vào chính. Đầu ra Boolean trả về true hay false tùy thuộc vào việc nút có được nhấn hay không. Loại còn lại là đầu ra kép trả về loại double 0-1.

### Đầu ra Boolean 

* Các nút A, X, Y, B
* Các nút D-pad 
* Left and Right Bumpers
* Misc Buttons(Share, Options, Start, Touchpad)

### Đầu ra Double
* Left and Right Triggers
* Both Joysticks

### Gán điều khiển Gamepad
Khi tham chiếu gamepad trong mã, bạn có thể sử dụng gamepad1 hoặc gamepad2 đề cập đến bộ điều khiển Trình điều khiển 1 hoặc Trình điều khiển 2. Điều này sẽ được theo sau bởi nút mà bạn đang cố gắng gán một lệnh.

```java 
gamepad1.a                  //a button on Driver 1 Controller
gamepad2.dpad_up            //dpad up on Driver 2 Controller

gamepad1.left_stick_x;      //0-1 value based on left horizontal joystick movement
gamepad1.left_trigger;   //0-1 value based on trigger position 
```

:::info
Khi sử dụng giá trị y cho cần điều khiển, di chuyển cần điều khiển xuống sẽ trả về giá trị dương và di chuyển nó lên sẽ trả về âm. Nếu bạn muốn chuyển đổi nó, chỉ cần nhân giá trị trả về với -1.
:::

### Sử dụng các nút
Dưới đây là một số mã cơ bản để di chuyển servo đến các vị trí khác nhau tùy thuộc vào thời điểm có nút. Giả sử một servo đã được khởi tạo.
```java 
if(gamepad1.a){
    servo.setPosition(0.5);  //Task if a is pressed
}else if(gamepad1.b){
    servo.setPosition(1);    //Task if b is pressed
```

### Sử dụng các giá trị Double
Có hai cách để bạn có thể sử dụng đầu ra kép, gán đầu ra làm nguồn cho động cơ hoặc sử dụng nó giống như một nút bằng cách trả về đúng hoặc sai. 
### Sử dụng giá trị Double
Một trong những cách sử dụng phổ biến nhất cho các bộ kích hoạt và cần điều khiển là gán giá trị do chúng xuất ra cho động cơ. Động cơ càng nhấn xuống hoặc di chuyển thì động cơ sẽ phát ra công suất cao hơn. Trong ví dụ này, giả sử động cơ quét và bánh đà đã được khởi tạo.
```java 
double sweeperPower = gamepad1.right_trigger;
double flywheelPower = gamepad1.left_stick_y * -1;

sweeper.setPower(sweeperPower);
flywheel.setPower(flywheelPower);
```
Như thể hiện trong ví dụ này, giá trị kích hoạt bên phải được gán cho động cơ quét và giá trị trục y cần điều khiển bên trái được gán cho động cơ kích hoạt. Hãy nhớ rằng, trục y của cần điều khiển ban đầu trả về một số âm đi lên, do đó, để thay đổi rằng công suất được nhân với âm 1. 

:::info
Để giải thích thêm một chút về cách cần điều khiển được lập trình với gamepad, có hai cần điều khiển trên mỗi gamepad, bạn tham khảo cái nào bạn muốn sử dụng bằng cách sử dụng left_stick hoặc right_stick. Mỗi cần điều khiển cũng có hai trục, một trục x, chuyển động trái và phải, và một trục y, chuyển động lên và xuống. Do đó, có bốn giá trị cần điều khiển khác nhau có thể nhận được trên mỗi gamepad. Điều này sẽ rất quan trọng khi lập trình hệ thống truyền động của bạn.
:::

### Sử dụng Trigger/Joystick như một nút
Trong một số trường hợp, bạn có thể đã sử dụng hết tất cả các nút trên gamepad của mình và chỉ muốn sử dụng trình kích hoạt hoặc cần điều khiển làm nút để bắt đầu một hành động khác. Giải pháp rất đơn giản, tạo một boolean kiểm tra xem giá trị đầu ra có lớn hơn không thì giá trị kép nhỏ và nếu vậy, "nút" đang được nhấn.
```java 
boolean isPressed;

isPressed = gamepad1.right_trigger > 0.1; 

if(isPressed){
    //Task to Complete
}
```

### Nhận biết một nút được ấn
#### Cách làm sai
Bây giờ, trong nhiều trường hợp, trình điều khiển sẽ đơn giản hơn khi sử dụng cùng một nút cho các tác vụ khác nhau liên quan đến cùng một mô-đun. Ví dụ: chuyển đổi vị trí của servo hoặc bật và tắt động cơ. Ý tưởng đầu tiên của bạn về cách làm điều này sẽ trông giống như thế này. Giả sử servo được khởi tạo.
```java
boolean downPosition = true; //alternating between down and up

if(gamepad1.a){
    downPosition = !downPosition; //switches position
    if(downPosition){
        servo.setPosition(0); //Moving down
    }else{
        servo.setPosition(1); //Moving up
    }
}
```

Logic này nói rằng nếu `a` đã được nhấn, để thay đổi giá trị của boolean `downPosition`. Nếu nó đã được thay đổi thành true, servo nên di chuyển đến vị trí xuống, nếu nó đã được thay đổi thành false, servo nên được di chuyển lên.

#### Tại sao nó không hoạt động ?
Logic có vẻ đúng nhưng có một lý do khiến điều này không hiệu quả. Như bạn đã biết, FTC tele-op chạy theo vòng lặp. Các vòng lặp này tiếp tục lặp lại ở tốc độ nhanh, một vòng lặp chỉ mất vài mili giây. Do đó, nếu bạn nhấn nút 'a', chương trình sẽ lặp lại nhiều lần trong khi bạn vẫn đang nhấn nó, khiến servo cố gắng di chuyển lên sau đó ngay lập tức xuống, v.v. khi chương trình tiếp tục lặp lại. Tất cả điều này sẽ làm là dẫn đến một servo bị rung khi bạn nhấn 'a'. 
#### Cách làm đúng
```java 
boolean lastMovement = false, currMovement = false;
boolean downPosition = true;

lastMovement = currMovement;
currMovement = gamepad1.a;    

if(currMovement && !lastMovement){
    downPosition = !downPosition;
    if(downPosition){
        servo.setPosition(0); //Move Down
    }else{
        servo.setPosition(1); //Move Up
    }
}
```

Điều này có vẻ khó hiểu, nhưng có một lời giải thích hợp lý đằng sau mã này. Ở đây chúng tôi đang thiết lập hai booleans `lastMovement` và `currMovement`. Chúng tôi đặt `lastMovement` bằng `currMovement` và sau đó, chúng tôi đặt `currMovement` thành boolean gamepad1.a.

Bây giờ, chúng ta chỉ nhập câu lệnh if để chuyển đổi vị trí servo nếu `currMovement` là true và `lastMovement` là false. Vòng lặp đầu tiên khi nhấn 'a' sẽ dẫn đến dòng `lastMovement = currMovement` có cả hai booleans ở false. 

Tuy nhiên, dòng tiếp theo sẽ thay đổi `currMovement` thành true, điều này sẽ cho phép vị trí servo thay đổi. Tuy nhiên, trong vòng lặp tiếp theo, vì nút vẫn đang được nhấn, trong vòng lặp tiếp theo, dòng `lastMovement = currMovement` sẽ đặt `lastMovement` thành true, dẫn đến cả `currMovement` và `lastMovement` đều đúng, có nghĩa là câu lệnh sẽ không được thực thi. Do đó, mã này sẽ đảm bảo rằng một hành động sẽ chỉ xảy ra một lần cho mỗi lần nhấn nút.



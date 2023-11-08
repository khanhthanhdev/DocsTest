---
sidebar_position: 2
---
# Logic chung của Odometry

Nền tảng chung của bất kì hệ thống di chuyển tự động nào chính là khả năng xác định vị trí chính xác nhờ thuật toán Odomentry. Thuật toán này cho phép robot có thể theo dõi vị trí chính xác của nó trên sân thi đấu

Thoạt nhìn, tọa độ của vị trí hiện tại của robot dường như không quan trọng, thế nhưng, những thông số này thật sự là chìa khóa của rất nhiều thuật toán giúp robot có thể di chuyển tới mọi vị trí trên sân

### Logic

Như bạn đã đọc được ở phía trên, Odometry cho phép robot xác định vị trí dựa vào vị trí ban đầu. Thuật toán này bắt đầu bằng việc lưu trữ vị trí đầu tiên của robot trên sân đấu dưới dạng toán học nhờ tọa độ không gian

$$
O = \begin{pmatrix}
x_0 \\
y_0\\
\theta_0
\end{pmatrix}
$$

Sau khi biết được vị trí đầu tiên, thuật toán này sẽ ghi nhận các chuyển động so với vị trị khởi tạo 

Sau đó chúng ta tiếp tục ghi nhận các sự thay đổi và thêm nó vào các tọa độ ban đầu. Quá trình này xảy ra liên tục với độ trễ chỉ vài mili giây nhằm đảm bảo các thông số chính xác nhất có thể. Phương trình sử dụng để cập nhật có thể viết dưới dạng toán học như sau:

$$
\begin{pmatrix}
x \\
y\\
\theta
\end{pmatrix}
 = O +
\begin{pmatrix}
\Delta x \\
\Delta y\\
\Delta \theta
\end{pmatrix}
$$

Để giải thích một cách đơn giản, vị trí hiện tại của robot là tổng của vị trí ban đầu (tọa độ $O$ ở phương trình đầu tiên) và tọa độ $\Delta$. Các kí hiệu $\Delta x$, $\Delta y$, $\Delta \theta$ thể hiện độ di chuyển so với vị trí trước đó: tiến lên và quay trái/phải

Giờ thì chúng ta đã biết Odometry hoạt động nhờ việc cập nhật vị trí trước đó và cộng với độ dịch chuyển. Điều nay đưa ta đến với một câu hỏi vô cùng quan trọng: Làm như thế nào để có thể tính toán được độ dịch chuyển đó?

Các đội thi sẽ sử dụng dữ liệu từ các cảm biến đặc biệt đưa ra các dữ liệu vị trí thô từ đó thông qua xử lí bằng lập trình, độ dịch chuyển sẽ được tính toán. Các loại cảm biến này cũng như cách lập trình để có thể xử lí dữ liệu từ chúng sẽ được nhắc tới trong các phần sau  

## General Implementation

Trong quá trình triển khai thực tế, những logic được nhắc tới ở phần trên vẫn được áp dụng, tuy nhiên, sẽ có một vài thay đổi nho nhỏ trong mã nguồn. Khi bắt đầu chương trình, dữ liệu về vị trí hiện tại sẽ được khởi tạo bằng vị trí bắt đầu của robot.

Sau đó, trong quá trình thực thi, các giá trị này được cập nhật liên tục bằng cách cộng với các giá trị của độ dịch chuyển hay còn được gọi là tọa độ $\Delta$ được truyền tới từ các nguồn dữ liệu. Điều này có nghĩa là vị trí bắt đầu được gán giá trị tọa độ $O$, và chương trình bắt đầu tự động cập nhật những giá trị ấy bằng các công thức phía trên. Điều này được thể hiệu dưới một mã giả (pseudocode) dưới đây

```java 
void updatePosition(){
    Point currentPosition = (0, 0, 0); // initialized to origin 
    // point, equal to $O$ matrix; changes
    // depending on the starting point of the robot on field
    Input OdometryInputSource = new Input();
    
        /* By continuously summing the amount the robot has moved from the previously 
        calculated position, the robot can be localized.
        Theoretical Equation: currentPosition = origin + overallDisplacement
        
        New Equation: currentPosition = 
        previouslyCalculatedPosition + displacementFromPreviousPosition
        */
    while(matchIsOccurring){
        Point displacement = OdometryInputSource.getDisplacement(); // receives
        // the $\Delta$ matrix of the equation
        

        currentPosition.x = currentPosition.x + displacement.x;
        currentPosition.y = currentPosition.y + displacement.y;
        currentPosition.theta = currentPosition.theta + displacement.theta;
    }
}
```
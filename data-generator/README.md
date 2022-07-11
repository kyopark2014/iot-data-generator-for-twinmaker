# IoT Data Generator


## 기본 설정 

IoT Data Generator는 특정 파형을 가지는 신호를 가상으로 생성하여 MQTT를 통해 IoT Core로 전송하므로, 마치 하나의 디바이스처럼 인증서등을 가지고 있어야 합니다. 따라서 [IoT Data Generator 설정](https://github.com/kyopark2014/iot-data-generator/blob/main/setup.md)에 따라서 인증서를 만들고, 설치하며 테스트를 합니다.

## Architecture

Data Generator의 구조는 아래와 같습니다. 상세한 정보는 [IoT Data Generator](https://github.com/kyopark2014/iot-data-generator/tree/main/data-generator)를 참조합니다. 

![diagram](https://user-images.githubusercontent.com/52392004/177172997-d6af2ba4-641b-4999-9af7-bbf47ad56093.png)

## 실행 결과

IoT Data Generator는 아래와 같은 형태의 파형을 생성 할 수 있습니다.

![image](https://user-images.githubusercontent.com/52392004/178292917-c422e580-7331-47bb-9b46-4b42e0301ab1.png)


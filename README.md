# TwinaMaker를 위한 IoT Data Generator 생성하기

여기서는 [IoT Data Generator를 이용하여 다양한 Data Source를 생성하고 Timestream과 Grafana를 이용하여 Dashboard 생성하기](https://github.com/kyopark2014/iot-data-generator)에서 TwinMaker를 위한 Data Source를 생성하기 위한 Sub Project입니다. 이것은 [TwinMaker와 SiteWise Connector를 연결하여 Asset Model](https://catalog.us-east-1.prod.workshops.aws/workshops/35e910c5-245f-41db-8284-73f0df0eb9ab/ko-KR/3/2)의 Data Souce를 Modeling 합니다.

## Data Asset Model

[IoT TwinMaker Workshop](https://catalog.us-east-1.prod.workshops.aws/workshops/35e910c5-245f-41db-8284-73f0df0eb9ab/ko-KR)에서 사용하는 Data Asset Model은 아래와 같습니다. 

<img width="963" alt="image" src="https://user-images.githubusercontent.com/52392004/177900062-3aac3867-5045-47b4-b39f-d4da23c71df3.png">

이때의 IoT Core로 인입되는 데이터의 형태는 아래와 같습니다. 

```java
{
    "rVibration_Temp":69.71,
    "rVibration_Z_RMS_Velocity":89.42,
    "rVibration_X_RMS_Velocity":50.58,
    "wRMSCurrent":106.94,
    "wCurrentLoad":107.94,
    "wEncoderVelocity":25.88,
    "wCylinderStatus":0.0,
    "sDateTime":"2022-07-06 22:56:30.503",
    "timeInSeconds":1657148190
}
```            

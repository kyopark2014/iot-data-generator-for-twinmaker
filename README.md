# TwinMaker를 위한 IoT Data Generator 생성하기

여기서는 [IoT Data Generator를 이용하여 다양한 Data Source를 생성하고 Timestream과 Grafana를 이용하여 Dashboard 생성하기](https://github.com/kyopark2014/iot-data-generator)에서 [AWS TwinMaker](https://github.com/kyopark2014/aws-iot-twinmaker/blob/main/README.md)를 위한 Data Source를 생성하기 위한 Sub Project입니다. 이것은 [TwinMaker와 SiteWise Connector를 연결하여 Asset Model](https://catalog.us-east-1.prod.workshops.aws/workshops/35e910c5-245f-41db-8284-73f0df0eb9ab/ko-KR/3/2)의 Data Souce를 Modeling 합니다.

## Data Asset Model

[IoT TwinMaker Workshop](https://catalog.us-east-1.prod.workshops.aws/workshops/35e910c5-245f-41db-8284-73f0df0eb9ab/ko-KR)에서 사용하는 Data Asset Model은 아래와 같습니다. 

<img width="963" alt="image" src="https://user-images.githubusercontent.com/52392004/177900062-3aac3867-5045-47b4-b39f-d4da23c71df3.png">

이때의 IoT Core로 인입되는 데이터의 Topic은 "$aws/rules/iotsitewise_conveyor1/conveyor1/telemetry"이고 데이터 형태는 아래와 같습니다.

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

Twinmaker에서 Conveyor를 로드한 화면 

<img width="550" alt="image" src="https://user-images.githubusercontent.com/52392004/178278678-4445b14a-cb70-4bc6-915a-b99303dde556.png">

Grafana에서 IoT data generator for twinmaker로 로딩한 모습은 아래와 같습니다. 

![image](https://user-images.githubusercontent.com/52392004/178278964-16c17b82-f325-42dc-95ea-d3daa9345d8e.png)


## 인프라 삭제 

인프라를 삭제할 경우에는 아래와 같이 삭제할 수 있습니다. 

```c
$ cdk destroy
```

그런데 entity가 삭제가 안되는 경우가 있다면 [AWS IoT TwinMaker](https://github.com/kyopark2014/aws-iot-twinmaker/blob/main/README.md)와 같이 AWS CLI를 이용하여 entity를 삭제후 workspace를 수동으로 삭제하여야 합니다. 

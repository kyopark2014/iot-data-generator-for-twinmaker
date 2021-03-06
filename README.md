# TwinMaker를 위한 IoT Data Generator 생성하기

[IoT Data Generator를 이용하여 다양한 Data Source를 생성하고 Timestream과 Grafana를 이용하여 Dashboard 생성하기](https://github.com/kyopark2014/iot-data-generator)에서 생성한 IoT Data Generator는 1개의 Source에서 1개의 파형만을 생성하고 있습니다. 하지만, [TwinMaker와 SiteWise Connector를 연결하여 생성한 Asset Model](https://catalog.us-east-1.prod.workshops.aws/workshops/35e910c5-245f-41db-8284-73f0df0eb9ab/ko-KR/3/2)은 1개의 Entity에서 여러개의 파형을 생성하여야 합니다.

따라서, [AWS TwinMaker](https://github.com/kyopark2014/aws-iot-twinmaker/blob/main/README.md)를 위하여 여기서 새로운 Data Generator를 생성하고자 합니다. 


## TwinMaker의 Data Asset Model 

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

## Data Source 생성하기 

[IoT Data Generator for twinmaker](https://github.com/kyopark2014/iot-data-generator-for-twinmaker/tree/main/data-generator)에서는 TwinMaker의 소스로 Multiple 파형을 가지는 IoT 소스를 구현하고 있습니다. 이때 Data Generator는 Python으로 구성되어 있으며, 아래와 같이 구동이 가능합니다. 

```c
$ cd data-generator
$ python3 simulator-sitewise.py
```

## 인프라 생성하기 

전체적인 인프라의 Architecture는 아래와 같습니다. IoT Data Generator는 여러개의 Waveform을 가지는 JSON 형태의 데이터를 IoT Core로 전송합니다. 여기서 Rule을 통해 특정 Topic을 IoT SiteWise로 전달합니다. 이때 Asset Model에 따라 정리된후 TwinMaker SiteWise Connect를 통해 TwinMaker에서 조회 할 수 있습니다. Grafana는 오픈 소스 시각화 도구로서 IoT TwinMaker의 데이터를 효과적으로 보여줍니다. 

<img width="908" alt="image" src="https://user-images.githubusercontent.com/52392004/178293935-4df28ed7-8d67-4ba3-9129-a391f7cf693f.png">

여기서는 [AWS CDK](https://github.com/kyopark2014/technical-summary/blob/main/cdk-introduction.md)를 이용해 인프라를 생성합니다. [CDK로 인프라 생성](https://github.com/kyopark2014/iot-data-generator-for-twinmaker/tree/main/cdk-twinmaker)에서는 CDK V2.0을 기준으로 Typescript를 이용하여 인프라를 생성하는 과정을 상세하게 설명하고 있습니다.  

```c
$ cd cdk-twinmaker
$ cdk deploy --all
```




## 생성 결과

Twinmaker에서 Conveyor를 로드한 화면은 아래와 같습니다. 

<img width="550" alt="image" src="https://user-images.githubusercontent.com/52392004/178278678-4445b14a-cb70-4bc6-915a-b99303dde556.png">

Grafana에서 TwinMaker를 통해 로딩한 신호를 Dashboard에 아래처럼 보여줄 수 있습니다. 

![image](https://user-images.githubusercontent.com/52392004/178278964-16c17b82-f325-42dc-95ea-d3daa9345d8e.png)


## 인프라 삭제 

인프라를 삭제할 경우에는 아래와 같이 삭제할 수 있습니다. 

```c
$ cdk destroy --all
```

## Reference

[Edge to Twin: A scalable edge to cloud architecture for digital twins](https://aws.amazon.com/ko/blogs/iot/edge-to-twin-a-scalable-edge-to-cloud-architecture-for-digital-twins/)

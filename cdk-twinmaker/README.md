# AWS CDK로 인프라 생성하기 

[상세코드](https://github.com/kyopark2014/iot-data-generator-for-twinmaker/blob/main/cdk-twinmaker/lib/cdk-twinmaker-stack.ts)에 각 모듈에 대해 설명합니다. 


## Workspace ID 정의

```java
const workspaceId = "MyWorkspace";

## S3 생성 

```java
    const s3Bucket = new s3.Bucket(this, "twinmaker",{
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: false,
      versioned: false,
    });
    new cdk.CfnOutput(this, 'bucketName', {
      value: s3Bucket.bucketName,
      description: 'The nmae of bucket',
    });
    new cdk.CfnOutput(this, 's3Arn', {
      value: s3Bucket.bucketArn,
      description: 'The arn of s3',
    });
    new cdk.CfnOutput(this, 's3Path', {
      value: 's3://'+s3Bucket.bucketName,
      description: 'The path of s3',
    });
```    

## Twinmaker Role

```c
    // create role for twinmaker
    const twinmakerRole = new iam.Role(this, "twinmakeRole", {
      roleName: 'TwinmakerRole',
      assumedBy: new iam.ServicePrincipal("iottwinmaker.amazonaws.com"),
      description: "Role of Twinmaker",
    });
    twinmakerRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "iotsitewise:GetAssetPropertyValue",
        "iotsitewise:DescribeAssetProperty",
        "iotsitewise:ListAssetModels",
        "iotsitewise:DescribeAssetModel",
        "iotsitewise:GetAssetPropertyValueHistory",
        "kinesisvideo:DescribeStream",
        "iotsitewise:DescribeAsset",
        "iotsitewise:ListAssets",
        "iottwinmaker:List*",
        "iottwinmaker:delete*"
      ],
      resources: ["*"],
    }));
    twinmakerRole.addManagedPolicy({  
      managedPolicyArn: 'arn:aws:iam::aws:policy/AmazonS3FullAccess',
    }); 
    new cdk.CfnOutput(this, 'twinmakerRoleArn', {
      value: twinmakerRole.roleArn,
      description: 'The arn of twinmaker',
    });
```

## TwinMaker Workspace

```java
    const cfnWorkspace = new iottwinmaker.CfnWorkspace(this, 'MyCfnWorkspace', {
      role: twinmakerRole.roleArn,  
      s3Location: s3Bucket.bucketArn,    
      workspaceId: workspaceId,
      description: 'Workspace for TwinMaker'
    }); 
```

## SiteWise Asset Model

```java
    const cfnAssetModel = new iotsitewise.CfnAssetModel(this, 'MyCfnAssetModel', {
      assetModelName: 'Conveyor Machine',
      assetModelDescription: 'Asset Model Description for Conveyor Machine',

      assetModelProperties: [
        // Attribute definitions
        {
          name: 'Serial Number',
          dataType: 'STRING',
          logicalId: 'logicalId-SerialNumber',
          type: {
            typeName: 'Attribute',
            attribute: {
              defaultValue: 'ABC123',
            },
          },
        },
        // Measurement definitions
        {
          name: 'rVibration_Temp',
          dataType: 'DOUBLE',
          logicalId: 'logicalId-rVibration_Temp',
          unit: 'Celsius',
          type: {
            typeName: 'Measurement',
          },
        },
        {
          name: 'rVibration_X_RMS_Velocity',
          dataType: 'DOUBLE',
          logicalId: 'logicalId-rVibration_X_RMS_Velocity',
          unit: 'mm/s',
          type: {
            typeName: 'Measurement',
          },
        },
        {
          name: 'rVibration_Z_RMS_Velocity',
          dataType: 'DOUBLE',
          logicalId: 'logicalId-rVibration_Z_RMS_Velocity',
          unit: 'mm/s',
          type: {
            typeName: 'Measurement',
          },
        },
        {
          name: 'wCurrentLoad',
          dataType: 'DOUBLE',
          logicalId: 'logicalId-wCurrentLoad',
          unit: '%',
          type: {
            typeName: 'Measurement',
          },
        },
        {
          name: 'wEncoderVelocity',
          dataType: 'DOUBLE',
          logicalId: 'logicalId-wEncoderVelocity',
          unit: 'RPM',
          type: {
            typeName: 'Measurement',
          },
        },
        {
          name: 'wRMSCurrent',
          dataType: 'DOUBLE',
          logicalId: 'logicalId-wRMSCurrent',
          unit: 'A',
          type: {
            typeName: 'Measurement',
          },
        },
        {
          name: 'wCylinderStatus',
          dataType: 'INTEGER',
          logicalId: 'logicalId-wCylinderStatus',
          unit: 'status',
          type: {
            typeName: 'Measurement',
          },
        }
      ],
    });
```

## Asset

```java
    const cfnAsset = new iotsitewise.CfnAsset(this, 'MyCfnAsset', {
      assetName: "Conveyor Machine 1",
      assetModelId: cfnAssetModel.attrAssetModelId,
      assetProperties: [
        {
          logicalId: 'logicalId-rVibration_Temp',
          alias: '/Conveyor1/rVibration_Temp',
          notificationState: 'ENABLED'
        },
        {
          logicalId: 'logicalId-rVibration_X_RMS_Velocity',
          alias: '/Conveyor1/rVibration_X_RMS_Velocity',
          notificationState: 'ENABLED'
        },
        {
          logicalId: 'logicalId-rVibration_Z_RMS_Velocity',
          alias: '/Conveyor1/rVibration_Z_RMS_Velocity',
          notificationState: 'ENABLED'
        },
        {
          logicalId: 'logicalId-wCurrentLoad',
          alias: '/Conveyor1/wCurrentLoad',
          notificationState: 'ENABLED'
        },
        {
          logicalId: 'logicalId-wEncoderVelocity',
          alias: '/Conveyor1/wEncoderVelocity',
          notificationState: 'ENABLED'
        },
        {
          logicalId: 'logicalId-wRMSCurrent',
          alias: '/Conveyor1/wRMSCurrent',
          notificationState: 'ENABLED'
        },
        {
          logicalId: 'logicalId-wCylinderStatus',
          alias: '/Conveyor1/wCylinderStatus',
          notificationState: 'ENABLED'
        },
      ]
    });
```

## role for IoT Rule

```java
    const ruleRole = new iam.Role(this, "ruleRole", {
      roleName: 'IoTRuleRole-for-twinmaker',
      assumedBy: new iam.ServicePrincipal("iot.amazonaws.com"),
      description: "Role of IoT Rule",
    });
    ruleRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "iotsitewise:BatchPutAssetPropertyValue"
      ],
      resources: [
        cfnAsset.attrAssetArn
      ],
    }));
    ruleRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "iotsitewise:BatchPutAssetPropertyValue"
      ],
      resources: [
        "arn:aws:iotsitewise:us-east-1:677146750822:time-series/*"
      ]
    }));
    new cdk.CfnOutput(this, 'ruleRoleArn', {
      value: ruleRole.roleArn,
      description: 'The arn of IoT Rule',
    });
```

## IoT Rule 

```java
    new iot.CfnTopicRule(this, "TopicRuleForIoTSiteWise", {
      ruleName: "iotsitewise_conveyor1",
      topicRulePayload: {
        description: 'Rule for IoT SiteWise',
        sql: "SELECT * FROM 'conveyor1/telemetry'",
        actions: [
          {
            iotSiteWise: {
              putAssetPropertyValueEntries: [
                {
                  propertyAlias: '/Conveyor1/rVibration_Temp',
                  propertyValues: [{
                    timestamp: {
                      timeInSeconds: '${timeInSeconds}',
                    },
                    value: {
                      doubleValue: '${rVibration_Temp}',
                    },
                  }],       
                },
                {
                  propertyAlias: '/Conveyor1/rVibration_X_RMS_Velocity',
                  propertyValues: [{
                    timestamp: {
                      timeInSeconds: '${timeInSeconds}',
                    },
                    value: {
                      doubleValue: '${rVibration_X_RMS_Velocity}',
                    },
                  }],       
                },
                {
                  propertyAlias: '/Conveyor1/rVibration_Z_RMS_Velocity',
                  propertyValues: [{
                    timestamp: {
                      timeInSeconds: '${timeInSeconds}',
                    },
                    value: {
                      doubleValue: '${rVibration_Z_RMS_Velocity}',
                    },
                  }],       
                },
                {
                  propertyAlias: '/Conveyor1/wCurrentLoad',
                  propertyValues: [{
                    timestamp: {
                      timeInSeconds: '${timeInSeconds}',
                    },
                    value: {
                      doubleValue: '${wCurrentLoad}',
                    },
                  }],       
                },
                {
                  propertyAlias: '/Conveyor1/wEncoderVelocity',
                  propertyValues: [{
                    timestamp: {
                      timeInSeconds: '${timeInSeconds}',
                    },
                    value: {
                      doubleValue: '${wEncoderVelocity}',
                    },
                  }],       
                },
                {
                  propertyAlias: '/Conveyor1/wRMSCurrent',
                  propertyValues: [{
                    timestamp: {
                      timeInSeconds: '${timeInSeconds}',
                    },
                    value: {
                      doubleValue: '${wRMSCurrent}',
                    },
                  }],       
                },
                {
                  propertyAlias: '/Conveyor1/wCylinderStatus',
                  propertyValues: [{
                    timestamp: {
                      timeInSeconds: '${timeInSeconds}',
                    },
                    value: {
                      integerValue: '${wCylinderStatus}',
                    },
                  }],       
                },
              ],
              roleArn: ruleRole.roleArn,
            },
          },
        ],
        ruleDisabled: false,
      },      
    });
```

## Entity와 Component 생성 

```java
    // create Entity Factory
    const cfnEntityFactory = new iottwinmaker.CfnEntity(this, 'MyCfnEntityFactory', {
      entityName: 'Factory',
      workspaceId: workspaceId,
      description: 'Entity Factory', 
      entityId: 'entityIdFactoryabcd', 
    }); 
    
    // create Entity Conveyors
    const cfnEntityConveyors = new iottwinmaker.CfnEntity(this, 'MyCfnEntityConveyors', {
      entityName: 'Conveyors',
      workspaceId: workspaceId,
      description: 'Entity Conveyors',
      entityId: 'entityIdConveyorsabcd',
      parentEntityId: cfnEntityFactory.entityId,
    });  
    
    // create Entity Conveyor1
    const cfnEntityConveyor1 = new iottwinmaker.CfnEntity(this, 'MyCfnEntityConveyor1', {
      entityName: 'Conveyor1',
      workspaceId: workspaceId,
      description: 'Entity Conveyors1',
      entityId: 'EntityIdConveyor1abcd',
      parentEntityId: cfnEntityConveyors.entityId,

      // add component
      components: {
        "ConveyorMetrics": {
          componentName: 'ConveyorMetrics',
          componentTypeId: 'com.amazon.iotsitewise.connector',
          description: 'component - ConveyorMetrics',
          properties: {
            "sitewiseAssetId": {
              value: {
                stringValue: cfnAsset.attrAssetId,
              }, 
            }, 
            "sitewiseAssetModelId": {
              value: {
                stringValue: cfnAssetModel.attrAssetModelId,
              }, 
            }, 
          }, 
        }, 
      }, 
    }); 
```

## GIB 파일을 S3로 복사

```java
    new s3Deploy.BucketDeployment(this, "DeployWebApplication", {
      sources: [s3Deploy.Source.asset("../sample")],
      destinationBucket: s3Bucket,
    });
```

## SCENE 생성 

아래와 같이 SCENE를 생성할 수 있습니다. 이후 SCENE에 리소스를 넣는 과정은 [3D Scene 구성](https://catalog.us-east-1.prod.workshops.aws/workshops/35e910c5-245f-41db-8284-73f0df0eb9ab/ko-KR/5/2)을 참고하여 Console에서 진행합니다. 

```java
// create scene
    const cfnScene = new iottwinmaker.CfnScene(this, 'MyCfnScene', {
      // contentLocation: 's3://'+s3Bucket.bucketName,
      contentLocation: "mylocation",
      sceneId: 'MyScene',
      workspaceId: workspaceId,
      description: 'Scene',
    });     
```


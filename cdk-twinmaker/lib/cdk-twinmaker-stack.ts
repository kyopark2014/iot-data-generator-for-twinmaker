import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iottwinmaker from 'aws-cdk-lib/aws-iottwinmaker'
import * as iotsitewise from 'aws-cdk-lib/aws-iotsitewise'
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as iot from 'aws-cdk-lib/aws-iot';
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment"

export class CdkTwinmakerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const workspaceId = "MyWorkspace";

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
    
    // SiteWise Asset Model
    const assetModel = new iotsitewise.CfnAssetModel(this, 'MyCfnAssetModel', {
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
    new cdk.CfnOutput(this, 'AssetModelId', {
      value: assetModel.attrAssetModelId,
      description: 'The id of SiteWise Model',
    });

    const asset = new iotsitewise.CfnAsset(this, 'MyCfnAsset', {
      assetName: "Conveyor Machine 1",
      assetModelId: assetModel.attrAssetModelId,
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
    new cdk.CfnOutput(this, 'AssetId', {
      value: asset.attrAssetId,
      description: 'The id of SiteWise Asset',
    });

    // create role for IoT Rule
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
        asset.attrAssetArn
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

    // defile IoT Rule 
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

    // create Workspace
    const workspace = new defineWorkspace(scope, "FactoryWorkspace", twinmakerRole, s3Bucket, workspaceId);

    // create Entity Factory
    const factory = new entityFactory(scope, "EntityFactory", workspaceId, 'entityIdFactoryabcd');    
    factory.addDependency(workspace);

    // create Entity Conveyors
    const conveyors = new entityConveyors(scope, "EntityConveyors", workspaceId, 'entityIdConveyorsabcd', 'entityIdFactoryabcd');
    conveyors.addDependency(factory);
    
    // create Entity Conveyor1
    const conveyor1 = new entityConveyor1(scope, "EntityConveyor1", workspaceId, 'entityIdConveyor1abcd', 'entityIdConveyorsabcd', assetModel, asset);
    conveyor1.addDependency(conveyors); 

    // copy glb files in S3
    new s3Deploy.BucketDeployment(this, "DeployWebApplication", {
      sources: [s3Deploy.Source.asset("../sample")],
      destinationBucket: s3Bucket,
    }); 

    // create scene
  /*  const cfnScene = new iottwinmaker.CfnScene(this, 'MyCfnScene', {  // To-Do define scene
      // contentLocation: 's3://'+s3Bucket.bucketName,
      contentLocation: "mylocation",
      sceneId: 'MyScene',
      workspaceId: workspaceId,
      description: 'Scene',
    });     */
  }
}

export class entityFactory extends cdk.Stack {
  constructor(scope: Construct, id: string, workspaceId: string, entityId: string, props?: StackProps) {    
    super(scope, id, props);
      
    // create Entity Factory
    const cfnEntityFactory = new iottwinmaker.CfnEntity(this, 'MyCfnEntityFactory', {
      entityName: 'Factory',
      workspaceId: workspaceId,
      description: 'Entity Factory', 
      entityId: entityId, 
    }); 

    new cdk.CfnOutput(this, 'factoryArn', {
      value: cfnEntityFactory.attrArn,
      description: 'The arn of factory entity',
    });  
  }
}

export class entityConveyors extends cdk.Stack {
  constructor(scope: Construct, id: string, workspaceId: string, entityId: string, parentEntityId: string, props?: StackProps) {
    super(scope, id, props);

    // create Entity Conveyors
    const cfnEntityConveyors = new iottwinmaker.CfnEntity(this, 'MyCfnEntityConveyors', {
      entityName: 'Conveyors',
      workspaceId: workspaceId,
      description: 'Entity Conveyors',
      entityId: entityId,
      parentEntityId: parentEntityId,
    });  
  }
}

export class entityConveyor1 extends cdk.Stack {
  constructor(scope: Construct, id: string, workspaceId: string, entityId: string, parentEntityId: string, assetModel: iotsitewise.CfnAssetModel, asset: iotsitewise.CfnAsset, props?: StackProps) {
    super(scope, id, props);
    // create Entity Conveyor1
    const cfnEntityConveyor1 = new iottwinmaker.CfnEntity(this, 'MyCfnEntityConveyor1', {
      entityName: 'Conveyor1',
      workspaceId: workspaceId,
      description: 'Entity Conveyors1',
      entityId: entityId,
      parentEntityId: parentEntityId,

      // add component
      components: {
        "ConveyorMetrics": {
          componentName: 'ConveyorMetrics',
          componentTypeId: 'com.amazon.iotsitewise.connector',
          description: 'component - ConveyorMetrics',
          properties: {
            "sitewiseAssetId": {
              value: {
                stringValue: asset.attrAssetId,
              }, 
            }, 
            "sitewiseAssetModelId": {
              value: {
                stringValue: assetModel.attrAssetModelId,
              }, 
            }, 
          }, 
        }, 
      }, 
    }); 
  }
}

export class defineWorkspace extends cdk.Stack {
  constructor(scope: Construct, id: string, twinmakerRole: cdk.aws_iam.Role, s3Bucket: cdk.aws_s3.Bucket, workspaceId: string, props?: StackProps) {
    super(scope, id, props);

    // TwinMaker Workspace
    const cfnWorkspace = new iottwinmaker.CfnWorkspace(this, 'MyCfnWorkspace', {
      role: twinmakerRole.roleArn,  
      s3Location: s3Bucket.bucketArn,    
      workspaceId: workspaceId,
      description: 'Workspace for TwinMaker'
    }); 
  }
}
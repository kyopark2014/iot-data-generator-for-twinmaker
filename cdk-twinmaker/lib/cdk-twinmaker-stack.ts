import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iottwinmaker from 'aws-cdk-lib/aws-iottwinmaker'
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

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
        "iottwinmaker:List*"
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
    
    const cfnWorkspace = new iottwinmaker.CfnWorkspace(this, 'MyCfnWorkspace', {
      role: twinmakerRole.roleArn,  
      s3Location: s3Bucket.bucketArn,    
      workspaceId: workspaceId,
      description: 'Workspace for TwinMaker'
    }); 
  }
}

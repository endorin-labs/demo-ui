## ACM setup for enclave

For profile association
```
aws ec2 --region {region} associate-iam-instance-profile --instance-id {instance_id} --iam-instance-profile Name=acm-instance-profile

aws ec2 disassociate-enclave-certificate-iam-role --certificate-arn <value> --role-arn <value>

aws ec2  associate-enclave-certificate-iam-role --certificate-arn <value> \ --role-arn <value>```

    sudo dnf install openssl-pkcs11-0.4.11-8.amzn2023.0.3.x86_64 -y

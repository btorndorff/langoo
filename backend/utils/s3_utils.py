import boto3


AWS_S3_PREFIX = "https://langoo.s3.us-east-1.amazonaws.com"


def upload_file(file_obj, bucket):
    object_name = file_obj.filename
    s3_client = boto3.client("s3")
    response = s3_client.upload_fileobj(file_obj, bucket, object_name)
    return response

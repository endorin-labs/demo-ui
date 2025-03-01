provider "aws" {
  region = "us-east-1"
}

data "aws_eip" "endorin_chat" {
  public_ip = "44.195.238.230"
}

resource "aws_instance" "enclave_demo" {
  ami                    = "ami-053a45fff0a704a47"
  instance_type          = "m5n.4xlarge"
  key_name               = "vsock-aakash" # Ensure this key pair exists
  availability_zone      = "us-east-1d"
  subnet_id              = "subnet-06c45597699591587"
  vpc_security_group_ids = ["sg-02f392c3e8121fb74"]

  root_block_device {
    volume_size = 100
    volume_type = "gp2"
  }

  # Use the combined cloud-init file
  user_data = file("cloud_init.yaml")

  # Enable Nitro Enclaves
  enclave_options {
    enabled = true
  }
}

resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.enclave_demo.id
  allocation_id = data.aws_eip.endorin_chat.id
}

output "instance_public_ip" {
  value = data.aws_eip.endorin_chat.public_ip
}

#
# Changes to this file require a restart
#
class AppConfig:
    # us-east-1 configuration
    client_id = "DeviceSimulator"
    endpoint = "anr3wll34rul5-ats.iot.us-east-1.amazonaws.com"
    cert = "./certs/data-generator.cert.pem"
    key = "./certs/data-generator.private.key"
    root_ca = "./certs/root-CA.crt"

    topic = "$aws/rules/iotsitewise_conveyor1/conveyor1/telemetry" # Can be overridem in the configs/*.json files with the optional 

    scan_interval = 1 # seconds

    config_dir = "./data_sources"
    config_file_exclusions = [config_dir+"/sample.json", config_dir+"/config-template.json"]

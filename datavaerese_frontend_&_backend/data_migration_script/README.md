### Port forwading

- Example: `ssh -i key.pem -L 5432:RDS-HOST-NAME:5432 ubuntu@IP-ADDRESS`
- RDS-HOST-NAME can be found in https://ap-south-1.console.aws.amazon.com/rds/home?region=ap-south-1#database:id=origin-health;is-cluster=false;tab=connectivity
- IP-ADDRESS is the IP address of the step server

- `ssh ubuntu@3.108.56.27 -L 5432:origin-health.co7cbjsal4mz.ap-south-1.rds.amazonaws.com:5432 -i origin-prod`


### Steps
- Put files in respective folders
- Port forward
- Change URL in `index.ts`. For example after port forwarding: `postgresql://username:password@localhost:5432/ohai_dataverse_prod` (the whole string should be URL encoded, password might contain special characters).
- Run with `npx ts-node data_migration_script/index.ts`
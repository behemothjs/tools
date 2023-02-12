import process from 'node:process';
import { S3Driver } from './drivers/s3';
import { LocalDriver } from './drivers/local';
export class Storage {
    config = {
        default: process.env.FILESYSTEM_DRIVER ?? 'local',
        disks: {
            local: {
                driver: 'local',
                root: '.',
            },
        },
    };
    constructor(config) {
        this.config = config;
        this.disk(this.config.default);
    }
    disk(name) {
        const disk = this.config.disks[name];
        if (!disk) {
            throw new Error(`[Storage] disk ${name} not defined.`);
        }
        switch (disk.driver) {
            case 'local': {
                return new LocalDriver(this, disk);
            }
            case 's3': {
                return new S3Driver(this, disk);
            }
            default: {
                throw new Error('[Storage] driver not supported.');
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3RvcmFnZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLE9BQU8sTUFBTSxjQUFjLENBQUM7QUFFbkMsT0FBTyxFQUFDLFFBQVEsRUFBd0IsTUFBTSxjQUFjLENBQUM7QUFDN0QsT0FBTyxFQUFDLFdBQVcsRUFBMkIsTUFBTSxpQkFBaUIsQ0FBQztBQUV0RSxNQUFNLE9BQU8sT0FBTztJQUNuQixNQUFNLEdBQWtCO1FBQ3ZCLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLE9BQU87UUFDakQsS0FBSyxFQUFFO1lBQ04sS0FBSyxFQUFFO2dCQUNOLE1BQU0sRUFBRSxPQUFPO2dCQUNmLElBQUksRUFBRSxHQUFHO2FBQ1Q7U0FDRDtLQUNELENBQUM7SUFFRixZQUFZLE1BQXFCO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsSUFBSSxDQUFDLElBQVk7UUFDaEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLElBQUksZUFBZSxDQUFDLENBQUM7U0FDdkQ7UUFFRCxRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDcEIsS0FBSyxPQUFPLENBQUMsQ0FBQztnQkFDYixPQUFPLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxJQUEyQixDQUFDLENBQUM7YUFDMUQ7WUFFRCxLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUNWLE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLElBQXdCLENBQUMsQ0FBQzthQUNwRDtZQUVELE9BQU8sQ0FBQyxDQUFDO2dCQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQzthQUNuRDtTQUNEO0lBQ0YsQ0FBQztDQUNEIn0=
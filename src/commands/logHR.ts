import { Command, flags } from '@oclif/command'
import { appName } from '../appName'
import tempo from '../tempo'
import globalFlags from '../globalFlags'

export default class LogHR extends Command {
    static description = 'Log daily working time'

    static examples = [
        `${appName} logHR 07:00 16:00 8.0 0.5`,
        `${appName} logHR 07:00 16:00 8.0`
    ]

    static aliases = ['hr']

    static flags = {
        help: flags.help({ char: 'h' }),
        debug: flags.boolean()
    }

    static args = [
        {
            name: 'start',
            description: 'start like 07:00',
            required: true
        },
        {
            name: 'end',
            description: 'end like 17:00',
            required: true
        },
        {
            name: 'duration',
            description: 'duration, like 8.0',
            required: true
        },
        {
            name: 'flex',
            description: 'flex, like 0.5',
            required: false
        }
    ]

    async run() {
        const { args, flags } = this.parse(LogHR)
        globalFlags.debug = flags.debug
        await tempo.addWorklog({
            issueKeyOrAlias: 'HR',
            durationOrInterval: '1m',
            when: args.when
        }, [
            {
                value: args.duration,
                key: '_NormalDuration_'
            },
            {
                value: args.end,
                key: '_To_'
            },
            {
                value: args.start,
                key: '_From_'
            },
            {
                value: args.flex || '0',
                key: '_Flextime_'
            }
        ])
    }
}

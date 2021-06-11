export * from './request';

export function searchArg(leader: string, follow: boolean, argv: string[]): [string | boolean, string[]] //{
{
    let o1 = null;
    let o2 = [];
    for(let i=0;i<argv.length;i++) {
        if(argv[i] == leader) {
            if(o1 != null) {
                throw new Error(`duplicated argument ${leader}`);
            }
            if(follow) {
                i++;
                if(i == argv.length) {
                    throw new Error(`missing required argument '${leader} <argument>'`);
                }
                o1 = argv[i];
            } else {
                o1 = true;
            }
            continue;
        }

        o2.push(argv[i]);
    }

    return [o1, o2];
} //}

export function tryAsBoolean(value: string): string | boolean //{
{
    if(value == 'true' || value == 'false') {
        return value == 'true';
    }

    return value;
} //}


import 'process';
import assert from 'assert';
import { default as fetch } from 'node-fetch';
import { API } from './api';
import { domain_handler } from './identity_domain';


async function create_token(): Promise<string> //{
{
    const username = process.env['OS_USERNAME'];
    const password = process.env['OS_PASSWORD'];
    const domain   = process.env['OS_USER_DOMAIN_NAME'] || 'Default';
    if (!username || !password) {
        console.log(`please set below environment variable

export OS_USERNAME=<username>
export OS_PASSWORD=<password>
export OS_USER_DOMAIN_NAME=[domain || 'Default']
`);
        throw new Error('require username and password');
    }

    const payload: any = {
        auth: {
            identity: {
                methods: [
                    "password",
                ],
                password: {
                    user: {
                        name: username,
                        password: password,
                        domain: {
                            name: "Default",
                        },
                    }
                }
            },
            scope: {
                project: {
                    domain: {
                        name: "Default",
                    },
                    name: "admin",
                },
            }
        }
    }

    const resp = await fetch(API.Identity.token, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'},
    });

    let bodyMsg = (await resp.buffer()).toString();
    try {
        bodyMsg = JSON.parse(bodyMsg);
    } catch {}
    const token: string = resp.headers.get("X-Subject-Token");

    const printText = {
        status: resp.status,
        statusText: resp.statusText,
        // body: JSON.stringify(bodyMsg, null, 2),
        token: token,
    };

    console.log(printText);
    return token;
} //}

async function delete_token(token: string): Promise<void> //{
{
    token = token || process.env['OS_TOKEN'];

    const resp = await fetch(API.Identity.token, {
        method: 'DELETE',
        headers: {
            "X-Auth-Token": token,
            "X-Subject-Token": token,
        },
    });

    console.log(`statusCode: ${resp.status}, statusText: ${resp.statusText}`)
    if (resp.status >= 300) {
        console.error(`BAD NEWS, request fail.`);
        console.error((await resp.buffer()).toString());
    }
} //}

export async function get_with_token(url: string, token: string, extra_headers: object = {}): Promise<string> //{
{
    token = token || process.env['OS_TOKEN'];
    const headers = Object.assign({}, extra_headers);
    headers['X-Auth-Token'] = token;

    const resp = await fetch(url, {
        method: 'GET',
        headers: headers,
    });

    console.log(`statusCode: ${resp.status}, statusText: ${resp.statusText}`)
    const msg = (await resp.buffer()).toString();
    if(resp.status >= 300) {
        console.error(msg)
        throw new Error('get fail');
    }

    return msg;
} //}

async function check_token(token: string): Promise<boolean> //{
{
    token = token || process.env['OS_TOKEN'];

    const resp = await fetch(API.Identity.token, {
        method: 'HEAD',
        headers: {
            "X-Auth-Token": token,
            'X-Subject-Token': token,
        },
    });

    console.log(`statusCode: ${resp.status}, statusText: ${resp.statusText}`)
    if (resp.status >= 300) {
        console.error(`BAD NEWS, request fail.`);
        console.error((await resp.buffer()).toString());
        return false;
    }

    return true;
} //}

async function get_token_info(token: string): Promise<void> //{
{
    console.log(JSON.parse(await get_with_token(API.Identity.token, token, {"X-Subject-Token": token})));
} //}

// require a domain scope token
async function get_catalog(token: string): Promise<void> //{
{
    console.log(JSON.stringify(JSON.parse(await get_with_token(API.Identity.catalog, token)), null, 4));
} //}

async function get_projects(token: string): Promise<void> //{
{
    console.log(JSON.stringify(JSON.parse(await get_with_token(API.Identity.projects, token)), null, 4));
} //}
async function get_domains(token: string): Promise<void> //{
{
    console.log(JSON.stringify(JSON.parse(await get_with_token(API.Identity.domains, token)), null, 4));
} //}
async function get_system(token: string): Promise<void> //{
{
    console.log(JSON.stringify(JSON.parse(await get_with_token(API.Identity.system, token)), null, 4));
} //}


async function main(cmd: string) {
    switch(cmd) {
        case 'create':
            await create_token();
            break;
        case 'delete':
            await delete_token(process.argv.length > 3 ? process.argv[3] : null);
            break;
        case 'get_token_info':
            await get_token_info(process.argv.length > 3 ? process.argv[3] : null);
            break;
        case 'check':
            await check_token(process.argv.length > 3 ? process.argv[3] : null);
            break;
        case 'get_catalog':
            await get_catalog(process.argv.length > 3 ? process.argv[3] : null);
            break;
        case 'get_projects':
            await get_projects(process.argv.length > 3 ? process.argv[3] : null);
            break;
        case 'get_domains':
            await get_domains(process.argv.length > 3 ? process.argv[3] : null);
            break;
        case 'get_system':
            await get_system(process.argv.length > 3 ? process.argv[3] : null);
            break;

        case 'domain':
            await domain_handler(process.argv.slice(3));
            break;

        default:
            throw new Error(`command ${cmd} is unsupported`);
            break;
    }
}

assert(process.argv.length >= 3);
main(process.argv[2]).catch(err => console.error(err));


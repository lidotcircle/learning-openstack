import assert from "assert";
import fetch from "node-fetch";
import { API } from './api';
import { get_with_token } from './identity';
import { searchArg, tryAsBoolean } from "./util";


async function domain_list(token: string) //{
{
    console.log(JSON.stringify(JSON.parse(await get_with_token(API.Identity.Domain.index, token)), null, 4));
} //}

async function domain_create(token: string, domain: {name: string, description?: string, enabled?: boolean}) //{
{
    token = token || process.env['OS_TOKEN'];

    const resp = await fetch(API.Identity.Domain.index, {
        method: "POST",
        headers: {
            "X-Auth-Token": token,
            "Content-Type": 'application/json',
        },
        body: JSON.stringify({ domain: domain }),
    });

    console.log(`status: ${resp.status}, statusText: ${resp.statusText}`);
    const msg = (await resp.buffer()).toString();
    if(resp.status >= 400) {
        throw new Error(JSON.stringify(JSON.parse(msg), null, 4));
    } else {
        console.log(JSON.stringify(JSON.parse(msg), null, 4));
    }
} //}

async function domain_detail(token: string, domain_id: string) //{
{
    token = token || process.env['OS_TOKEN'];

    const resp = await fetch(API.Identity.Domain.index + `/${domain_id}`, {
        method: "GET",
        headers: {
            "X-Auth-TOken": token,
        },
    });

    console.log(`status: ${resp.status}, statusText: ${resp.statusText}`);
    const msg = (await resp.buffer()).toString();
    if(resp.status >= 400) {
        throw new Error(JSON.stringify(JSON.parse(msg), null, 4));
    } else {
        console.log(JSON.stringify(JSON.parse(msg), null, 4));
    }
} //}

async function domain_delete(token: string, domain_id: string) //{
{
    token = token || process.env['OS_TOKEN'];

    const resp = await fetch(API.Identity.Domain.index + `/${domain_id}`, {
        method: "DELETE",
        headers: {
            "X-Auth-TOken": token,
        },
    });

    console.log(`status: ${resp.status}, statusText: ${resp.statusText}`);
    const msg = (await resp.buffer()).toString();
    if(resp.status >= 400) {
        throw new Error(JSON.stringify(JSON.parse(msg), null, 4));
    }
} //}

async function domain_modify(token: string, domain_id: string, key: string, value: string) //{
{
    token = token || process.env['OS_TOKEN'];

    const bodyObj = {};
    bodyObj[key] = tryAsBoolean(value);
    const resp = await fetch(API.Identity.Domain.index + `/${domain_id}`, {
        method: "PATCH",
        headers: {
            "X-Auth-TOken": token,
            "Content-Type": 'application/json',
        },
        body: JSON.stringify({ domain: bodyObj }),
    });

    console.log(`status: ${resp.status}, statusText: ${resp.statusText}`);
    let msg = (await resp.buffer()).toString();
    if(resp.status >= 400) {
        throw new Error(JSON.stringify(JSON.parse(msg), null, 4));
    } else {
        console.log(JSON.stringify(JSON.parse(msg), null, 4));
    }
} //}

export async function domain_handler(command: string[]) {
    assert(command.length > 0);
    const c = command[0];
    command.splice(0, 1);

    switch(c) {
        case 'list':
            await domain_list(command[1]);
            break;

        case 'create': {
            const [tk, cmd] = searchArg('-t', true, command);
            await domain_create(tk as string, {
                name: cmd[0],
                description: cmd[1],
                enabled: cmd[2] == undefined || cmd[2] == 'true',
            });
        } break;

        case 'detail': {
            const [tk, cmd] = searchArg('-t', true, command);
            assert(cmd.length > 0);
            await domain_detail(tk as string, cmd[0]);
        } break;

        case 'delete': {
            const [tk, cmd] = searchArg('-t', true, command);
            assert(cmd.length > 0);
            await domain_delete(tk as string, cmd[0]);
        } break;

        case 'modify': {
            const [tk, cmd] = searchArg('-t', true, command);
            assert(cmd.length == 3);
            await domain_modify(tk as string, cmd[0], cmd[1], cmd[2]);
        } break;

        default:
            throw new Error(`bad bad command '${command[0]}'`);
            break;
    }
}


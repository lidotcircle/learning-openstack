import assert from "assert";
import fetch from "node-fetch";
import { API } from './api';
import { searchArg, tryAsBoolean, patch_request, get_request, delete_request, post_request } from "./util";


async function domain_list(token: string) //{
{
    console.log(JSON.stringify(JSON.parse(await get_request(API.Identity.Domain.index, token)), null, 4));
} //}

async function domain_create(token: string, domain: {name: string, description?: string, enabled?: boolean}) //{
{
    await post_request(token, API.Identity.Domain.index, { domain: domain });
} //}

async function domain_detail(token: string, domain_id: string) //{
{
    console.log(JSON.stringify(JSON.parse(await get_request(API.Identity.Domain.index + `/${domain_id}`, token)), null, 4));
} //}

async function domain_delete(token: string, domain_id: string) //{
{
    await delete_request(token, API.Identity.Domain.index + `/${domain_id}`);
} //}

async function domain_modify(token: string, domain_id: string, key: string, value: string) //{
{
    const dom = {};
    dom[key] = tryAsBoolean(value);
    await patch_request(token, API.Identity.Domain.index + `/${domain_id}`, { domain: dom });
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


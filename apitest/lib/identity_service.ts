import assert from "assert";
import fetch from "node-fetch";
import { API } from "./api";
import { get_with_token } from "./identity";
import { delete_request, patch_request, post_request, searchArg, tryAsBoolean } from "./util";


async function service_list(token: string) //{
{
    console.log(JSON.stringify(JSON.parse(await get_with_token(API.Identity.Service.index, token)), null, 4));
} //}

async function service_create(token: string, service: {name: string, description?: string, enabled?: boolean, type?: string}) //{
{
    await post_request(token, API.Identity.Service.index, { service: service });
} //}

async function service_detail(token: string, service_id: string) //{
{
    console.log(JSON.stringify(JSON.parse(await get_with_token(API.Identity.Service.index + `/${service_id}`, token)), null, 4));
} //}

async function service_delete(token: string, service_id: string) //{
{
    await delete_request(token, API.Identity.Service.index + `/${service_id}`);
} //}

async function service_modify(token: string, service_id: string, key: string, value: string) //{
{
    const obj = { };
    obj[key] = tryAsBoolean(value);
    await patch_request(token, API.Identity.Service.index + `/${service_id}`, { service: obj });
} //}


export async function service_handler(command: string[]) {
    assert(command.length > 0);
    const c = command[0];
    command.splice(0, 1);

    switch(c) {
        case 'list': {
            await service_list(command[0]);
        } break;

        case 'detail': {
            const [tk, cmd] = searchArg('-t', true, command);
            assert(cmd.length == 1);
            await service_detail(tk as string, cmd[0]);
        } break;

        case 'create': {
            const [tk, cmd] = searchArg('-t', true, command);
            await service_create(tk as string, {
                name: cmd[0],
                description: cmd[1],
                enabled: cmd[2] == undefined || cmd[2] == 'true',
                type: cmd[3],
            });
        } break;

        case 'delete': {
            const [tk, cmd] = searchArg('-t', true, command);
            assert(cmd.length > 0);
            await service_delete(tk as string, cmd[0]);
        } break;

        case 'modify': {
            const [tk, cmd] = searchArg('-t', true, command);
            assert(cmd.length == 3);
            await service_modify(tk as string, cmd[0], cmd[1], cmd[2]);
        } break;

        default:
            throw new Error(`bad bad command '${command[0]}'`);
            break;
    }
}


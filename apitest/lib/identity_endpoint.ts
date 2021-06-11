import assert from "assert";
import fetch from "node-fetch";
import { API } from "./api";
import { get_with_token } from "./identity";
import { delete_request, patch_request, post_request, searchArg, tryAsBoolean } from "./util";


async function endpoint_list(token: string) //{
{
    console.log(JSON.stringify(JSON.parse(await get_with_token(API.Identity.Endpoint.index, token)), null, 4));
} //}

async function endpoint_create(token: string, endpoint: {url: string, interface: string, enabled?: boolean, service_id: string, region_id?: string}) //{
{
    await post_request(token, API.Identity.Endpoint.index, { endpoint: endpoint });
} //}

async function endpoint_detail(token: string, endpoint_id: string) //{
{
    console.log(JSON.stringify(JSON.parse(await get_with_token(API.Identity.Endpoint.index + `/${endpoint_id}`, token)), null, 4));
} //}

async function endpoint_delete(token: string, endpoint_id: string) //{
{
    await delete_request(token, API.Identity.Endpoint.index + `/${endpoint_id}`);
} //}

async function endpoint_modify(token: string, endpoint_id: string, key: string, value: string) //{
{
    await patch_request(token, API.Identity.Endpoint.index + `/${endpoint_id}`, key, value);
} //}


export async function endpoint_handler(command: string[]) {
    assert(command.length > 0);
    const c = command[0];
    command.splice(0, 1);

    switch(c) {
        case 'list': {
            await endpoint_list(command[0]);
        } break;

        case 'detail': {
            const [tk, cmd] = searchArg('-t', true, command);
            assert(cmd.length == 1);
            await endpoint_detail(tk as string, cmd[0]);
        } break;

        case 'create': {
            const [tk, cmd] = searchArg('-t', true, command);
            await endpoint_create(tk as string, {
                url: cmd[0],
                interface: cmd[1],
                service_id: cmd[2],
                region_id: cmd[4],
                enabled: cmd[3] == undefined || cmd[2] == 'true',
            });
        } break;

        case 'delete': {
            const [tk, cmd] = searchArg('-t', true, command);
            assert(cmd.length > 0);
            await endpoint_delete(tk as string, cmd[0]);
        } break;

        case 'modify': {
            const [tk, cmd] = searchArg('-t', true, command);
            assert(cmd.length == 3);
            await endpoint_modify(tk as string, cmd[0], cmd[1], cmd[2]);
        } break;

        default:
            throw new Error(`bad bad command '${command[0]}'`);
            break;
    }
}


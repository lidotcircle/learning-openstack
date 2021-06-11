import fetch from "node-fetch";
import { tryAsBoolean } from "./util";


export async function patch_request(token: string, url: string, key: string, value: string) //{
{
    token = token || process.env['OS_TOKEN'];

    const bodyObj = {};
    bodyObj[key] = tryAsBoolean(value);
    const resp = await fetch(url, {
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

export async function delete_request(token: string, url: string) //{
{
    token = token || process.env['OS_TOKEN'];

    const resp = await fetch(url, {
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

export async function post_request(token: string, url: string, obj: object) //{
{
    token = token || process.env['OS_TOKEN'];

    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "X-Auth-Token": token,
            "Content-Type": 'application/json',
        },
        body: JSON.stringify(obj),
    });

    console.log(`status: ${resp.status}, statusText: ${resp.statusText}`);
    const msg = (await resp.buffer()).toString();
    if(resp.status >= 400) {
        throw new Error(JSON.stringify(JSON.parse(msg), null, 4));
    } else {
        console.log(JSON.stringify(JSON.parse(msg), null, 4));
    }
} //}

export async function get_request(url: string, token: string, extra_headers: object = {}): Promise<string> //{
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


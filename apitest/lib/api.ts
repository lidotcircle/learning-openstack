import 'process';


const auth_endpoint = process.env["OS_AUTH_URL"] || 'http://controller:5000/v3';

export module API {
    export module Identity {
        export const token = `${auth_endpoint}/auth/tokens`;

        export const catalog = `${auth_endpoint}/auth/catalog`;

        export const projects = `${auth_endpoint}/auth/projects`;
        export const domains  = `${auth_endpoint}/auth/domains`;
        export const system   = `${auth_endpoint}/auth/system`;

        export module Domain {
            export const index = `${auth_endpoint}/domains`;
        }
    }
}


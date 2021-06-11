const gulp   = require('gulp');

const fs          = require('fs');
const util        = require('util');
const path        = require('path');
const proc        = require('process');
const child_proc  = require('child_process');


function onerror(err) {
    console.log(err.toString());
    this.emit("end");
}

function try_watch(restart) //{
{
    const watcher = gulp.watch(["lib/**/*.ts"]);
    const handle = async (fp, stat) => {
        const fp_split = fp.split("/");
        switch (fp_split[0]) {
            case "lib":
                try {
                    await compile_ts();
                } catch (err) {
                    console.error(err);
                }
                break;
        }
    }
    watcher.on("change", handle);
    watcher.on("add",    handle);
    watcher.on("unlink", handle);
    watcher.on("error",  onerror);
} //}
/** TASK watch */
gulp.task("watch", () => try_watch(false));

let is_compiler_running  = false;
let wait_for_compilation = false;
async function compile_ts() //{
{
    if (is_compiler_running) {
        wait_for_compilation = true;
        return;
    }
    is_compiler_running = true;

    console.log("compile ts");
    await new Promise((resolve, reject) => {
        const child = child_proc.spawn('tsc', {
            cwd: proc.cwd(),
            stdio: ['ignore', 'inherit', 'inherit'],
            shell: true
        });
        child.once('exit', (code, signal) => resolve());
    });

    is_compiler_running = false;
    if (wait_for_compilation) {
        wait_for_compilation = false;
        await compile_ts();
    }
} //}


import {
    CommandClient,
    Constants,
    InteractionCommandClient,
    Interaction,
    Utils,
    Command
} from 'detritus-client';
import path from 'path';

// support for esm, just modified

CommandClient.prototype.addMultipleIn = async function (
    this: CommandClient,
    directory: string,
    options: { isAbsolute?: boolean, subdirectories?: boolean } = {},
): Promise<CommandClient> {
    options = Object.assign({ subdirectories: true }, options);
    this.directories.set(directory, { subdirectories: !!options.subdirectories });

    const files: Array<string> = await Utils.getFiles(directory, options.subdirectories);
    const errors: Record<string, any> = {};

    const addCommand = (imported: any, filepath: string): void => {
        if (!imported) {
            return;
        }
        if (typeof (imported) === 'function') {
            this.add({ _file: filepath, _class: imported, name: '' });
        } else if (imported instanceof Command.Command) {
            Object.defineProperty(imported, '_file', { value: filepath });
            this.add(imported);
        } else if (typeof (imported) === 'object' && Object.keys(imported).length) {
            if (Array.isArray(imported)) {
                for (const child of imported) {
                    addCommand(child, filepath);
                }
            } else {
                if ('name' in imported) {
                    this.add({ ...imported, _file: filepath });
                }
            }
        }
    };
    for (const file of files) {
        if (!file.endsWith((Constants.IS_TS_NODE) ? '.ts' : '.js')) {
            continue;
        }
        const filepath = path.resolve(directory, file);
        try {
            let importedCommand: any = await import("file:///" + filepath);
            if (typeof (importedCommand) === 'object') {
                importedCommand = importedCommand.default;
            }
            addCommand(importedCommand, filepath);
        } catch (error) {
            errors[filepath] = error;
        }
    }

    if (Object.keys(errors).length) {
        throw errors
    }

    return this;
}

InteractionCommandClient.prototype.addMultipleIn = async function (
    this: InteractionCommandClient,
    directory: string,
    options: { isAbsolute?: boolean, subdirectories?: boolean } = {},
): Promise<InteractionCommandClient> {
    options = Object.assign({ subdirectories: true }, options);
    this.directories.set(directory, { subdirectories: !!options.subdirectories });

    const files: Array<string> = await Utils.getFiles(directory, options.subdirectories);
    const errors: Record<string, any> = {};

    const addCommand = (imported: any, filepath: string): void => {
        if (!imported) {
            return;
        }
        if (typeof (imported) === 'function') {
            this.add({ _file: filepath, _class: imported, name: '' });
        } else if (imported instanceof Interaction.InteractionCommand) {
            Object.defineProperty(imported, '_file', { value: filepath });
            this.add(imported);
        } else if (typeof (imported) === 'object' && Object.keys(imported).length) {
            if (Array.isArray(imported)) {
                for (const child of imported) {
                    addCommand(child, filepath);
                }
            } else {
                if ('name' in imported) {
                    this.add({ ...imported, _file: filepath });
                }
            }
        }
    };
    for (const file of files) {
        if (!file.endsWith((Constants.IS_TS_NODE) ? '.ts' : '.js')) {
            continue;
        }
        const filepath = path.resolve(directory, file);
        try {
            let importedCommand: any = await import("file:///" + filepath);
            if (typeof (importedCommand) === 'object') {
                importedCommand = importedCommand.default;
            }
            addCommand(importedCommand, filepath);
        } catch (error) {
            errors[filepath] = error;
        }
    }

    if (Object.keys(errors).length) {
        throw errors;
    }

    return this;
}
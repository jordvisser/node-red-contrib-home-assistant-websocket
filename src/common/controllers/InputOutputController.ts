import Joi from 'joi';
import { NodeMessageInFlow } from 'node-red';

import {
    BaseNode,
    NodeDone,
    NodeMessage,
    NodeProperties,
    NodeSend,
} from '../../types/nodes';
import { inputErrorHandler } from '../errors/inputErrorHandler';
import { NodeEvent } from '../events/Events';
import Integration from '../integration/Integration';
import InputService, { ParsedMessage } from '../services/InputService';
import OutputController, { OutputControllerOptions } from './OutputController';

export interface InputOutputControllerOptions<
    T extends BaseNode,
    C extends NodeProperties
> extends OutputControllerOptions<T> {
    inputService: InputService<C>;
    integration?: Integration;
}

export interface InputProperties {
    done: NodeDone;
    message: NodeMessage;
    parsedMessage: ParsedMessage;
    send: NodeSend;
}

type OptionalInputHandler = (
    message: NodeMessageInFlow,
    send: NodeSend
) => boolean;

interface OptionalInput {
    schema: Joi.ObjectSchema;
    handler: OptionalInputHandler;
}

export default abstract class InputOutputController<
    T extends BaseNode,
    K extends NodeProperties
> extends OutputController<T> {
    #optionalInputs = new Map<string, OptionalInput>();

    protected readonly inputService: InputService<K>;
    protected readonly integration?: Integration;

    constructor(params: InputOutputControllerOptions<T, K>) {
        super(params);
        this.inputService = params.inputService;
        this.integration = params.integration;
        params.node.on(NodeEvent.Input, this.#preOnInput.bind(this));
    }

    async #preOnInput(
        message: NodeMessageInFlow,
        send: NodeSend,
        done: NodeDone
    ) {
        // Run optional inputs
        if (this.#optionalInputs.size) {
            for (const [, { schema, handler }] of this.#optionalInputs) {
                let validSchema = false;
                try {
                    validSchema = InputService.validateSchema(schema, message);
                } catch (e) {} // silent fail

                if (validSchema) {
                    try {
                        if (handler(message, send)) {
                            done();
                            return;
                        }
                    } catch (error) {
                        inputErrorHandler(error, { done, status: this.status });
                    }
                }
            }
        }

        const parsedMessage = this.inputService.parse(message);

        try {
            this.inputService.validate(parsedMessage);

            await this.onInput?.({
                parsedMessage,
                message,
                send,
                done,
            });
        } catch (e) {
            inputErrorHandler(e, { done, status: this.status });
        }
    }

    protected abstract onInput?({
        done,
        message,
        parsedMessage,
        send,
    }: InputProperties): Promise<void>;

    protected addOptionalInput(
        key: string,
        schema: Joi.ObjectSchema,
        callback: () => boolean
    ) {
        this.#optionalInputs.set(key, {
            schema,
            handler: callback,
        });
    }

    protected removeOptionalInput(key: string) {
        this.#optionalInputs.delete(key);
    }
}

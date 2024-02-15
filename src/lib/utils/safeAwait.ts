export type Success<T> = {
    success: true;
    value: T;
};

export type Failure = {
    success: false;
    error: unknown;
};

export type Result<T> = Success<T> | Failure;

export const safeAwait = async <T>(promise: Promise<T>): Promise<Result<T>> => {
    try {
        const value = await promise;
        return { success: true, value: value };
    } catch (e) {
        if (e instanceof Error) {
            return { success: false, error: e.message };
        }
        return {
            success: false,
            error: 'Unknown error occurred. Please check the logs for more information.',
        };
    }
};

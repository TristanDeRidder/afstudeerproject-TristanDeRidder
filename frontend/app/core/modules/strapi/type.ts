export type StrapiResponse<T> = {
    data: T;
    meta: Record<string, any>;
};
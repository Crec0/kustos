const GENERIC_NOT_LOGGED_IN_MESSAGE =
    'You are not logged in. Please login to access this resource.';

export function constructRedirectURL(
    route: string | null,
    params: URLSearchParams,
    message: string = GENERIC_NOT_LOGGED_IN_MESSAGE,
): string {
    let redirect: string;

    if (route == null) {
        params.set('message', "Requested page doesn't exist. Please check the URL.");
        redirect = `/error/not-found?${params}`;
    } else {
        params.set('message', message);
        params.set('goto', route.slice(1));
        redirect = `/login?${params}`;
    }

    return redirect;
}

## `tuktakjs` is a collection utility functions

The word `tuktak` means tiny things that resembles the meaning of the library.

#### applyMiddleware

You can pass many middleware as arguments to the function. Every middleware in the chain will receive your request arguments or graphql resolver arguments and a `next` callback function as the last argument. You may call it to forward the execution to the next middleware or to your actual resolver or controller function.

Example:

1. graphql resolver level middleware

```js
import { applyMiddleware } from 'tuktakjs';

site: applyMiddleware(
    authMiddleware,
    permissionMiddleware,
    async (root, args, ctx, info) => {
        // your business logic
    }
);

function authMiddleware(root, args, ctx, info, next) {
    // your middleware logic
    // call next() to forward it to the next middleware or to your resolver
}

function permissionMiddleware(root, args, ctx, info, next) {
    // your middleware logic
    // call next() to forward it to the next middleware or to your resolver
}
```

2. Express level middleware

```js
import { applyMiddleware } from 'tuktakjs';

site: applyMiddleware(
    authMiddleware,
    permissionMiddleware({ action: 'delete', resource: 'site' }),
    async (req, res) => {
        // your business logic
    }
);

function permissionMiddleware({ action, resource }) {
    return (req, res, next) => {
        // invoke next() after the permission check
    };
}

function authMiddleware(req, res, next, ourNext) {
    // your middleware logic
    // call ourNext() to forward it to the next middleware or to your controller
}
```
